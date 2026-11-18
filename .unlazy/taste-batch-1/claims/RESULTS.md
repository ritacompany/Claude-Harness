# Claim check results, batch 1

## masked-edges and dynamic-viewport (claim-verifier, Sonnet, fresh context, claims files only)

84 claims: 75 supported, 9 partly, 0 not supported. Partly items were quotes or details the
fetch did not return. Fixed by cutting the unconfirmed part: masked-edges 17 (reason cut), 19
(fallback clause cut), 28 (fallback detail cut, kept as inference from the 0px initial value), 40
(cut); dynamic-viewport 8 ("extra space" quote reworded), 21 (throttle sentence cut), 33 (date
now attributed to StatCounter October 2026). Left as is: masked-edges 15 (source confirms fade for
horizontal rows), dynamic-viewport 20 (lv and dv sets follow the sv set by definition).

## alpha-borders and dark-mode-depth (claim-verifier, Sonnet, fresh context, claims files only)

59 claims: 58 supported, 0 partly, 0 not supported, 1 computed. The computed contrast figures
(alpha-borders 25) were recomputed independently with the WCAG formula: 1.25:1, 42%, 34% matched;
black 10% on #121212 came out 1.02:1, not 1.01:1, and the entry was corrected. Material overlay
percentages recomputed by the checker from ElevationOverlayProvider: 5.12, 8.24, 10.76, 11.89,
14.75 and 16.49%, matching the rounded values.

## tabular-numbers source removed before the check

The Go Make Things page carried a hidden instruction to the reading agent. The source, its three
claims and the quote that relied on it were removed; the sentence now stands on the mechanism.
