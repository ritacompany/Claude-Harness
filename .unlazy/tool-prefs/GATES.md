# Gates: tool and interface preferences system

OWNS: .unlazy/tool-prefs/**, skills/tool-defaults/**, CLAUDE.md, README.md

Scope: research Chadwick's own words across past chats and sessions on how he wants tools, boards, canvases and editors built, then turn them into a standing system that applies them from the first build.

- [x] G1: every rule in the skill cites at least one evidence id, and every cited id exists in the evidence file with a verbatim quote, a source and a date
  CHECK: node .unlazy/tool-prefs/check-citations.mjs
  EXPECT: citations ok
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/Claude-Harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=aa546aee357677561c60ec2853016f94ed300d14fb5f787590f72dcf5af51b67; output-bytes=37

- [x] G2: the evidence is broad, not recent only: quotes come from at least 25 distinct chats or sessions across at least 3 calendar months
  CHECK: node .unlazy/tool-prefs/check-breadth.mjs
  EXPECT: breadth ok
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/Claude-Harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=eaf41d6dc3d521cc452618b09f888e13102ff9d2474094712508f15061180645; output-bytes=112

- [x] G3: coverage is recorded: the source log lists every archived claude.ai chat screened, every cloud session read and the repo sweep, with counts measured from the log itself
  CHECK: node .unlazy/tool-prefs/check-coverage.mjs
  EXPECT: coverage ok
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/Claude-Harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=e6359dd6e3774366e4837b2f9eca431586d011c13a74e881b6bdb190b137d952; output-bytes=52

- [x] G4: an independent agent checked a sample of quotes against the original transcripts and found no misquote or misattribution left unfixed
  EVIDENCE: 16 Nov, Sonnet checker on 45 random cited ids against the original chat files, session extracts and repo files (reviews/FIDELITY.md): 39 verbatim, 1 close (E1257 typo restored to his "sking"), 1 relayed in a Claude seed prompt (E1819, now marked relayed and never cited alone), 4 artifact comments not rechecked; dates matched for all checked

- [x] G5: the skill and its pointer text have no em or en dashes, no hyphen pairs used as dashes and no Oxford commas
  CHECK: node .unlazy/tool-prefs/check-copy.mjs
  EXPECT: copy ok
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/Claude-Harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=e8c87d518395b1959ad1d1611b867f1b887b6e63a4ea883c5a4a0444bcf532c4; output-bytes=8

- [x] G6: the system reaches new sessions: the harness CLAUDE.md points to the skill for any tool, board, canvas, editor or page build, and the README says how it reaches cloud sessions
  CHECK: node .unlazy/tool-prefs/check-wiring.mjs
  EXPECT: wiring ok
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/Claude-Harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=7ba72402ccc11f9194bc7597aa4c31c113ca0f7a51ce5786c65bd0ea1d7b5b9b; output-bytes=10

- [x] G8: the tool checker catches each of ten planted mistakes (sideways scroll, a sidebar that cannot collapse, an inner scroll box, tiny text, a light page, unsaved controls, a dash, an Oxford comma, no title, a script error) and passes the clean page
  CHECK: node skills/tool-defaults/tests/vaccinate.mjs
  EXPECT: vaccine ok
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/Claude-Harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=56b0e214d2fcea2651e11949198f0d11730982b38acf86214d3d3cf84ccf645d; output-bytes=370

- [x] G9: every cited quote supports the rule it is cited for, per an independent fit review, with every NO replaced or the rule narrowed
  EVIDENCE: 16 Nov, Opus reviewer read all 445 citations (reviews/FIT-REVIEW.md): 314 support, 93 partial, 38 no; a second Opus agent applied every replacement, narrowed 15 overreaching rules and the 7 later contradictions (72 of 129 rules edited, now 130); E1832 dropped; one clause (Figma style number fields) still rests on a relayed quote plus direct ones

- [ ] G7: Chadwick's open picks were put to him (grilling) and his answers are recorded in the evidence file, or the questions still open are named in the report
  EVIDENCE: pending
