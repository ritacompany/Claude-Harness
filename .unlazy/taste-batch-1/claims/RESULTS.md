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

## tabular-numbers and optical-centre (claim-verifier, Sonnet, fresh context, claims files only)

86 live claims: 84 supported, 2 partly, 0 not supported. optical-centre 19: the quote's tail was
not confirmed verbatim, so the quote now stops at the confirmed words. tabular-numbers 37: the
Details tab rests on the page's placement of the Numbers options under that tab's image; kept.

## matched-icon-weight and blurred-icon-swaps (claim-verifier, Sonnet, fresh context, claims files only)

83 claims: 82 supported, 1 partly, 0 not supported. blurred-icon-swaps 21: the Chrome article's
2017 date was not on the fetched page, so the date was cut.

## OKLCH computed figures (recomputed independently)

A separate script with Ottosson's published matrices recomputed every computed claim
(palettes 32, 34, 35; gradients 21 to 24, 29, 30, 35). All matched: max sRGB chroma at L 0.62 is
0.127 for hue 90 and 0.206 for hue 260; 0.157 at L 0.70 hue 260; midpoints #909880 (C 0.035,
L 0.665), Oklab L 0.703 C 0.026, OKLCH C 0.194 at hue 177.4 against 0.13 held; the eleven
sampled stops and both lilac hex values identical.

## oklch-palettes and oklch-gradients (claim-verifier, Sonnet, fresh context, claims files only)

110 claims: 93 supported, 4 partly, 0 not supported, 13 computed (rechecked above). Fixes:
palettes 29 (Chrome and Safari clipping now dated to the 2025 report; the entry already called the
spec's algorithms permitted, not required), palettes 48 (Polychrom now "uses OKLCH to suggest
adjustments"). Kept: palettes 36 (calc(l - 0.07) is the entry's own value in code, same pattern as
MDN's examples), gradients 34 (0 to 263 shorter arc gives 311.5 by the spec's rule; rechecked by
hand: 263 minus 0 exceeds 180, so the first hue becomes 360 and the midpoint is 311.5).
