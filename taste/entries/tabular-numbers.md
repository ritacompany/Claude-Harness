# Tabular numbers

- id: tabular-numbers
- kind: rule
- surfaces: product-ui, brochure, editorial, motion
- layers: type, state
- default: yes, for any number that updates in place or sits in a column; no for numbers in running text
- captured from: charles.unemployed, "20 design terms you should know" (no. 3) and "20 ways to unslop AI designs" (no. 18, "use tabular nums")
- researched: 18 Nov 2026
- confidence: high on the mechanism and code, medium on Figma beyond what its help page names

## In one line

Give every digit the same width wherever numbers line up in columns or change in place, so prices
align and timers stop jittering; leave running text on proportional figures.

## What it is

A font can carry two sets of digits. Tabular figures are "set on a fixed width" (Butterick), so a 1
takes as much room as an 8. Proportional figures "are set on varying widths that suit the shape of
the figure". OpenType switches between them with two features: `tnum` "replaces figure glyphs set
on proportional widths with corresponding glyphs set on uniform (tabular) widths" and `pnum` does
the reverse. Each overrides the other. The spec notes that tabular widths "will generally, but not
always, be the default", and Butterick notes that the default figures on many fonts, system fonts
above all, are tabular lining figures. So the font you picked decides what you get before any
setting does.

Width is a separate axis from height. Lining figures (`lnum`) sit on the baseline at about cap
height; oldstyle figures (`onum`) have descenders on digits like 3, 4, 7 and 9 and read like
lowercase. The spec keeps the two axes apart: `lnum` "is distinct from the figure width features
('pnum' and 'tnum')". That gives four combinations, and Figma's type settings list all four.

## Why it works

When digits change width, a number that updates live changes width with them. A counter moving
from 0 to 1 gets narrower in most proportional fonts, and anything laid out after it moves. Fixed width digits
keep the same footprint every tick, so the eye can stay on the value. In a column, fixed width
lines up units, tens and hundreds vertically, which is what lets someone scan a list of prices.
Butterick: "tabular figures are essential for one purpose: vertically aligned columns."

## Use it when

- Numbers sit in a column a reader compares: tables, price lists, invoices, statements, leaderboards.
- A number updates in place: timers, countdowns, counters, progress percentages, live prices,
  animated stat tiles, odometer style transitions. Dialpad's design system recommends tabular
  figures for "preventing layout shifts of dynamically-changing content", for example "a timer
  counting down".
- Several numbers stacked in a card should align on their right edge.

## Do not use it when

- The number sits in running text. Butterick: "In body text, proportional figures are preferred
  because they tend to have more even spacing and a more consistent appearance."
- A date or year sits in a headline or all caps display line. The OpenType spec's own example for
  `pnum` is "even spacing for lining figures used as dates in an all-cap headline".
- The font does not ship `tnum`. Butterick: "Not every font has every set of alternate figures."
  The setting then does nothing at all ("A font without `tnum`
  glyphs will silently do nothing", alanwest on DEV). Pick another face for the numbers rather than
  trusting the property.
- You reach for a monospace font only to stop digits jittering. That changes the letters too; the
  figure setting changes only the digits.

## How: code

```css
/* columns and anything that updates live */
.num, td.num, .timer, .price, .stat-value {
  font-variant-numeric: tabular-nums;
}

/* running text stays proportional (the property's default is normal) */
.prose { font-variant-numeric: normal; }

/* tabular oldstyle figures for a table set inside oldstyle text */
.prose td.num { font-variant-numeric: tabular-nums oldstyle-nums; }
```

MDN maps `tabular-nums` to OpenType `tnum`, `proportional-nums` to `pnum`, `lining-nums` to `lnum`
and `oldstyle-nums` to `onum`, and lists `font-variant-numeric` as available across browsers since
January 2020. `font-feature-settings: "tnum"` does the same job at a lower level (MDN's own example
uses it on `td.tabular`), but MDN says "Whenever possible, Web authors should instead use the
font-variant shorthand property or an associated longhand property", because those give "more
effective, predictable, understandable results". Keep `font-feature-settings` for features no
`font-variant` value reaches. If you load a subset web font, make sure the subset keeps the `tnum`
glyphs; that is my judgment from how subsetting works, so check the served file.

The spec also says `kern` "should not be used in combination with features that result in
fixed-width metrics", `tnum` among them, and that it "should be disabled" for such a run. My
judgment from that rule: if a tabular column still looks unevenly spaced, look for something
forcing kerning back on, such as `"kern" 1` in `font-feature-settings`.

## How: Figma

Select the text layer, open the type settings from the Typography section of the right sidebar and
go to the Details tab. Under Numbers, Style offers proportional or monospace figures, each in
lining or old-style. Figma's help: "Monospace figures, also known as tabular figures, have the same
width regardless of the character being used." Hover a feature to preview it ("Hover over any
feature or property to see the preview"). What appears depends on the font: "The properties in
this section will depend on the font family you are using." My inference from that line: if
Monospace is not offered for a font, assume it lacks `tnum` and run the check below before building
on it.

Save the setting into the text style used for tables, prices and timers rather than setting it per
layer, so it travels with the style. That is a working habit, not something Figma's help states.

## Defaults to start from

- `font-variant-numeric: tabular-nums` on every table cell holding numbers, every price in a list or
  comparison, every timer, counter, percentage and animated stat.
- Right align numeric columns so the units line up (tabular widths only align digits that share a
  right edge).
- Lining figures for UI and anything set with caps; oldstyle only inside long reading text, and
  then `tabular-nums oldstyle-nums` for any table in it.
- Body copy left on the font's default figures. Butterick: "It's never wrong to use the default
  figures in your font."

## How it goes wrong

- A countdown or live total shifts sideways every second because it uses proportional digits.
- The property is set but the font has no `tnum`, so nothing changes and nobody notices until the
  build runs live.
- Tabular figures applied globally, so a sentence with "1,111 people" reads gappy.
- A column set tabular but centre or left aligned, so the digits still do not stack.
- Oldstyle figures used beside caps. Butterick: "With caps, however, you should not use oldstyle
  figures. They look wrong."

## How to check it

1. In the browser, for every element that shows a live number or sits in a numeric column, read the
   computed `font-variant-numeric`; pass if it includes `tabular-nums`.
2. Prove the font honours it. Butterick's test: "type a line of zeroes above a line of ones. If
   they're the same length, then your font has tabular figures." Run it in the same font, weight
   and size with `tabular-nums` on. Equal lengths pass; different lengths mean the font has no
   tabular set and the face must change.
3. In Figma, select the number layers and check that Details, Numbers, Style reads Monospace.
4. Running text: pass if paragraphs use the font's default figures, not a forced `tabular-nums`.

## His take

Not yet given.

## Related

- optical-centre (another fix for what the eye sees over what the metrics say)
- matched-icon-weight (not yet researched)

## Sources

- https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt : OpenType feature
  registry, p to t. `tnum` and `pnum` function, "generally, but not always, the default", each
  overrides the other, "off by default" UI suggestion, oldstyle tabular example, the dates in an
  all cap headline example for `pnum`.
- https://learn.microsoft.com/en-us/typography/opentype/spec/features_ko : OpenType feature
  registry, k to o. `lnum` and `onum`, their separation from the width features and the `kern`
  interaction with `tnum`.
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric : MDN. Values and their
  OpenType equivalents, available across browsers since January 2020.
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings : MDN. Prefer
  `font-variant` properties; the `td.tabular` `"tnum"` example; available across browsers since
  March 2016.
- https://help.figma.com/hc/en-us/articles/360039956634 : Figma help, "Explore text properties".
  Details tab, Numbers, Style with proportional and monospace in lining and old-style, hover
  preview, options depend on the font.
- https://practicaltypography.com/alternate-figures.html : Matthew Butterick, Practical Typography.
  Tabular versus proportional, lining versus oldstyle, where each belongs, system font defaults,
  not every font has every set, the zeros over ones test.
- https://dialtone.dialpad.com/utilities/typography/font-variant-numeric.html : Dialpad Dialtone
  design system. Tabular figures for tabular data and changing content, the countdown timer case.
- https://dev.to/alanwest/tabular-numbers-in-css-font-variant-numeric-vs-monospace-hacks-25cn : DEV
  article. A font without `tnum` silently does nothing; the monospace font hack.
