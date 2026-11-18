#!/usr/bin/env node
// Measures how many places each personal rule is written, plus skill duplication,
// from the snapshot of what this cloud session loaded and the harness repo.
// Usage: node research/hygiene/measure-dup.mjs            prints the figures
//        node research/hygiene/measure-dup.mjs --verify R  checks every figure tagged in report R
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, "../..");
const snap = path.join(here, "snapshot");

// Every place a rule can be written that someone has to keep in step.
const sources = {
  "account preferences (claude.ai)": path.join(snap, "account-preferences.md"),
  "CLAUDE.md in cloud sessions": path.join(snap, "cloud-CLAUDE.md"),
  "harness CLAUDE.md": path.join(repo, "CLAUDE.md"),
  "harness README": path.join(repo, "README.md"),
  "humanizer skill": path.join(repo, "skills/humanizer/SKILL.md"),
  "turn check hook": path.join(repo, "hooks/turn-check.mjs"),
};

const rules = {
  "dashes": /em (or en )?dash|en dash|double hyphen|hyphen pair|\bno dashes\b|check the dash/i,
  "oxford-comma": /oxford comma/i,
  "default-to-deciding": /default to deciding/i,
  "ask-only-what-i-hold": /only i hold/i,
  "one-question": /one question or none/i,
  "no-status-messages": /status messages/i,
  "lead-with-answer": /lead with the answer/i,
  "no-implied-memory": /shared (memory|recall)/i,
  "never-invent": /(never|do not) invent/i,
  "agreement-complete": /agreement the evidence supports/i,
  "checked-vs-inferred": /(verified information from inference|checked from what is inferred)/i,
};

function measure() {
  const out = {};
  const text = Object.fromEntries(Object.entries(sources).map(([k, p]) => [k, fs.readFileSync(p, "utf8").replace(/\s+/g, " ")]));
  for (const [id, re] of Object.entries(rules)) {
    const files = Object.keys(text).filter((k) => re.test(text[k]));
    out[id] = { places: files.length, files };
  }
  // Skills loaded twice: same name from a plugin and from the claude.ai account.
  const acct = new Set(fs.readFileSync(path.join(snap, "account-skills.txt"), "utf8").split("\n").filter(Boolean));
  const plug = fs.readFileSync(path.join(snap, "plugin-skills.txt"), "utf8").split("\n").filter(Boolean);
  out["skills-loaded-twice"] = { places: plug.filter((n) => acct.has(n)).length };
  out["account-skills"] = { places: acct.size };
  // Files the harness skills point at that do not exist in the copy the account serves.
  const synced = "/root/.claude/skills/synced";
  let missing = 0;
  const missingList = [];
  if (fs.existsSync(synced)) {
    const root = path.join(synced, fs.readdirSync(synced).find((d) => !d.startsWith(".")));
    for (const s of ["unlazy", "resource-sourcing", "humanizer"]) {
      const body = fs.readFileSync(path.join(root, s, "SKILL.md"), "utf8").replace(/```[\s\S]*?```/g, "");
      const refs = new Set([...body.matchAll(/`((?:templates|references|scripts)\/[\w./-]+\.(?:md|mjs))`/g)].map((m) => m[1]));
      for (const r of refs) if (!fs.existsSync(path.join(root, s, r))) { missing++; missingList.push(`${s}/${r}`); }
    }
  }
  out["missing-skill-files"] = { places: missing, files: missingList };
  return out;
}

const res = measure();
const args = process.argv.slice(2);
if (args[0] === "--verify") {
  const report = fs.readFileSync(path.resolve(args[1]), "utf8");
  const tags = [...report.matchAll(/<!-- dup:([\w-]+)=(\d+) -->/g)];
  if (tags.length < 8) { console.log(`only ${tags.length} tagged figures found`); process.exit(1); }
  let bad = 0;
  for (const [, id, n] of tags) {
    if (!res[id]) { console.log(`unknown figure ${id}`); bad++; continue; }
    if (res[id].places !== Number(n)) { console.log(`${id}: report says ${n}, measured ${res[id].places}`); bad++; }
  }
  if (bad) process.exit(1);
  console.log(`DUP FIGURES MATCH (${tags.length} checked)`);
} else {
  for (const [id, r] of Object.entries(res)) console.log(`${id}\t${r.places}\t${(r.files || []).join("; ")}`);
}
