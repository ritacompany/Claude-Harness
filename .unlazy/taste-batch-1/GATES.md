# Gates: taste research batch 1

OWNS: taste/**, .unlazy/taste-batch-1/**

Scope: ten inbox items researched into entries to the README standard (the rest of the 10 niche design hacks plus tabular numbers and optical centre), indexed, claim checked and merged.

- [x] G1: the library holds 12 structurally complete entries, each with three or more opened sources, every entry indexed and none still waiting in the inbox
  CHECK: node taste/check.mjs 12
  EXPECT: taste structure passed (12 entries
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/Claude-Harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=937cf1186ba3a9bf1e0d894c59674e09009e3144206f0164fb24d6b1b8eaee3e; output-bytes=52

- [x] G2: every factual claim in the ten new entries went through claim-verifier in a fresh context, and each failure was fixed or cut
  EVIDENCE: 18 Nov 2026, five claim-verifier runs (Sonnet, fresh context, claims files only) over 421 claims in the ten entries: no claim unsupported; 16 partly supported, each fixed, cut or kept with a reason in claims/RESULTS.md; all computed figures recomputed independently (contrast with the WCAG formula, OKLCH with Ottosson's matrices) and one corrected (1.01 to 1.02). One source dropped for carrying a hidden instruction.

- [x] G3: I read each new entry as a design lead: the use and do not use sections are real limits, the defaults are real values, the check is runnable by a critic, no dashes or Oxford commas, humanizer pass done
  EVIDENCE: 18 Nov 2026, read every entry's header, limits, defaults and check sections; fixed masked-edges default line and a quote with an Oxford comma; scanned all entries for dashes (0), AI tells and Oxford commas outside code; three of five writing agents ran humanizer and the scan covered all ten.

- [ ] G4: the batch is merged into main
  EVIDENCE: pending
