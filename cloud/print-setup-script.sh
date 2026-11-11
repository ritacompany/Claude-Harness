#!/usr/bin/env bash
# Prints a setup script for a cloud environment that writes this repo's CLAUDE.md into the
# session's ~/.claude. Paste the output into the environment's setup script box.
# A cloud setup script cannot clone a private repo by itself, so the text travels inline.
# Run this again and repaste whenever CLAUDE.md changes.
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
grep -q '^HARNESS_EOF$' "$here/CLAUDE.md" && { echo "CLAUDE.md contains the delimiter line" >&2; exit 1; }
echo '# Personal layer from ritacompany/claude-harness (cloud/print-setup-script.sh)'
echo 'mkdir -p ~/.claude'
echo "cat > ~/.claude/CLAUDE.md <<'HARNESS_EOF'"
cat "$here/CLAUDE.md"
echo 'HARNESS_EOF'
