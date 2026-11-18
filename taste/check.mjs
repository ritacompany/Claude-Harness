// Checks the taste library's structure. Prints "taste structure passed" only if every check holds.
// Run from the harness root: node taste/check.mjs [minimum entry count]
import fs from 'node:fs';
const fail = [];
const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch { fail.push(`missing ${p}`); return ''; } };
const inbox = read('taste/INBOX.md');
const index = read('taste/INDEX.md');
const readme = read('taste/README.md');
const skill = read('skills/taste/SKILL.md');
// Inbox: every item line is well formed, and no entry that exists is still waiting in the inbox.
const itemLines = inbox.split('\n').filter(l => l.startsWith('- '));
for (const l of itemLines) if (!/^- [a-z0-9-]+ \| /.test(l)) fail.push(`malformed inbox line: ${l}`);
const counts = [itemLines.length];
const sections = ['In one line','What it is','Why it works','Use it when','Do not use it when','How: code','How: Figma','Defaults to start from','How it goes wrong','How to check it','His take','Related','Sources'];
for (const s of sections) if (!readme.includes(s)) fail.push(`README lacks section name ${s}`);
if (!/^name: taste$/m.test(skill)) fail.push('skill frontmatter name missing');
const entries = fs.existsSync('taste/entries') ? fs.readdirSync('taste/entries').filter(f => f.endsWith('.md')) : [];
const min = Number(process.argv[2] || 1);
if (entries.length < min) fail.push(`only ${entries.length} entries, need ${min}`);
for (const f of entries) { const id = f.replace(/\.md$/, ''); if (new RegExp(`^- ${id} \\| (?!researched)`, 'm').test(inbox)) fail.push(`${id} is an entry but still waiting in INBOX`); }
const rows = (index.match(/^\| [a-z0-9-]+ \|/gm) || []).map(r => r.slice(2, -2)).filter(r => r !== 'id' && !/^-+$/.test(r));
for (const r of rows) if (!entries.includes(`${r}.md`)) fail.push(`INDEX row ${r} has no entry file`);
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
console.log(`taste structure passed (${entries.length} entries, ${counts[0]} inbox lines)`);
