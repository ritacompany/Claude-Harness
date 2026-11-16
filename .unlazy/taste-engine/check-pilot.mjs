// Checks the taste pilot's structure. Prints "pilot structure passed" only if every check holds.
import fs from 'node:fs';
const fail = [];
const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch { fail.push(`missing ${p}`); return ''; } };
const inbox = read('taste/INBOX.md');
const index = read('taste/INDEX.md');
const readme = read('taste/README.md');
const skill = read('skills/taste/SKILL.md');
// Inbox: every item legible in the four screenshots. 15 + 20 + 20 + 10.
const counts = [...inbox.split(/^## /m).slice(1)].map(sec => (sec.match(/^- [a-z0-9-]+ \|/gm) || []).length);
const want = [15, 20, 20, 10];
if (JSON.stringify(counts) !== JSON.stringify(want)) fail.push(`inbox section counts ${JSON.stringify(counts)} != ${JSON.stringify(want)}`);
const sections = ['In one line','What it is','Why it works','Use it when','Do not use it when','How: code','How: Figma','Defaults to start from','How it goes wrong','How to check it','His take','Related','Sources'];
for (const s of sections) if (!readme.includes(s)) fail.push(`README lacks section name ${s}`);
if (!/^name: taste$/m.test(skill)) fail.push('skill frontmatter name missing');
const entries = fs.existsSync('taste/entries') ? fs.readdirSync('taste/entries').filter(f => f.endsWith('.md')) : [];
if (entries.length < 2) fail.push(`only ${entries.length} entries`);
for (const f of entries) {
  const t = fs.readFileSync(`taste/entries/${f}`, 'utf8');
  const id = f.replace(/\.md$/, '');
  for (const s of sections) if (!new RegExp(`^## ${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'm').test(t)) fail.push(`${f} lacks ## ${s}`);
  const src = t.split(/^## Sources$/m)[1] || '';
  const urls = new Set((src.match(/https:\/\/[^\s)]+/g) || []).map(u => u.replace(/[.,:]+$/, '')));
  if (urls.size < 3) fail.push(`${f} cites ${urls.size} sources`);
  const dn = (t.split(/^## Do not use it when$/m)[1] || '').split(/^## /m)[0].trim();
  if (!dn) fail.push(`${f} has empty Do not use it when`);
  if (!new RegExp(`^\\| ${id} \\|`, 'm').test(index)) fail.push(`INDEX lacks row ${id}`);
}
if (fail.length) { console.log(fail.join('\n')); process.exit(1); }
console.log(`pilot structure passed (${entries.length} entries, inbox ${counts.join('+')})`);
