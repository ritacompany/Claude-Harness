#!/usr/bin/env bash
# Prints a setup script for a cloud environment. At each session start it fetches the current
# CLAUDE.md from this public repo, so cloud sessions never run on a stale pasted copy. It tries the
# raw file first and a shallow git clone second; if both fail, the session starts without the
# personal layer and the setup log says so. No copy is embedded, which keeps the script short enough
# for the environment settings and means there is nothing to repaste when CLAUDE.md changes.
set -euo pipefail
cat <<'SCRIPT'
# Personal layer from ritacompany/claude-harness (cloud/print-setup-script.sh)
mkdir -p ~/.claude
h_url="${HARNESS_CLAUDE_MD_URL:-https://raw.githubusercontent.com/ritacompany/claude-harness/main/CLAUDE.md}"
h_repo="${HARNESS_REPO_URL:-https://github.com/ritacompany/claude-harness}"
h_tmp="$(mktemp -d)"
if curl -fsSL --max-time 20 "$h_url" -o "$h_tmp/CLAUDE.md" 2>/dev/null && head -1 "$h_tmp/CLAUDE.md" | grep -q '^# Personal layer'; then
  mv "$h_tmp/CLAUDE.md" ~/.claude/CLAUDE.md && echo "harness: CLAUDE.md fetched from $h_url"
elif git clone -q --depth 1 "$h_repo" "$h_tmp/repo" 2>/dev/null && head -1 "$h_tmp/repo/CLAUDE.md" | grep -q '^# Personal layer'; then
  cp "$h_tmp/repo/CLAUDE.md" ~/.claude/CLAUDE.md && echo "harness: CLAUDE.md cloned from $h_repo"
else
  echo "harness: WARNING could not fetch CLAUDE.md; this session runs without the personal layer"
fi
rm -rf "$h_tmp"
true
SCRIPT
