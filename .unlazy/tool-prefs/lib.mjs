// Shared readers for the tool-defaults gates. Paths are relative to the harness repo root.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SKILL = join(ROOT, "skills", "tool-defaults");
export const read = (p) => readFileSync(p, "utf8");
export function ruleFiles() {
  const out = [join(SKILL, "SKILL.md")];
  const ref = join(SKILL, "references");
  if (existsSync(ref)) for (const f of readdirSync(ref)) if (f.endsWith(".md")) out.push(join(ref, f));
  return out.filter(existsSync);
}
// Evidence entries: "### E012 · label" then "- quote:", "- source:", "- date:" lines.
export function evidence() {
  const p = join(SKILL, "evidence", "EVIDENCE.md");
  if (!existsSync(p)) return new Map();
  const map = new Map();
  let cur = null;
  for (const line of read(p).split("\n")) {
    const h = line.match(/^### (E\d{3,4})\b/);
    if (h) { cur = { id: h[1] }; map.set(h[1], cur); continue; }
    if (!cur) continue;
    const f = line.match(/^- (quote|source|date): (.*)$/);
    if (f) cur[f[1]] = f[2].trim();
  }
  return map;
}
// Rule bullets: list lines in rule files outside code fences and outside "## About" sections.
export function ruleBullets() {
  const rows = [];
  for (const file of ruleFiles()) {
    let fence = false, skip = false, last = null;
    for (const line of read(file).split("\n")) {
      if (/^\s*```/.test(line)) { fence = !fence; continue; }
      if (fence) continue;
      if (/^#{1,3} /.test(line)) { skip = /^#{1,3} (About|How to use|What is not here|Where this comes from|Sources)/i.test(line); last = null; continue; }
      if (skip) continue;
      if (/^\s*(- |\d+\. )/.test(line) && line.replace(/^\s*(- |\d+\. )/, "").trim().length > 25) { last = { file, line }; rows.push(last); continue; }
      if (last && /^\s{2,}\S/.test(line)) { last.line += " " + line.trim(); continue; }
      last = null;
    }
  }
  return rows;
}
export const cites = (s) => [...s.matchAll(/\bE\d{3,4}\b/g)].map((m) => m[0]);
