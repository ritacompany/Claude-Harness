# OKLCH gradients

- id: oklch-gradients
- kind: technique
- surfaces: brochure, graphic, product-ui, editorial
- layers: colour
- default: yes, whenever a CSS gradient runs between two clearly different hues; not needed for a fade to transparent
- captured from: charles.unemployed, "10 niche design hacks" (no. 4)
- researched: 18 Nov 2026
- confidence: high on the syntax, defaults, hue methods and browser support; medium on the Figma workaround, since a plugin listing and a feature request are the only sources on how Figma blends

## In one line

Interpolate gradients in Oklab or OKLCH instead of sRGB: Oklab stops the middle going too dark,
and OKLCH also stops it going grey when the two hues are far apart.

## What it is

A gradient is a path between colours through a colour space, so the same two stops give a
different gradient in a different space (Evil Martians). CSS Images 4 adds a
`<color-interpolation-method>` to `linear-gradient()`, `radial-gradient()` and `conic-gradient()`
to choose it:

```css
linear-gradient(in oklab, A, B)
linear-gradient(90deg in oklch, A, B)
linear-gradient(in oklch longer hue, A, B)
```

CSS Color 4 defines the grammar as
`in [ <rectangular-color-space> | <polar-color-space> <hue-interpolation-method>? ]`. Rectangular
spaces include `srgb`, `srgb-linear`, `display-p3`, `lab` and `oklab`; polar ones are `hsl`,
`hwb`, `lch` and `oklch`. Only polar spaces take a hue method:

- `shorter` (the default) takes the shorter arc between the two hues.
- `longer` takes the longer arc. The spec's example: from red `oklch(0.6 0.24 30)` to yellow
  `oklch(0.8 0.15 90)`, the midpoint is a deep orange `oklch(0.7 0.195 60)` with `shorter` and a
  sky blue `oklch(0.7 0.195 240)` with `longer`.
- `increasing` and `decreasing` always turn one way, so an animated hue does not flip to the other
  arc when the gap passes 180 degrees.

The defaults are easy to miss. CSS Images 4 says a gradient with no method uses Oklab, but CSS
Color 4 makes browsers interpolate between legacy sRGB formats (hex, named colours, `rgb()`,
`hsl()`, `hwb()`) in gamma encoded sRGB, for compatibility. So `linear-gradient(#2563eb, #facc15)`
still runs through sRGB. Writing `in oklab` or `in oklch` opts in, as does writing at least one
stop in a non legacy form.

## Why it works

CSS Color 4 calls sRGB "neither linear-light nor perceptually uniform" and says interpolating in
it "produces poorer results (overly dark or greyish mixes)". CSS Images 4 shows a gradient from `#f01` to `#081` in sRGB is "clearly too dark at the midpoint", and white to
`#01E` in sRGB is too dark, "a little desaturated" and slightly purple. CIE Lab fixes the darkness
but adds "a significant purple cast"; Oklab gives "no purple cast at all". Ottosson set even
blending as an aim when he designed Oklab ("Blending two colors should result in even
transitions"), and found CIELAB, CIELUV and HSV all shift a white to blue blend toward purple. His
post lists Oklab as Photoshop's default gradient interpolation.

Oklab is still rectangular: its midpoint sits on the straight line between the two colours, and
between far apart hues that line passes near grey. CSS Images 4 draws `#A37` to `#595` in five
spaces and notes: "The rectangular spaces have a greyish midpoint, while the intermediate colors in
the polar spaces follow a curved, chroma-preserving path." CSS Color 4 sums up the split: Oklab
when colours "need to be evenly spaced perceptually (such as in a gradient)", OKLCH when "avoiding
graying out ... i.e. maximizing chroma throughout the transition".

A worked case, computed with Ottosson's conversion, from blue `#2563eb` to yellow `#facc15`:

- sRGB: midpoint `#909880`, chroma 0.035, lightness 0.665 against an average of 0.703 for the
  ends, so darker than it should be and close to grey.
- Oklab: lightness 0.703, the even average, but chroma 0.026, so still grey.
- OKLCH: chroma 0.194 at hue 177 (cyan), more than sRGB can show there (about 0.13), so the browser
  has to bring it back into gamut.

That last point is OKLCH's cost. CSS Color 4 warns that polar interpolation "may fall outside the
gamut of a display", and its example `#1A1` to `#23F` in OKLCH has most of its in between values
outside both sRGB and Display P3. OKLCH also walks through every hue between the stops: blue to
yellow passes through cyan and green.

## Use it when

- A hero, background or brand gradient runs between two distinct hues.
- A gradient goes muddy or dark in the middle in the browser.
- A data ramp or `color-mix()` blend needs even lightness steps; the same method syntax overrides
  the default space for `color-mix()` too (MDN).

Pick the space by the hue gap (my judgement): Oklab when the hues are close or when no new hue
may appear in the middle; OKLCH when the hues are far apart, the middle should stay saturated and
the hues passed on the way are acceptable.

## Do not use it when

- The gradient fades a colour to transparent. CSS gradients already interpolate in premultiplied
  alpha, which MDN's compatibility data describes as preventing greys in gradients with
  transparency (since Chrome 29, Firefox 36 and Safari 15). Changing the space is not the fix for
  that.
- OKLCH would pass through an off brand hue (blue to yellow through green, for instance). Use
  Oklab, or add a deliberate middle stop.
- The browser render has to match a Figma or bitmap master exactly. Figma blends its stops
  differently (see How: Figma), so the two will not match.
- The two stops share a hue and only lightness changes. OKLCH has no hue to keep; Oklab is enough.

## How: code

```css
/* close hues: Oklab */
.band {
  background: linear-gradient(90deg in oklab, oklch(0.75 0.11 190), oklch(0.5 0.19 265));
}

/* far hues, saturated middle: OKLCH, with pre-sampled stops first for older browsers */
.hero {
  background: linear-gradient(90deg, #2563eb, #007fcb, #008fbb, #009eb3, #00abab,
    #00b99f, #00c885, #5fd05d, #a0d139, #d1cf12, #facc15);
  background: linear-gradient(90deg in oklch, #2563eb, #facc15);
}

/* a grey or white stop in OKLCH: give it no hue */
.wash {
  background: linear-gradient(in oklch, oklch(1 0 none), oklch(0.55 0.2 263));
}
```

The eleven fallback stops are the OKLCH path sampled every 10%, with chroma cut at constant
lightness and hue where it leaves sRGB, computed with Ottosson's conversion. The
`@csstools/postcss-gradients-interpolation-method` PostCSS plugin produces the same kind of
fallback automatically: its README example turns a two stop `in oklch` gradient into eleven `rgb()`
stops, kept before the original declaration. It does not support colour stops given as `var()`.

The `none` in `.wash` matters. A white or grey written as `oklch(1 0 0)` has a hue of 0 that does
nothing on its own, but CSS Color 4 says a hand written powerless value "acts as normal", so the
gradient sweeps from hue 0 toward 263 along the shorter arc (through 360 down to 263) and the
middle turns lilac (`#cba4e5` instead of a light blue `#94b6f6`, computed). With `none` the
missing hue takes the other stop's value. Keywords like `white` are safe: when a colour is
converted into OKLCH and its hue is powerless, the spec sets it to missing.

Support: the interpolation colour space and hue method in `linear-gradient()` work in Safari 16.2
(Dec 2022), Chrome and Edge 111 (Mar 2023) and Firefox 127 (11 Jun 2024), per MDN's compatibility
data. The fallback declaration goes first, as in the PostCSS plugin's output.

## How: Figma

Figma's gradient fill offers linear, radial, angular and diamond types, and stops are added by
clicking along the gradient slider. The Perceptual Color plugin's listing states that "the color
blending (or interpolation) between colors in Figma is done in RGB color space", so Figma will not
match an OKLCH gradient from the web. A community request to choose the gradient interpolation
space was posted on the Figma forum on 13 Jun 2022; when read on 18 Nov 2026 the thread had
replies through Nov 2026 and none from Figma staff.

To approximate it, sample the OKLCH path and paste the samples as stops: the eleven hex values in
the code above go in at 0%, 10% and so on to 100%. More stops make each RGB segment shorter, so
the RGB blending between neighbours changes little (this follows from the mechanism; the PostCSS
plugin's fallback is built the same way, from many stops). For other colours, culori generates the stops:

```js
import { interpolate, samples, formatHex, toGamut } from 'culori';
const mix = interpolate(['#2563eb', '#facc15'], 'oklch');
const toRgb = toGamut('rgb');
const stops = samples(11).map(t => formatHex(toRgb(mix(t))));
```

culori's `interpolate` takes the shorter hue path by default, and `formatHex` alone clamps out of
range channels, which is why `toGamut` runs first. Perceptual Color itself lets you inspect and
adjust selected gradient fills in OKLCH.

## Defaults to start from

- `in oklab` for any two stop gradient in CSS, even when the hues are close, because it evens
  the lightness.
- `in oklch` (shorter hue) when the stops are roughly 90 degrees or more apart in hue and the
  middle should stay saturated (my threshold, not a sourced one).
- `in oklch longer hue` only for a deliberate rainbow.
- A fallback declaration before every `in` gradient where browsers older than Safari 16.2, Chrome
  111 or Firefox 127 matter.
- Grey, white and black stops written as keywords, hex or `oklch(L 0 none)`.

## How it goes wrong

- Hex stops with no `in`: the gradient stays in sRGB, because legacy colours default to it.
- OKLCH between far apart hues, unwatched: an unexpected green or magenta band in the middle.
- Saturated OKLCH stops: the middle leaves the gamut and each browser maps or clips it in its own
  way.
- `oklch(1 0 0)` as a white stop: a tinted sweep through the wrong hues.
- Building the gradient in Figma with two stops and expecting the browser to match it.

## How to check it

For every CSS gradient: if its stops differ in hue by more than about 30 degrees in OKLCH, it
declares `in oklab` or `in oklch`. Every `in oklch` gradient with a stop of chroma 0 writes that
hue as `none` or uses a keyword or hex. Every `in` gradient has a fallback declaration before it
where the support target needs one. Render the gradient and sample the midpoint. For an OKLCH gradient,
its chroma should be clearly higher than the sRGB version's midpoint; for an Oklab gradient, its
lightness should be close to the average of the two stops.

## His take

Not yet given.

## Related

- oklch-palettes (the colour space itself, its gamut limits and tools)
- grainy-gradients, thermal-gradients (not yet researched)

## Sources

- https://www.w3.org/TR/css-images-4/ : W3C CSS Images Module Level 4, Working Draft, 30 Sep 2025.
  Section 3.1 (`<color-interpolation-method>` in gradients), 3.1.1 (the sRGB, Lab, Oklab and OKLCH
  comparison examples, greyish midpoints in rectangular spaces, polar spaces chroma preserving
  but easily out of gamut), 3.5.2 (default interpolation is Oklab).
- https://www.w3.org/TR/css-color-4/ : W3C CSS Color Module Level 4, Candidate Recommendation
  Draft, 12 Nov 2026. Section 4.4.1 (powerless components act as normal when written by hand, are
  set to missing after conversion), 13 (interpolation steps), 13.1 (OKLCH interpolation can leave
  sRGB and Display P3), 13.3 (the grammar, Oklab for even spacing, OKLCH to avoid greying, legacy
  sRGB colours interpolate in sRGB), 13.4 (missing components take the other colour's value),
  13.6 (shorter, longer, increasing, decreasing).
- https://developer.mozilla.org/en-US/docs/Web/CSS/color-interpolation-method : MDN. Syntax,
  default Oklab, default shorter hue, applies to `color-mix()` and `linear-gradient()`.
- https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient : MDN. `in oklab`
  and `in hsl longer hue` syntax examples.
- https://bcd.developer.mozilla.org/bcd/api/v0/current/css.types.gradient.linear-gradient.json :
  MDN browser compatibility data. Interpolation colour space and hue method versions;
  premultiplied gradients "prevents grays from appearing in gradients with transparency".
- https://bottosson.github.io/posts/oklab/ : Björn Ottosson, "A perceptual color space for image
  processing", 23 Dec 2020. Even blending as a design aim, the white to blue purple shift in
  CIELAB, CIELUV and HSV, Photoshop's default gradient interpolation and the conversion used for
  the worked numbers.
- https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl : Andrey Sitnik and Travis
  Turner, Evil Martians. A gradient is a path through a colour space; Oklab has no greyish middle
  like sRGB and no blue to purple shift like Lab.
- https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-gradients-interpolation-method :
  csstools PostCSS plugin README. Eleven stop `rgb()` fallback for an `in oklch` gradient, `var()`
  stops unsupported.
- https://figma-web.pages.dev/plugins/1266828922235523696 : listing of the Perceptual Color Figma
  plugin by Jeremy Knudsen (figma.com/community/plugin/1266828922235523696, which refused an
  automated fetch). Figma blends gradient stops in RGB; the plugin inspects and adjusts gradients
  in OKLCH.
- https://help.figma.com/hc/en-us/articles/34208860210199-Use-gradients-as-a-fill-or-stroke :
  Figma help. Gradient types and adding stops along the slider.
- https://forum.figma.com/t/support-for-more-color-spaces-including-the-ability-to-specify-gradient-interpolation-method/23804 :
  Figma forum feature request, 13 Jun 2022, for more colour spaces and a gradient interpolation
  setting.
- https://culorijs.org/api/ : culori API. `interpolate`, `samples`, `formatHex` clamping,
  `toGamut`, shorter hue by default.
