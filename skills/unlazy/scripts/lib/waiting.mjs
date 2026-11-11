// Waiting state for the Stop hook (Mondai, 4 Nov, review M8): a turn that launched background
// agents or tasks that have not reported yet, and does not claim to be done, ends without a block.
// "plese fix the way unlazy is set up" (Chadwick, 24 Oct); the levers review lead turn was blocked
// 14 times while five reviewers ran. A turn that claims done with open gates is still blocked.
import { readFileSync } from "node:fs";

const LAUNCH = /Async agent launched|running in (?:the )?background|moved to the background|launched in the background/i;
const DONE = /\b(?:all (?:gates )?(?:met|done|passed)|(?:is|are|now|it's|everything(?:'s| is)) (?:done|complete|finished)|complete(?:d)? and (?:merged|verified)|ready to (?:ship|merge|hand off)|done report|work is done)\b/i;

function textOf(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content.map((c) => (typeof c === "string" ? c : c && (c.text || (typeof c.content === "string" ? c.content : textOf(c.content))) || "")).join("\n");
}

// Ids launched in the background and not yet reported back, read from the transcript.
export function runningFromTranscript(lines) {
  const launched = new Map(); // tool_use_id -> agent/task id (or null)
  const finished = new Set();
  for (const line of lines) {
    let d; try { d = JSON.parse(line); } catch { continue; }
    const content = d && d.message && d.message.content;
    if (Array.isArray(content)) for (const c of content) {
      if (c && c.type === "tool_result") {
        const t = textOf(c.content);
        if (LAUNCH.test(t)) {
          const m = t.match(/agentId:\s*([\w-]+)|\bID:\s*([\w-]+)/);
          launched.set(c.tool_use_id, m ? (m[1] || m[2]) : null);
        }
      }
    }
    const s = (d && d.attachment && d.attachment.prompt) || (d && d.type === "user" ? textOf(content) : "");
    if (typeof s === "string" && /<task-notification>|agent-message from=|Subagent hand-back/.test(s)) {
      if (/<status>\s*(?:running|started)\s*<\/status>/.test(s)) continue;
      for (const m of s.matchAll(/<tool-use-id>([\w-]+)<\/tool-use-id>|<task-id>([\w-]+)<\/task-id>|from="([\w-]+)"/g)) finished.add(m[1] || m[2] || m[3]);
    }
  }
  let n = 0;
  for (const [tid, id] of launched) if (!finished.has(tid) && !(id && finished.has(id))) n++;
  return n;
}

export function lastAssistantText(lines) {
  for (let i = lines.length - 1; i >= 0; i--) {
    let d; try { d = JSON.parse(lines[i]); } catch { continue; }
    if (d && d.type === "assistant") { const t = textOf(d.message && d.message.content); if (t.trim()) return t; }
    if (d && d.type === "user" && d.origin && d.origin.kind === "human") return "";
  }
  return "";
}

export function claimsDone(text) { return DONE.test(String(text || "")); }

// Returns a count of running background items when the stop should wait, else 0.
export function waiting(payload) {
  let lines = [];
  try { if (payload.transcript_path) lines = readFileSync(payload.transcript_path, "utf8").split("\n"); } catch { /* unreadable: no waiting state */ }
  const tasks = Array.isArray(payload.background_tasks) ? payload.background_tasks.length : 0;
  const running = Math.max(tasks, runningFromTranscript(lines));
  if (!running) return 0;
  const text = typeof payload.last_assistant_message === "string" ? payload.last_assistant_message : lastAssistantText(lines);
  return claimsDone(text) ? 0 : running;
}
