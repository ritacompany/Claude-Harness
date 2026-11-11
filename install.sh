#!/usr/bin/env bash
# Installs the personal layer on a computer, for the Claude account signed in there.
# Run it again after a pull; it is safe to repeat.
#   ./install.sh
# What it does, in your Claude folder (~/.claude, or CLAUDE_CONFIG_DIR):
#   1. links this repo in as claude-harness
#   2. links CLAUDE.md; a CLAUDE.md of your own is moved aside to CLAUDE.md.before-harness first
#   3. links each skill in skills/ unless a skill of that name is already there (then it says so)
#   4. adds the usage guard hooks and status line to settings.json, after a backup
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
home="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
command -v node >/dev/null || { echo "install: node is needed (https://nodejs.org), nothing changed"; exit 1; }
mkdir -p "$home/skills" "$home/state"

ln -sfn "$here" "$home/claude-harness"
echo "linked: $home/claude-harness"

if [ -e "$home/CLAUDE.md" ] && [ ! -L "$home/CLAUDE.md" ]; then
  mv "$home/CLAUDE.md" "$home/CLAUDE.md.before-harness"
  echo "moved aside: your CLAUDE.md is now CLAUDE.md.before-harness (fold anything you need into the repo)"
fi
ln -sfn "$here/CLAUDE.md" "$home/CLAUDE.md"
echo "linked: CLAUDE.md"

for d in "$here"/skills/*/; do
  name="$(basename "$d")"
  target="$home/skills/$name"
  if [ -L "$target" ] || [ ! -e "$target" ]; then
    ln -sfn "${d%/}" "$target"; echo "linked skill: $name"
  else
    echo "skipped skill: $name (a skill of that name is already in $home/skills)"
  fi
done

[ -f "$home/settings.json" ] && cp "$home/settings.json" "$home/settings.json.before-harness-$(date +%Y%m%d%H%M%S)"
node "$here/scripts/merge-settings.mjs" "$home/settings.json"
echo "done. Start a new Claude session to load it."
