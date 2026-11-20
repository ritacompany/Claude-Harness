import { join } from "node:path"; import { ROOT, ruleFiles, read } from "./lib.mjs";
const files = [...ruleFiles(), join(ROOT, "CLAUDE.md"), join(ROOT, "README.md")];
const W = "(?!(?:and|or)\\b)[\\w'-]+";
const ox = new RegExp("\\b" + W + "(?: " + W + ")?, " + W + "(?: " + W + ")?, (?:and|or) [\\w'-]");
const dash = /[–—]|[\w,)]--[\w(]|[\w,)] -- [\w(]/;
const bad = [];
for (const f of files) { let fence = false;
  for (const raw of read(f).split("\n")) {
    if (/^\s*```/.test(raw)) { fence = !fence; continue; }
    if (fence || /^\s*>/.test(raw) || /^\s*[-=|: ]+\s*$/.test(raw)) continue;
    const l = raw.replace(/`[^`]*`/g, "").replace(/"[^"]*"/g, "").replace(/https?:\/\/\S+/g, "");
    if (dash.test(l) || ox.test(l)) bad.push(f.replace(ROOT + "/", "") + ": " + raw.trim().slice(0, 100));
  } }
if (bad.length) { console.log(bad.join("\n")); process.exit(1); }
console.log("copy ok");
