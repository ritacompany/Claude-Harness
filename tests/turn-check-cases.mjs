// Planted and clean replies for hooks/turn-check.mjs. Prints TURN CASES OK when every case is right.
import fs from "node:fs"; import os from "node:os"; import path from "node:path"; import { execFileSync } from "node:child_process";
const hook = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "hooks", "turn-check.mjs");
const F = "\n\n[skills: none]";
const user = t => ({ type: "user", message: { content: t } });
const said = (text, tools = []) => ({ type: "assistant", message: { content: [...tools.map(n => ({ type: "tool_use", name: n })), { type: "text", text }] } });
const cases = [
  ["clean reply", [user("hi"), said("All done." + F)], null],
  ["em dash", [user("hi"), said("Done — mostly." + F)], "dash"],
  ["en dash", [user("hi"), said("Pages 3–5 changed." + F)], "dash"],
  ["hyphen pair as a dash", [user("hi"), said("Done -- mostly." + F)], "dash"],
  ["hyphen pair in inline code is fine", [user("hi"), said("Run `git push --force-with-lease` now." + F)], null],
  ["hyphen pair in a code block is fine", [user("hi"), said("Run:\n```\ncmd -- arg\n```" + F)], null],
  ["dash in a quote is fine", [user("hi"), said("He said:\n> fine — ship it" + F)], null],
  ["Oxford comma", [user("hi"), said("Copy, layout, and spacing changed." + F)], "oxford-comma"],
  ["Oxford comma with or", [user("hi"), said("Pick red, green, or blue." + F)], "oxford-comma"],
  ["list without Oxford comma", [user("hi"), said("Copy, layout and spacing changed." + F)], null],
  ["clause comma after a list with or is fine", [user("hi"), said("It has no memory, logs or usage guard, and unlazy covers it." + F)], null],
  ["clause comma before or is fine", [user("hi"), said("In a new chat, allow attaching that repo, or add it yourself." + F)], null],
  ["Oxford comma with two word items", [user("hi"), said("Fix the grid, the copy, and the footer." + F)], "oxford-comma"],
  ["missing footer", [user("hi"), said("All done.")], "footer"],
  ["footer not last", [user("hi"), said("[skills: none]\nAll done.")], "footer"],
  ["unasked schedule", [user("fix the bug"), said("Fixed." + F, ["mcp__claude-code-remote__send_later"])], "unasked"],
  ["unasked PR watch", [user("open a PR"), said("Opened." + F, ["mcp__claude-code-remote__subscribe_pr_activity"])], "unasked"],
  ["asked to watch the PR", [user("open a PR and watch it"), said("Opened and watching." + F, ["mcp__claude-code-remote__subscribe_pr_activity"])], null],
  ["asked earlier in the chat", [user("remind me tomorrow"), said("Set." + F), user("thanks"), said("Ok." + F, ["CronCreate"])], null],
  ["only the last reply counts", [user("hi"), said("Working — on it"), said("Done." + F)], null],
  ["only this turn counts", [user("a"), said("old — reply" + F), user("b"), said("New." + F)], null],
];
let wrong = 0;
for (const [name, rows, want] of cases) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "tc-"));
  const t = path.join(d, "s.jsonl");
  fs.writeFileSync(t, rows.map(r => JSON.stringify(r)).join("\n"));
  const out = execFileSync("node", [hook], { input: JSON.stringify({ transcript_path: t }), env: { ...process.env, HARNESS_STATE: d, CLAUDE_PROJECT_DIR: d } }).toString();
  const log = fs.readFileSync(path.join(d, "turn-check.jsonl"), "utf8").trim().split("\n").pop();
  const rules = JSON.parse(log).rules;
  const ok = want ? out.includes('"block"') && rules.includes(want) : !out.trim();
  console.log((ok ? "pass  " : "FAIL  ") + name + (ok ? "" : "  got " + (out || "pass")));
  if (!ok) wrong++;
  fs.rmSync(d, { recursive: true, force: true });
}
// Safety valve: the same failing reply is released after three blocks.
{
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "tc-")); const t = path.join(d, "s.jsonl");
  fs.writeFileSync(t, [user("hi"), said("No footer")].map(r => JSON.stringify(r)).join("\n"));
  const run = () => execFileSync("node", [hook], { input: JSON.stringify({ transcript_path: t }), env: { ...process.env, HARNESS_STATE: d, CLAUDE_PROJECT_DIR: d }, stdio: ["pipe", "pipe", "ignore"] }).toString();
  const outs = [run(), run(), run(), run()];
  const ok = outs.slice(0, 3).every(o => o.includes("block")) && !outs[3].trim();
  console.log((ok ? "pass  " : "FAIL  ") + "released after three blocks"); if (!ok) wrong++;
  fs.rmSync(d, { recursive: true, force: true });
}
// A project that runs its own turn check is left to it.
{
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "tc-")); const t = path.join(d, "s.jsonl");
  fs.mkdirSync(path.join(d, ".claude")); fs.writeFileSync(path.join(d, ".claude", "settings.json"), '{"hooks":{"Stop":[{"hooks":[{"command":"ops/hooks/turn-check.sh"}]}]}}');
  fs.writeFileSync(t, [user("hi"), said("No footer")].map(r => JSON.stringify(r)).join("\n"));
  const out = execFileSync("node", [hook], { input: JSON.stringify({ transcript_path: t }), env: { ...process.env, HARNESS_STATE: d, CLAUDE_PROJECT_DIR: d } }).toString();
  const ok = !out.trim(); console.log((ok ? "pass  " : "FAIL  ") + "defers to a project's own turn check"); if (!ok) wrong++;
  fs.rmSync(d, { recursive: true, force: true });
}
console.log(wrong ? wrong + " wrong" : "TURN CASES OK");
process.exit(wrong ? 1 : 0);
