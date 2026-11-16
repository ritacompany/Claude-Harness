# Gates: taste engine, feasibility and setup

OWNS: taste/**, skills/taste/**, .unlazy/taste-engine/**

Scope: a feasibility verdict and a recommended setup for a taste knowledge base fed by design list reels, proven with a working pilot in the harness repo.

- [x] G1: reel ingestion was tried for real (Instagram page fetch and video download for a transcript), and the result is recorded in the setup notes
  EVIDENCE: 16 Nov 2026, profile URL returns 302 to login; automated reel download was refused by this session's permission check. Recorded in taste/README.md, Adding to it.

- [x] G2: existing taste skills and the reel author's own published material were searched before building, and the overlap is recorded
  EVIDENCE: 16 Nov 2026, web search for the author's unslop skill found no published version tied to him (only unrelated unslop skills); installed skills grep showed the reel topics scattered across about 15 generic skills (impeccable, hallmark, emil-design-eng, high-end-visual-design and others), none holding his verdicts or sourced entries.

- [x] G3: the pilot is structurally complete: an inbox holding every item legible in the four screenshots, an entry schema and at least two researched entries that each cite three or more opened sources
  CHECK: node .unlazy/taste-engine/check-pilot.mjs
  EXPECT: pilot structure passed
  EVIDENCE: exit=0; shell=/bin/sh; cwd=/home/user/Claude-Harness; path=7f4fb4b02918/15 entries; EXPECT=matched; output-sha256=7395cfb5ee3fc39ecb099571b697b53e42fc81070a07757a7541cef6d9351184; output-bytes=54

- [x] G4: the pilot entries' factual claims passed an independent claim check with failures fixed or cut
  EVIDENCE: 16 Nov 2026, claim-verifier (Sonnet, fresh context, claims only) checked 14 claims across 8 sources: 13 supported, 1 supported in substance from the fetch paraphrase (MDN background-blend-mode). Nothing to fix. Unsourced claims cut by hand before the check: SwiftUI ConcentricRectangle, 'most common AI mistake', 'Figma has no automatic concentric radius'.

- [x] G5: the reply to Chadwick covers feasibility, where it lives, how items arrive, the research standard, categories and overlap, how it is used, and how his own verdicts get captured
  EVIDENCE: 16 Nov 2026, reply covers feasibility (yes, with the reframe that it is read at the moment of making, not trained), where it lives (harness, and why not a new repo or Mondai), how items arrive (screenshots; Instagram tested and blocked), the research standard, surfaces, layers and kinds with overlap handled by Do not use it when, the three modes, and His take for his verdicts.
