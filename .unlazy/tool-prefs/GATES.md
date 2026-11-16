# Gates: tool and interface preferences system

OWNS: .unlazy/tool-prefs/**, skills/tool-defaults/**, CLAUDE.md, README.md

Scope: research Chadwick's own words across past chats and sessions on how he wants tools, boards, canvases and editors built, then turn them into a standing system that applies them from the first build.

- [ ] G1: every rule in the skill cites at least one evidence id, and every cited id exists in the evidence file with a verbatim quote, a source and a date
  CHECK: node .unlazy/tool-prefs/check-citations.mjs
  EXPECT: citations ok
  EVIDENCE: pending

- [ ] G2: the evidence is broad, not recent only: quotes come from at least 25 distinct chats or sessions across at least 3 calendar months
  CHECK: node .unlazy/tool-prefs/check-breadth.mjs
  EXPECT: breadth ok
  EVIDENCE: pending

- [ ] G3: coverage is recorded: the source log lists every archived claude.ai chat screened, every cloud session read and the repo sweep, with counts measured from the log itself
  CHECK: node .unlazy/tool-prefs/check-coverage.mjs
  EXPECT: coverage ok
  EVIDENCE: pending

- [ ] G4: an independent agent checked a sample of quotes against the original transcripts and found no misquote or misattribution left unfixed
  EVIDENCE: pending

- [ ] G5: the skill and its pointer text have no em or en dashes, no hyphen pairs used as dashes and no Oxford commas
  CHECK: node .unlazy/tool-prefs/check-copy.mjs
  EXPECT: copy ok
  EVIDENCE: pending

- [ ] G6: the system reaches new sessions: the harness CLAUDE.md points to the skill for any tool, board, canvas, editor or page build, and the README says how it reaches cloud sessions
  CHECK: node .unlazy/tool-prefs/check-wiring.mjs
  EXPECT: wiring ok
  EVIDENCE: pending

- [ ] G8: the tool checker catches each of ten planted mistakes (sideways scroll, a sidebar that cannot collapse, an inner scroll box, tiny text, a light page, unsaved controls, a dash, an Oxford comma, no title, a script error) and passes the clean page
  CHECK: node skills/tool-defaults/tests/vaccinate.mjs
  EXPECT: vaccine ok
  EVIDENCE: pending

- [ ] G9: every cited quote supports the rule it is cited for, per an independent fit review, with every NO replaced or the rule narrowed
  EVIDENCE: pending

- [ ] G7: Chadwick's open picks were put to him (grilling) and his answers are recorded in the evidence file, or the questions still open are named in the report
  EVIDENCE: pending
