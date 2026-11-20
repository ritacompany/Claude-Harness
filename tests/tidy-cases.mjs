#!/usr/bin/env node
// Plants each kind of mess in a throwaway setup and checks the tidy inventory reports it, stays quiet on
// a clean setup, honours tidy-keep.txt and changes no file it reads. Prints TIDY CASES OK when all pass.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { build } from "../scripts/build-preferences.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inventory = path.join(repo, "skills", "tidy", "scripts", "tidy-inventory.mjs");
let fails = 0;
const check = (name, ok) => { console.log(`${ok ? "pass" : "FAIL"}  ${name}`); if (!ok) fails++; };
const write = (p, t) => { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, t); };

const CLAUDE = `# Personal layer

Intro line for the test.

## Copy
<!-- rule: copy | surfaces: all | match: em dash; oxford comma -->

No em or en dashes in any reply. No Oxford commas.

## Truth
<!-- rule: truth | surfaces: all | match: claim check -->

Research claims go through an independent claim check before they reach me.
Separate what was checked from what is inferred in every report you send.

## Working
<!-- rule: working | surfaces: code | match: writes its gates first -->

Substantial work writes its gates first. See \`templates/card.md\` for reviews.
`;
const skill = (name, desc, body = "Do the job.") => `---\nname: ${name}\ndescription: ${desc}\n---\n\n${body}\n`;

function setup(dirty) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "tidy-"));
  const harness = path.join(root, "harness"), home = path.join(root, "home"), project = path.join(root, "project");
  write(path.join(harness, "CLAUDE.md"), CLAUDE);
  write(path.join(harness, "templates", "card.md"), "card\n");
  write(path.join(harness, "preferences", "claude-ai.md"), dirty ? build(CLAUDE).replace("Intro line", "Old intro line") : build(CLAUDE));
  write(path.join(harness, "skills", "alpha", "SKILL.md"), skill("alpha", "Formats tables in reports."));
  write(path.join(harness, "retired.md"), dirty ? "# Retired\n\n## 2026-10-01 old-rule\n\nText.\n" : "# Retired\n\n## 2026-11-10 recent-rule\n\nText.\n");
  write(path.join(harness, "tidy-keep.txt"), "truth | kept-skill/SKILL.md | scoped on purpose\n");
  fs.mkdirSync(home, { recursive: true });
  if (dirty) write(path.join(home, "CLAUDE.md"), CLAUDE.replace("No Oxford commas.", "Oxford commas are fine."));
  else fs.symlinkSync(path.join(harness, "CLAUDE.md"), path.join(home, "CLAUDE.md"));
  const bucket = path.join(home, "skills", "synced", "bucket1");
  write(path.join(bucket, "alpha", "SKILL.md"), skill("alpha", "Formats tables in reports."));
  write(path.join(bucket, "kept-skill", "SKILL.md"), skill("kept-skill", "Writes release notes.", "Every number goes through a claim check first."));
  write(path.join(project, "CLAUDE.md"), "# Project\n\nUse the build script.\n");
  if (dirty) {
    write(path.join(project, "CLAUDE.md"), "# Project\n\nNever use an em dash in this project.\n\nResearch claims must go through an independent check before they reach me.\n\nThe spec lives in `docs/missing-spec.md`.\n");
    write(path.join(bucket, "beta", "SKILL.md"), skill("beta", "Draws charts.", "Use bars."));
    write(path.join(home, "plugins", "store", "p1", "skills", "beta", "SKILL.md"), skill("beta", "Draws charts.", "Use lines."));
    write(path.join(bucket, "gamma", "SKILL.md"), skill("gamma", "Writes guides.", "Read `references/guide.md` first."));
    write(path.join(bucket, "handoff", "SKILL.md"), skill("handoff", "Compact the current conversation into a handoff document for another agent to pick up."));
    write(path.join(bucket, "remember", "SKILL.md"), skill("remember", "Save session state for clean continuation next session."));
    write(path.join(bucket, "grill-me", "SKILL.md"), skill("grill-me", "A relentless interview."));
    write(path.join(bucket, "grilling", "SKILL.md"), skill("grilling", "Question the user about a plan."));
  }
  const prefs = path.join(root, "pasted-preferences.md");
  write(prefs, dirty ? build(CLAUDE) + "\nAlways answer in French.\n" : build(CLAUDE));
  return { root, harness, home, project, prefs };
}

function snapshot(dir) {
  const out = {};
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) { const s = fs.statSync(p); out[p] = crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex") + s.mtimeMs; }
    }
  };
  walk(dir);
  return out;
}

function run(f, extra = []) {
  const out = execFileSync(process.execPath, [inventory, "--json", "--harness", f.harness, "--home", f.home, "--project", f.project, "--prefs", f.prefs, "--today", "2026-11-18", ...extra], { encoding: "utf8" });
  return JSON.parse(out);
}

// Dirty setup: every planted mess is reported.
const d = setup(true);
const before = snapshot(d.root);
const r = run(d);
const has = (cls, re) => r.findings.some((x) => x.class === cls && re.test(x.title + " " + x.detail.join(" ")));
check("a rule restated in a project file is reported with its quote", has("restated", /rule "copy".*project\/CLAUDE\.md.*Never use an em dash/));
check("a paraphrase of a rule is reported as a near duplicate", has("near-duplicate", /project\/CLAUDE\.md/));
check("stale generated preferences are reported", has("drift", /preferences\/claude-ai\.md is older/));
check("a pasted account preferences line with no home is reported", has("drift", /Always answer in French/));
check("a global CLAUDE.md copy that drifted is reported", has("drift", /is a copy that differs/));
check("a skill loaded from the account and a plugin with different text is reported", has("loaded-twice", /"beta".*copies differ/));
check("a skill pointing at a missing file is reported", has("missing-file", /"gamma".*references\/guide\.md/));
check("a dead file reference in a project CLAUDE.md is reported", has("dead-reference", /docs\/missing-spec\.md/));
check("several handoff skills are reported as one overlap", has("overlap", /2 skills hand work between sessions/));
check("two skills with the same name stem are reported", has("overlap", /"grill-me" and "grilling"/));
check("a retired rule past two weeks is reported", has("retired-due", /old-rule/));
check("a restatement listed in tidy-keep.txt stays quiet", !r.findings.some((x) => /kept-skill/.test(x.title)));
check("an existing reference is not reported as dead", !r.findings.some((x) => /templates\/card\.md/.test(x.title)));
const outFile = path.join(d.root, "report.md");
execFileSync(process.execPath, [inventory, "--harness", d.harness, "--home", d.home, "--project", d.project, "--today", "2026-11-18", "--out", outFile], { encoding: "utf8" });
const after = snapshot(d.root);
delete after[outFile];
check("the inventory changed no file it read, and wrote only its report", JSON.stringify(before) === JSON.stringify(after) && fs.existsSync(outFile));

// Clean setup: nothing to report.
const c = setup(false);
const rc = run(c);
check("a clean setup gives no findings", rc.findings.length === 0);
if (rc.findings.length) console.log(JSON.stringify(rc.findings, null, 2));

fs.rmSync(d.root, { recursive: true, force: true });
fs.rmSync(c.root, { recursive: true, force: true });
if (fails) { console.log(`${fails} failed`); process.exit(1); }
console.log("TIDY CASES OK");
