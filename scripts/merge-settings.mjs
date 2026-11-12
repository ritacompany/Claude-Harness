// Adds the harness hooks and status line to a Claude settings file without touching anything else.
// Usage: node merge-settings.mjs <settings.json>
// Idempotent: harness entries are recognised by "claude-harness" in their command and replaced.
// The status line is set only when the file has none, so his own is never overwritten.
import fs from "node:fs";
const file = process.argv[2];
let s = {};
if (fs.existsSync(file)) {
  const raw = fs.readFileSync(file, "utf8").trim();
  if (raw) s = JSON.parse(raw);
}
const H = '"$HOME/.claude/claude-harness';
const ours = {
  UserPromptSubmit: [{ hooks: [{ type: "command", command: `bash ${H}/hooks/usage-guard.sh" prompt` }] }],
  PreToolUse: [{ matcher: "Agent|Task|Workflow", hooks: [{ type: "command", command: `bash ${H}/hooks/usage-guard.sh" tool` }] }],
  Stop: [{ hooks: [
    { type: "command", command: `node ${H}/hooks/turn-check.mjs"` },
    { type: "command", command: `bash ${H}/hooks/unlazy-stop.sh"` },
  ] }],
};
s.hooks ??= {};
for (const [event, entries] of Object.entries(ours)) {
  const kept = (s.hooks[event] ?? []).filter(e => !(e.hooks ?? []).some(h => String(h.command ?? "").includes("claude-harness")));
  s.hooks[event] = [...kept, ...entries];
}
let statusNote = "kept yours";
if (!s.statusLine) {
  s.statusLine = { type: "command", command: `bash ${H}/statusline/usage-statusline.sh"` };
  statusNote = "added";
}
fs.writeFileSync(file, JSON.stringify(s, null, 2) + "\n");
console.log(`settings: harness hooks set, status line ${statusNote}`);
