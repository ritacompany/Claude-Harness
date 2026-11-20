# Index

One row per researched entry. Read this file, never the whole entries folder: pick the rows that
match the job's surface and layer, then open only those entries.

Default yes means the entry applies whenever its condition holds, so a build or critique checks
it without being asked. Default no means it is an option to propose, never applied unasked.

| id | kind | surfaces | layers | default | his take | in one line |
| --- | --- | --- | --- | --- | --- | --- |
| concentric-radius | rule | product-ui, brochure, editorial | shape, layout | yes | none yet | Nested rounded shapes take the outer radius minus the gap, floored above zero |
| multiply-blending | technique | product-ui, brochure, editorial, graphic | image, colour | no | none yet | White backed images set to multiply drop their white box on light tinted surfaces; off in dark mode |
| alpha-borders | technique | product-ui, brochure, editorial | colour, shape, image | yes (decorative and image edges) | none yet | Borders in black or white at low alpha adapt to any surface; never the only boundary of a control unless it passes 3:1 |
| dark-mode-depth | rule | product-ui, brochure | colour, shape | yes | none yet | In dark themes higher layers get lighter surfaces, base never pure black, floating layers keep a shadow or edge |
| tabular-numbers | rule | product-ui, brochure, editorial, motion | type, state | yes | none yet | Numbers that update or sit in columns use tabular figures; running text keeps the font's default |
| optical-centre | rule | product-ui, brochure, editorial, graphic | layout, shape, type | yes | none yet | Asymmetric shapes, lone elements and button labels are centred by eye, never on data edges |
| matched-icon-weight | rule | product-ui, brochure, editorial | shape, type | yes | none yet | One icon family at one stroke, weight matched to the label and sized from its cap height |
| blurred-icon-swaps | technique | product-ui, brochure, motion | motion, state, interaction | no | none yet | An icon changing in place crossfades with scale and a small blur; never on large or constantly used icons |
| masked-edges | technique | product-ui, brochure, editorial | layout, interaction, state | yes (the method) | none yet | Fade scroller edges with a mask, not a background coloured overlay, and only when there is more to scroll |
| dynamic-viewport | rule | product-ui, brochure, editorial | layout, state | yes | none yet | Full height blocks on mobile use svh for heroes, dvh for things that must fit, lvh for backdrops; never 100vh |
| oklch-palettes | technique | product-ui, brochure, editorial, graphic | colour | yes (new scales) | none yet | Build scales on a shared OKLCH lightness ladder, let chroma fall to what each hue holds, measure contrast |
| oklch-gradients | technique | brochure, graphic, product-ui, editorial | colour | yes (distinct hues) | none yet | Gradients between different hues interpolate in Oklab, or OKLCH when hues are far apart; Figma needs sampled stops |
| layered-shadows | technique | product-ui, brochure, editorial | shape, colour, state, motion | yes (when a shadow is used) | none yet | Floating surfaces get 2+ shadow layers, one light direction, hue tinted; never animate the shadow itself |
| balanced-headlines | rule | product-ui, brochure, editorial | type, layout | yes (headings and short display text) | none yet | Wrapping headings get text-wrap balance, body copy pretty; pretty when retrofitting Figma matched pages or boxed titles |
