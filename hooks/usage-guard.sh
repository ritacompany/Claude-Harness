#!/usr/bin/env bash
# Usage guard. Reads the weekly usage the status line saved.
#   usage-guard.sh prompt : on each message, at the warning level, tells Claude to wrap up
#   usage-guard.sh tool   : before an agent or workflow starts, at the stop level, refuses it
# Levels: HARNESS_WEEKLY_WARN (default 75) and HARNESS_WEEKLY_STOP (default 85), in percent.
# It never blocks when it cannot read a fresh figure: a missing, old or past reset file passes.
set -uo pipefail
mode="${1:-tool}"
cat >/dev/null 2>&1 || true
file="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/state/usage.json"
[ -f "$file" ] || exit 0
node -e '
const fs=require("fs");const [file,mode,warn,stop]=process.argv.slice(1);
let u;try{u=JSON.parse(fs.readFileSync(file,"utf8"))}catch(e){process.exit(0)}
const now=Math.floor(Date.now()/1000);
if(typeof u.weekly!=="number")process.exit(0);
if(u.resets_at&&u.resets_at<now)process.exit(0);
if(u.saved_at&&now-u.saved_at>6*3600)process.exit(0);
const pct=Math.round(u.weekly);
if(mode==="tool"&&pct>=Number(stop)){
  console.log(JSON.stringify({hookSpecificOutput:{hookEventName:"PreToolUse",permissionDecision:"deny",
    permissionDecisionReason:"Weekly usage is at "+pct+"%, past the stop level of "+stop+"%. Do not start agents or workflows. Save, commit and push what is done and tell him in one line."}}));
}else if(mode==="prompt"&&pct>=Number(warn)){
  console.log(JSON.stringify({hookSpecificOutput:{hookEventName:"UserPromptSubmit",
    additionalContext:"Weekly usage is at "+pct+"% (warning level "+warn+"%). Start no new large work; finish, save and push what is in hand, and say the figure in one line."}}));
}' "$file" "$mode" "${HARNESS_WEEKLY_WARN:-75}" "${HARNESS_WEEKLY_STOP:-85}"
exit 0
