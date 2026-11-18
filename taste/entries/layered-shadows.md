# Layered shadows

- id: layered-shadows
- kind: technique
- surfaces: product-ui, brochure, editorial
- layers: shape, colour, state, motion
- default: yes, whenever a surface that floats (a lifted card, menu, popover, sheet, dialog, toast) already calls for a shadow: build it as a layered stack; no as a reason to add shadows to a flat system, a dense list or anything a border or surface step already separates
- captured from: theecommguy, "10 niche design hacks" (no. 5, screenshot 18 Nov 2026)
- researched: 18 Nov 2026
- confidence: high on the CSS mechanics (spec and MDN) and Figma's limits (its help pages); medium on the starting values, which are practitioner values and my own composition from them; medium on the performance cost, which rests on practitioner write ups and a general browser guide, not on measurements

## In one line

Build a shadow from two or more stacked layers that grow in offset and blur as they fall in
opacity, all lit from one direction and tinted toward the surface hue, so a raised surface reads
as sitting on the page rather than wearing a grey halo.

## What it is

`box-shadow` takes a comma separated list. MDN: "To specify multiple shadows, provide a
comma-separated list of shadows", and "the first specified shadow is on top". The spec says the
same: "the first shadow is on top and the others are layered behind." A layered shadow puts a
tight, small layer first and adds wider, softer, fainter layers behind it.

Tobias Ahlin's version doubles offset and blur each step at a constant low alpha:
`0 1px 1px`, `0 2px 2px`, `0 4px 4px`, `0 8px 8px`, `0 16px 16px`, each at
`rgba(0,0,0,0.12)`, against his single shadow `0 3px 3px rgba(0,0,0,0.2)`. His sharper variant
lets alpha fall as the layers widen, from 0.25 on the innermost layer to 0.05 on the widest: "the
innermost shadow (with the least offset and blur) has the highest alpha value, and it decreases
with every layer."

Material's own elevation tokens are built the same way. The Material Components web source
defines three layers per level with separate opacities: `$umbra-opacity: 0.2`,
`$penumbra-opacity: 0.14` and `$ambient-opacity: 0.12`. At level 2 (Material 1 gives cards a
resting elevation of 2dp) the three are `0px 3px 1px -2px`, `0px 2px 2px 0px` and
`0px 1px 5px 0px`. Atlassian's light theme tokens use two layers: raised is
`0px 1px 1px #1E1F2140, 0px 0px 1px #1E1F214F`, overlay is
`0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F`.

## Why it works

Material models the light this copies: "Key lights create directional shadows, while ambient
light creates soft shadows from all angles", and "Shadows in the material environment are cast
by these two light sources." A real object on a surface shows both at once, a dark tight shadow
where it nearly touches and a wide faint one around it. One CSS shadow has one blur radius, so it
can be the tight edge or the soft cloud but not both; that follows from the syntax. Josh Comeau:
"By layering multiple shadows, we create a bit of the subtlety present in real-life shadows." His
description of the single shadow default: "The web is covered in fuzzy grey boxes that don't
really look much like shadows."

Height is read from how the shadow changes. Material 1: "The shadow grows softer and larger as
the object's elevation increases" and "grows crisper and smaller as the elevation decreases".
Android's docs: "Views with higher Z values cast larger, softer shadows". Comeau gives the three
moves together: "the offset should increase, the blur radius should increase, and the shadow's
opacity should decrease." Layers give you separate control of each part. Ahlin: layering gives
"more control over the rendering of shadows, and with it we can fine-tune sharpness, distance,
and spread."

Consistency carries the illusion. Comeau: "we should decide on a single light source for all
elements on the page", and if each shadow is made in isolation "it just looks like a bunch of
blurry borders". He also argues for a use beyond looks: "Our attention tends to be drawn to the
elements closest to us", so a higher shadow directs attention. That is his claim, not a measured
result.

Colour matters as much as shape. Comeau: "When we layer black over our background color, it
doesn't just make it darker; it also desaturates it quite a bit." His fix keeps the background's
hue and drops lightness and saturation: on a `hsl(220deg 100% 80%)` background the shadow colour
that reads right is `hsl(220deg 60% 50%)`. Ahlin's own page header uses a tinted dark,
`rgba(16,27,30,0.15)`, not pure black.

## Use it when

- A surface floats above others and the system uses shadows for elevation: menus, popovers,
  dropdowns, dialogs, sheets, toasts, a card that lifts on hover or drag.
- An elevation scale needs steps that read as different heights, not just darker halos. Material
  1 gives menus 8dp and dialogs 24dp; layered tokens let each step change offset, blur and opacity
  together.
- A brochure or editorial piece shows a product screenshot, device or card floating on a tinted
  section, where a black single shadow would grey the section colour.

## Do not use it when

- The brand system is flat by intent. A layered shadow adds depth the system has chosen not to
  have; that is judgment. Material 3 itself moved away from shadow first elevation: Android's docs
  note that "Material3 introduces an elevation approach based on surface color."
- The element is one of many in a dense list, table or grid. Atlassian: "Raised elevations can
  create visual noise, so don't use to group content when a border or white space would suffice",
  and "The shadows and surfaces of raised and overlay elevations can create busy UI if not applied
  intentionally." Cost adds up too. Comeau: "If we layer 5 shadows, our device has to do 5x more
  work!" and "it can slow rendering down on older inexpensive mobile devices"; he adds he has
  "never tried to use dozens or hundreds at the same time". web.dev: "anything that involves a
  blur (like a shadow, for example) takes longer to paint than drawing a red box."
- The element is already separated by a border or a surface colour step. Atlassian: "To create
  flat cards, pair with a border", and "A border is the default approach for scrolled content".
  A stacked shadow on top of a border is a second cue for the same edge (judgment).
- The target is text. `box-shadow` paints around the element's box (the spec: "The shadow is
  drawn outside the border edge only"), not around glyphs, and soft layers behind letters blur the
  edge readers rely on; the second half is judgment.
- The shadow itself would be animated. Ahlin: "Animating a change of box-shadow will hurt
  performance." Comeau: "it's probably a bad idea to try animating a layered shadow." Animate the
  opacity of a pseudo element that carries the bigger stack instead (How: code).
- The theme is dark and the shadow is the only depth cue. Material's Android docs: "Shadows are
  less effective in an app using a dark theme, because they will have less contrast with the dark
  background colors and will appear to be less visible." Lighter surface steps carry depth there
  (see dark-mode-depth); the shadow stays only as support.

## How: code

```css
:root {
  /* shadow colour: the page hue at low lightness, never pure black */
  --shadow-color: 220deg 15% 15%;

  --shadow-raised:            /* card that lifts, resting state */
    0 1px 1px hsl(var(--shadow-color) / 0.14),
    0 2px 4px hsl(var(--shadow-color) / 0.10);
  --shadow-floating:          /* menu, popover, dropdown, lifted card */
    0 1px 1px hsl(var(--shadow-color) / 0.12),
    0 2px 4px hsl(var(--shadow-color) / 0.10),
    0 6px 12px hsl(var(--shadow-color) / 0.08),
    0 12px 24px hsl(var(--shadow-color) / 0.06);
  --shadow-overlay:           /* dialog, sheet */
    0 1px 2px hsl(var(--shadow-color) / 0.12),
    0 4px 8px hsl(var(--shadow-color) / 0.10),
    0 12px 24px hsl(var(--shadow-color) / 0.08),
    0 24px 48px hsl(var(--shadow-color) / 0.08);
}

/* a tinted section re-tints the shadow (Comeau's pattern) */
.section-blue { background: hsl(220deg 100% 80%); --shadow-color: 220deg 60% 50%; }

/* animate a lift without animating box-shadow (Ahlin's pattern) */
.card { position: relative; box-shadow: var(--shadow-raised); }
.card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: var(--shadow-floating);
  opacity: 0;
  transition: opacity 200ms ease-out;
  pointer-events: none;
}
.card:hover::after { opacity: 1; }
```

Every token keeps x at 0 and grows y with blur, so all layers share one light from straight above.
Comeau's alternative puts the light above and slightly left ("It's common for that light source
to be above and slightly to the left"), with "The vertical offset is always 2x the horizontal
one"; either works if the whole product uses one ratio. The token values are mine, built on
Ahlin's doubling with falling alpha, Material's split into a tight and a wide layer, and
Atlassian's two layer tokens. Comeau's tokens set the colour as a custom property and "Every time
I change the background color ... I also change the --shadow-color".

Why the pseudo element works: Ahlin, "There are very few CSS properties that can be animated
without constantly triggering repaints for every frame, namely opacity and transform." web.dev:
"restrict animations to `opacity` and `transform` to keep animations on the compositing stage".
The `::after` layer is transparent, and an outer shadow "is clipped inside the border-box of the
element" (spec), so it never covers the card's content; `pointer-events: none` keeps it from taking
clicks. Ahlin's own version adds `z-index: -1`. An absolutely positioned child sits inside its
containing block's padding box, so on a card with a border set `inset` to minus the border width
so the shadow layer matches the card's outer edge.

If a stack must transition directly, match the layer count and keep inset on the same layers. MDN:
"If the lists of shadows have different lengths, then the shorter list is padded at the end with
shadows whose color is `transparent`", and "If in any pair of shadows, one has `inset` set and the
other does not, the entire shadow list is uninterpolated".

Dark theme: raise the alpha, drop the tint toward black and add a faint light ring on floating
layers. Atlassian's dark overlay token does exactly this:
`0px 0px 0px 1px #BDBDBD1F, 0px 8px 12px #0104045C, 0px 0px 1px 1px #01040480`, a 1px light edge
at about 12% plus near black layers at about 36% and 50%. Its dark raised token uses near black at
about 50% on both layers.

## How: Figma

In the Effects section add one Drop shadow per layer of the stack. Figma: "Each layer can have up
to eight drop shadows". Each has X, Y, Blur and Spread, with colour and opacity set in its fill
("Apply a paint using the color picker and set an opacity for the shadow").

Save each elevation step as an effect style; Figma: "You can also create Styles for shadow and
blur effects." Bind every shadow colour in the style to one colour variable: "you can still apply
color variables to the shadow color." Give that variable a light and a dark value as modes
("each mode stores one value per variable"), so switching a frame's mode under Appearance swaps
the shadow tint with the surfaces. Number variables list "Effects" among the properties they can
drive. After saving a style, open it and confirm every layer of the stack is still in it before
reusing it; that is a working habit, not something the help page states.

Two Figma limits change what translates from code. Spread: "Shadow spread is only supported on
rectangles, ellipses, frames, and components", and a frame or component also needs "Clip content"
on and "A visible fill with at least 1% opacity". Material's negative spread umbra layers and a
1px spread ring like Atlassian's dark overlay will not render on other layer types. Transparency:
by default Figma's drop shadows do not show through transparent areas of a layer, which matches
CSS, where the outer shadow is clipped inside the element's border box.

## Defaults to start from

- Layers: two for a resting card (one tight, one wider), three or four for menus, popovers,
  dialogs and sheets.
- Steps: each layer roughly doubles the offset and blur of the one before (Ahlin); blur equal to
  or twice the y offset.
- Alpha per layer on light surfaces: 0.06 to 0.14 for a tinted dark colour, falling as the layer
  widens; no single layer above 0.25 except a 1 to 2px contact layer, which can go to about 0.3
  (Material's highest is 0.2; Atlassian's light tokens reach about 0.31 only on a 1px blur, zero
  offset ring).
- Colour: the surface hue at 15 to 50% lightness, for example `220deg 15% 15%` on a cool neutral
  page and Comeau's `220deg 60% 50%` on `hsl(220deg 100% 80%)`. Never `#000` above 0.2 alpha.
- Direction: x 0 with y growing, or Comeau's 1 to 2 ratio of x to y, one choice for the whole
  product.
- Dark theme: near black at 0.3 to 0.5, plus a light 1px ring at about 0.12 on floating layers
  (Atlassian's dark tokens), with surface steps doing the main work (dark-mode-depth).

## How it goes wrong

- Layers added without lowering alpha, so the stack reads heavier than the single shadow it
  replaced. Ahlin: "if you increase the number of layers you'll have to decrease the alpha value
  for each layer if you wish to keep the strength somewhat the same."
- Each component tuned by eye with its own direction, so the page has several suns. Comeau: "a
  mess of incongruous shadows".
- Pure black on a coloured section, greying it into a dirty halo (Comeau's desaturation point).
- A `transition: box-shadow` on hover cards, repainting the stack every frame.
- A transition between stacks of different lengths or with inset on one side only, which pads with
  transparent shadows or snaps without animating (MDN).
- The wide layers cut off by a parent. Shadows do not take up space ("Shadows do not influence
  layout", spec), so an ancestor with `overflow: hidden`, or a Figma frame with Clip content on,
  clips them like any other overflowing paint; give the parent padding or move the clip.
- The light theme stack reused unchanged in dark mode, where it nearly vanishes.
- A spread layer that renders in the browser but not on a Figma group or text layer, so design and
  build disagree.

## How to check it

Run over the computed `box-shadow` of every element that has one, outer layers only.

1. Layers: every elevated surface (card that lifts, menu, popover, dropdown, sheet, dialog, toast)
   has two or more layers, and its widest blur is at least three times its tightest (count a 0
   blur as 1px). A lone layer passes only if its blur is 2px or less (a contact shadow).
2. Direction: across all layers on the page, x offsets are all zero or above, or all zero or
   below, and the same holds for y. Layers with a non zero x share one x to y ratio within 10%.
3. Opacity, light theme: no layer with a colour under 30% lightness exceeds 0.25 alpha where its
   blur is over 2px, or 0.35 at any blur. No layer is `rgb(0 0 0)` above 0.2 alpha. Tinted colours
   at 30% lightness or more are judged by eye against the same token on a neutral surface.
4. Tint: on a background with visible chroma, the shadow colour's hue sits within 20 degrees of
   the background's hue.
5. Dark theme: skip check 3. Instead each floating layer has a lighter surface than its parent
   (dark-mode-depth) and either a shadow or a light edge.
6. Motion: no element lists `box-shadow` (or `all` while its shadow changes between states) in
   `transition-property` or in an animation's keyframes.
7. Density: in a list or grid of more than 12 repeated siblings, no sibling carries a blur over
   8px at rest.
8. Figma: every elevated layer uses an effect style from the elevation set, and every shadow
   colour in those styles is bound to the shadow colour variable.

The thresholds in 1, 3, 4 and 7 are my judgment, set so the sourced stacks above (Ahlin's,
Material's and Atlassian's light tokens) pass and a single heavy black shadow such as Ahlin's own
counter example `0 6px 6px rgba(0,0,0,0.4)` fails.

## His take

Not yet given.

## Related

- dark-mode-depth (on dark surfaces lightness carries height and shadows only support it)
- alpha-borders (the border that replaces a shadow on flat cards, and the light edge on dark
  floating layers)
- oklch-palettes (the hue ladder a tinted shadow colour can be taken from)

## Sources

- https://www.w3.org/TR/css-backgrounds-3/#box-shadow : W3C, CSS Backgrounds and Borders Level 3,
  the box-shadow section. First shadow on top, outer shadow drawn outside the border edge only and
  clipped inside the border box, shadows do not influence layout or trigger scrolling.
- https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow : MDN.
  Comma separated multiple shadows, first specified on top, blur and spread definitions, animation
  type "a shadow list", padding of shorter lists with transparent shadows, inset mismatch stops
  interpolation.
- https://m1.material.io/material-design/environment.html : Material Design 1, Environment. Key
  lights and ambient light and the two kinds of shadow they cast.
- https://m1.material.io/material-design/elevation-shadows.html : Material Design 1, Elevation and
  shadows. Shadow grows softer and larger with elevation; resting elevations (cards 2dp, menus
  8dp, dialogs 24dp).
- https://raw.githubusercontent.com/material-components/material-components-web/master/packages/mdc-elevation/_elevation-theme.scss
  : Material Components web, elevation source. Umbra, penumbra and ambient opacities 0.2, 0.14
  and 0.12 and the per level layer values.
- https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md
  : Material Components Android, Dark theme. Shadows less effective on dark backgrounds; surfaces
  lighter at higher elevations.
- https://developer.android.com/develop/ui/views/theming/shadows-clipping : Android developers,
  Create shadows and clip views. Higher Z casts larger, softer shadows; Material 3 elevation based
  on surface colour.
- https://www.joshwcomeau.com/css/designing-shadows/ : Josh W. Comeau, "Designing beautiful
  shadows in CSS", 13 Sep 2021, updated 27 Apr 2026. One light source, offset and blur up and
  opacity down with elevation, layering, the 5x work and animation cautions, colour matched
  shadows and the shadow colour custom property.
- https://tobiasahlin.com/blog/layered-smooth-box-shadows/ : Tobias Ahlin, "Smoother and sharper
  shadows with layered box-shadows", 19 Sep 2019. The doubling stacks, falling alpha for sharper
  shadows, lower alpha per layer as layers are added.
- https://tobiasahlin.com/blog/how-to-animate-box-shadow/ : Tobias Ahlin, "How to animate
  box-shadow with silky smooth performance", 18 Nov 2015. Animating box-shadow hurts
  performance; animate the opacity of a pseudo element carrying the bigger shadow.
- https://web.dev/articles/animations-guide : web.dev, animations guide (Kayce Basques and Rachel
  Andrew). Restrict animation to opacity and transform; blurs such as shadows take longer to
  paint.
- https://atlassian.design/foundations/elevation : Atlassian Design System, Elevation. Pair
  surfaces with shadows, borders for flat cards and scrolled content, raised elevations create
  visual noise, shadows kept in dark mode.
- https://unpkg.com/@atlaskit/tokens@20.14.0/dist/esm/artifacts/themes/atlassian-light.js and
  https://unpkg.com/@atlaskit/tokens@20.14.0/dist/esm/artifacts/themes/atlassian-dark.js :
  Atlassian design tokens package, version 20.14.0. The raised, overlay and overflow shadow values
  in light and dark themes.
- https://help.figma.com/hc/en-us/articles/360041488473 : Figma help, Apply shadow or blur
  effects. Up to eight drop shadows per layer, the shadow settings, spread limited to rectangles,
  ellipses, frames and components with clip content and a fill, shadows hidden behind transparent
  areas by default, effect styles.
- https://help.figma.com/hc/en-us/articles/15343107263511 : Figma help, Apply variables to
  designs. Colour variables on shadow colours; Effects among number variable properties.
- https://help.figma.com/hc/en-us/articles/15343816063383 : Figma help, Modes for variables. One
  value per mode, switching a frame's mode under Appearance.
