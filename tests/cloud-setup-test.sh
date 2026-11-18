#!/usr/bin/env bash
# Runs the printed cloud setup script in a throwaway home. Prints CLOUD SETUP OK when all pass.
set -uo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fails=0
check(){ if eval "$2"; then echo "pass  $1"; else echo "FAIL  $1"; fails=$((fails+1)); fi; }
t=$(mktemp -d)
bash "$here/cloud/print-setup-script.sh" > "$t/setup.sh"

# A served copy that differs from the repo, to prove the fetched file is the one written.
{ cat "$here/CLAUDE.md"; echo "fetched marker"; } > "$t/served.md"
# A local repo standing in for GitHub, for the second route.
git init -q "$t/remote" && { cat "$here/CLAUDE.md"; echo "cloned marker"; } > "$t/remote/CLAUDE.md" \
  && git -C "$t/remote" add CLAUDE.md && git -C "$t/remote" -c user.email=t@t -c user.name=t commit -qm x

HOME="$t/a" HARNESS_CLAUDE_MD_URL="file://$t/served.md" HARNESS_REPO_URL="$t/none" bash "$t/setup.sh" > "$t/out-a" 2>&1; code=$?
check "a working fetch writes the fetched file and exits 0" '[ $code -eq 0 ] && cmp -s "$t/a/.claude/CLAUDE.md" "$t/served.md" && grep -q "fetched from" "$t/out-a"'

HOME="$t/b" HARNESS_CLAUDE_MD_URL="file://$t/missing.md" HARNESS_REPO_URL="$t/remote" bash "$t/setup.sh" > "$t/out-b" 2>&1; code=$?
check "a failed fetch falls back to the clone" '[ $code -eq 0 ] && grep -q "cloned marker" "$t/b/.claude/CLAUDE.md" && grep -q "cloned from" "$t/out-b"'

echo "<html>rate limited</html>" > "$t/page.html"
HOME="$t/c" HARNESS_CLAUDE_MD_URL="file://$t/page.html" HARNESS_REPO_URL="$t/remote" bash "$t/setup.sh" > "$t/out-c" 2>&1
check "a fetched page that is not CLAUDE.md is rejected" 'grep -q "cloned marker" "$t/c/.claude/CLAUDE.md"'

HOME="$t/d" HARNESS_CLAUDE_MD_URL="file://$t/missing.md" HARNESS_REPO_URL="$t/none" bash "$t/setup.sh" > "$t/out-d" 2>&1; code=$?
check "when both routes fail the session still starts and the log warns" '[ $code -eq 0 ] && [ ! -e "$t/d/.claude/CLAUDE.md" ] && grep -q "WARNING" "$t/out-d"'

check "the default source is the public repo" 'grep -q "raw.githubusercontent.com/ritacompany/claude-harness/main/CLAUDE.md" "$t/setup.sh"'
check "the script fits the environment limits (100 lines, 200 bytes a line)" '[ $(wc -l < "$t/setup.sh") -le 100 ] && [ $(awk "{ if (length(\$0) > m) m = length(\$0) } END { print m }" "$t/setup.sh") -le 200 ]'

HOME="$t/e" bash "$t/setup.sh" > "$t/out-e" 2>&1
check "the real fetch from GitHub works from here" 'head -1 "$t/e/.claude/CLAUDE.md" | grep -q "^# Personal layer"'
rm -rf "$t"
[ $fails -eq 0 ] && echo "CLOUD SETUP OK" || { echo "$fails failed"; exit 1; }
