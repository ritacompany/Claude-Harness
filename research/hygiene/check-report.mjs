#!/usr/bin/env node
// Structural checks for the hygiene research report. Usage: node check-report.mjs <part>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(here, f), "utf8");
const part = process.argv[2];
const fail = (m) => { console.log(`FAIL ${part}: ${m}`); process.exit(1); };

// Returns the body of a "## Heading" section, up to the next level two heading.
function section(text, heading) {
  const lines = text.split("\n");
  const start = lines.findIndex((l) => l.trim().toLowerCase() === `## ${heading}`.toLowerCase());
  if (start < 0) return null;
  const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  return lines.slice(start + 1, end < 0 ? undefined : end).join("\n");
}
const stripCode = (t) => t.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");

const report = read("REPORT.md");

if (part === "sourcing") {
  const s = section(report, "What exists");
  if (!s) fail("no 'What exists' section");
  const entries = s.split(/\n(?=### )/).filter((e) => e.startsWith("### "));
  const good = entries.filter((e) => /https:\/\/\S+/.test(e) && /\b20\d\d-\d\d-\d\d\b/.test(e));
  if (good.length < 4) fail(`${good.length} candidates with link and date, need 4`);
  console.log(`SOURCING OK (${good.length} candidates)`);
} else if (part === "research") {
  const s = section(report, "Sources");
  if (!s) fail("no 'Sources' section");
  const urls = new Set([...s.matchAll(/https:\/\/[^\s)>\]]+/g)].map((m) => m[0].replace(/[.,]$/, "")));
  if (urls.size < 6) fail(`${urls.size} distinct sources, need 6`);
  console.log(`RESEARCH OK (${urls.size} sources)`);
} else if (part === "claims") {
  const rows = read("claims.md").split("\n").filter((l) => /^\|\s*C?\d+\s*\|/.test(l));
  if (rows.length < 10) fail(`${rows.length} claim rows, need 10`);
  const verdicts = rows.map((r) => r.split("|").map((c) => c.trim()).filter(Boolean).pop());
  const unchecked = verdicts.filter((v) => !/^(SUPPORTED|CORRECTED|REMOVED)\b/.test(v));
  if (unchecked.length) fail(`${unchecked.length} claims without a passing verdict: ${unchecked.slice(0, 3).join(" / ")}`);
  console.log(`CLAIMS OK (${rows.length} claims)`);
} else if (part === "recommendation") {
  const rec = section(report, "Recommendation");
  if (!rec) fail("no 'Recommendation' section");
  if (!/what would change it/i.test(rec)) fail("recommendation does not say what would change it");
  const safe = section(report, "Safeguards against deleting what matters");
  if (!safe) fail("no safeguards section");
  const bullets = safe.split("\n").filter((l) => /^(\d+\.|-) /.test(l));
  if (bullets.length < 4) fail(`${bullets.length} safeguards, need 4`);
  console.log(`RECOMMENDATION OK (${bullets.length} safeguards)`);
} else if (part === "copy") {
  // Positive control: the same test must catch planted marks.
  const bad = (t) => /[–—]|\w\s?--\s?\w/.test(stripCode(t));
  if (!bad("a — b") || !bad("a -- b") || bad("run `x --y`")) fail("control failed");
  const files = ["REPORT.md", "sourcing.md", "deep-research.md"].filter((f) => fs.existsSync(path.join(here, f)));
  const hits = files.filter((f) => bad(read(f)));
  if (hits.length) fail(`dash marks in ${hits.join(", ")}`);
  console.log(`COPY OK (${files.length} files)`);
} else fail("unknown part");
