# Gates: taste batch 2 and the six reel tips applied

OWNS: taste/**, .unlazy/taste-batch-2/**

Scope: the two tips from theecommguy's "10 niche design hacks" reel (18 Nov 2026) not yet in the library (layered shadows, balanced headlines) researched into claim checked entries; all six tips checked against the portfolio site and the ones that fit applied on a branch with before and after evidence.

- [ ] G1: the library holds 14 structurally complete entries, each with three or more opened sources, every entry indexed and none still waiting in the inbox
  CHECK: node taste/check.mjs 14
  EXPECT: taste structure passed (14 entries
  EVIDENCE: pending

- [ ] G2: every factual claim in the two new entries went through claim-verifier in a fresh context, and each failure was fixed or cut
  EVIDENCE: pending

- [ ] G3: I read both new entries as a design lead: real limits, real values, a runnable check, no dashes or Oxford commas, humanizer pass done
  EVIDENCE: pending

- [x] G4: each of the six entries' "How to check it" was run against the portfolio site's shipped pages, with every finding recorded with file and selector
  CHECK: NODE_PATH=/opt/node22/lib/node_modules node ../portfolio/scripts/taste-audit.mjs
  EXPECT: taste audit complete: 6 of 6 checks ran
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/Claude-Harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=18134e7fef4d284d0fe918e4176aa1f19a6d5757cfb6f34113e777d84024f0aa; output-bytes=94

- [x] G5: the fixes that fit are applied on the portfolio branch, the site's own check passes and before and after screenshots of each changed spot exist
  EVIDENCE: 18 Nov 2026, portfolio commit a657cc8 on claude/inspiring-shannon-3x09uf. Clock: width over 8 ticks 107.3 to 111.2px (home) and 107.2 to 112.2px (Haven) before, 114.7px every tick after, measured by script. Headings: every h20 and h24 on Haven compared at 1440, 768 and 390, 1 of 12 breaks changed (the phone orphan), crops in reports/taste-2026-11-18. Balance tried and rejected with crops kept. npm run check: "site check OK (10 page(s))".

- [ ] G6: harness and portfolio branches pushed with draft pull requests open
  EVIDENCE: pending
