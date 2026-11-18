# Multiply blending

- id: multiply-blending
- kind: technique
- surfaces: product-ui, brochure, editorial, graphic
- layers: image, colour
- default: no, opt in for images with a white background on a light tinted surface
- captured from: charles.unemployed, "10 niche design hacks" (no. 10)
- researched: 16 Nov 2026
- confidence: high on the maths and code, high on the dark mode limit

## In one line

Set an image with a white background to multiply and its white drops out, so the object sits on
the card colour instead of in a white box.

## What it is

Multiply is a blend mode: each pixel's colour is multiplied by the colour behind it. The W3C
compositing spec defines it as `B(Cb, Cs) = Cb x Cs` and states the two facts that matter here:
"Multiplying any color with black results in black. Multiplying any color with white preserves
the original color." So a white pixel takes on the backdrop colour exactly, and every other pixel
gets darker by the backdrop. web.dev puts it plainly: "White pixels will appear transparent, and
black pixels will appear black."

## Why it works

Product shots and scans often arrive on white. Dropped on a tinted card, the white rectangle
breaks the surface and makes the layout look assembled from parts. Multiply removes the box
without anyone cutting the image out, so a grid of mixed photos reads as one surface. The same
mechanism suits graphic work: ink textures, scanned paper, halftone and line art laid over colour.

## Use it when

- Photos or illustrations on pure or near white backgrounds sit on a light, tinted surface.
- Scanned marks, textures or line work should sit in a colour field like printed ink.
- Several images from different sources need to sit on one surface.

## Do not use it when

- The surface is dark. Multiply always darkens: on a dark card the whole image goes muddy and
  dark parts of the product vanish. Figma's help describes multiply as "always producing
  a darker result". GitLab's design system hit this with dark mode buttons.
  In dark mode switch the blend off and use a cut out image instead.
- The image's own colour must stay exact (brand photography, skin tones, a colour picker). Every
  pixel is tinted by the surface behind it.
- The image background is off white or textured. Only pure white disappears completely; a light
  grey background leaves a visible box.
- Text or controls sit behind the image within the same stacking context; they will blend too.

## How: code

```css
.product-card { background: #efe7da; isolation: isolate; }
.product-card img { mix-blend-mode: multiply; }
@media (prefers-color-scheme: dark) {
  .product-card img { mix-blend-mode: normal; }
}
```

`mix-blend-mode` blends an element with whatever sits behind it in its stacking context (MDN), and
it has worked across browsers since January 2020. `isolation: isolate` on the card makes the card
its own stacking context so the image blends only with the card, not with the page behind it.
Use `background-blend-mode` instead when blending an element's own background layers.

## How: Figma

Select the image layer and set its layer blend mode to Multiply. Figma applies blend modes to a
whole layer, to individual fills and to some effects. A parent frame or group set to Pass through
lets the child's blend reach the layers below the parent.

## Defaults to start from

Card surface light enough that the product stays readable; check the darkest product colour
against the surface after blending. Pair every multiply image with a dark mode rule.

## How it goes wrong

- Shipped without a dark mode rule, so dark mode shows dim, muddy products.
- Used on off white images, leaving a faint box that looks like a mistake.
- Used where colour accuracy matters.

## How to check it

For every image with `mix-blend-mode: multiply` (or Figma layer blend Multiply): its surface is
light, the image background is pure white and a dark mode rule turns the blend off or swaps the
image.

## His take

Not yet given.

## Related

- grainy-gradients, halftone, paper-texture (graphic overlays that use the same blend, not yet
  researched)
- dark-mode-depth (not yet researched)

## Sources

- https://www.w3.org/TR/compositing-1/ : W3C Compositing and Blending Level 1, section 10.1.2
  (multiply formula, white preserves, black gives black) and section 3.4.2 (isolation creates a
  stacking context).
- https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode : MDN. Definition, blends with
  the backdrop in the same stacking context, creates a stacking context, `background-blend-mode`
  for an element's own layers, available across browsers since January 2020.
- https://web.dev/learn/css/blend-modes : web.dev Learn CSS. White pixels appear transparent
  under multiply; `isolation: isolate` stops blending with the backdrop.
- https://help.figma.com/hc/en-us/articles/360040667874 : Figma help. Where blend modes apply
  (layer, fill, effects), multiply always darkens, pass through on parents.
- https://gitlab.com/gitlab-org/gitlab-services/design.gitlab.com/-/issues/1853 : GitLab design
  system issue. Multiply "will always create a darker color", which fails in dark mode.
