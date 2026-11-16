#!/usr/bin/env bash
# Makes an upload zip of one skill for claude.ai (Settings, Capabilities, Skills), leaving out the
# evidence and test folders that only matter in this repo. Usage: scripts/skill-zip.sh <skill-name>
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
name="${1:?skill name}"
[ -f "$here/skills/$name/SKILL.md" ] || { echo "no skill named $name" >&2; exit 1; }
out="$here/dist/$name.zip"
mkdir -p "$here/dist"; rm -f "$out"
(cd "$here/skills" && zip -qr "$out" "$name" -x "$name/evidence/*" "$name/tests/*")
echo "$out"
