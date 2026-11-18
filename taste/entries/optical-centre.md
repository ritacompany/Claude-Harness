# Optical centre

- id: optical-centre
- kind: rule
- surfaces: product-ui, brochure, editorial, graphic
- layers: layout, shape, type
- default: yes, whenever an asymmetric shape, a lone element or a text label is centred in a container
- captured from: charles.unemployed, "20 design terms you should know" (no. 2) and "20 ways to unslop AI designs" (no. 17, "align by eye, not pixels")
- researched: 18 Nov 2026
- confidence: high that the correction is needed, medium on the amounts (no source gives a universal number)

## In one line

Centre things where they look centred, not where the maths puts them: lift a lone element slightly
above the middle, nudge a play triangle toward its point and centre button text on its capitals,
not its line box.

## What it is

Layout tools centre bounding boxes. The eye centres mass. When the two disagree, a box centred
exactly looks wrong, and the fix is a small deliberate offset. Apple's WWDC25 design system session
puts it as policy: "to preserve optical balance", views are "mathematically centered when it makes
sense" and "subtly offset when it doesn't".

Four cases come up again and again:

1. The frame. The optical centre of a rectangle sits "slightly above the geometric center", and the
   same Duke design principles page notes that mat board for photographs and artwork "is usually slightly wider at
   the bottom".
2. Asymmetric shapes. "A play triangle, for example, has more visible area near its flat edge than
   near its point" (Pixso). Centred by its box inside a circle, it looks "like it's sliding off to
   the left" (IconBuddy). By plain geometry, a right pointing triangle's centroid sits a third of
   the way from its flat edge, which is one sixth of its width left of its box centre. IconBuddy
   puts arrows and other asymmetric glyphs in the same group, carrying "their visual weight away
   from their geometric center".
3. Round against flat. Type designers let round letters run past the baseline and cap or x height
   so they look the same size as flat ones. FontLab: "Overshoots are important to make round
   letters feel like they are the same height as straight letters." Wikipedia gives "perhaps 1% to
   3% of the cap or x-height" as typical for an O, and cites Peter Karow recommending 3% for O and 5%
   for A. Icon sets handle the same problem with keylines: guide shapes that keep icons of different
   forms looking equally large inside one bounding box (IconBuddy).
4. Text in a box. A line of text carries extra space above and below its glyphs; Figma describes
   its vertical trim setting as a way "to remove the extra space above and below text". MDN:
   "Vertical spacing differs between fonts, making consistent typesetting historically challenging
   on the web." Equal padding around the line box is then not equal padding around the
   capitals the eye actually sees. The edge version of the same problem is punctuation: an opening
   quote at the start of a line pushes the letters in, so the column edge looks indented. Hanging
   punctuation moves the mark outside the line box (MDN).

## Why it works

The eye judges position by visual weight, not by the box a tool draws around a shape. IconBuddy:
"Your eye balances mass, not bounding boxes." A shape centred by its box but heavier on one side
reads as off centre. My judgment on the rest: a reader notices the error without being able to
name it, and correcting for perception makes the layout look settled, which is the point of
centring in the first place.

## Use it when

- A play, next or arrow glyph sits in a circular or square button.
- A single element (an empty state illustration, a logo on a splash, a hero headline block) is
  centred in a large frame.
- A button, badge, tag or pill holds a text label, alone or beside an icon. jakub.kr: "when a
  button has both text and an icon, it is better to have slightly less padding on the side of the
  icon to optically align the content."
- You draw custom icons or a logotype mixing round and flat shapes that must look the same size.
- A pull quote or heading starts with a quotation mark against a hard left edge.

## Do not use it when

- The icon set already corrects for it. jakub.kr: "a lot of icon packs already account for this."
  Nudging again overcorrects. Check the glyph's drawing before adding an offset.
- The shape is symmetric on the axis you centre along (a circle, a plus, a centred word). There is
  nothing to correct.
- Alignment is data: bars in a chart, numbers in a column, form field edges, grid lines. Those must
  share exact edges or the reader misreads them. My judgment: optical nudges belong to single
  objects in containers, not to edges that line up with other edges.
- You are setting type in an existing font. Overshoot is drawn into the glyphs by the type designer
  (the FontLab tutorial is about doing exactly that), so do not add your own.
- The offset would have to differ per instance. Put it in the component or the SVG once, never on
  each use.

## How: code

```css
/* 1. Centre a label on its capitals, not its line box (Baseline 2026) */
.button {
  text-box-trim: trim-both;
  text-box-edge: cap alphabetic;   /* over edge at cap height, under edge at the baseline */
  padding-block: 12px;
}

/* 2. Leading icon: a little less padding on the icon side */
.button.has-leading-icon { padding-inline: 14px 16px; }

/* 3. Play glyph: better fixed in the SVG; this is the fallback */
.play-button svg { transform: translateX(8%); }

/* 4. Hang an opening quote outside the column (Safari only) */
blockquote p { hanging-punctuation: first; }

/* 5. Lift a lone element above the middle of a full height frame:
      extra bottom padding moves the centre up by half its value */
.empty-state { display: grid; place-items: center; min-height: 100vh; padding-bottom: 6vh; }
```

Notes on each:

- `text-box-trim` "specifies which of the over and under edges of text content to trim", and
  `text-box-edge` sets how much: `cap` "trims the over edge of the text element's block container to
  the top of the capital letters" and `alphabetic` "trims the under-edge flush with the text
  baseline" (MDN). `text-box-edge` "has no effect if `text-box-trim` is not set or is set to `none`".
  The `text-box` shorthand also exists (`text-box: trim-start cap alphabetic` is one of MDN's syntax
  examples). MDN marks all three Baseline 2026 (available "Since August 2026") and warns they
  "might not work in older devices or browsers". Older engines fall back to the untrimmed line box,
  so pick padding that still looks acceptable without the trim.
- For icons, jakub.kr: "the best way to fix it is in the `svg` itself, so no additional `margin` or
  `padding` needs to be added." The `translateX(8%)` above is a starting value of mine, explained
  under Defaults; it assumes the triangle fills the SVG's width, so work from the triangle's own
  width when it does not.
- `hanging-punctuation` "specifies whether a punctuation mark should hang at the start or end of a
  line of text" (MDN). MDN marks it "Limited availability", not Baseline. Can I use lists full
  support only in Safari from 17.4 (iOS Safari the same) and no support in Chrome, Edge or
  Firefox. Treat it as progressive enhancement.
- The `6vh` padding (a 3vh lift) is a starting value of mine, not a sourced number.

## How: Figma

For text, Figma's type settings have a Basics tab option to toggle vertical trim. Figma: "Use
vertical trim to remove the extra space above and below text." Its help adds that "This allows text
layers to behave like other components in your layout", so padding around a trimmed label is
padding around the letters. Dev Mode reports
it as `leading-trim: both;` and Figma's help calls `leading-trim` and `text-edge` "draft features
that aren't widely supported by web browsers". That help text predates the shipped properties: MDN
now documents them as `text-box-trim` and `text-box-edge`, so rename them in handoff (my inference
from the two pages).

For icons and lone elements, make the correction inside the icon component (move the glyph within
its frame) so every instance inherits it, and keep the frame itself centred by auto layout. That
placement advice is my judgment, not Figma's documentation.

## Defaults to start from

These are my judgment, calibrated against the geometry above; the sources give no universal number
and Pixso warns against one ("Do not automatically enlarge every circle to 26 px or offset every
triangle by 1 px").

- Play triangle in a circle: move it toward its point by about one twelfth of its own width, which
  is halfway between box centring and centroid centring. On a 12px wide glyph that is 1px, in line
  with IconBuddy's one pixel nudge (it does not give the glyph size). Never go past one sixth, the
  full centroid offset.
- Lone element in a frame: lift its centre by 2 to 5 percent of the frame height.
- Button label: trim to cap height and alphabetic baseline, then use equal top and bottom padding.
- Button with a leading icon: padding on the icon side 2px less than on the text side at 16px
  padding.
- Custom icon or logo with round and flat forms side by side: make round forms 1 to 3 percent
  taller than flat ones, the range Wikipedia gives for an O.

## How it goes wrong

- A play button that looks like it slides left, because the triangle is centred by its box.
- A button label that sits visibly high or low because padding was set on the line box.
- The opposite: a nudge so large it reads as a mistake, or a nudge stacked on an icon that was
  already corrected.
- Nudges applied per instance, so the same icon sits differently on two screens.
- Optical tweaks applied to edges that should line up with other edges, breaking the grid.

## How to check it

1. Play and arrow glyphs in containers: measure the glyph's bounding box centre against the
   container centre. Pass if it is shifted toward the point by more than 0 and at most one sixth of
   the glyph's width, or if the icon's own SVG already carries that offset.
2. Text in buttons and tags: measure from the top of a capital to the top edge, and from the
   baseline to the bottom edge. Pass if the two differ by 1px or less.
3. Lone centred element in a large frame: pass if its centre sits at or slightly above the frame's
   vertical midpoint, never below it.
4. View every correction at its real display size beside a geometrically centred copy, as Pixso
   advises: "Keep a geometrically centered version beside the candidate." Pass if the corrected one
   looks centred and the copy does not.
5. Grids, tables and chart edges: pass only if no optical offset was applied to them.

## His take

Not yet given.

## Related

- concentric-radius (the shape rule for nested corners, often applied to the same buttons)
- tabular-numbers (another fix for what the eye sees over what the metrics say)
- matched-icon-weight (not yet researched)

## Sources

- https://developer.apple.com/videos/play/wwdc2025/356/ : Apple, "Get to know the new design
  system", WWDC25, Design language chapter. Views "mathematically centered when it makes sense" and
  "subtly offset when it doesn't".
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim : MDN. What it trims, its values,
  vertical spacing differing between fonts, Baseline 2026 since August 2026.
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-edge : MDN. `cap`, `ex` and
  `alphabetic` edges, no effect without `text-box-trim`.
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-box : MDN. The shorthand and its syntax
  examples.
- https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation : MDN. Definition, values,
  limited availability.
- https://caniuse.com/css-hanging-punctuation : Can I use. Safari 17.4 and later only; no Chrome,
  Edge or Firefox support.
- https://help.figma.com/hc/en-us/articles/360039956634 : Figma help, "Explore text properties".
  Vertical trim in the Basics tab, its Dev Mode output and the draft features note.
- https://help.fontlab.com/fontlab/8/tutorials/calfonts/3.%20Fitting%20and%20Spacing/03a%20Setting%20Your%20Letter%20Heights/ :
  FontLab 8 tutorial, "Setting your letter heights". Why round letters overshoot.
- https://en.wikipedia.org/wiki/Overshoot_(typography) : Overshoot definition, 1% to 3% for O,
  Karow's 3% and 5%.
- https://sites.math.duke.edu/education/ccp/resources/write/design/graphic7.html : Duke University,
  "Design principles: graphic design principles". Optical centre slightly above the geometric
  centre; mat board wider at the bottom.
- https://iconic.iconbuddy.com/p/week-01-why-your-icons-look-off : IconBuddy, "Why your icons look
  off", 15 Jul 2026. The play button that slides left, the one pixel nudge, keylines, "Your eye
  balances mass, not bounding boxes."
- https://pixso.net/articles/alignment-icon/ : Pixso, "Optical alignment in UI design", 30 May 2026.
  Visible area of a play triangle, shift toward the point, no universal offset, compare beside a
  geometric version.
- https://jakub.kr/components/optical-alignment : jakub.kr, "Optical alignment" (no byline on the
  page). Less padding on the icon side of a
  button; icon packs often correct already; fix icons in the SVG.
