// Proves tool-check catches each planted mistake and passes the clean page.
// Usage: node skills/tool-defaults/tests/vaccinate.mjs  (prints "vaccine ok" when every case behaves)
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const check = join(here, "..", "scripts", "tool-check.mjs");
const shots = mkdtempSync(join(tmpdir(), "tool-check-"));
const cases = { "clean.html": null, "p1-sideways.html": "overflow", "p2-sidebar-stuck.html": "sidebar", "p3-scrollbox.html": "scrollbox", "p4-tinytext.html": "tinytext", "p5-light.html": "theme", "p6-nosave.html": "save", "p7-dash.html": "copy", "p8-oxford.html": "copy", "p9-notitle.html": "title", "p10-error.html": "errors" };
let bad = 0;
for (const [file, kind] of Object.entries(cases)) {
  let out = "", code = 0;
  try { out = execFileSync("node", [check, join(here, file), "--out", join(shots, file)], { encoding: "utf8" }); }
  catch (e) { out = (e.stdout || "") + (e.stderr || ""); code = e.status; }
  const ok = kind === null ? code === 0 && /tool-check passed/.test(out) : code === 1 && new RegExp("^" + kind + ":", "m").test(out);
  console.log(`${ok ? "caught" : "MISSED"} ${file}${kind ? " (" + kind + ")" : " (clean, must pass)"}`);
  if (!ok) bad++;
}
if (bad) { console.log(`${bad} case(s) wrong`); process.exit(1); }
console.log("vaccine ok");
