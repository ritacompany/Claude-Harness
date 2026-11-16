import { ruleBullets, evidence, cites } from "./lib.mjs";
const ev = evidence(); const used = new Set(ruleBullets().flatMap((r) => cites(r.line)));
const sources = new Set(), months = new Set();
for (const id of used) { const e = ev.get(id); if (!e) continue; sources.add((e.source || "").split("·")[0].trim()); months.add((e.date || "").slice(0, 7)); }
console.log(`cited=${used.size} sources=${sources.size} months=${[...months].sort().join(",")}`);
if (sources.size >= 25 && months.size >= 3) console.log("breadth ok"); else process.exit(1);
