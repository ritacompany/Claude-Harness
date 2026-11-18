# Matched icon weight

- id: matched-icon-weight
- kind: rule
- surfaces: product-ui, brochure, editorial
- layers: shape, type
- default: yes, whenever an icon sits beside text, and for every product that uses icons at all (one family, one stroke)
- captured from: charles.unemployed, "10 niche design hacks" (no. 5) and "20 ways to unslop AI designs" (no. 12, "keep icons consistent")
- researched: 18 Nov 2026
- confidence: high on the platform mechanics, medium on the starting sizes and tolerances (those are judgment)

## In one line

Give an icon the stroke weight of the text beside it, size it from that text's cap height and draw
every icon in the product from one family at one stroke weight.

## What it is

An outline icon is drawn with strokes, the way letters are, so it has a weight that either matches
the label next to it or does not. Apple builds the match into SF Symbols: there are nine symbol
weights, from ultralight to black, and each corresponds to a weight of the San Francisco system
font, "helping you achieve precise weight matching between symbols and adjacent text". Each symbol
also comes in three scales, small, medium and large, and "the scales are defined relative to the
cap height of the San Francisco system font".

Material Symbols does the same job with variable font axes. Weight runs from thin (100) to bold
(700). Grade changes thickness in finer steps, and Google's guide says "You can match grade levels
between text and symbols for a harmonious visual effect." Optical size runs from 20dp to 48dp and
"offers a way to automatically adjust the stroke weight when you increase or decrease the symbol
size". Fill is 0 for the default outline or 1 for completely filled.

SVG icon sets work differently. Lucide icons are drawn on a 24 by 24 canvas with 2px strokes, and
when the icon is resized "the size of the stroke width will be relative to the size of the icon".
So the same icon rendered at 16px has a stroke of about 1.33px and at 32px about 2.67px, which is
plain arithmetic on the 24px grid. Lucide's `nonScalingStroke` prop makes the stroke width
constant, and in plain SVG `vector-effect: non-scaling-stroke` makes the stroke independent of the
element's transforms and zoom.

The family half of the rule is about drawing conventions beyond weight. Lucide's own guide fixes
the canvas, the 2px stroke, round line caps, round joins and a 2px corner radius on larger shapes,
and says "Lucide is a consistent icon set, not a collection of unrelated icons." Two sets drawn to
different conventions will not match even at the same stroke weight.

## Why it works

Next to text, an icon is read as part of the line. When its strokes are heavier than the letters it
shouts over the label; when lighter it looks greyed out or disabled. My judgment is that this
mismatch is the most common tell of icons pasted in from a second source, since nobody chose it.

Apple separates the two levers. Weight matches the type; scale "lets you adjust a symbol's
emphasis compared to adjacent text, without disrupting the weight matching with text that uses the
same point size." That is the useful model: change size for emphasis, never weight.

Outline and fill carry meaning, so mixing them is not neutral. Apple describes the outline variant
as having no solid areas, "resembling the appearance of text", and says it works well in toolbars,
lists and other places where a symbol sits alongside text. Fill gives "more visual
emphasis" and suits tab bars, swipe actions and places where an accent colour communicates
selection. Google says "To convey a state transition, use the fill axis for animation or
interaction." Read together: outline is the resting style and fill means a state, usually
selected. A filled icon among outline siblings reads as selected whether or not it is.

## Use it when

- An icon sits beside a label: a button, list row, menu item, tab, chip, input adornment or an
  icon inline in a sentence.
- A label changes weight (a bold button, a heading with an icon): the icon's weight follows it.
- Icons come from more than one library, or one has been pasted in from elsewhere.
- One icon appears at several sizes: hold the rendered stroke steady or let the optical size axis
  adjust it, rather than letting the stroke scale with the box.
- Light icons sit on a dark surface: Google suggests a low grade, for example -25, "to reduce glare
  for a light symbol on a dark background".

## Do not use it when

- The mark is a logo, brand mark, app icon or illustration. Those keep their own drawing. Apple's
  terms also prohibit using SF Symbols in app icons, logos or any other trademarked use.
- Fill is doing its job as a state. A filled selected tab among outline tabs is the convention,
  not an inconsistency; do not "fix" it to outline.
- The label is heavier than the icon family can go. Material Symbols stops at 700, so text set at
  800 or 900 cannot be matched on that axis. Pick the heaviest weight and let size carry the
  emphasis rather than faking weight with an added stroke.
- The icon is very small and a matched hairline would disappear. Apple notes that enclosed
  variants "can improve legibility at small sizes". At that size legibility beats the match.
- The icon stands alone as a large empty state or feature graphic with no text to match. Family
  consistency still holds; weight matching has nothing to match against.

## How: code

Variable icon font (Material Symbols). Leave `wght` out of `font-variation-settings` so the icon
follows the inherited `font-weight` of its label; MDN maps the registered `wght` axis to
`font-weight` and calls `font-variation-settings` the low level route for axes with no property of
their own, which `FILL` and `GRAD` are. The stylesheet link must request the axis ranges you use
(Google's guide shows the `number..number` range syntax).

```css
.icon {
  --fill: 0;
  --grad: 0;
  font-family: "Material Symbols Outlined";
  font-size: 20px;
  font-weight: inherit;                  /* wght follows the label */
  font-variation-settings: "FILL" var(--fill), "GRAD" var(--grad), "opsz" 20; /* opsz = rendered px */
}
.icon[data-selected="true"] { --fill: 1; }
@media (prefers-color-scheme: dark) {
  .icon { --grad: -25; }
}
```

SVG stroke icons (Lucide or any stroke set). Size from the cap height and hold one rendered stroke
across sizes:

```css
.with-icon { display: inline-flex; align-items: center; gap: 0.5cap; }
.with-icon svg {
  width: 1.65cap; height: 1.65cap; flex: none;
  stroke-width: 1.5;                     /* one value for the whole product */
}
.with-icon svg * { vector-effect: non-scaling-stroke; }
```

`cap` is the cap height of the element's font (MDN). Ahmad Shadeed sizes a button icon at
`1.65cap` with a `0.5cap` gap; the unit shipped in Firefox (Feb 2022), Chrome (Sep 2023) and Safari
(Dec 2023). `vector-effect` has been available across browsers since July 2020 (MDN), and with
`non-scaling-stroke` the stroke width no longer depends on the element's transform or zoom, so
`stroke-width: 1.5` renders 1.5px at 16px and at 32px. In React, Lucide's `strokeWidth` and
`nonScalingStroke` props do the same.

## How: Figma

Icon font: with a text layer set in a variable font, the type settings panel's Variable tab has a
slider and input for each axis the font provides. Set weight to match the label's weight and
optical size to the icon's size.

SVG icons: build one component per size with the stroke weight set on each by hand, so a 16 and a
24 icon render the same stroke. The scale tool (K) scales strokes along with the layer ("Any blurs
or strokes will scale as well"), which is what you want for an illustration and not for an icon
set; it also cannot scale layers nested inside a component instance. Keep every icon in one
library so a second family cannot be placed by accident.

## Defaults to start from

These are judgment, set as starting points:

- Body text 16px regular: icon box 20px, gap 0.5cap or 6 to 8px.
- Small text 13 to 14px: icon box 16px.
- Material Symbols: weight equal to the label's weight, optical size equal to the rendered size in
  px (within its 20 to 48 range), grade 0 on light surfaces and -25 on dark, fill 0 except for
  selected states.
- SVG sets: one stroke width for the whole product, 1.5px rendered next to regular text and 2px
  next to semibold or bold, held with non-scaling-stroke.
- One family and one style (outline) per product; fill only for selected or active states.

## How it goes wrong

- Two libraries in one toolbar: caps, corners and optical sizes differ even when stroke widths
  match.
- The same SVG used at 16px and 32px with a scaling stroke, so the large one looks bold beside the
  small ones (1.33px against 2.67px on a 24px grid with a 2px stroke).
- A semibold label with a regular weight icon, or the other way round.
- Fill used for decoration, so an icon reads as selected when nothing is.
- The icon box taller than the line, so rows grow or the icon sits off the centre of the capitals.
- Faking a heavier weight by adding a stroke to the glyph instead of choosing a weight the family
  was drawn at.

## How to check it

1. List every icon source in the build (import paths, icon font families, SVG folders). Pass if
   there is one family.
2. For each icon beside text, read the label's `font-weight` and the icon's weight axis value, or
   its rendered stroke (`stroke-width` times rendered size divided by viewBox size, or
   `stroke-width` itself under non-scaling-stroke). Pass if the weight axis equals the label weight
   within 100, or if every icon's rendered stroke is within 0.25px of the product value.
3. Pass if every filled icon sits on a selected or active element and every other icon is outline.
4. Pass if each icon box is no taller than its label's line height and is centred on the capitals,
   not on the line box.

## His take

Not yet given.

## Related

- concentric-radius (another consistency rule for things that sit together)
- blurred-icon-swaps (how an icon changes; this entry is how it sits)
- optical-centre, x-height, use-a-design-system (not yet researched)

## Sources

- https://developer.apple.com/design/human-interface-guidelines/sf-symbols : Apple Human Interface
  Guidelines, SF Symbols. Nine weights matched to San Francisco, three scales relative to cap
  height, scale for emphasis without breaking the weight match, outline beside text and fill for
  emphasis and selection, enclosed variants at small sizes, the logo and app icon prohibition.
- https://developers.google.com/fonts/docs/material_symbols : Google Fonts, Material Symbols guide.
  Fill, weight (100 to 700), grade (matching text, -25 on dark, 200 for emphasis) and optical size
  (20 to 48dp) axes; fill for state transitions; axis range syntax.
- https://lucide.dev/guide/basics/stroke-width : Lucide, stroke width. 2px default, stroke relative
  to size, the `strokeWidth` and `nonScalingStroke` props.
- https://lucide.dev/guide/design/icon-design-guide : Lucide icon design guide. 24px canvas, 2px
  stroke, round caps and joins, corner radii, "a consistent icon set".
- https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/vector-effect : MDN,
  `vector-effect`. `non-scaling-stroke` and its availability since July 2020.
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings : MDN. Low level
  property for axes with no basic property; `wght` maps to `font-weight`; custom axes are upper
  case.
- https://developer.mozilla.org/en-US/docs/Web/CSS/length : MDN, CSS lengths. `cap` is the cap
  height of the element's font.
- https://ishadeed.com/article/css-cap-unit/ : Ahmad Shadeed, 5 Jun 2024. Sizing an icon in
  `cap` beside text (`1.65cap`, `0.5cap` gap) and browser release dates.
- https://help.figma.com/hc/en-us/articles/5579502031511 : Figma help, "Use variable fonts". The
  Variable tab and its per axis sliders.
- https://help.figma.com/hc/en-us/articles/360040451453 : Figma help, "Scale layers while
  maintaining proportions". The scale tool scales strokes and cannot scale layers inside an
  instance.
