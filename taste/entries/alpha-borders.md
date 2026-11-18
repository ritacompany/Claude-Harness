# Alpha borders

- id: alpha-borders
- kind: technique
- surfaces: product-ui, brochure, editorial
- layers: colour, shape, image
- default: yes for decorative borders and image edges that sit on more than one surface colour; never as the only boundary of a control that needs one
- captured from: charles.unemployed, "10 niche design hacks" (no. 2)
- researched: 18 Nov 2026
- confidence: high on the mechanism and the contrast maths, medium on the starting alpha values (practitioner values, not a standard)

## In one line

Draw borders and image edges in black or white at low alpha instead of a fixed grey, so the line
darkens or lightens whatever it sits on and stays visible across surfaces, and keep it out of
borders that have to meet contrast.

## What it is

A solid grey border is one fixed colour. On a white page it reads as a light line; on a light
grey or tinted panel it can match the surface and disappear. A border in black at low alpha is
composited over whatever is behind it, so it always lands a little darker than its own surface.
Cloud Four's example swaps a `#ddd` border for `rgba(0, 0, 0, 0.135)`, which "matches #ddd on
white backgrounds but automatically appears darker on other backgrounds". Anthony Hobday's
visual techniques list shows the same thing on a two colour background: a solid grey border is
lost against light blue, while a black border at 10% opacity darkens both the white and the
light blue and shows on both.

The second form is the inner border on images and avatars: a hairline drawn on the image's own
edge, not around it. Mathias Beke's version is `outline: 1px solid rgba(0, 0, 0, 0.1)` with
`outline-offset: -1px`. MDN: on `outline-offset`, "A negative value places the outline inside
the element". Where the image edge is dark the line is barely there; where it is white or pale
the line gives the image an edge against a white page.

## Why it works

Alpha borders separate by relative contrast, not by a fixed colour, so one token holds across
cards, tinted sections and photos. Two or more fixed greys would otherwise be needed, one per
surface, and they drift. Cloud Four's own limit is worth keeping: "This technique works best when
using a transparent black or white." A tinted alpha takes on the hue of what is behind it.

The image inner border fixes a specific failure: a photo or avatar with a white or near white
edge on a white page has no visible boundary, so it looks unfinished or cropped wrong. Apple
makes the same point for icons in dark mode: "an icon that represents a drop of oil might need a
slight border to make the edge visible against a dark background."

## Use it when

- Dividers, card outlines and table rules that sit on more than one surface colour: alternating
  section backgrounds, tinted panels, hover states.
- Images, avatars, logos and thumbnails whose edges may be white or very light, in grids and
  lists on a light page; in dark mode the same for images with very dark edges.
- A component library that must work on surfaces it does not control (embeds, theming,
  brand colours set by the customer).

## Do not use it when

- The border is the only thing that identifies a control, such as the box of a text input or a
  checkbox. WCAG 1.4.11 then requires 3:1 against the adjacent colour, and a decorative alpha
  border fails by a wide margin: black at 10% on white composites to `#e6e6e6`, about 1.25:1
  (worked with the WCAG relative luminance formula). Black needs about 42% alpha to reach 3:1 on
  white and white needs about 34% to reach 3:1 on `#121212`. Use a solid token checked at 3:1,
  or an alpha high enough to pass on every surface it can land on.
- Two bordered elements overlap or touch with shared edges. Alpha layers stack: two 10% black
  lines on top of each other composite to 19% black, so collapsed table borders and overlapping
  avatars show darker seams.
- The surface behind is a busy photo or a strong colour where the border must look the same
  everywhere. Hobday's caveat: the shift from one colour to another "can look bad in a different
  way".
- The same black alpha token is reused in dark mode. Black at 10% on `#121212` is about 1.02:1, so
  the line disappears; dark surfaces need a white alpha, and Hobday notes a dark background needs
  a less transparent border.

## How: code

```css
:root {
  color-scheme: light dark;
  --edge: light-dark(rgb(0 0 0 / 0.1), rgb(255 255 255 / 0.12));
  --edge-strong: light-dark(rgb(0 0 0 / 0.45), rgb(255 255 255 / 0.4)); /* 3:1 on white and #121212 */
}
.card {
  border: 1px solid var(--edge);
  background-clip: padding-box;
}
.avatar, .thumb {
  outline: 1px solid var(--edge);
  outline-offset: -1px;
  border-radius: 50%; /* or the thumb's own radius */
}
.input { border: 1px solid var(--edge-strong); }
```

- `background-clip: padding-box` matters when the bordered element has its own background. MDN:
  "The background is always drawn behind the border", and the default `border-box` paints it
  under the border, so a translucent border shows the element's own fill, not the page. With
  `padding-box`, "No background is drawn beneath the border."
- The image hairline uses `outline` because MDN says outlines "don't take up space, so they don't
  affect the layout of the document in any way". MDN lists `border-radius` among the properties
  that set an outline's corners, so the hairline follows a round avatar.
- `light-dark()` returns its first value in the light scheme and its second in the dark one, and
  needs `color-scheme: light dark`; MDN marks it Baseline 2024 (since May 2024). On older targets
  set the dark value in a `prefers-color-scheme: dark` block instead.
- A pseudo element overlay is the other way to draw the image hairline, but Beke notes `:after`
  does not work on an `img`, so it needs a wrapper.

## How: Figma

Add a stroke, set its colour to black (white on dark frames) and lower its opacity in the colour
picker to the alpha you want. For an image or avatar edge, set the stroke position to Inside, so
it sits on the image and not around it; Figma sets most shapes to inside by default. A stroke's
weight is not counted in the layer's dimensions unless an auto layout frame is set to include
strokes. Colour variables can be applied to stroke colours, so keep the edge as one variable with
a light and a dark value rather than typing the alpha on each layer.

## Defaults to start from

- Decorative border on light: black 8 to 13.5% (Beke uses 10%; Cloud Four's 13.5% matches
  `#ddd` on white).
- Decorative border on dark: white 10 to 15%, nudged up rather than down, following Hobday.
- Image and avatar hairline: 1px, black 10% on light, white 10% on dark, offset -1px or stroke
  Inside.
- Border that identifies a control: at least black 42% on white and white 34% on `#121212`, and
  check every other surface it sits on.

## How it goes wrong

- The decorative token gets reused on input boxes and fails 1.4.11.
- Black alpha carried into dark mode, where it vanishes.
- No `background-clip: padding-box` on an element with its own fill, so the border shows that
  fill and looks like a solid grey again.
- Overlapping or adjacent alpha borders producing darker seams.
- A 1px alpha hairline on a high density image that the browser renders fainter still; the WCAG
  understanding note says "particularly thin lines and shapes of non-text elements may be
  rendered by user agents with a much fainter color".

## How to check it

For every border and outline with an alpha colour: it has a dark mode value that is white based
(or otherwise visible on the dark surface); elements with their own background use
`background-clip: padding-box`. For every border that is the only visual boundary of a control,
composite it over each surface it can sit on and confirm 3:1 or more with the WCAG formula. For
images and avatars in a grid or list, confirm a 1px inset hairline (outline with a negative offset
or Inside stroke) and that it changes no layout size.

## His take

Not yet given.

## Related

- concentric-radius (a border adds to the gap that rule measures)
- dark-mode-depth (borders and highlights as a depth cue on dark surfaces)
- multiply-blending (the other way to settle images with white backgrounds onto a surface)

## Sources

- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html : W3C, Understanding SC
  1.4.11 Non-text Contrast. The 3:1 requirement, a visual boundary only required when there is no
  other visual way to identify the control, inactive components exempt, thin lines rendered
  fainter.
- https://www.w3.org/TR/WCAG22/ : WCAG 2.2, glossary definitions of contrast ratio and relative
  luminance, used for the worked contrast values above.
- https://cloudfour.com/thinks/building-flexible-components-with-transparency/ : Paul Hebert,
  Cloud Four, 19 Nov 2020. `#ddd` swapped for `rgba(0, 0, 0, 0.135)`, works best with transparent
  black or white, the accessible contrast warning.
- https://anthonyhobday.com/sideprojects/visualtechniques/techniques/borders/transparent-border-for-contrast
  and
  https://anthonyhobday.com/sideprojects/visualtechniques/techniques/borders/semi-transparent-border-as-element-contrast-helper
  : Anthony Hobday, Visual design techniques. The 10% black border on white and light blue, the
  colour shift caveat, dark backgrounds need a less transparent border.
- https://www.denbeke.be/blog/?p=1753 : Mathias Beke, 15 Jan 2015. The image hairline with
  `outline` and `outline-offset: -1px`; the `:after` alternative needs a wrapper because it does
  not work on `img`.
- https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset ,
  https://developer.mozilla.org/en-US/docs/Web/CSS/outline ,
  https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip ,
  https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark : MDN. Negative offset
  draws inside the element; outlines take no space and take corners from `border-radius`;
  background painted under the border by default; `light-dark()` and its `color-scheme`
  requirement.
- https://help.figma.com/hc/en-us/articles/360049283914 : Figma help, Apply and adjust stroke
  properties. Stroke position, inside as default for most shapes, stroke opacity in the colour
  picker, strokes not counted in dimensions except in auto layout when included.
- https://help.figma.com/hc/en-us/articles/15343107263511 : Figma help, Apply variables to
  designs. Colour variables apply to stroke colours.
- https://help.figma.com/hc/en-us/articles/15343816063383 : Figma help, Modes for variables. One
  variable can hold a light and a dark value as modes.
- https://developer.apple.com/design/human-interface-guidelines/dark-mode : Apple HIG, Dark Mode.
  The oil drop icon that needs a slight border on a dark background. The page renders with
  JavaScript; its text is at
  https://developer.apple.com/tutorials/data/design/human-interface-guidelines/dark-mode.json
