#!/usr/bin/env bash
# Zips each harness skill as a whole folder for upload to claude.ai (Settings, Capabilities, Skills).
# The account keeps only what is uploaded, so a skill uploaded as SKILL.md alone loses its scripts,
# templates and references in cloud sessions and Cowork. Upload these zips instead.
#   bash scripts/package-skills.sh [out-dir]     (default: dist/skills, which git ignores)
set -euo pipefail
here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out="${1:-$here/dist/skills}"
mkdir -p "$out"
command -v zip >/dev/null || { echo "package-skills: zip is needed" >&2; exit 1; }
for d in "$here"/skills/*/; do
  name="$(basename "$d")"
  rm -f "$out/$name.zip"
  (cd "$here/skills" && zip -qr "$out/$name.zip" "$name" -x "$name/node_modules/*" "$name/.git/*")
  echo "packed: $out/$name.zip ($(cd "$here/skills/$name" && find . -type f | wc -l | tr -d ' ') files)"
done
