#!/usr/bin/env bash
# Tests hooks/auto-update.sh against a throwaway remote. Prints AUTO UPDATE OK when all pass.
set -uo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fails=0; check(){ if eval "$2"; then echo "pass  $1"; else echo "FAIL  $1"; fails=$((fails+1)); fi; }
t=$(mktemp -d); export HOME="$t"; unset CLAUDE_CONFIG_DIR
export GIT_AUTHOR_NAME=t GIT_AUTHOR_EMAIL=t@t GIT_COMMITTER_NAME=t GIT_COMMITTER_EMAIL=t@t
git init -q --bare "$t/remote.git"
git clone -q "$t/remote.git" "$t/src" 2>/dev/null
(cd "$here" && git ls-files -co --exclude-standard | tar -cf - -T - | tar -xf - -C "$t/src")
(cd "$t/src" && git add -A && git commit -qm v1 && git push -q origin HEAD:main 2>/dev/null)
git -C "$t/remote.git" symbolic-ref HEAD refs/heads/main
git clone -q "$t/remote.git" "$t/harness"
mkdir -p "$t/.claude"; bash "$t/harness/install.sh" >/dev/null 2>&1
hook="$t/harness/hooks/auto-update.sh"
run(){ echo '{}' | HARNESS_UPDATE_SYNC=1 bash "$hook"; }

(cd "$t/src" && echo "new rule" >> CLAUDE.md && git commit -qam v2 && git push -q origin HEAD:main 2>/dev/null)
run
check "a new version is pulled at session start" 'grep -q "new rule" "$t/harness/CLAUDE.md"'
check "the update is logged" 'grep -q "updated" "$t/.claude/state/auto-update.log"'
check "the linked CLAUDE.md shows the new rule" 'grep -q "new rule" "$t/.claude/CLAUDE.md"'
check "the install wired the update hook at session start" 'grep -q "auto-update.sh" "$t/.claude/settings.json"'

(cd "$t/src" && echo "rule three" >> CLAUDE.md && git commit -qam v3 && git push -q origin HEAD:main 2>/dev/null)
run
check "a second session within the hour does not pull again" '! grep -q "rule three" "$t/harness/CLAUDE.md"'

rm -f "$t/.claude/state/auto-update.stamp"
echo "my edit" >> "$t/harness/README.md"
run
check "local edits are never overwritten" 'grep -q "my edit" "$t/harness/README.md" && ! grep -q "rule three" "$t/harness/CLAUDE.md"'
check "the skip is logged" 'grep -q "skipped: local edits" "$t/.claude/state/auto-update.log"'

git -C "$t/harness" checkout -q -- README.md; rm -f "$t/.claude/state/auto-update.stamp"
out=$(echo '{}' | bash "$hook"); sleep 3
check "the normal run prints nothing into the session" '[ -z "$out" ]'
check "the normal run updates in the background" 'grep -q "rule three" "$t/harness/CLAUDE.md"'

rm -rf "$t"
if [ "$fails" -eq 0 ]; then echo "AUTO UPDATE OK"; else echo "$fails failed"; exit 1; fi
