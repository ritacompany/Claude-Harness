#!/usr/bin/env bash
# SessionStart hook: keeps the harness up to date by itself, so nobody has to remember to pull.
# At most once an hour it fetches the repo in the background and fast forwards it. It never waits,
# never prints into the session and never touches local changes: if the folder has edits or the
# history has split, the pull simply does not happen (logged in state/auto-update.log).
# When the update brings a new version, it runs install.sh again so new hooks and skills land too.
# The update takes effect from the next session.
# HARNESS_UPDATE_SYNC=1 runs it in the foreground (tests); HARNESS_UPDATE_EVERY sets the seconds.
set -uo pipefail
cat >/dev/null 2>&1 || true
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
state="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/state"
mkdir -p "$state" 2>/dev/null || exit 0
stamp="$state/auto-update.stamp"
now=$(date +%s); last=$(cat "$stamp" 2>/dev/null || echo 0)
[ $((now - last)) -lt "${HARNESS_UPDATE_EVERY:-3600}" ] && exit 0
echo "$now" > "$stamp"
update() {
  cd "$here" || return
  before=$(git rev-parse HEAD 2>/dev/null) || return
  if ! git diff --quiet HEAD 2>/dev/null; then echo "$(date -u +%FT%TZ) skipped: local edits in the folder"; return; fi
  if ! GIT_TERMINAL_PROMPT=0 git pull --ff-only -q 2>&1; then echo "$(date -u +%FT%TZ) skipped: pull failed"; return; fi
  after=$(git rev-parse HEAD)
  if [ "$before" != "$after" ]; then
    bash "$here/install.sh" >/dev/null 2>&1 && echo "$(date -u +%FT%TZ) updated ${before:0:7} to ${after:0:7}"
  fi
}
if [ "${HARNESS_UPDATE_SYNC:-}" = 1 ]; then update >> "$state/auto-update.log" 2>&1
else ( update >> "$state/auto-update.log" 2>&1 & ) ; fi
exit 0
