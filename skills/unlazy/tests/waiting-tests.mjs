// Planted transcripts for the Stop hook's waiting state (Mondai M8, 4 Nov).
// Run: node .claude/skills/unlazy/tests/waiting-tests.mjs
import { mkdtempSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HOOK = join(dirname(fileURLToPath(import.meta.url)), "..", "scripts", "stop-hook.mjs");
const typed = (t) => ({ type: "user", origin: { kind: "human" }, message: { content: t } });
const say = (t) => ({ type: "assistant", message: { content: [{ type: "text", text: t }] } });
let n = 0;
const launch = () => { n++; return [
  { type: "assistant", message: { content: [{ type: "tool_use", id: "tu" + n, name: "Agent", input: { prompt: "x" } }] } },
  { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "tu" + n, content: [{ type: "text", text: "Async agent launched successfully.\nagentId: ag" + n + " (internal ID)" }] }] } }]; };
const notify = (i) => ({ type: "attachment", attachment: { type: "queued_command", prompt: `<task-notification>\n<task-id>ag${i}</task-id>\n<tool-use-id>tu${i}</tool-use-id>\n<status>completed</status>\n</task-notification>` } });
const bash = () => { n++; return [
  { type: "assistant", message: { content: [{ type: "tool_use", id: "tu" + n, name: "Bash", input: { command: "x" } }] } },
  { type: "user", message: { content: [{ type: "tool_result", tool_use_id: "tu" + n, content: "Command running in background with ID: b" + n }] } }]; };

function run(rows, extra = {}) {
  const root = mkdtempSync(join(tmpdir(), "unlazy-wait-"));
  mkdirSync(join(root, ".unlazy", "s"), { recursive: true });
  writeFileSync(join(root, ".unlazy", "s", "GATES.md"), "# Gates: t\n\n- [ ] G1: open gate\n  EVIDENCE: pending\n");
  const tp = join(root, "t.jsonl");
  writeFileSync(tp, rows.map((r) => JSON.stringify(r)).join("\n") + "\n");
  const p = spawnSync("node", [HOOK, "--scope", "s"], { input: JSON.stringify({ cwd: root, session_id: "w" + Math.random(), transcript_path: tp, ...extra }), encoding: "utf8" });
  rmSync(root, { recursive: true, force: true });
  return /"decision":\s*"block"/.test(p.stdout) ? "block" : "pass";
}

const cases = [
  ["five agents running, open gates, no done claim", "pass", [typed("go"), ...launch(), ...launch(), ...launch(), ...launch(), ...launch(), say("Five agents are running.")]],
  ["five agents running, reply claims done", "block", [typed("go"), ...launch(), ...launch(), ...launch(), ...launch(), ...launch(), say("All done, everything is complete.")]],
  ["agents all reported, open gates", "block", (() => { const s = n; const r = [typed("go"), ...launch(), ...launch()]; return [...r, notify(s + 1), notify(s + 2), say("Both reported.")]; })()],
  ["one of two reported", "pass", (() => { const s = n; const r = [typed("go"), ...launch(), ...launch()]; return [...r, notify(s + 1), say("Waiting on one.")]; })()],
  ["no agents, open gates", "block", [typed("go"), say("Working on it.")]],
  ["background tasks in hook input", "pass", [typed("go"), say("Shell still running.")], { background_tasks: [{ id: "b1", type: "shell" }] }],
  ["background shell from the transcript", "pass", [typed("go"), ...bash(), say("Tests running.")]],
  ["unreadable transcript, open gates", "block", [], { transcript_path: "/no/such/file.jsonl" }],
];
let wrong = 0;
for (const [name, want, rows, extra] of cases) {
  const got = run(rows, extra || {});
  if (got !== want) wrong++;
  console.log((got === want ? "ok     " : "WRONG  ") + name + " (" + got + ")");
}
console.log(`\n${cases.length} cases, ${wrong} wrong`);
process.exit(wrong ? 1 : 0);
