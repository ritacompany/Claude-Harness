// Prints every rule bullet with the full quote of each id it cites, for the fit review.
import { ruleBullets, evidence, cites, ROOT } from "./lib.mjs";
const ev = evidence();
let n = 0;
for (const r of ruleBullets()) {
  n++;
  console.log(`\nR${n} [${r.file.replace(ROOT + "/skills/tool-defaults/", "")}] ${r.line.trim()}`);
  for (const id of [...new Set(cites(r.line))]) { const e = ev.get(id); console.log(`   ${id} (${e.date}) ${e.quote}`); }
}
