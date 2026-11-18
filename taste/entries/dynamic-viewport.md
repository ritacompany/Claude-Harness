# Dynamic viewport

- id: dynamic-viewport
- kind: rule
- surfaces: product-ui, brochure, editorial
- layers: layout, state
- default: yes, whenever a web element is sized to the viewport height and the page runs in mobile browsers
- captured from: charles.unemployed, "10 niche design hacks" (no. 9)
- researched: 18 Nov 2026
- confidence: high on the definitions and support, medium on the per pattern picks, which are judgment built on the spec's trade offs

## In one line

On mobile, `100vh` is the height with the browser bars hidden, so a full height block overflows
when they show. Size heroes with `svh` and things that must always fit (sheets, app shells) with
`dvh`; keep `lvh` for backdrops that may be partly covered.

## What it is

Mobile browsers show and hide their address bar and toolbar as the page scrolls, so the viewport
has more than one height. CSS Values and Units Level 4 names three:

- Large viewport, `lv*` units: "the viewport sized assuming any UA interfaces that are
  dynamically expanded and retracted to be retracted". The plain `v*` units (`vh`, `vw`) are
  defined against this same large size, and the spec says this mapping is "presumed to be
  required for Web compatibility". MDN: "Currently, all default viewport units (`vh`, `vw`,
  etc.) are equivalent to their large viewport counterparts."
- Small viewport, `sv*` units: the viewport sized with those interfaces expanded. Stable unless
  the viewport itself is resized.
- Dynamic viewport, `dv*` units: sized "with dynamic consideration" of the interfaces, so it
  tracks what is showing. web.dev says its values are "clamped between their `lv*` and `sv*`
  counterparts". Not stable even while the viewport is unchanged.

Each size comes in the full set: `svw svh svi svb svmin svmax`, the same with `lv` and with `dv`.
`vi` and `vb` are 1% of the viewport in the inline and block axis, so they follow the writing
mode.

## Why it works

Because `vh` is the large size, a `100vh` block is taller than the screen whenever the bars are
showing, which is the state a page loads in. web.dev: "elements sized to be `100vh` tall will
bleed out of the viewport." Ahmad Shadeed's tests show a hero's bottom element "blurred
underneath the address bar UI in iOS Safari and cropped in Android browsers", and a `100vh`
modal whose bottom part is invisible. The fix is to say which height you mean. The spec spells
out the trade: large units may be "hidden behind such interfaces when they are expanded"; small
units "will fill the screen perfectly, without any of its content being obscured" but leave
"extra space" once the bars hide and are "safer in general"; dynamic units fit exactly but "can
cause content to resize e.g. while the user scrolls the page", which "can be disturbing to the
user and/or costly in terms of performance".

## Use it when

- A hero or splash fills the first screen: `100svh`, so its bottom content and call to action
  are visible on load. This is Ahmad Shadeed's fix for the hero case.
- A full screen modal, bottom sheet or app shell with a bar pinned to the bottom must always fit:
  `100dvh`, so the bottom actions are never under the toolbar. Shadeed offers `svh` or `dvh` for
  the modal; my pick is `dvh` where the content is short enough that a resize is not noticed, and
  `svh` where a jump would move what someone is reading.
- A decorative backdrop, video or colour field must never show a gap when the bars hide:
  `100lvh`. Being covered at the bottom costs nothing there.
- The same split applies to width (`svw`, `dvw`, `lvw`) and to the logical `vi`/`vb` forms.

## Do not use it when

- Type, spacing or anything inside reading flow. Shadeed: dvh "will change as you scroll, so it
  might create a confusing experience when used for stuff like `font-size`". My judgment extends
  that to padding and gaps.
- A long scrolling page whose content would reflow as the bars move. Use `svh` or no viewport
  unit; `dvh` there is the "disturbing" case the spec warns about.
- The problem is the on-screen keyboard. The spec says on-screen keyboards typically overlay
  content and have no effect on viewport units, and web.dev says the keyboard "is not considered
  part of the UA UI". Since Chrome 108 on Android the keyboard resizes only the visual viewport,
  so `dvh` will not lift a form above it. Chrome's opt in is the viewport meta key
  `interactive-widget=resizes-content`.
- The problem is a notch, rounded corners or the home indicator. That is the safe area, handled
  with `env(safe-area-inset-*)`, not with these units (see safe-area).
- Desktop only surfaces. My judgment: there are no retracting bars, so the three sizes match and
  the choice does not matter.

## How: code

```css
/* First screen: fits with the bars showing, may leave a gap when they hide */
.hero { min-height: 100vh; min-height: 100svh; }

/* Must always fit: tracks the bars */
.sheet {
  position: fixed; inset-inline: 0; bottom: 0;
  max-height: 100vh; max-height: 100dvh;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.app { min-height: 100vh; min-height: 100dvh; display: grid; grid-template-rows: auto 1fr auto; }

/* Backdrop: never shows a gap, may be covered */
.backdrop { position: fixed; inset: 0 0 auto 0; height: 100lvh; }
```

The `100vh` line before each new unit is a fallback: a browser that does not know the unit drops
that declaration and keeps the one before it. Use `min-height` for a hero so long content can
still grow past the screen.

Support: caniuse lists the small, large and dynamic units in Chrome and Edge 108, Safari and iOS
Safari 15.4, Firefox 101 and Samsung Internet 21. It put global usage at about 96% when checked
on 18 Nov 2026. web.dev's announcement says Chrome 108 joined Safari and Firefox, which already
had them; WebKit announced them in Safari 15.4 on 14 March 2022.

Layout shift: dynamic units do not update smoothly. web.dev: "The values for the dynamic viewport
do not update at 60fps. In all browsers updating is throttled as the UA UI expands or retracts."
The spec lets a browser skip animating them during the bar animation and recommends assuming the
fully retracted size while it runs. So a `dvh` box changes height in a step after the bars
settle, and anything laid out below or inside it moves with it.

Safe area: `env(safe-area-inset-bottom)` is the distance from the viewport edge where content
could be cut off by a non rectangular display; MDN says the values are `0` on a rectangular
viewport and gives the second argument as the fallback. A bottom bar sized with `dvh` still needs
this padding on phones with a home indicator.

## How: Figma

A Figma frame has one height, so draw each full height mobile web screen at two heights: the
small viewport (bars showing) and the large viewport (bars hidden), with the toolbar heights
measured from a screenshot of the target browser on the target device. Check that the hero's
call to action sits inside the small height and that the backdrop has no gap at the large
height. For a bar pinned to the bottom in a prototype, set Prototype, Scroll behavior, Position
to Fixed; Figma's help: "Fixed objects don't move, even as you scroll up and down." Hand the unit
choice (`svh`, `dvh` or `lvh`) to build as an annotation on the frame, since the frame itself
carries only a pixel height.

## Defaults to start from

- Hero, splash, first screen: `min-height: 100svh`.
- Full screen modal, bottom sheet, app shell with a pinned bar: `100dvh`.
- Fixed backdrop image, video or colour: `100lvh`.
- Bottom bars: add `padding-bottom: env(safe-area-inset-bottom, 0px)`.
- Never: font size, padding or gap in any `dv*` unit.

## How it goes wrong

- `height: 100vh` on a mobile hero, with the call to action under the toolbar on load.
- `dvh` on a long page section, so the page jumps in a step as the bars hide.
- `dvh` used to keep a form above the on-screen keyboard, which it does not do.
- `height` instead of `min-height` on a hero, clipping content on short screens or with large
  text settings.
- A bottom bar fixed in `dvh` but missing the safe area inset, sitting on the home indicator.

## How to check it

Search the CSS for `vh`, `vw`, `vi`, `vb`, `vmin` and `vmax` with no `sv`, `lv` or `dv` prefix on
any rule that sizes to the full screen; each needs a reason. No `dv*` unit on `font-size`,
`padding`, `margin` or `gap`. Then on a real phone in Safari and Chrome: load the page with the
bars showing and confirm the hero's bottom content is visible; scroll until the bars hide and
confirm no backdrop gap; open each sheet and modal in both states and confirm its bottom action
is visible and clear of the home indicator.

## His take

Not yet given.

## Related

- safe-area (insets for notches, rounded corners and the home indicator, not yet researched)
- masked-edges (another mobile scroller rule in this batch)

## Sources

- https://www.w3.org/TR/css-values-4/ : W3C CSS Values and Units Level 4, Working Draft 12 March
  2024, section 6.1.2. Large, small and dynamic viewport definitions, default units map to the
  large viewport, the warning on dynamic units, UAs may skip animating them, on-screen keyboards
  typically overlay without changing the units, `vi` and `vb`.
- https://developer.mozilla.org/en-US/docs/Web/CSS/length : MDN. Viewport unit variants, all
  default units equal their large counterparts, small units "safer", dynamic units can cause a
  performance hit.
- https://web.dev/blog/viewport-units : Bramus, web.dev. Why `100vh` bleeds out on mobile, the
  three viewports, dynamic values clamped and throttled, keyboard not part of the UA UI, Chrome
  108 support.
- https://webkit.org/blog/12445/new-webkit-features-in-safari-15-4/ : WebKit, 14 March 2022. The
  new units shipped in Safari 15.4.
- https://ishadeed.com/article/new-viewport-units/ : Ahmad Shadeed, 8 July 2023. Hero and modal
  failures with `100vh`, `svh` for the hero, `svh` or `dvh` for the modal, `dvh` on `font-size`.
- https://caniuse.com/viewport-unit-variants : caniuse. Versions per browser and global usage.
- https://developer.chrome.com/blog/viewport-resize-behavior : Bramus, Chrome blog. Chrome 108 on
  Android resizes only the visual viewport for the keyboard; the `interactive-widget` values.
- https://developer.mozilla.org/en-US/docs/Web/CSS/env : MDN. `safe-area-inset-*` definition and
  the fallback argument.
- https://help.figma.com/hc/en-us/articles/360039818734 : Figma help, Prototype scroll and
  overflow behavior. Scroll with parent, Fixed and Sticky positions.
