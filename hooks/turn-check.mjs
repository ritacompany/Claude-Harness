// Stop hook: checks the reply at the end of every turn against the rules a script can hold.
//   1. No em or en dash, and no hyphen pair doing a dash's job.
//   2. No Oxford comma ("a, b, and c").
//   3. The reply ends with the footer: a last line "[skills: <names or none>]".
//   4. Nothing runs unasked: a scheduled task, reminder, timer or PR watch started this turn
//      needs his own words asking for one somewhere in the chat.
// Code, inline code, links and quoted lines are not read for rules 1 and 2.
// It blocks at most 3 times in a row for the same chat, then lets the turn end and says so, so
// it can never wedge a session. A transcript it cannot read passes, with a note on stderr.
// A project whose own .claude/settings.json already runs a "turn-check" hook is left to it.
// One line per run goes to ~/.claude/state/turn-check.jsonl (HARNESS_STATE overrides the folder).
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const stateDir = process.env.HARNESS_STATE || path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), ".claude"), "state");
let input = {};
try { input = JSON.parse(fs.readFileSync(0, "utf8") || "{}"); } catch {}
const transcript = input.transcript_path || "";
const session = path.basename(transcript).replace(/\.jsonl$/, "") || "unknown";

function log(outcome, rules = [], note) {
  try {
    fs.mkdirSync(stateDir, { recursive: true });
    fs.appendFileSync(path.join(stateDir, "turn-check.jsonl"),
      JSON.stringify({ ts: new Date().toISOString(), outcome, rules, session, ...(note ? { note } : {}) }) + "\n");
  } catch {}
}
function pass(note) { if (note) process.stderr.write("turn-check: " + note + "\n"); log(note ? "unreadable" : "passed", [], note); process.exit(0); }

const proj = process.env.CLAUDE_PROJECT_DIR || input.cwd || "";
try {
  if (proj && /turn-check/.test(fs.readFileSync(path.join(proj, ".claude", "settings.json"), "utf8"))) { log("deferred"); process.exit(0); }
} catch {}

if (!transcript || !fs.existsSync(transcript)) pass("no transcript to read; nothing was checked");
const rows = [];
for (const line of fs.readFileSync(transcript, "utf8").split("\n")) {
  if (!line.trim()) continue;
  try { rows.push(JSON.parse(line)); } catch {}
}
const hasOrigin = rows.some(r => r && typeof r.origin === "object" && r.origin);
const content = r => (r.message || {}).content;
function typed(r) {
  if (r.type !== "user" || r.isSidechain || r.isMeta) return false;
  if (hasOrigin && (r.origin || {}).kind !== "human") return false;
  const c = content(r);
  if (typeof c === "string") return c.trim().length > 0;
  return Array.isArray(c) && c.some(b => b && b.type === "text") && !c.some(b => b && b.type === "tool_result");
}
const textOf = r => { const c = content(r); return typeof c === "string" ? c : (c || []).filter(b => b && b.type === "text").map(b => b.text || "").join("\n"); };
const starts = rows.map((r, i) => typed(r) ? i : -1).filter(i => i >= 0);
if (!starts.length) pass("no typed message in the transcript; nothing was checked");
const start = starts[starts.length - 1];
const turn = rows.slice(start + 1).filter(r => !r.isSidechain);
const everTyped = starts.map(i => textOf(rows[i])).join("\n");

let reply = "";
const tools = [];
for (const r of turn) {
  if (r.type !== "assistant") continue;
  for (const b of content(r) || []) {
    if (b && b.type === "text" && (b.text || "").trim()) reply = b.text;
    if (b && b.type === "tool_use") tools.push(b.name || "");
  }
}
if (!reply.trim()) pass();

// Prose only: drop code fences, inline code, links, quoted lines and table rules.
const prose = [];
let fence = false;
for (const raw of reply.split("\n")) {
  if (/^\s*```/.test(raw)) { fence = !fence; continue; }
  if (fence || /^\s*>/.test(raw) || /^\s*[-=|: ]+\s*$/.test(raw)) continue;
  prose.push(raw.replace(/`[^`]*`/g, "").replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+/g, ""));
}
const found = [];
const hits = (re) => prose.filter(l => re.test(l)).slice(0, 3);
const dash = hits(/[–—]|[\w,)]--[\w(]|[\w,)] -- [\w(]/);
if (dash.length) found.push(["dash", "an em dash, en dash or hyphen pair doing a dash's job. Rewrite the sentence; do not swap in another dash", dash]);
const W = "(?!(?:and|or)\\b)[\\w'-]+";
const oxford = hits(new RegExp("\\b" + W + "(?: " + W + ")?, " + W + "(?: " + W + ")?, (?:and|or) [\\w'-]"));
if (oxford.length) found.push(["oxford-comma", "an Oxford comma. Drop the comma before the last and/or", oxford]);
const lines = reply.trim().split("\n");
if (!/^\[skills: [^\]]+\]$/.test(lines[lines.length - 1].trim()))
  found.push(["footer", "no footer. End the reply with a last line [skills: <names that loaded this turn, or none>]", []]);
const SCHEDULE = /^(CronCreate|ScheduleWakeup|PushNotification|mcp__.*__(send_later|create_trigger|subscribe_pr_activity))$/;
const started = [...new Set(tools.filter(t => SCHEDULE.test(t)))];
if (started.length && !/\b(schedul\w*|remind\w*|timer|check[- ]?in|every \w+|loop|watch\w*|monitor\w*|subscrib\w*|babysit\w*|notify|ping me)\b/i.test(everTyped))
  found.push(["unasked", "a scheduled task, reminder or PR watch was started (" + started.join(", ") + ") and he never asked for one in this chat. Undo it, then say so in one line", []]);

const counter = path.join(stateDir, "turn-check-" + session + ".count");
if (!found.length) { try { fs.rmSync(counter, { force: true }); } catch {} log("passed"); process.exit(0); }
let n = 0;
try { n = Number(fs.readFileSync(counter, "utf8")) || 0; } catch {}
const ids = found.map(f => f[0]);
if (n >= 3) {
  try { fs.rmSync(counter, { force: true }); } catch {}
  process.stderr.write("turn-check: still failing after 3 tries (" + ids.join(", ") + "); the turn ends anyway\n");
  log("released", ids); process.exit(0);
}
try { fs.mkdirSync(stateDir, { recursive: true }); fs.writeFileSync(counter, String(n + 1)); } catch {}
const reason = "The reply breaks a personal rule. Fix it and send the reply again:\n" +
  found.map(([, why, ex]) => "- " + why + (ex.length ? "\n    " + ex.map(e => e.trim().slice(0, 160)).join("\n    ") : "")).join("\n");
log("blocked", ids);
process.stdout.write(JSON.stringify({ decision: "block", reason }));
