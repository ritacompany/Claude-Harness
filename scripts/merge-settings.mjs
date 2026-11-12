// Adds the harness hooks and status line to a Claude settings file without touching anything else.
// Usage: node merge-settings.mjs <settings.json>
// Idempotent: harness entries are recognised by "claude-harness" in their command and replaced.
// A status line of his own keeps running: the harness one runs it and adds the weekly figure.
import fs from "node:fs";
import path from "node:path";
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
// The usage guard reads the weekly figure the harness status line saves, so ours must run. A status
// line of his own is kept: its command is saved and ours runs it first and shows its output.
const ourStatus = `bash ${H}/statusline/usage-statusline.sh"`;
let statusNote = "added";
const current = s.statusLine && s.statusLine.command;
if (current && !String(current).includes("claude-harness")) {
  const stateDir = path.join(path.dirname(path.resolve(file)), "state");
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(path.join(stateDir, "statusline-wrapped.json"), JSON.stringify({ command: current }) + "\n");
  statusNote = "yours kept and shown first, with weekly usage added";
} else if (current) {
  statusNote = "already set";
}
s.statusLine = { ...(s.statusLine || {}), type: "command", command: ourStatus };
fs.writeFileSync(file, JSON.stringify(s, null, 2) + "\n");
console.log(`settings: harness hooks set, status line ${statusNote}`);
