#!/usr/bin/env node
// Checks for the hygiene build. Usage: node tests/hygiene-build-checks.mjs <part>
// Parts: migration, claudemd, preferences, skills, zips, copy. Each prints "<PART> OK" on success.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { parseSections } from "../skills/tidy/scripts/sections.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const part = process.argv[2];
const read = (p) => fs.readFileSync(path.join(repo, p), "utf8");
const norm = (t) => t.replace(/\s+/g, " ").trim();
const fail = (m) => { console.log(`FAIL ${part}: ${m}`); process.exit(1); };

if (part === "migration") {
  const old = norm(read("research/hygiene/snapshot/account-preferences.md"));
  const sentences = old.split(/(?<=[.!?:])\s+(?=[A-Z"\[])/).map((x) => x.trim()).filter(Boolean);
  const rows = new Map();
  for (const line of read("preferences/MIGRATION.md").split("\n")) {
    const m = line.match(/^\| (\d\d) \| (.*?) \| (.*?) \|\s*(.*?)\s*\|$/);
    if (m) rows.set(Number(m[1]), { home: m[3], quote: m[4] });
  }
  const claude = norm(read("CLAUDE.md"));
  const ledgerSkill = (() => {
    const base = "/root/.claude/skills/synced";
    const roots = [path.join(os.homedir(), ".claude/skills/ledger/SKILL.md")];
    if (fs.existsSync(base)) for (const b of fs.readdirSync(base)) roots.push(path.join(base, b, "ledger/SKILL.md"));
    const f = roots.find((p) => fs.existsSync(p));
    return f ? norm(fs.readFileSync(f, "utf8")) : null;
  })();
  let bad = 0;
  sentences.forEach((s, i) => {
    const row = rows.get(i + 1);
    if (!row) { console.log(`no row for old sentence ${i + 1}: ${s}`); bad++; return; }
    if (/^none needed/.test(row.home)) { if (!/:$/.test(s)) { console.log(`row ${i + 1} drops a sentence that is not a label: ${s}`); bad++; } return; }
    const quote = norm(row.quote.replace(/\\\|/g, "|"));
    if (!quote) { console.log(`row ${i + 1} has no quote`); bad++; return; }
    if (/^CLAUDE\.md/.test(row.home)) { if (!claude.includes(quote)) { console.log(`row ${i + 1}: quote not in CLAUDE.md: ${quote}`); bad++; } }
    else if (/^ledger skill/.test(row.home)) { if (!ledgerSkill) { console.log(`row ${i + 1}: ledger skill not found to check`); bad++; } else if (!ledgerSkill.toLowerCase().includes(quote.toLowerCase())) { console.log(`row ${i + 1}: quote not in the ledger skill: ${quote}`); bad++; } }
    else { console.log(`row ${i + 1}: unknown home ${row.home}`); bad++; }
  });
  if (rows.size !== sentences.length) { console.log(`${rows.size} rows for ${sentences.length} sentences`); bad++; }
  if (bad) fail(`${bad} problems`);
  console.log(`MIGRATION OK (${sentences.length} sentences mapped)`);
} else if (part === "claudemd") {
  const text = read("CLAUDE.md");
  const secs = parseSections(text).slice(1);
  const ids = new Set();
  for (const s of secs) {
    if (!s.id) fail(`section "${s.heading}" has no rule comment`);
    if (!/^## .+\n<!-- rule:/.test(`${s.heading}\n${s.lines.join("\n")}`)) fail(`the rule comment is not right under "${s.heading}"`);
    if (ids.has(s.id)) fail(`duplicate id ${s.id}`);
    ids.add(s.id);
    if (!["all", "code"].includes(s.surfaces)) fail(`section ${s.id} has surfaces "${s.surfaces}"`);
    if (!s.match.length) fail(`section ${s.id} has no match phrases`);
    const body = norm(s.lines.join(" ").replace(/<!--[\s\S]*?-->/g, " ")).toLowerCase();
    const own = s.match.filter((m) => body.includes(m.toLowerCase()) || m === "[skills:");
    if (!own.length) fail(`none of section ${s.id}'s match phrases appear in its own text, so the inventory could never find it restated`);
  }
  const lines = text.split("\n").length;
  if (lines >= 200) fail(`${lines} lines`);
  console.log(`CLAUDEMD OK (${secs.length} sections, ${lines} lines)`);
} else if (part === "preferences") {
  const ok = spawnSync(process.execPath, [path.join(repo, "scripts/build-preferences.mjs"), "--check"], { encoding: "utf8" });
  if (ok.status !== 0) fail(ok.stdout + ok.stderr);
  const tmp = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "prefs-")), "CLAUDE.md");
  fs.writeFileSync(tmp, read("CLAUDE.md").replace("Lead with the answer.", "Lead with a summary."));
  const planted = spawnSync(process.execPath, [path.join(repo, "scripts/build-preferences.mjs"), "--check"], { encoding: "utf8", env: { ...process.env, HARNESS_CLAUDE_MD: tmp } });
  if (planted.status === 0) fail("a planted edit to CLAUDE.md did not make the check fail");
  const prefs = read("preferences/claude-ai.md");
  for (const s of parseSections(read("CLAUDE.md")).slice(1)) {
    const inPrefs = prefs.includes(s.heading);
    if (s.surfaces === "all" && !inPrefs) fail(`section ${s.id} is for all surfaces but missing from the preferences`);
    if (s.surfaces === "code" && inPrefs) fail(`code only section ${s.id} leaked into the preferences`);
  }
  if (/<!--/.test(prefs)) fail("the preferences carry an HTML comment");
  console.log(`PREFERENCES OK (${prefs.length} characters)`);
} else if (part === "skills") {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "home-"));
  const out = JSON.parse(execFileSync(process.execPath, [path.join(repo, "skills/tidy/scripts/tidy-inventory.mjs"), "--json", "--harness", repo, "--home", home], { encoding: "utf8" }));
  const missing = out.findings.filter((f) => f.class === "missing-file" || f.class === "dead-reference");
  if (missing.length) fail(missing.map((f) => f.title).join("; "));
  const sampleRule = /keep them at roughly the sample's frequency|overrides this rule/;
  if (!sampleRule.test("if the sample uses em dashes, keep them at roughly the sample's frequency")) fail("control failed");
  if (sampleRule.test(read("skills/humanizer/SKILL.md"))) fail("the humanizer still lets a sample bring dashes back");
  if (!fs.existsSync(path.join(repo, "skills/resource-sourcing/references/sources.md"))) fail("resource-sourcing has no sources file");
  console.log(`SKILLS OK (${out.skills} skills checked)`);
} else if (part === "zips") {
  const out = fs.mkdtempSync(path.join(os.tmpdir(), "zips-"));
  execFileSync("bash", [path.join(repo, "scripts/skill-zip.sh")], { encoding: "utf8", env: { ...process.env, SKILL_ZIP_DIR: out } });
  const need = {
    "unlazy.zip": ["unlazy/SKILL.md", "unlazy/scripts/gate-check.mjs", "unlazy/scripts/lib/gates.mjs", "unlazy/templates/gates-leaf.md", "unlazy/references/gates.md"],
    "resource-sourcing.zip": ["resource-sourcing/SKILL.md", "resource-sourcing/references/sources.md"],
    "humanizer.zip": ["humanizer/SKILL.md"],
    "tidy.zip": ["tidy/SKILL.md", "tidy/scripts/tidy-inventory.mjs", "tidy/scripts/sections.mjs"],
  };
  for (const [zip, files] of Object.entries(need)) {
    const list = execFileSync("unzip", ["-Z1", path.join(out, zip)], { encoding: "utf8" }).split("\n");
    for (const f of files) if (!list.includes(f)) fail(`${zip} is missing ${f}`);
  }
  // Every file in each skill folder is in its zip, except the tests folder, which stays in the repo.
  for (const name of fs.readdirSync(path.join(repo, "skills"))) {
    const list = new Set(execFileSync("unzip", ["-Z1", path.join(out, `${name}.zip`)], { encoding: "utf8" }).split("\n"));
    const files = execFileSync("find", [name, "-type", "f", "-not", "-path", `${name}/tests/*`], { cwd: path.join(repo, "skills"), encoding: "utf8" }).trim().split("\n");
    if (list.has(`${name}/tests/`) || [...list].some((f) => f.startsWith(`${name}/tests/`))) fail(`${name}.zip carries its tests`);
    const lost = files.filter((f) => !list.has(f));
    if (lost.length) fail(`${name}.zip lacks ${lost.slice(0, 3).join(", ")}`);
  }
  console.log(`ZIPS OK (${Object.keys(need).length} skills)`);
} else if (part === "copy") {
  const files = ["CLAUDE.md", "README.md", "retired.md", "tidy-keep.txt", "preferences/claude-ai.md", "preferences/MIGRATION.md", "skills/tidy/SKILL.md", "skills/resource-sourcing/references/sources.md", "research/hygiene/BUILD-GATES.md"];
  const W = "(?!(?:and|or)\\b)[\\w'-]+";
  const oxford = new RegExp("\\b" + W + "(?: " + W + ")?, " + W + "(?: " + W + ")?, (?:and|or) [\\w'-]");
  const dash = /[–—]|[\w,)]--[\w(]|[\w,)] -- [\w(]/;
  const prose = (t) => { let fence = false; return t.split("\n").filter((l) => { if (/^\s*```/.test(l)) { fence = !fence; return false; } return !fence; }).map((l) => l.replace(/`[^`]*`/g, "").replace(/<!--[\s\S]*?-->/g, "")); };
  if (!dash.test("a — b") || !oxford.test("red, green, and blue") || oxford.test("red, green and blue")) fail("control failed");
  const hits = [];
  for (const f of files) for (const l of prose(read(f))) { if (dash.test(l)) hits.push(`${f}: dash: ${l.trim()}`); if (oxford.test(l)) hits.push(`${f}: Oxford comma: ${l.trim()}`); }
  if (hits.length) fail(hits.slice(0, 8).join("\n"));
  console.log(`COPY OK (${files.length} files)`);
} else fail("unknown part");
