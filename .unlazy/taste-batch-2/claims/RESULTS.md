# Claim check results, taste batch 2

## layered-shadows (62 claims, 18 Nov 2026)

Two claim-verifier runs (Sonnet, fresh context, claims list only, never the entry): claims 1 to 31
and 32 to 62. The verifiers have no write tool, so their per claim lines are kept in their replies
and summarised here.

- Supported: 60.
- 25 unchecked by the verifier (WebFetch strips the page's demo CSS). Checked by the lead from the
  page's raw HTML: the Default box is `0 6px 6px rgba(16,27,30,0.4)` and the Smooth boxes use
  `rgba(16,27,30,0.15)`. Supported.
- 58 partly supported: the article's label for its single shadow reads `0 6px 6px rgba(0,0,0,0.2)`
  while the demo CSS it renders (`.blog-shadow-6`) is `0 6px 6px rgba(0,0,0,0.4)`, confirmed by the
  lead in the raw HTML. Fixed: the entry now names both values and which check each fails.
