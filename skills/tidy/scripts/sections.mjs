// Reads CLAUDE.md sections and their rule comments, and builds the claude.ai preferences text.
// Shared by the tidy inventory and the harness's scripts/build-preferences.mjs, so both read the
// rules the same way.
export function parseSections(text) {
  const lines = text.split("\n");
  const sections = [];
  let current = { heading: null, lines: [] };
  for (const line of lines) {
    if (/^## /.test(line)) { sections.push(current); current = { heading: line, lines: [] }; }
    else current.lines.push(line);
  }
  sections.push(current);
  for (const s of sections) {
    const body = s.lines.join("\n");
    const m = body.match(/<!--\s*rule:\s*([\w-]+)\s*\|\s*surfaces:\s*(\w+)\s*\|\s*match:\s*([\s\S]*?)-->/);
    s.id = m ? m[1] : null;
    s.surfaces = m ? m[2] : null;
    s.match = m ? m[3].split(";").map((x) => x.trim()).filter(Boolean) : [];
  }
  return sections;
}

const stripComments = (t) => t.replace(/<!--[\s\S]*?-->\n?/g, "");

export function build(claudeMd) {
  const sections = parseSections(claudeMd);
  const keep = [sections[0], ...sections.slice(1).filter((s) => s.surfaces === "all")];
  const parts = keep.map((s) => stripComments([s.heading, ...s.lines].filter((l) => l !== null).join("\n")).trim());
  const head = "Built from CLAUDE.md in ritacompany/claude-harness by scripts/build-preferences.mjs. Change the rules there, not here.";
  return [head, ...parts].join("\n\n").replace(/\n{3,}/g, "\n\n") + "\n";
}
