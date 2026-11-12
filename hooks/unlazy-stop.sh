#!/usr/bin/env bash
# Stop hook: unlazy's own check, which refuses to end a turn that claims done while its gates are
# unmet. A project whose .claude/settings.json already runs unlazy's stop hook is left to it, so it
# never runs twice.
set -uo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
proj="${CLAUDE_PROJECT_DIR:-$PWD}"
if grep -q -- '--unlazy-hook-v2' "$proj/.claude/settings.json" 2>/dev/null; then cat >/dev/null; exit 0; fi
exec node "$here/skills/unlazy/scripts/stop-hook.mjs" --unlazy-hook-v2
