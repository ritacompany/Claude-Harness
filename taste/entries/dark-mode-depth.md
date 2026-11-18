# Dark mode depth

- id: dark-mode-depth
- kind: rule
- surfaces: product-ui, brochure
- layers: colour, shape, state
- default: yes, whenever a dark theme stacks surfaces (cards, sheets, menus, popovers, modals)
- captured from: charles.unemployed, "10 niche design hacks" (no. 8)
- researched: 18 Nov 2026
- confidence: high on the principle (Material, Apple and Atlassian agree), medium on exact step values

## In one line

In a dark theme, show height with lightness: a dark grey base, each raised layer a step lighter,
shadows kept only as a supporting cue and a border where two steps sit too close to tell apart.

## What it is

On a light background a drop shadow is a dark shape on a light field, so it reads. On a dark
background the same shadow has almost nothing to darken. Material's Android documentation says
it directly: "Shadows are less effective in an app using a dark theme, because they will have
less contrast with the dark background colors and will appear to be less visible." Its answer was
that surfaces "become lighter and more colorful at higher elevations, when they are closer to the
implied light source".

Three systems implement the same idea differently:

- Material, first version: a semi-transparent overlay composited on the surface, with an alpha
  that rises with elevation. The library's formula is `(4.5 x ln(1 + elevation in dp) + 2) / 100`,
  which gives about 5% at 1dp, 8% at 3dp, 11% at 6dp, 12% at 8dp, 15% at 16dp and 16% at 24dp.
  Material 3 themes set the overlay colour to the primary colour.
- Material 3: the overlays are replaced by fixed tonal surface roles. In the dark scheme the
  documented tones are background and surface 6, surface container lowest 4, low 10, container
  12, high 17, highest 22 and surface bright 24.
- Apple: two sets of background colours, base and elevated. "The base colors are dimmer, making
  background interfaces appear to recede, and the elevated colors are brighter, making foreground
  interfaces appear to advance." The switch is automatic when an interface comes to the
  foreground, such as a popover or modal sheet.

Atlassian's elevation tokens follow the same light model: "the higher the elevation, the lighter
the surface looks", with raised and overlay surfaces lighter in dark mode, and sunken surfaces
that darken in both modes.

## Why it works

It keeps the physical metaphor that shadows carry in light mode, a light source in front of the
interface, and moves the cue to the one channel that still has range on a dark screen: surface
lightness. A layer nearer the viewer catches more light, so it is lighter. Avoiding pure black
gives the scale room at the bottom. Material's Android docs: dark grey "instead of black, which
increases visibility for shadows and also reduces eye strain for light text". Ondrej Pesicka's
practitioner guide (Atmos) makes the same case: "Choose dark grays for your default surface
color", and "Another advantage is that you will be able to use shadows on dark gray surfaces."

## Use it when

- A dark theme has more than one surface level: page, cards, sheets, menus, popovers, dialogs.
- A product ships light and dark themes from one set of components: define elevation as surface
  roles that switch per theme, not as a shadow alone.
- A dark brochure section holds cards or panels that need to read as lifted off the page.

## Do not use it when

- The area is meant to read as recessed, such as a well, an input track or a code block. Lighter
  means nearer; a recessed area goes darker, as Atlassian's sunken token does in both modes.
- The design is light. Light surfaces have no room to get lighter, so shadows carry elevation
  there; this rule is the dark theme half of an elevation system, not a replacement for it.
- Shadows would be dropped entirely on floating layers. Atlassian keeps them: "Raised and overlay
  surfaces are still paired with shadows for added depth and consistency in dark mode." Lightness
  replaces the shadow as the main cue, not as the only one.
- The levels multiply. Steps a few points of lightness apart stop being distinguishable past a
  handful; that is a judgment, but it is why Material 3 settles on a small fixed set of container
  roles rather than a continuous scale.
- The surface is a full screen media viewer. Apple notes an immersive media app can use a
  permanently dark appearance so the UI recedes; there the content is the top layer and the
  chrome should stay as dark as the base.

## How: code

```css
:root { color-scheme: light dark; }

@media (prefers-color-scheme: dark) {
  :root {
    --surface-0: #121212;                                   /* page */
    --surface-1: color-mix(in srgb, white 5%, #121212);    /* card, about 1dp */
    --surface-2: color-mix(in srgb, white 8%, #121212);    /* raised card, about 3dp */
    --surface-3: color-mix(in srgb, white 11%, #121212);   /* menu, popover, about 6dp */
    --surface-4: color-mix(in srgb, white 15%, #121212);   /* sheet, about 16dp */
    --surface-5: color-mix(in srgb, white 16%, #121212);   /* dialog, about 24dp */
    --edge: rgb(255 255 255 / 0.08);
    --shadow-overlay: 0 8px 24px rgb(0 0 0 / 0.5);
  }
}

body    { background: var(--surface-0); }
.card   { background: var(--surface-1); border: 1px solid var(--edge); }
.menu   { background: var(--surface-3); box-shadow: var(--shadow-overlay); }
.dialog { background: var(--surface-5); box-shadow: var(--shadow-overlay); }
```

The percentages are Material's overlay formula with a white overlay in place of the primary
colour; a primary tint is the Material 3 overlay default and suits a branded theme. `color-mix()`
with two percentages mixes in the named colour space and has been Baseline across browsers since
May 2023 (MDN). The base `#121212` is the default dark background and surface colour in Material's
Android library. The border on cards and the shadow on menus and dialogs are judgment: a border
for flat cards follows Atlassian's "To create flat cards, pair with a border", and the shadow
follows Atlassian's pairing of raised and overlay surfaces with shadows.

## How: Figma

Make one colour variable collection with a Light and a Dark mode and a variable per surface step
(surface 0 to 5), plus an edge colour and a shadow colour. Bind each layer's fill to its step and
shadow effect colours to the shadow variable; Figma lets colour variables drive fills, strokes and
shadow colours. Check depth by switching a frame to the Dark mode (Appearance, Apply variable
mode); a frame left on Auto takes its parent's mode. A dark frame where every layer uses the same
fill and depth comes only from drop shadows is the failure this rule catches.

## Defaults to start from

- Base: `#121212` (Material's Android default), never `#000000` for the page.
- Steps: white over the base at 5, 8, 11, 15 and 16% (Material's formula at 1, 3, 6, 16 and
  24dp), or Material 3's dark tones 6, 10, 12, 17 and 22 if the system is built on Material
  tonal palettes.
- Edge on flat cards and between close steps: white 6 to 10% (judgment; see alpha-borders).
- Shadows on menus, popovers and dialogs kept, darker and larger than in light mode (judgment).
- Text on every step: at least 4.5:1, aiming for 7:1 on custom colours, as Apple asks.

## How it goes wrong

- A light theme flipped to dark by inverting colours, so higher layers come out darker and read
  as holes. Apple notes dark mode colours are not simply inversions of the light ones.
- Pure black page with dark grey cards and black shadows: the shadows have nothing to fall on.
- Steps so close that a menu over a card looks like one surface; add the edge or widen the step.
- Lighter surfaces lowering text contrast on the top layers, especially secondary text.
- Sunken areas drawn lighter, so a well reads as raised.
- Brand coloured overlays applied heavily, so high surfaces tint visibly toward the brand colour.

## How to check it

In the dark theme, list every surface in stacking order (page, card, raised card, menu or
popover, sheet, dialog). Pass if: the page is not `#000000`; each layer's surface is lighter than
the one directly below it, or equal with a visible border; recessed areas are darker than their
parent; floating layers (menus, popovers, dialogs) have a shadow or an edge; and secondary text on
the lightest surface still meets 4.5:1.

## His take

Not yet given.

## Related

- alpha-borders (the edge used between close steps and on flat cards)
- multiply-blending (fails on dark surfaces; needs its own dark mode rule)
- concentric-radius (nested surfaces at different steps still need matching corners)

## Sources

- https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md
  : Material Components for Android, Dark theme. Shadows less effective on dark backgrounds,
  surfaces lighter at higher elevations, dark grey instead of black, elevation overlays and their
  replacement by tonal surface colours.
- https://github.com/material-components/material-components-android/blob/master/docs/theming/Color.md
  : Material Components for Android, Color theming. The tonal surface roles and their dark tones;
  overlays replaced and no longer maintained; Material 3 sets the overlay colour to primary.
- https://github.com/material-components/material-components-android/blob/master/lib/java/com/google/android/material/elevation/ElevationOverlayProvider.java
  : the overlay alpha formula (multiplier 4.5, offset 2, natural log of 1 plus elevation in dp).
- https://github.com/material-components/material-components-android/blob/master/lib/java/com/google/android/material/color/res/values/colors.xml
  : `#121212` as the default dark background and surface colour.
- https://developer.apple.com/design/human-interface-guidelines/dark-mode : Apple HIG, Dark Mode.
  Base and elevated background sets, automatic switch for popovers and modal sheets, contrast of
  at least 4.5:1 and 7:1 for custom colours, colours not simple inversions, immersive media apps.
  The page renders with JavaScript; its text is at
  https://developer.apple.com/tutorials/data/design/human-interface-guidelines/dark-mode.json
- https://atlassian.design/foundations/elevation : Atlassian Design System, Elevation. Lighter
  surfaces at higher elevation, raised and overlay surfaces still paired with shadows in dark
  mode, sunken surfaces darken in both modes, flat cards paired with a border.
- https://atmos.style/blog/dark-mode-ui-best-practices : Ondrej Pesicka, Atmos, 8 Oct 2022
  (updated 20 Jul 2023). Practitioner guide: dark greys over pure black, lighter surfaces the
  higher they sit, shadows usable on dark grey.
- https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix : MDN, `color-mix()`
  syntax and Baseline since May 2023.
- https://help.figma.com/hc/en-us/articles/15343816063383 and
  https://help.figma.com/hc/en-us/articles/15343107263511 : Figma help, Modes for variables
  (light and dark modes, Apply variable mode, Auto inherits the parent) and Apply variables to
  designs (colour variables on fills, strokes and shadow colours).
