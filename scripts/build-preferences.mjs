#!/usr/bin/env node
// Builds the claude.ai account preferences from CLAUDE.md, so the two can never say different things.
// It keeps the opening paragraph and every section whose rule comment says "surfaces: all", word for
// word, and drops the HTML comments (they are notes for people and cost Claude nothing).
//   node scripts/build-preferences.mjs           writes preferences/claude-ai.md
//   node scripts/build-preferences.mjs --check   exits 1 if preferences/claude-ai.md is out of date
//   node scripts/build-preferences.mjs --stdout  prints the text, for pasting into claude.ai
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "../skills/tidy/scripts/sections.mjs";

export { build };

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const src = process.env.HARNESS_CLAUDE_MD || path.join(repo, "CLAUDE.md");
  const out = process.env.HARNESS_PREFERENCES || path.join(repo, "preferences/claude-ai.md");
  const text = build(fs.readFileSync(src, "utf8"));
  const arg = process.argv[2];
  if (arg === "--check") {
    const have = fs.existsSync(out) ? fs.readFileSync(out, "utf8") : "";
    if (have !== text) { console.log("preferences are out of date: run node scripts/build-preferences.mjs and paste the result into claude.ai"); process.exit(1); }
    console.log(`PREFERENCES UP TO DATE (${text.length} characters)`);
  } else if (arg === "--stdout") {
    process.stdout.write(text);
  } else {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, text);
    console.log(`wrote ${path.relative(repo, out)} (${text.length} characters). Paste it into claude.ai: Settings, Profile, preferences.`);
  }
}
