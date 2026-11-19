import { ruleBullets, evidence, cites } from "./lib.mjs";
const ev = evidence(); const bad = [];
const rules = ruleBullets();
if (!rules.length) bad.push("no rule bullets found");
for (const r of rules) {
  const ids = cites(r.line);
  if (!ids.length) { bad.push("uncited: " + r.line.trim().slice(0, 90)); continue; }
  for (const id of ids) {
    const e = ev.get(id);
    if (!e) bad.push("missing evidence " + id);
    else if (!/^".+"$/.test(e.quote || "") || !e.source || !/^\d{4}-\d{2}-\d{2}$/.test(e.date || "")) bad.push("incomplete evidence " + id);
  }
}
if (bad.length) { console.log([...new Set(bad)].slice(0, 40).join("\n")); process.exit(1); }
console.log(`rules=${rules.length} evidence=${ev.size}\ncitations ok`);
