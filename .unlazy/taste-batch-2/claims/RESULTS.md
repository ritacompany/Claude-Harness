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

## balanced-headlines (76 claims, 18 Nov 2026)

Two claim-verifier runs (Sonnet, fresh context, claims list only): claims 1 to 38 and 39 to 75.
Claim 76 is the local headless Chrome test, which has no web source and is labelled as a test in
the entry.

- Supported by the verifiers: 62. No claim partly supported or unsupported.
- Unchecked by the verifiers: 13 (1, 4, 6, 7, 8, 12, 13, 14, 15, 25, 59, 63, 64), all resting on
  the CSS Text 4 editor's draft, whose section 5.4 WebFetch could not return from a 700k
  character page. Checked by the lead from the page's raw HTML (fetched 18 Nov 2026): the property
  table reads "Value: auto | balance | stable | pretty | avoid-short-last-line" and "Inherited: yes";
  the balance, pretty, stable, forced break, line-clamp, ten line and intent sentences are all
  present as quoted. All 13 supported. These 13 were checked by the lead, not independently.
