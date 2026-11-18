# Gates: agent setup hygiene research

OWNS: research/hygiene/**

Scope: a report on what exists for keeping an agent setup clean (duplicate, stale and contradictory rules) without deleting what matters, grounded in this harness, with one recommended process.

- [ ] G1: the sourcing survey names at least four existing tools or skills, each with a link and a last updated date read from its source
  CHECK: node research/hygiene/check-report.mjs sourcing
  EXPECT: SOURCING OK
  EVIDENCE: pending

- [ ] G2: the deep research section cites at least six distinct sources by link
  CHECK: node research/hygiene/check-report.mjs research
  EXPECT: RESEARCH OK
  EVIDENCE: pending

- [ ] G3: every duplication figure in the report matches a fresh measurement of the actual files
  CHECK: node research/hygiene/measure-dup.mjs --verify research/hygiene/REPORT.md
  EXPECT: DUP FIGURES MATCH
  EVIDENCE: pending

- [ ] G4: every external claim went through an independent claim check and none is left unsupported
  CHECK: node research/hygiene/check-report.mjs claims
  EXPECT: CLAIMS OK
  EVIDENCE: pending

- [ ] G5: the report has one recommendation, what would change it and the safeguards against deleting something important
  CHECK: node research/hygiene/check-report.mjs recommendation
  EXPECT: RECOMMENDATION OK
  EVIDENCE: pending

- [ ] G6: the report has no em or en dashes and no hyphen pairs
  CHECK: node research/hygiene/check-report.mjs copy
  EXPECT: COPY OK
  EVIDENCE: pending

- [ ] G7: reread against the ask: what is out there, deep research, how to solidify, care not to over delete; each is answered in the report and the chat reply
  EVIDENCE: pending
