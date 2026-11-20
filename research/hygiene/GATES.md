# Gates: agent setup hygiene research

OWNS: research/hygiene/**

Scope: a report on what exists for keeping an agent setup clean (duplicate, stale and contradictory rules) without deleting what matters, grounded in this harness, with one recommended process.

- [x] G1: the sourcing survey names at least four existing tools or skills, each with a link and a last updated date read from its source
  CHECK: node research/hygiene/check-report.mjs sourcing
  EXPECT: SOURCING OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=7db883f43ea9f7485427594d808a64178b2920c987a3c7562f7b4be2750a584b; output-bytes=27

- [x] G2: the deep research section cites at least six distinct sources by link
  CHECK: node research/hygiene/check-report.mjs research
  EXPECT: RESEARCH OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=bb8597d24140b7bcf4a953bcd61bd269a9ccb19f4989c58f593162f246740037; output-bytes=24

- [x] G3: every duplication figure in the report matches a fresh measurement of the actual files
  CHECK: node research/hygiene/measure-dup.mjs --verify research/hygiene/REPORT.md
  EXPECT: DUP FIGURES MATCH
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=ab4e9a6353f9bab7ccab6a744dc2d1c29c7f507a0cec55b9ab749bc66831b1b8; output-bytes=31

- [x] G4: every external claim went through an independent claim check and none is left unsupported
  CHECK: node research/hygiene/check-report.mjs claims
  EXPECT: CLAIMS OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=6aaf23737ecd6bb6303310411fabf4c6a210d6648522d36a62f293be6ba0a315; output-bytes=22

- [x] G5: the report has one recommendation, what would change it and the safeguards against deleting something important
  CHECK: node research/hygiene/check-report.mjs recommendation
  EXPECT: RECOMMENDATION OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=1d5979334587ba9fbe66e4ccf8fe8b5f63013474c0c82ff6ed435c014aac84ab; output-bytes=33

- [x] G6: the report has no em or en dashes and no hyphen pairs
  CHECK: node research/hygiene/check-report.mjs copy
  EXPECT: COPY OK
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/claude-harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=dc2897f6cf6e4fb4475ef321cb8778eb78bbc2bbe0920b9f35e6d5337fecaa00; output-bytes=18

- [x] G7: reread against the ask: what is out there, deep research, how to solidify, care not to over delete; each is answered in the report and the chat reply
  EVIDENCE: manual review 2026-11-18: out there = REPORT 'What exists' plus tested built in audit; deep research = 'What the research says' plus deep-research.md; solidify = 'Recommendation' (structure fixes and tidy pass); over delete = 'Safeguards against deleting what matters'; chat reply carries the same four
