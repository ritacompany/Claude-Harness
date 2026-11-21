// UserPromptSubmit: warns as a chat nears his 200k limit, on every project (the Mondai repo carries the
// same logic plus its long message step in ops/hooks/lib/prompt-check.mjs). His words, 18 Nov: "I don't
// really want us to go more than like 200 tokens max in one session ... reminding me, that would be great too."
// The context size is the last main thread reply's usage in the transcript (input plus cache read plus cache
// creation plus output). From WARN Claude is told once to say it in one line and hand over at the next stop;
// from LIMIT, on every message, to hand over now. He sees the line too (systemMessage).
// Env: HARNESS_SESSION_WARN, HARNESS_SESSION_LIMIT (tokens), HARNESS_STATE (folder). Never blocks.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const WARN = +(process.env.HARNESS_SESSION_WARN || 150000);
const LIMIT = +(process.env.HARNESS_SESSION_LIMIT || 180000);

export function contextSize(transcriptText) {
  const lines = transcriptText.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const l = lines[i].trim();
    if (!l || !l.includes('"usage"')) continue;
    let r; try { r = JSON.parse(l); } catch { continue; }
    if (r.type !== 'assistant' || r.isSidechain) continue;
    const u = (r.message || {}).usage;
    if (!u) continue;
    return (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.output_tokens || 0);
  }
  return 0;
}

// told: the levels already said this session ({ warn: true }). Returns { context, message, told }.
export function decide({ size, told = {} }) {
  const k = Math.round(size / 1000);
  const ctx = []; const msg = [];
  if (size >= LIMIT) {
    ctx.push(`This chat is at about ${k}k tokens, past the ${Math.round(LIMIT / 1000)}k line he set (he wants no chat over about 200k; his 18 Nov voice note). ` +
      'Open your reply with one plain line saying so, finish only what is in hand, write the handoff (decisions in his words, open picks, threads, next action) and hand over to a fresh lead chat at this stop.');
    msg.push(`This chat is at about ${k}k tokens, near your 200k limit. It should hand over to a fresh chat now.`);
  } else if (size >= WARN && !told.warn) {
    ctx.push(`This chat is at about ${k}k tokens (he wants no chat over about 200k; his 18 Nov voice note). ` +
      'Say so in one plain line at the start of your reply and plan to hand over at the next stop.');
    msg.push(`This chat is at about ${k}k tokens. It will hand over at the next stop.`);
    told = { ...told, warn: true };
  }
  return { context: ctx.join('\n\n'), message: msg.join(' '), told };
}

function main() {
  let input = {};
  try { input = JSON.parse(fs.readFileSync(0, 'utf8') || '{}'); } catch { return; }
  let size = 0;
  try { if (input.transcript_path && fs.existsSync(input.transcript_path)) size = contextSize(fs.readFileSync(input.transcript_path, 'utf8')); } catch { /* size unknown */ }
  const dir = process.env.HARNESS_STATE || path.join(process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude'), 'state');
  const stateFile = path.join(dir, `session-size-${String(input.session_id || 'none').replace(/[^\w-]/g, '')}.json`);
  let told = {};
  try { told = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch { /* first message */ }
  const out = decide({ size, told });
  try { if (out.told !== told) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(stateFile, JSON.stringify(out.told)); } } catch { /* state is a convenience */ }
  if (!out.context) return;
  const res = { hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: out.context } };
  if (out.message) res.systemMessage = out.message;
  process.stdout.write(JSON.stringify(res));
}

// Real paths on both sides: the installed hook is reached through a link to this repo.
const self = (p) => { try { return fs.realpathSync(p); } catch { return p; } };
if (process.argv[1] && self(new URL(import.meta.url).pathname) === self(process.argv[1])) { try { main(); } catch { /* never block his message */ } }
