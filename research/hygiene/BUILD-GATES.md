# Gates: hygiene build (structural fixes and tidy pass)

OWNS: CLAUDE.md, README.md, retired.md, preferences/**, cloud/**, scripts/**, skills/tidy/**, skills/humanizer/SKILL.md, skills/resource-sourcing/**, tests/**, .gitignore, research/hygiene/**

Scope: one home for every personal rule, generated account preferences, cloud sessions that fetch the live CLAUDE.md, one handoff method, full skill folders for upload, the dash conflict settled and a report only tidy pass with tests.

- [x] G1: every sentence of the old account preferences is mapped to a line in the new CLAUDE.md or marked as covered, so nothing is lost
  CHECK: node tests/hygiene-build-checks.mjs migration
  EXPECT: MIGRATION OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=9cdf2988f614ca1dbbbed72e35a587e5c3919947e2d2f8955be42a5c60f6b6ad; output-bytes=35

- [x] G2: every CLAUDE.md section has an id comment with surfaces and match phrases, and the file stays under 200 lines
  CHECK: node tests/hygiene-build-checks.mjs claudemd
  EXPECT: CLAUDEMD OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=63aacb437b89f0b48d77946a9f13ddb0c035e6e930ea9e069484076aca40a6ce; output-bytes=37

- [x] G3: the committed account preferences equal a fresh build from CLAUDE.md, and a planted edit to CLAUDE.md makes the check fail
  CHECK: node tests/hygiene-build-checks.mjs preferences
  EXPECT: PREFERENCES OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=1425e45c09a5b109b65bf73c67a42ff1e9b3cc98b68bd24c8135f30401eec790; output-bytes=33

- [x] G4: the printed cloud setup script writes the fetched CLAUDE.md, falls back to a shallow clone when the fetch fails, warns and still starts when both fail, and fits the environment's 100 line limit (changed from an embedded fallback copy, which made the script too long for that limit)
  CHECK: bash tests/cloud-setup-test.sh
  EXPECT: CLOUD SETUP OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=e3534cfd63e1efde0acba27dfd15ec4687cd90602f80ff242db4ec388cadd166; output-bytes=412

- [x] G5: no harness skill points at a file that does not exist, and the humanizer no longer lets a sample bring dashes back
  CHECK: node tests/hygiene-build-checks.mjs skills
  EXPECT: SKILLS OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=86830d69b6d50786371036f46ecf2d59b32e27284c67f5530a2f2282fc9be599; output-bytes=29

- [x] G6: the tidy inventory reports every planted mistake, stays quiet on a clean setup and changes no input file
  CHECK: node tests/tidy-cases.mjs
  EXPECT: TIDY CASES OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=3d3087ac8abbc1901c0a72fc335513d90ae7599964e25a8bc8217c0fdbe5ecd1; output-bytes=884

- [x] G7: the upload zips hold the full skill folders, scripts and references included
  CHECK: node tests/hygiene-build-checks.mjs zips
  EXPECT: ZIPS OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=db36a714bd35d32455479225f1e9d30a1b9db797a1dc9a00e07566fb5e87b02c; output-bytes=19

- [x] G8: the existing harness tests still pass
  CHECK: bash tests/run.sh && node tests/turn-check-cases.mjs && bash tests/auto-update-test.sh
  EXPECT: /HARNESS TESTS OK[\s\S]*TURN CASES OK[\s\S]*AUTO UPDATE OK/
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=29558acafe0db492aa479355409ddfb6ff57e4c7187fd40593a5f5ac8b3d5f4c; output-bytes=2270

- [x] G9: changed and new files carry no dashes or Oxford commas in prose
  CHECK: node tests/hygiene-build-checks.mjs copy
  EXPECT: COPY OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=1d90349e4b75c07ce1c413dc5ec5b764042eed25c131e52c1778d25a0a72cb52; output-bytes=18

- [x] G10: the cloud environment's setup script is replaced with the fetching version
  EVIDENCE: manual 2026-11-18: update_environment returned updated true, setup_script_replaced true for the personal environment; the same script run in this session printed "CLAUDE.md fetched" and the result matched main byte for byte, restoring the design line the pasted copy lacked. Unproven on a fresh container until the next new session.

- [x] G11: reread against the ask (every item of the recommendation is built or handed to the owner as an account switch), the tidy skill read against its sources, README updated
  EVIDENCE: manual 2026-11-18: one home with ids (CLAUDE.md), preferences built from it (preferences/claude-ai.md, mapping in MIGRATION.md), cloud fetch (G4, G10), one handoff method (CLAUDE.md Handoffs; turning off handoff, remember and grill-me is an account switch), full folder zips (G7; upload is an account switch), dash conflict settled (G5), tidy skill with inventory, keep list, retired file and tests (G6). Tidy SKILL.md read against setup-audit, extract-ssot and memory-sync files; README sections for account setup, cloud, keeping rules clean and tests updated. Why comments added only where the old preferences gave a reason; none invented.
