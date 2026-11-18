# Masked edges

- id: masked-edges
- kind: technique
- surfaces: product-ui, brochure, editorial
- layers: layout, interaction, state
- default: yes for the method (any edge fade is made with a mask); whether to fade at all stays a choice
- captured from: charles.unemployed, "10 niche design hacks" (no. 6)
- researched: 18 Nov 2026
- confidence: high on the CSS and the overlay comparison, medium on the scroll driven version while its support is new

## In one line

Fade the edge of a scrolling row, marquee or clipped text by masking the content itself with a
gradient, not by painting a background coloured gradient over it, so the fade works on any
surface.

## What it is

`mask-image` takes an image, gradients included, and uses it to hide parts of the element it is
set on. For a gradient the mask uses the alpha channel: MDN puts it as "element areas masked by
opaque sections of the `mask-image` will be rendered, while areas masked by transparent image
sections are hidden." A `linear-gradient` that runs from `transparent` to `black` therefore makes
the content itself go from invisible to fully visible across that band. The colour named in the
gradient does not matter, only its alpha.

The overlay version does something different: it places a pseudo element over the edge, filled
with a gradient from transparent to the page colour. That only looks like a fade while the colour
behind matches. Chrome's guidance on soft edges says masking "is superior to using a
semi-transparent overlay because it actually fades the content itself, allowing the background
to show through naturally without interfering with text selection or pointer events", and that
an overlay "requires knowing the background color".

## Why it works

A clean cut at the edge of a scroller reads as the end of the content. A fade reads as content
continuing, which is the hint that the row scrolls. Chrome's scrollability guide says items cut
off by a fade read as "more of the same". Because a mask makes pixels transparent rather than
covering them, the same rule holds on a photo, a gradient, a translucent sheet and both themes:
the guide notes that a mask "works on any background". An overlay has to be repainted for every
surface and breaks the moment the surface is an image.

## Use it when

- A horizontal row of chips, tabs, cards or logos scrolls past the container edge. Chrome's guide
  picks a fade over a shadow for horizontal rows.
- The row sits on an image, gradient, translucent or themed surface where no single overlay colour
  matches.
- The scroller has no visible border; the guide notes a fade "needs no edge to tuck content
  under".
- A logo marquee loops and the items should appear and disappear softly at both ends.
- Clipped text such as a preview teaser needs a soft cut, as long as the full text is one tap
  away.

## Do not use it when

- People must read right up to the edge: long text, tables and forms. Chrome's guide picks a
  shadow for these because "a fade makes content near the edge hard to read".
- The scroller sits under fixed chrome such as a dialog header or sticky table header. The guide
  picks a shadow there.
- The fade is the only sign that more text exists and there is no way to reveal it. My judgment:
  a mask changes painting only, so the hidden part is still in the page for a screen reader but
  out of reach for a sighted reader. Pair a text fade with an expand control.
- The fade shows when everything already fits. A static fade then dims the first and last items
  for no reason; make it conditional (see How: code).
- The scrollbar is hidden and the fade is the only cue. Chrome's guide says that in this case the
  hint must reach 3:1 contrast against adjacent colours (WCAG 1.4.11).

## How: code

Static fade on one or both ends. The colour in the gradient only supplies alpha.

```css
.row {
  overflow-x: auto;
  -webkit-mask-image: linear-gradient(to right, transparent, black 3rem, black calc(100% - 3rem), transparent);
          mask-image: linear-gradient(to right, transparent, black 3rem, black calc(100% - 3rem), transparent);
}
```

For a marquee, put the mask on the still wrapper and animate the track inside it. The mask is
positioned against the box it is set on (`mask-origin` starts at `border-box` in the spec), so a
mask on the moving track would travel with the items.

```css
.marquee {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}
.marquee > .track { animation: slide 30s linear infinite; }
```

Fade only where there is more to scroll. Chrome's scrollability guide builds the mask as an
opaque layer minus two gradient bands and grows each band with a scroll driven animation on the
scroller's own position. "When the content fits, the scroll timeline is inactive and there is no
fade." Masking only the bands also keeps the scroller's focus outline visible, which a single
gradient clipped to the border box would hide. The guide's code for a horizontal row, condensed,
with the scroll padding it recommends added:

```css
@property --fade-start { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --fade-end   { syntax: "<length>"; inherits: false; initial-value: 0px; }

.scroller {
  overflow-x: auto;
  --fade-size: 3rem;
  --fade-dir: right; --fade-start-pos: 0; --fade-end-pos: 100%;
  mask:
    linear-gradient(black, black) no-clip subtract,
    linear-gradient(to var(--fade-dir), black, transparent) var(--fade-start-pos) 0 / var(--fade-start) 100% no-repeat no-clip,
    linear-gradient(to var(--fade-dir), transparent, black) var(--fade-end-pos) 0 / var(--fade-end) 100% no-repeat no-clip;
  animation: reveal-fade-start linear both, hide-fade-end linear both;
  animation-timeline: scroll(self inline);
  animation-range: 0 var(--fade-size), calc(100% - var(--fade-size)) 100%;
  scroll-padding-inline: var(--fade-size);
  &:dir(rtl) { --fade-dir: left; --fade-start-pos: 100%; --fade-end-pos: 0; }
}
@keyframes reveal-fade-start { to   { --fade-start: var(--fade-size); } }
@keyframes hide-fade-end     { from { --fade-end: var(--fade-size); } }
```

Points from the guide: the two custom properties must be registered with `@property` or the
fades jump; `scroll-padding-inline` set to the fade size keeps snapped and focused items out of
the fade; gradient directions are physical, so right to left content flips them. Where
`animation-timeline` is unsupported the custom properties stay at their 0px initial value, so the
fade never shows; the guide offers a fallback built on `IntersectionObserver`.

Support and side effects:
- MDN lists `mask-image` as Baseline widely available, "available across browsers since December
  2023". caniuse shows unprefixed support from Chrome and Edge 120, Safari 15.4 and Firefox 53,
  with earlier versions as partial support. Chrome's soft edge guide still writes
  `-webkit-mask-image` alongside the standard property for older browsers; it costs one line.
- MDN marks `animation-timeline` as Baseline 2026, newly available since October 2026, so treat
  the conditional fade as an enhancement on top of a working scroller.
- In the masking spec a `mask-image` other than `none` creates a stacking context, the same way
  opacity below 1 does, and "has no effect on the geometry or hit-testing of any element's CSS
  boxes". Faded items stay clickable and keep their layout.
- Keyboard reach: Chrome's blog says scrollers become keyboard focusable by default if they have
  no focusable children, a change it gives as Chrome 130 and then as pushed back to Chrome 132.
  The same post recommends `tabindex="0"` when you want the scroller itself focusable. A row of
  plain images needs it in browsers without that behaviour; my judgment is to add it.

## How: Figma

Figma's masks support alpha: its help page says "All masks in Figma support alpha channels" and
lists fills, strokes and gradients with varying opacity as ways to shape a mask. So: draw a
rectangle the size of the visible row, fill it with a linear gradient from 0% opacity at each edge to 100% inside, place it below the
row's layers (Figma positions masks below the layers they mask) and choose Use as mask (Ctrl Alt M
on Windows, Control Command M on Mac). Because the fade lives in the mask, the frame behind can
be swapped for an image or a dark theme without redrawing it. A static frame shows one scroll position, so my
practice is to draw the conditional states as separate frames: start (fade on the end only),
middle (both) and fits (none).

## Defaults to start from

- Horizontal row: fade size 3rem (48px at a 16px root), the example value in Chrome's guide.
- Marquee: transparent to black over the outer 10% on each side.
- Vertical text teaser: opaque to 80%, transparent at 100%, the values in Chrome's soft edge
  example.
- Gradient goes from `transparent` to `black`. Any opaque colour works, but black reads as
  intent in code review.

These are starting values, not measured optima; check that the first item in the row is still
recognisable inside the fade.

## How it goes wrong

- An overlay in the page colour, which shows as a grey or white smear in dark mode or over an
  image.
- A static fade that sits on a row which fits, dimming the first and last items.
- The mask on the animated marquee track, so the fade slides along with the logos.
- A single full gradient mask on a focusable scroller that clips its focus ring.
- Body text faded at the bottom with no expand control, so the rest cannot be read.
- Snap points or focused items that land inside the fade because `scroll-padding` was not set.

## How to check it

For every edge fade in the build: it is made with `mask-image` or `mask` (no pseudo element
gradient in a background colour, unless it sits inside an `@supports not` fallback); the fade is
absent when the content fits (resize until it fits and look); on a marquee the mask is on the
element that does not move; the scroller can be reached and scrolled with the keyboard and its
focus ring is visible; long text or tables use a shadow or a hard edge instead; switch the theme
and the surface, and the fade still matches.

## His take

Not yet given.

## Related

- dynamic-viewport (another mobile layout rule in this batch)
- scroll-shadows (the shadow alternative from the same Chrome guide, not yet researched)

## Sources

- https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image : MDN. Definition, gradients as
  mask images, alpha versus luminance through `mask-mode`, Baseline widely available since
  December 2023.
- https://www.w3.org/TR/css-masking-1/ : W3C CSS Masking Module Level 1, Candidate Recommendation
  Draft, 5 August 2021. Mask value is the alpha channel, `mask-image` creates a stacking context
  and has no effect on geometry or hit testing, `mask-origin` and `mask-clip` start at
  `border-box`.
- https://developer.chrome.com/docs/modern-web-guidance/guides/visual-design/soft-edge-content-fade :
  Chrome Modern Web Guidance. Mask versus overlay, the `-webkit-` line, the 80% and 10% example
  gradients, the overlay fallback and its need to know the background colour.
- https://developer.chrome.com/docs/modern-web-guidance/guides/ui-atoms/scrollability-affordance-hints :
  Chrome Modern Web Guidance. Fade versus shadow, the conditional scroll driven mask, focus
  outline, `scroll-padding`, right to left, the 3:1 rule when the scrollbar is hidden and the
  `IntersectionObserver` fallback.
- https://caniuse.com/css-masks : caniuse. Unprefixed versions per browser, partial support before
  them.
- https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline : MDN. Baseline 2026, newly
  available since October 2026.
- https://developer.chrome.com/blog/keyboard-focusable-scrollers : Chrome blog. Scrollers keyboard
  focusable by default when they have no focusable children, version 130 then 132, `tabindex`
  advice.
- https://help.figma.com/hc/en-us/articles/360040450253 : Figma help, Masks. Alpha masks,
  gradients with varying opacity, masks sit below masked layers, the Use as mask command and
  shortcut.
