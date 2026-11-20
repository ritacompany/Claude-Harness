#!/usr/bin/env node
// Tidy inventory: a read only report of what has drifted from "one home per rule".
// It never edits, moves or deletes anything; the only file it may write is the report named by --out.
//
//   node skills/tidy/scripts/tidy-inventory.mjs [--project DIR]... [--prefs FILE] [--out FILE] [--json]
//                                   [--harness DIR] [--home DIR] [--today YYYY-MM-DD]
//
// --project  a project folder to include (its CLAUDE.md, AGENTS.md, .claude/rules, .claude/skills,
//            LEDGER.md); repeat for several projects
// --prefs    a file holding the account preferences pasted from claude.ai, to compare with the
//            generated text
// --home     the Claude folder (default CLAUDE_CONFIG_DIR or ~/.claude)
//
// Finding classes: restated, near-duplicate, drift, loaded-twice, missing-file, dead-reference,
// overlap, retired-due, size. Each finding quotes the lines it rests on. Decisions to keep a
// restatement on purpose go in tidy-keep.txt in the harness, one per line: rule-id | path part | reason.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { parseSections, build } from "./sections.mjs";

// ---------- arguments ----------
const argv = process.argv.slice(2);
const opt = { project: [], json: false };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--json") opt.json = true;
  else if (a === "--project") opt.project.push(argv[++i]);
  else if (["--prefs", "--out", "--harness", "--home", "--today"].includes(a)) opt[a.slice(2)] = argv[++i];
  else { console.error(`unknown argument: ${a}`); process.exit(2); }
}
// The harness is the repo this skill sits in, else the copy install.sh links into the Claude folder.
const here = path.dirname(fileURLToPath(import.meta.url));
const fromRepo = path.resolve(here, "..", "..", "..");
const harness = path.resolve(opt.harness || (fs.existsSync(path.join(fromRepo, "CLAUDE.md")) && fs.existsSync(path.join(fromRepo, "skills", "tidy")) ? fromRepo : path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude"), "claude-harness")));
if (!fs.existsSync(path.join(harness, "CLAUDE.md"))) { console.error(`tidy: no harness CLAUDE.md at ${harness}; pass --harness <folder>`); process.exit(2); }
const home = path.resolve(opt.home || process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude"));
const today = opt.today ? new Date(opt.today + "T00:00:00Z") : new Date();
const projects = opt.project.map((p) => path.resolve(p));

// ---------- helpers ----------
const exists = (p) => { try { fs.statSync(p); return true; } catch { return false; } };
const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const read = (p) => fs.readFileSync(p, "utf8");
const real = (p) => { try { return fs.realpathSync(p); } catch { return path.resolve(p); } };
const sha = (t) => crypto.createHash("sha256").update(t).digest("hex").slice(0, 12);
const norm = (t) => t.replace(/<!--[\s\S]*?-->/g, " ").replace(/\s+/g, " ").trim();
const stripCode = (t) => t.replace(/```[\s\S]*?```/g, "");
const stripFront = (t) => t.replace(/^---\n[\s\S]*?\n---\n/, "");
const sentences = (t) => stripFront(stripCode(t)).replace(/<!--[\s\S]*?-->/g, " ")
  .split(/\n\s*\n|\n(?=\s*(?:#|[-*] |\d+\. |\|))/)
  .flatMap((block) => block.replace(/\s+/g, " ").trim().split(/(?<=[.!?;])\s+/))
  .map((s) => s.replace(/^(#+|[-*]|\d+\.)\s+/, "").trim()).filter((s) => s.length > 0);
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const phraseRe = (p) => new RegExp(`(^|[^\\w])${escapeRe(p)}(e?s)?($|[^\\w])`, "i");
const STOP = new Set("a an and are as at be by do does for from has have i if in is it its me my no nor not of on or so that the then this to was what when where which who will with you your one".split(" "));
const words = (s) => new Set(s.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").split(" ").filter((w) => w.length > 2 && !STOP.has(w)));
const jaccard = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / (a.size + b.size - n || 1); };
const short = (s, n = 160) => (s.length > n ? s.slice(0, n - 3) + "..." : s);
const shown = (p) => {
  const r = path.resolve(p);
  if (r.startsWith(harness + path.sep)) return "harness/" + path.relative(harness, r);
  if (r.startsWith(home + path.sep)) return "~claude/" + path.relative(home, r);
  for (const pr of projects) if (r.startsWith(pr + path.sep)) return path.basename(pr) + "/" + path.relative(pr, r);
  return r;
};
function walk(dir, test, depth = 6, out = []) {
  if (depth < 0 || !exists(dir)) return out;
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    if (e.name === ".git" || e.name === "node_modules") continue;
    const p = path.join(dir, e.name);
    let dirLike = e.isDirectory();
    if (e.isSymbolicLink()) { try { dirLike = fs.statSync(p).isDirectory(); } catch { continue; } }
    if (dirLike) walk(p, test, depth - 1, out);
    else if (test(p)) out.push(p);
  }
  return out;
}

const findings = [];
const add = (cls, title, detail) => findings.push({ class: cls, title, detail });

// ---------- the home of every rule ----------
const claudeMdPath = path.join(harness, "CLAUDE.md");
const claudeMd = read(claudeMdPath);
const sections = parseSections(claudeMd).filter((s) => s.id);
const homeSentences = sentences(claudeMd).map((s) => ({ s, w: words(s) })).filter((x) => x.w.size >= 5);

const keepFile = path.join(harness, "tidy-keep.txt");
const keeps = exists(keepFile)
  ? read(keepFile).split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).map((l) => l.split("|").map((x) => x.trim()))
  : [];
const kept = (rule, file) => keeps.some(([r, part]) => (r === rule || r === "*") && file.includes(part));

// ---------- skills from every source ----------
// Each source is a folder holding skill folders. Names repeat when the same skill arrives twice.
const skillSources = [];
const addSkillRoot = (label, dir) => { if (exists(dir)) skillSources.push({ label, dir }); };
addSkillRoot("harness", path.join(harness, "skills"));
addSkillRoot("home", path.join(home, "skills"));
const syncedRoot = path.join(home, "skills", "synced");
if (exists(syncedRoot)) for (const b of fs.readdirSync(syncedRoot)) if (!b.startsWith(".")) addSkillRoot("account", path.join(syncedRoot, b));
for (const pr of projects) addSkillRoot(`project ${path.basename(pr)}`, path.join(pr, ".claude", "skills"));
const skills = [];
for (const src of skillSources) {
  for (const name of fs.readdirSync(src.dir)) {
    if (src.label === "home" && name === "synced") continue;
    const file = path.join(src.dir, name, "SKILL.md");
    if (isFile(file)) skills.push({ name, source: src.label, dir: path.join(src.dir, name), file, real: real(file) });
  }
}
// Plugin skills: report only, for the loaded twice check.
for (const f of walk(path.join(home, "plugins"), (p) => p.endsWith(`${path.sep}SKILL.md`), 8)) {
  skills.push({ name: path.basename(path.dirname(f)), source: "plugin", dir: path.dirname(f), file: f, real: real(f), plugin: true });
}

// ---------- the instruction files to scan for restatements ----------
const scan = [];
const addScan = (file, kind) => { if (isFile(file) && real(file) !== real(claudeMdPath)) scan.push({ file, kind }); };
addScan(path.join(home, "CLAUDE.md"), "global CLAUDE.md");
for (const pr of projects) {
  for (const n of ["CLAUDE.md", "CLAUDE.local.md", "AGENTS.md", ".claude/CLAUDE.md", "LEDGER.md"]) addScan(path.join(pr, n), "project file");
  for (const f of walk(path.join(pr, ".claude", "rules"), (p) => p.endsWith(".md"))) addScan(f, "project rule");
}
for (const f of walk(path.join(home, "rules"), (p) => p.endsWith(".md"))) addScan(f, "global rule");
for (const f of walk(path.join(home, "projects"), (p) => /[\\/]memory[\\/][^\\/]+\.md$/.test(p), 3)) addScan(f, "memory");
const seenReal = new Set();
for (const s of skills) if (!s.plugin && !seenReal.has(s.real)) { seenReal.add(s.real); addScan(s.file, `skill (${s.source})`); }
if (opt.prefs) addScan(path.resolve(opt.prefs), "account preferences");

// ---------- restated: a rule's match phrase found outside its home ----------
const reported = new Set();
for (const { file, kind } of scan) {
  // A synced or linked copy of CLAUDE.md is drift, not restatement; the drift check covers it.
  if (kind === "global CLAUDE.md" || kind === "account preferences") continue;
  const sents = sentences(read(file));
  for (const sec of sections) {
    for (const phrase of sec.match) {
      const re = phraseRe(phrase);
      const quote = sents.find((s) => re.test(s));
      if (!quote) continue;
      if (kept(sec.id, shown(file))) break;
      const key = `${sec.id}|${file}`;
      if (reported.has(key)) break;
      reported.add(key);
      add("restated", `rule "${sec.id}" is restated in ${shown(file)} (${kind})`, [`phrase: "${phrase}"`, `quote: "${short(quote, 220)}"`, `home: CLAUDE.md section "${sec.heading.replace(/^## /, "")}"`]);
      break;
    }
  }
}

// ---------- near-duplicate: a sentence that says what a CLAUDE.md sentence says ----------
for (const { file, kind } of scan) {
  if (kind === "global CLAUDE.md" || kind === "account preferences") continue;
  for (const s of sentences(read(file))) {
    const w = words(s);
    if (w.size < 5) continue;
    for (const h of homeSentences) {
      const score = jaccard(w, h.w);
      if (score < 0.5) continue;
      const sec = sections.find((x) => norm(x.lines.join("\n")).includes(h.s)) || { id: "intro" };
      const key = `${sec.id}|${file}`;
      if (reported.has(key) || kept(sec.id, shown(file))) continue;
      reported.add(key);
      add("near-duplicate", `${shown(file)} (${kind}) says what CLAUDE.md says`, [`quote: "${short(s, 220)}"`, `home: "${short(h.s, 220)}"`, `overlap: ${score.toFixed(2)}`]);
    }
  }
}

// ---------- drift: copies that should match their source ----------
const generatedPath = path.join(harness, "preferences", "claude-ai.md");
const fresh = build(claudeMd);
if (!exists(generatedPath)) add("drift", "the generated account preferences are missing", ["run: node scripts/build-preferences.mjs"]);
else if (read(generatedPath) !== fresh) add("drift", "preferences/claude-ai.md is older than CLAUDE.md", ["run: node scripts/build-preferences.mjs, then paste the result into claude.ai on both accounts"]);
if (opt.prefs && exists(opt.prefs)) {
  if (norm(read(opt.prefs)) !== norm(fresh)) {
    const have = new Set(sentences(read(opt.prefs)));
    const want = sentences(fresh);
    const missing = want.filter((s) => !have.has(s));
    const extra = [...have].filter((s) => !want.includes(s));
    add("drift", "the account preferences differ from the generated text", [
      `${missing.length} generated sentences are missing from the account, ${extra.length} account sentences are not generated`,
      ...extra.slice(0, 5).map((s) => `only in the account: "${short(s)}"`),
      "an account only sentence is a rule without a home: move it into CLAUDE.md before replacing the preferences",
    ]);
  }
}
const globalMd = path.join(home, "CLAUDE.md");
if (isFile(globalMd) && real(globalMd) !== real(claudeMdPath)) {
  const a = read(globalMd).split("\n"), b = claudeMd.split("\n");
  if (a.join("\n") !== b.join("\n")) {
    const onlyHere = b.filter((l) => l.trim() && !a.includes(l));
    const onlyThere = a.filter((l) => l.trim() && !b.includes(l));
    add("drift", `${shown(globalMd)} is a copy that differs from the harness CLAUDE.md`, [
      ...onlyHere.slice(0, 4).map((l) => `missing from the copy: "${short(l.trim())}"`),
      ...onlyThere.slice(0, 4).map((l) => `only in the copy: "${short(l.trim())}"`),
      "a cloud session copy refreshes at session start from the public repo once the setup script fetches it",
    ]);
  }
}

// ---------- loaded twice: one skill name from more than one source ----------
const byName = new Map();
for (const s of skills) { if (!byName.has(s.name)) byName.set(s.name, []); byName.get(s.name).push(s); }
for (const [name, list] of byName) {
  // Plugin folders keep cached and synced copies of the same plugin; they count as one source, and a
  // copy counts as identical when it matches any of them.
  const pluginHashes = new Set(list.filter((s) => s.plugin).map((s) => sha(read(s.file))));
  const distinct = [...new Map(list.map((s) => [s.plugin ? "plugin" : s.real, s])).values()];
  if (distinct.length < 2) continue;
  const hashes = new Set(distinct.filter((s) => !s.plugin).map((s) => sha(read(s.file))));
  if (pluginHashes.size && ![...hashes].every((h) => pluginHashes.has(h))) hashes.add("plugin-differs");
  const sources = distinct.map((s) => s.source).join(" and ");
  const harnessCopy = distinct.find((s) => s.source === "harness");
  const accountCopy = distinct.find((s) => s.source === "account");
  if (harnessCopy && accountCopy && distinct.length === 2) {
    if (hashes.size > 1) add("drift", `the account copy of skill "${name}" differs from the harness`, ["upload the harness folder to claude.ai again (bash scripts/skill-zip.sh <name>)"]);
    continue;
  }
  add("loaded-twice", `skill "${name}" loads from ${sources}`, [hashes.size === 1 ? "the copies are identical: one can be turned off with no change in behavior" : "the copies differ: the agent may follow either one"]);
}

// ---------- missing files a skill tells Claude to read ----------
for (const s of skills) {
  if (s.plugin) continue;
  const body = stripCode(read(s.file));
  const refs = new Set();
  for (const m of body.matchAll(/`((?:templates|references|scripts|assets|examples|reference)\/[\w./-]+\.\w+)`/g)) refs.add(m[1]);
  for (const m of body.matchAll(/\]\(((?!https?:|#|mailto:)[\w./-]+\.(?:md|mjs|js|sh|py|json|txt))\)/g)) refs.add(m[1]);
  const gone = [...refs].filter((r) => !exists(path.join(s.dir, r)));
  if (gone.length) add("missing-file", `skill "${s.name}" (${s.source}) points at ${gone.length} file${gone.length > 1 ? "s" : ""} that ${gone.length > 1 ? "are" : "is"} not there`, [...gone.slice(0, 6).map((r) => `missing: ${r}`), ...(gone.length > 6 ? [`and ${gone.length - 6} more`] : []), s.source === "account" ? "the claude.ai account keeps only SKILL.md: upload the whole folder, or the skill runs without them" : `in ${shown(s.file)}`]);
}

// ---------- dead references in CLAUDE.md type files ----------
const refFiles = [claudeMdPath, ...scan.filter((x) => /CLAUDE|AGENTS|rule|project file/.test(x.kind)).map((x) => x.file)];
for (const f of refFiles) {
  // A copy of the harness CLAUDE.md names harness paths, so it resolves against the harness.
  const root = f === claudeMdPath || f === globalMd ? harness : projects.find((p) => f.startsWith(p + path.sep)) || path.dirname(f);
  for (const m of stripCode(read(f)).matchAll(/`([\w.-]+\/[\w./-]*\.\w{1,5})`/g)) {
    const r = m[1];
    if (!exists(path.join(path.dirname(f), r)) && !exists(path.join(root, r))) add("dead-reference", `${shown(f)} names ${r}, which is not there`, []);
  }
}

// ---------- overlap: several skills for the same job ----------
const nonPlugin = [...new Map(skills.filter((s) => !s.plugin).map((s) => [s.name, s])).values()];
const describe = (s) => { const m = read(s.file).match(/^description:\s*(.*)$/m); return m ? m[1].replace(/^["'>|]\s*/, "") : ""; };
const handoffLike = nonPlugin.filter((s) => /(session|conversation|agent)\b.{0,60}\b(handoff|hand over|continu|pick up|resume|state)|(handoff|continuation|live state)\b.{0,60}\b(session|conversation|agent|project)/i.test(describe(s)));
if (handoffLike.length > 1) add("overlap", `${handoffLike.length} skills hand work between sessions`, [...handoffLike.map((s) => `${s.name}: "${short(describe(s), 120)}"`), "CLAUDE.md names one handoff method; turn the others off"]);
const stem = (n) => n.toLowerCase().replace(/[^a-z]/g, "").replace(/(me|ing|er|s)$/, "");
for (let i = 0; i < nonPlugin.length; i++) for (let j = i + 1; j < nonPlugin.length; j++) {
  const a = nonPlugin[i], b = nonPlugin[j];
  const sa = stem(a.name), sb = stem(b.name);
  const sameStem = sa.length >= 4 && sa === sb;
  const descScore = jaccard(words(describe(a)), words(describe(b)));
  if ((sameStem || descScore >= 0.5) && !kept("overlap", `${a.name} + ${b.name}`) && !kept("overlap", `${b.name} + ${a.name}`)) add("overlap", `skills "${a.name}" and "${b.name}" look like the same job`, [`${a.name}: "${short(describe(a), 120)}"`, `${b.name}: "${short(describe(b), 120)}"`, `description overlap ${descScore.toFixed(2)}${sameStem ? ", same name stem" : ""}`]);
}

// ---------- retired rules past their two week window ----------
const retiredPath = path.join(harness, "retired.md");
if (exists(retiredPath)) {
  for (const m of read(retiredPath).matchAll(/^## (\d{4}-\d{2}-\d{2}) (.+)$/gm)) {
    const days = (today - new Date(m[1] + "T00:00:00Z")) / 86400000;
    if (days >= 14) add("retired-due", `retired entry "${m[2].trim()}" from ${m[1]} is past its two week window`, ["if nothing regressed, it can be deleted from retired.md in its own commit"]);
  }
}

// ---------- size ----------
for (const f of [claudeMdPath, ...scan.filter((x) => /CLAUDE/.test(x.kind)).map((x) => x.file)]) {
  const n = read(f).split("\n").length;
  if (n > 200) add("size", `${shown(f)} has ${n} lines; Anthropic's guidance is under 200 per CLAUDE.md`, []);
}
for (const f of walk(path.join(home, "projects"), (p) => p.endsWith(`${path.sep}MEMORY.md`), 3)) {
  const n = read(f).split("\n").length;
  if (n > 200) add("size", `${shown(f)} has ${n} lines; only the first 200 load`, []);
}

// ---------- report ----------
const order = ["drift", "missing-file", "dead-reference", "loaded-twice", "overlap", "restated", "near-duplicate", "retired-due", "size"];
const counts = Object.fromEntries(order.map((c) => [c, findings.filter((f) => f.class === c).length]));
const summary = `TIDY REPORT: ${findings.length} findings (` + order.filter((c) => counts[c]).map((c) => `${counts[c]} ${c}`).join(", ") + ")";
let out;
if (opt.json) out = JSON.stringify({ summary, counts, findings, scanned: scan.length, skills: skills.length }, null, 2) + "\n";
else {
  const lines = ["# Tidy inventory", "", `Read only. Scanned ${scan.length} instruction files and ${skills.length} skills on ${today.toISOString().slice(0, 10)}. Nothing was changed.`, ""];
  for (const c of order) {
    const list = findings.filter((f) => f.class === c);
    if (!list.length) continue;
    lines.push(`## ${c} (${list.length})`, "");
    for (const f of list) { lines.push(`- ${f.title}`); for (const d of f.detail) lines.push(`  - ${d}`); }
    lines.push("");
  }
  lines.push(summary, "");
  out = lines.join("\n");
}
if (opt.out) { fs.writeFileSync(opt.out, out); console.log(summary); }
else process.stdout.write(out);
