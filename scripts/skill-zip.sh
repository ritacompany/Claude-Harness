#!/usr/bin/env bash
# Makes upload zips of skills for claude.ai (Settings, Capabilities, Skills), each the whole folder
# minus its tests folder, which only matters in this repo. The account keeps only what is uploaded,
# so a skill uploaded as SKILL.md alone runs without its scripts, templates and references.
# Usage: scripts/skill-zip.sh [skill-name ...]   (no name: every skill; zips land in dist/, which git ignores)
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out_dir="${SKILL_ZIP_DIR:-$here/dist}"
command -v zip >/dev/null || { echo "skill-zip: zip is needed" >&2; exit 1; }
if [ $# -eq 0 ]; then set -- $(cd "$here/skills" && for d in */; do echo "${d%/}"; done); fi
mkdir -p "$out_dir"
for name in "$@"; do
  [ -f "$here/skills/$name/SKILL.md" ] || { echo "no skill named $name" >&2; exit 1; }
  out="$out_dir/$name.zip"; rm -f "$out"
  (cd "$here/skills" && zip -qr "$out" "$name" -x "$name/tests/*")
  echo "$out"
done
