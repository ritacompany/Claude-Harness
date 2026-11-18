# OKLCH palettes

- id: oklch-palettes
- kind: technique (also defines the term OKLCH)
- surfaces: product-ui, brochure, editorial, graphic
- layers: colour
- default: yes, whenever a new colour scale or palette is built for screens; values a project already holds as its source of truth are read from there, not re-derived
- captured from: charles.unemployed, "10 niche design hacks" (no. 3) and "20 design terms you should know" (no. 11, "OKLCH")
- researched: 18 Nov 2026
- confidence: high on the definition, syntax, gamut behaviour in the spec and browser support; medium on how far equal lightness predicts contrast

## In one line

Build colour scales in OKLCH: fix one ladder of lightness steps and share it across hues, so a
step looks equally light in every hue and lightness can be read straight from the code.

## What it is

OKLCH (the CSS spec writes it OkLCh) is the polar form of Oklab, a perceptual colour space Björn
Ottosson published on 23 Dec 2020. Oklab has three axes: L, perceived lightness; a, how green or
red the colour is; b, how blue or yellow it is. OKLCH keeps L and turns a and b into chroma
C = √(a² + b²) (the distance from grey) and hue h = atan2(b, a) (an angle). Ottosson derived it by
optimising a space with the same structure as IPT against data generated with CAM16. The CSS spec
credits it with better hue linearity, hue uniformity and chroma uniformity than CIE LCH.

In CSS it is written `oklch(L C H / alpha)`:

- L runs from 0 (black) to 1 (diffuse white), or 0% to 100%. Values outside that range are
  clamped when parsed, and L of 0 or 1 displays as black or white whatever the chroma.
- C starts at 0 (grey). The spec calls its maximum "theoretically unbounded (but in practice does
  not exceed 0.5)". As a percentage, 100% means 0.4, not 1. Evil Martians put the practical
  limit for both sRGB and Display P3 below 0.37.
- H is a hue angle, but not the HSL one: 0deg points toward purplish red, 90deg mustard yellow,
  180deg greenish cyan and 270deg sky blue. MDN notes that the angle for a given hue differs
  between `hsl()`, `lch()` and `oklch()`. When C is 0 the hue does nothing (the spec calls it
  powerless).

HSL lightness is the reason this matters. The spec says HSL lightness "does not correspond to the
visual perception of lightness across hues": `hsl(240deg 100% 50%)` (blue) and
`hsl(60deg 100% 50%)` (yellow) both have HSL lightness 50%, but in OKLCH they are L 0.452 and L
0.968. HSL hue spacing is uneven too: the spec's pair 220deg and 250deg look fairly similar while
50deg and 80deg look very different, though both are 30deg apart; in OKLCH the same pairs are
6.3deg and 35.66deg apart.

## Why it works

Ottosson's stated aim was that L, C and h "should be perceived as orthogonal, so one can be altered
without affecting the other two". So a palette can hold L as the constant: blue-500 and green-500
share a lightness, a hover state is the same colour with L moved and a 0.1 step is meant to
look like the same change in every hue. Evil Martians, who moved their CSS to OKLCH, say its "predictable
lightness" gives better accessibility and show contrast problems being read off L values in code
(their example flags a 0.2 lightness gap between text and background as too small).

My judgement: L predicts contrast well enough to plan a palette, not well enough to sign it off.
Harmonizer, Evil Martians' own palette tool, pairs OKLCH with the APCA contrast formula to get
consistent contrast across hues, which suggests L alone was not enough for them either. Measure the
final text pairs.

The limit is the screen. OKLCH can describe colours no display shows, and Evil Martians note that
"every hue has a different maximum chroma" at each lightness: "For some lightness values, there is
only a blue color with a large chroma." A colour outside the display's gamut has to be brought
back in. The spec's three permitted algorithms all aim at "constant-lightness, constant-hue chroma
reduction in the OkLCh color space". In practice it varies: Chrome's own guide says "The browser
gamut maps or clamps to sRGB", and Evil Martians reported that Chrome and Safari clip, which can
shift the hue (the spec's clipping example moves a hue by 69°). So a palette should stay inside
the gamut it targets rather than rely on the browser.

## Use it when

- Building a tonal ramp (50 to 950, or 100 to 900) for a brand, accent or neutral colour.
- Building several hue ramps that must line up step for step: success, warning, danger, info.
- Deriving hover, pressed and disabled states from one base colour with relative colour syntax.
- Tinting neutrals with the brand hue at very low chroma.
- Generating colour from data or user input where text on it must stay readable. Evil Martians
  fix L at 0.8 and C at 0.17 on a user's avatar hue and keep black text.

## Do not use it when

- A project already holds its palette as the source of truth (for Mondai, the design system in
  Figma). Read the values there; this entry does not re-derive them.
- A brand colour is specified exactly. Converting it to `oklch()` is fine; nudging it onto a
  lightness ladder is a brand decision, not a palette one.
- A warm hue needs high chroma at a middle lightness. Computed with Ottosson's conversion, sRGB
  holds about C 0.13 for yellow (hue 90) at L 0.62 against about 0.21 for blue (hue 260), so a
  shared ladder turns the yellow 500 olive. Let warm hues sit higher on the ladder and check their
  contrast on their own. Tailwind does this: its yellow-500 is L 79.5% and its blue-500 is L 62.3%.
- You expect equal chroma across hues at every step. The gamut does not allow it; hold L
  constant and let C fall to what each hue can hold.
- Equal L is being used as proof of passing contrast. It is a plan, not a measurement.

## How: code

```css
:root {
  /* one lightness ladder, shared by every hue */
  --l-100: 0.93; --l-300: 0.81; --l-500: 0.62; --l-700: 0.49; --l-900: 0.38;

  --blue-500:  oklch(var(--l-500) 0.20 260);
  --green-500: oklch(var(--l-500) 0.16 150);
  --red-500:   oklch(var(--l-500) 0.21 25);
  --neutral-100: oklch(var(--l-100) 0.005 260); /* brand tinted grey */
}
@media (color-gamut: p3) {
  :root { --blue-500: oklch(var(--l-500) 0.215 260); }
}
.button { background: var(--blue-500); }
.button:hover { background: oklch(from var(--blue-500) calc(l - 0.07) c h); }
```

Every value above sits inside sRGB (the P3 override inside Display P3), checked with Ottosson's
conversion. The hover darkens rather than lightens on purpose: relative colour syntax keeps C, and
lightening this blue to L 0.70 at C 0.20 leaves sRGB, which holds about 0.16 there. Use numbers,
not percentages, inside `calc()` and relative colours; Evil Martians note that `%` does not work
there.

Support: `oklch()` works in Safari 15.4, Chrome 111, Edge 111 and Firefox 113. MDN marks it
Baseline widely available, "available across browsers since May 2023". Relative colour syntax in
`oklch()` has full support from Chrome and Edge 122, Firefox 128 and Safari 18.

Tools Evil Martians list: the oklch.com picker and converter, the Huetone palette generator (which
uses Oklab by default), `npx convert-to-oklch` for existing CSS, stylelint-gamut to flag P3
colours left outside `@media (color-gamut: p3)` and Color.js or culori for generating palettes in
script. culori's `toGamut('rgb')` converts a colour to OKLCH and finds the largest chroma that is in
gamut.

## How: Figma

Evil Martians wrote on 28 May 2025 that "Figma doesn't support OKLCH in its color picker just
yet". Plugins fill the gap: OkColor picks colours in OKLCH and copies them as `oklch()` in its
OkLCh (CSS) format; Harmonizer (Evil Martians) generates whole palettes in OKLCH with APCA
contrast and takes its colour space, P3 or sRGB, from the Figma document; Polychrom checks text
contrast with APCA and shows and adjusts colours in OKLCH. Evil Martians also report a bug:
pasting an `oklch()` value into the hex field breaks in a file set to the P3 colour profile. Build
the ramp in a plugin, then store the results as colour variables so code and Figma read the same
values.

## Defaults to start from

- Lightness ladder, as a reference: Tailwind v4's blue ramp, written in `oklch()`, runs L 97%,
  93.2%, 88.2%, 80.9%, 70.7%, 62.3%, 54.6%, 48.8%, 42.4%, 37.9%, 28.2% from 50 to 950.
- Chroma: let it peak in the middle and taper at both ends. Tailwind's blue goes from C 0.014 at
  50 up to 0.245 at 600 and back down to 0.091 at 950.
- Hue: hold it within a few degrees across the ramp. Tailwind's blue drifts from 254.6 to 267.9.
- Neutrals: C 0 to 0.01 on the brand hue. Evil Martians' sample palette uses
  `oklch(0.96 0.005 300)` for a light surface and `oklch(0.29 0.01 300)` for a dark one.
- Wide gamut: sRGB value first, P3 chroma inside `@media (color-gamut: p3)`.

Tailwind's ramps show that writing `oklch()` is not the same as sharing a ladder: Tailwind kept its
v3 balance between colours, so its 500s do not share L. Decide which one the project wants.

## How it goes wrong

- Converting hex to `oklch()` and stopping there. Nothing changes on screen; the benefit comes
  from authoring with a shared L.
- Holding C constant across hues, so some hues leave sRGB and get clipped or mapped by the
  browser, and the ramp looks uneven anyway.
- Lightening with relative colour syntax at full chroma, pushing the colour out of gamut.
- Writing C as a percentage and reading 100% as 1 (it is 0.4).
- Copying an HSL hue angle into `oklch()` and getting a different hue.
- Treating equal L as passing contrast.

## How to check it

Parse every palette token to OKLCH (culori or Color.js). Pass if: within each ramp L falls
steadily from lightest to darkest; same numbered steps across hues share L within 0.02, or the
exceptions are named warm hues; every value is inside sRGB, or has an sRGB value plus a P3
override inside `@media (color-gamut: p3)`; and every designated text and surface pair passes the
project's contrast check (APCA or WCAG), measured, not inferred from L.

## His take

Not yet given.

## Related

- oklch-gradients (the same colour space used for interpolation)
- improve-text-contrast (not yet researched)
- add-an-accent-colour (not yet researched)

## Sources

- https://www.w3.org/TR/css-color-4/ : W3C CSS Color Module Level 4, Candidate Recommendation
  Draft, 12 Nov 2026. Section 7 (HSL lightness does not match perceived lightness; the blue and
  yellow and hue spacing examples), 9.2 (Oklab and OkLCh, improved hue linearity, chroma "to 0.5
  or so"), 9.4 (the `oklch()` syntax, ranges, 100% = 0.4, hue directions, powerless hue, L 0 and
  1 display as black and white), 14 (gamut mapping, clipping shifts hue, the three algorithms
  aim at constant lightness and hue chroma reduction in OkLCh).
- https://bottosson.github.io/posts/oklab/ : Björn Ottosson, "A perceptual color space for image
  processing", 23 Dec 2020. What L, a and b mean, the polar form C and h, the orthogonality aim,
  derivation from IPT structure and CAM16 data and the conversion used for the gamut numbers.
- https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch : MDN `oklch()`. L, C and H
  definitions, 100% = 0.4 for C, hue angles differ from `hsl()`, Baseline widely available since
  May 2023.
- https://bcd.developer.mozilla.org/bcd/api/v0/current/css.types.color.oklch.json : MDN browser
  compatibility data for `oklch()` and its relative syntax.
- https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl : Andrey Sitnik and Travis
  Turner, Evil Martians, "OKLCH in CSS: why we moved from RGB and HSL" (dated 17 Sep 2025 on the
  page). Axes, chroma below 0.37, different maximum chroma per hue, clipping in Chrome and Safari,
  P3 media query advice, `%` in `calc()`, sample palette, the tools listed.
- https://evilmartians.com/chronicles/exploring-the-oklch-ecosystem-and-its-tools : Irina
  Nazarova, Arthur Objartel and Travis Turner, Evil Martians, 28 May 2025. Figma's picker without
  OKLCH, the P3 paste bug, OkColor, Harmonizer, Polychrom.
- https://evilmartians.com/opensource/harmonizer : Harmonizer. OKLCH with APCA for consistent
  chroma and contrast across levels and hues, Figma plugin and web app.
- https://tailwindcss.com/docs/colors : Tailwind CSS default palette in `oklch()`, the blue,
  yellow and neutral values quoted.
- https://tailwindcss.com/blog/tailwindcss-v4 : Tailwind CSS v4.0, 22 Jan 2025. Palette moved
  from `rgb` to `oklch`, balance kept from v3.
- https://developer.chrome.com/docs/css-ui/migrate-hd-color : Adam Argyle, Chrome for Developers,
  "Migrate to HD CSS color". The browser "gamut maps or clamps to sRGB".
- https://culorijs.org/api/ : culori API. `toGamut` converts to OKLCH and finds the largest chroma
  that is in gamut.
