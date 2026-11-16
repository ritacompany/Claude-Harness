import { join } from "node:path"; import { existsSync } from "node:fs"; import { ROOT, SKILL, read } from "./lib.mjs";
const bad = [];
if (!existsSync(join(SKILL, "SKILL.md"))) bad.push("no skill");
else if (!/^---\nname: tool-defaults\ndescription: .{80,}/m.test(read(join(SKILL, "SKILL.md")))) bad.push("skill frontmatter");
const claude = read(join(ROOT, "CLAUDE.md"));
if (!/tool-defaults/.test(claude) || !/(tool|board|canvas|editor)/i.test(claude.split("tool-defaults")[0].slice(-400) + claude.split("tool-defaults")[1]?.slice(0, 400))) bad.push("CLAUDE.md pointer");
const readme = read(join(ROOT, "README.md"));
if (!/skills\/tool-defaults/.test(readme) || !/cloud/i.test(readme)) bad.push("README row");
if (bad.length) { console.log(bad.join("\n")); process.exit(1); }
console.log("wiring ok");
