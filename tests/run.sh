#!/usr/bin/env bash
# Tests the install and the usage guard in a throwaway home. Prints HARNESS TESTS OK when all pass.
set -uo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fails=0
ok()   { echo "pass  $1"; }
bad()  { echo "FAIL  $1"; fails=$((fails+1)); }
check(){ if eval "$2"; then ok "$1"; else bad "$1"; fi; }

t=$(mktemp -d); export HOME="$t"; unset CLAUDE_CONFIG_DIR
mkdir -p "$t/.claude/skills/humanizer"
echo "my own rules" > "$t/.claude/CLAUDE.md"
echo '{"theme":"dark","hooks":{"Stop":[{"hooks":[{"type":"command","command":"echo mine"}]}]}}' > "$t/.claude/settings.json"
bash "$here/install.sh" >"$t/out1" 2>&1
bash "$here/install.sh" >"$t/out2" 2>&1
S="$t/.claude/settings.json"

check "CLAUDE.md is linked to the repo" '[ "$(readlink "$t/.claude/CLAUDE.md")" = "$here/CLAUDE.md" ]'
check "his own CLAUDE.md was moved aside, not lost" 'grep -q "my own rules" "$t/.claude/CLAUDE.md.before-harness"'
check "a skill he already has is not replaced" '[ ! -L "$t/.claude/skills/humanizer" ] && grep -q "skipped skill: humanizer" "$t/out1"'
check "the other skills are linked" '[ -L "$t/.claude/skills/unlazy" ] && [ -L "$t/.claude/skills/resource-sourcing" ]'
check "his settings keys and hooks are kept" 'node -e "const s=require(process.argv[1]);process.exit(s.theme===\"dark\"&&s.hooks.Stop[0].hooks[0].command===\"echo mine\"?0:1)" "$S"'
check "a second install adds no duplicate hooks" 'node -e "const s=require(process.argv[1]);process.exit(s.hooks.PreToolUse.length===1&&s.hooks.UserPromptSubmit.length===1?0:1)" "$S"'
check "the turn check and unlazy run once each at the stop" 'node -e "const s=require(process.argv[1]);const c=s.hooks.Stop.flatMap(e=>e.hooks.map(h=>h.command)).join(\"\\n\");process.exit((c.match(/turn-check.mjs/g)||[]).length===1&&(c.match(/unlazy-stop.sh/g)||[]).length===1?0:1)" "$S"'
check "settings were backed up first" 'ls "$t/.claude/" | grep -q "settings.json.before-harness-"'
check "the status line is set" 'node -e "const s=require(process.argv[1]);process.exit(String(s.statusLine&&s.statusLine.command).includes(\"usage-statusline\")?0:1)" "$S"'

# The hook commands as installed must run from the linked path.
cmd_tool=$(node -e 'const s=require(process.argv[1]);console.log(s.hooks.PreToolUse[0].hooks[0].command)' "$S")
cmd_prompt=$(node -e 'const s=require(process.argv[1]);console.log(s.hooks.UserPromptSubmit[0].hooks[0].command)' "$S")
cmd_status=$(node -e 'const s=require(process.argv[1]);console.log(s.statusLine.command)' "$S")
now=$(date +%s)
sample() { printf '{"rate_limits":{"seven_day":{"used_percentage":%s,"resets_at":%s},"five_hour":{"used_percentage":12,"resets_at":%s}}}' "$1" "$2" "$2"; }

out=$(sample 90 $((now+86400)) | bash -c "$cmd_status")
check "the status line shows the weekly figure" '[ "$out" = "week 90%  5h 12%" ]'
check "the status line saves it for the guard" 'grep -q "\"weekly\":90" "$t/.claude/state/usage.json"'
check "planted 90%: an agent launch is refused" 'echo "{}" | bash -c "$cmd_tool" | grep -q "\"permissionDecision\":\"deny\""'
check "planted 90%: a message gets the wrap up warning" 'echo "{}" | bash -c "$cmd_prompt" | grep -q "Weekly usage is at 90%"'

sample 80 $((now+86400)) | bash -c "$cmd_status" >/dev/null
check "planted 80%: agents still run" '[ -z "$(echo "{}" | bash -c "$cmd_tool")" ]'
check "planted 80%: the warning shows" 'echo "{}" | bash -c "$cmd_prompt" | grep -q "warning level 75%"'

sample 40 $((now+86400)) | bash -c "$cmd_status" >/dev/null
check "clean 40%: nothing said or refused" '[ -z "$(echo "{}" | bash -c "$cmd_tool")$(echo "{}" | bash -c "$cmd_prompt")" ]'

sample 95 $((now-60)) | bash -c "$cmd_status" >/dev/null
check "a figure past its reset passes" '[ -z "$(echo "{}" | bash -c "$cmd_tool")" ]'

echo "{\"weekly\":95,\"resets_at\":$((now+86400)),\"saved_at\":$((now-7*3600))}" > "$t/.claude/state/usage.json"
check "a figure older than six hours passes" '[ -z "$(echo "{}" | bash -c "$cmd_tool")" ]'

rm -f "$t/.claude/state/usage.json"
check "no figure passes" '[ -z "$(echo "{}" | bash -c "$cmd_tool")" ]'

echo '{"model":{}}' | bash -c "$cmd_status" >/dev/null
check "a plan without usage data writes nothing" '[ ! -f "$t/.claude/state/usage.json" ]'

# The stop hooks as installed run and pass a clean turn.
printf '%s\n' '{"type":"user","message":{"content":"hi"}}' '{"type":"assistant","message":{"content":[{"type":"text","text":"Done.\\n\\n[skills: none]"}]}}' > "$t/s.jsonl"
for c in $(node -e 'const s=require(process.argv[1]);s.hooks.Stop.flatMap(e=>e.hooks).filter(h=>/claude-harness/.test(h.command)).forEach((h,i)=>console.log(i))' "$S"); do
  cmd=$(node -e 'const s=require(process.argv[1]);console.log(s.hooks.Stop.flatMap(e=>e.hooks).filter(h=>/claude-harness/.test(h.command))[process.argv[2]].command)' "$S" "$c")
  out=$(printf '{"transcript_path":"%s","session_id":"t","cwd":"%s"}' "$t/s.jsonl" "$t" | CLAUDE_PROJECT_DIR="$t" bash -c "$cmd" 2>&1); code=$?
  check "installed stop hook $c runs and passes a clean turn" '[ $code -eq 0 ] && ! printf "%s" "$out" | grep -q "\"block\""'
done

rm -rf "$t"

# A status line of his own is kept: it still shows, the weekly figure is added and the guard gets it.
t=$(mktemp -d); export HOME="$t"; mkdir -p "$t/.claude"
echo '{"statusLine":{"type":"command","command":"echo my-line"}}' > "$t/.claude/settings.json"
bash "$here/install.sh" >/dev/null 2>&1; bash "$here/install.sh" >/dev/null 2>&1
S="$t/.claude/settings.json"
cmd_status=$(node -e 'const s=require(process.argv[1]);console.log(s.statusLine.command)' "$S")
out=$(sample 90 $((now+86400)) | bash -c "$cmd_status")
check "his own status line still shows, with the weekly figure after it" '[ "$out" = "my-line  week 90%  5h 12%" ]'
check "the guard gets the figure when he has his own status line" 'grep -q "\"weekly\":90" "$t/.claude/state/usage.json"'
check "a second install does not wrap the harness inside itself" 'grep -q "echo my-line" "$t/.claude/state/statusline-wrapped.json"'
rm -rf "$t"
if [ "$fails" -eq 0 ]; then echo "HARNESS TESTS OK"; else echo "$fails failed"; exit 1; fi
