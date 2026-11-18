// SOURCES.md must hold three sections, each a list measured here: archive chats, cloud sessions, repo sweep.
import { existsSync } from "node:fs"; import { join } from "node:path"; import { SKILL, read } from "./lib.mjs";
const p = join(SKILL, "evidence", "SOURCES.md");
if (!existsSync(p)) { console.log("no SOURCES.md"); process.exit(1); }
const sec = {}; let cur = null;
for (const line of read(p).split("\n")) {
  const h = line.match(/^## (.+)$/); if (h) { cur = h[1].toLowerCase(); sec[cur] = []; continue; }
  if (cur && /^- /.test(line)) sec[cur].push(line);
}
const n = (k) => Object.entries(sec).find(([h]) => h.startsWith(k))?.[1].length || 0;
const archive = n("archived claude.ai chats"), cloud = n("cloud sessions"), repo = n("repo sweep"), art = n("artifacts");
console.log(`archive=${archive} cloud=${cloud} repo=${repo} artifacts=${art}`);
// 148 is the archive's own INDEX count (mondaihistory/claude/INDEX.md); 71 is the selected cloud set.
if (archive >= 148 && cloud >= 71 && repo >= 1 && art >= 1) console.log("coverage ok"); else process.exit(1);
