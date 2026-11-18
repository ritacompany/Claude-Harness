# Concentric radius

- id: concentric-radius
- kind: rule
- surfaces: product-ui, brochure, editorial
- layers: shape, layout
- default: yes, whenever a rounded shape sits inside another rounded shape
- captured from: charles.unemployed, "10 niche design hacks" (no. 1) and "20 ways to unslop AI designs" (no. 14, "inner radius = outer minus padding")
- researched: 16 Nov 2026
- confidence: high on the formula, medium on where to stop following it

## In one line

When a rounded shape sits inside another, give it the outer radius minus the gap between them, so
both curves share a centre and the gap stays even around the corner.

## What it is

Each rounded corner is a quarter circle. If the inner shape copies the outer radius, the two arcs
have different centres and the gap between them is wider at the corner than along the straight
edges. Subtracting the gap from the outer radius puts both arcs on the same centre point, so the
band between them keeps one width all the way round. Cloud Four writes it as
`outerRadius - gap = innerRadius`. Apple's WWDC25 design system session names it as one of three
shape types: fixed, capsule and concentric, where "concentric shapes calculate their radius by
subtracting padding from the parent's".

## Why it works

An even band reads as one deliberate object: a card holding its content. An uneven band reads as
two unrelated shapes stacked by accident. The corners give it away, since that is where the gap
swells. Apple's advice for nested containers: "If something feels off, the
answer is simple. Its shape probably needs to be concentric."

## Use it when

- An image, button or inner panel sits inside a rounded card, sheet, modal or device frame.
- A focus ring or selection outline wraps a rounded control (the ring is the outer shape).
- A component appears both nested and alone: give it the concentric value when nested and a
  fixed fallback radius when alone (Apple calls this a concentric shape with a fallback radius).

## Do not use it when

- The gap is larger than the outer radius. The formula gives zero or less, and a square inner
  corner inside a rounded card looks wrong. Chris Coyier: "zero just doesn't feel right either."
  Use a small fixed inner radius instead, or reduce the gap.
- The inner shape is a capsule or pill. A capsule's radius is set by its own height, not by its
  parent.
- The two shapes are visually separate objects that happen to overlap rather than one sitting
  inside the other. The rule is about nesting.

## How: code

```css
.card  { --r: 24px; --pad: 8px; border-radius: var(--r); padding: var(--pad); }
.card > .inner { border-radius: max(4px, calc(var(--r) - var(--pad))); }
```

The `max()` floor stops the inner corner collapsing to square when padding grows. If the outer
shape has a border, count the border width as part of the gap: CSS rounds the outer border edge, so the
padding box inside it is already smaller by the border width.

## How: Figma

Set the inner layer's radius to outer radius minus padding, and bind both to radius variables
so the pair is easy to keep in step when the outer value changes. Check the inner value again
whenever the padding changes; nothing recalculates it for you.

## Defaults to start from

Outer 24, padding 8, inner 16. Outer 16, padding 4, inner 12. Floor the inner value at about 4
rather than letting it reach 0.

## How it goes wrong

- Same radius on parent and child: the mistake this rule exists to fix, and why it shows up in
  unslop lists.
- Following the formula into a zero or near zero inner radius.
- Applying it to elements that are not nested.

## How to check it

For every rounded element with a rounded parent, read both radii and the gap (padding plus
border). Pass if inner radius equals outer minus gap, within 1px, or if the inner value sits on
the floor because the gap is too large.

## His take

Not yet given.

## Related

- matched-icon-weight (another nesting consistency rule, not yet researched)
- alpha-borders (borders change the gap this rule measures, not yet researched)

## Sources

- https://developer.apple.com/videos/play/wwdc2025/356/ : Apple, "Get to know the new design
  system", WWDC25. The three shape types, concentric radius as parent minus padding, the nested
  containers advice and the fallback radius.
- https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/ : Paul Hebert, Cloud
  Four, 26 Oct 2022. The geometry and the formula `outerRadius - gap = innerRadius`, with a CSS
  custom property version.
- https://blog.master.dev/the-classic-border-radius-advice-plus-an-unusual-trick/ : Chris Coyier,
  13 May 2024. The formula is "a little too simplistic in practice"; zero inner radius looks
  wrong when padding exceeds the outer radius; the `overflow-clip-margin` trick and its weak
  browser support.
