# Balanced headlines

- id: balanced-headlines
- kind: rule
- surfaces: product-ui, brochure, editorial
- layers: type, layout
- default: yes, `text-wrap: balance` on headings and other short display text that wraps (h1 to h3, hero lines, card and modal titles, pull quotes, captions) when it sits on an open surface, and `text-wrap: pretty` on body paragraphs; no for any heading that carries its own visible box, for editable text and for text over six lines
- captured from: theecommguy, "10 niche design hacks" (no. 6, screenshot 18 Nov 2026, `h1 { text-wrap: balance; }`) and charles.unemployed, "20 ways to unslop AI designs" (inbox item wrap-headlines-properly)
- researched: 18 Nov 2026
- confidence: high on the spec, browser support and the engine line limits (read in the Chromium and Firefox source); medium on Figma beyond its help pages; the numeric thresholds in the check are my judgment

## In one line

Let the browser even out the lines of short display text so a heading reads as one block instead
of a full line and a stub; use pretty, not balance, for paragraphs.

## What it is

Default wrapping is greedy. The spec says the `auto` value "will typically map to Web browsers'
speedy legacy line breaking, which has so far used first-fit/greedy algorithms", and WebKit
describes it as "always thinking about only one line at a time". Each line takes as many words as
fit, so whatever is left over lands on the last line, often one word.

`text-wrap` is a shorthand for `text-wrap-mode` (wrap or nowrap) and `text-wrap-style`. The style
longhand takes `auto`, `balance`, `stable` and `pretty`; the current CSS Text 4 editor's draft (17
Nov 2026) also lists `avoid-short-last-line`, which no browser data I checked lists yet.

- `balance`: "Line breaks are chosen to balance the remaining (empty) space in each line box". For
  "5 or fewer lines" it "must not change" the number of line boxes, and above that it "should avoid
  changing" it. Only the break points move. The spec calls it "intended for titles and captions, where
  equal-length lines of text tend to be preferred". In Chrome the browser "effectively performs a
  binary search for the smallest width which doesn't cause any additional lines, stopping at one CSS
  pixel" (Chrome for Developers). Firefox searches too, insetting the line width in halving steps,
  and accepts a trial only if the line count and the end of the last line match the unbalanced
  layout (its `nsBlockFrame.cpp`).
- `pretty`: the browser "should bias for better layout over speed" and the spec intends it, with
  `avoid-short-last-line`, "for body text, where the last line is expected to be a bit shorter than
  the average line". What it improves is left to each browser, and they differ a lot (below).
- `stable`: content on later lines is not considered "so that when editing text any content before
  the cursor remains stable". The spec intends it for editable sections.

The limits that decide use:

- Chromium balances at most six lines. The constant is `kMaxLinesForBalance = 6` in Chromium's
  `score_line_break_context.h`; Chrome's article says "it only works for six wrapped lines and
  under", and MDN says "six or less for Chromium and ten or less for Firefox". Past the limit
  Chromium returns no balanced result and the text wraps normally; it also skips any block it
  estimates at more than twelve lines before trying (`paragraph_line_breaker.cc`).
- Firefox balances up to ten lines, set by the pref `layout.css.text-wrap-balance.limit` with value
  10. When the count exceeds it, "no balancing is needed; just break from the balance loop"
  (`nsBlockFrame.cpp`).
- WebKit has no limit: "The WebKit implementation doesn't need to limit the number of lines. Every
  line will be balanced with all of the others." The spec allows any browser to "treat this value
  as auto if there are more than ten lines to balance".
- Older articles disagree on Chromium. Ahmad Shadeed (April 2023) wrote "limited to 4 lines only"
  and WebKit's April 2025 post also says four; the Chromium source today says six. Four is the
  number Chromium uses for `pretty` (`kMaxLinesForOptimal = 4`).
- Balance does not resize the element. Chrome: "it's a wrapping style only, not a size changing
  style", so DevTools shows "a bunch of extra space at the end", and "Balanced text wrapping
  ironically creates imbalance to the contained element." A test run for this entry in headless
  Chrome 153 showed the same: a 420px heading wrapped to four lines either way, its widest balanced
  line was 360px and the box stayed 420px. Adding `width: fit-content` did not shrink it either. Lea
  Verou's CSSWG issue 12505 (July 2025) says balance "is unusable with any container that has a
  visible box (e.g. backgrounds, borders, etc.)". It was closed as a duplicate of issue 191, "How to
  shrink to fit the width?", which is still open; a comment there on 30 Oct 2026 quotes a working
  group resolution to "Work on solving this as either a new keyword or a modification of
  fit-content".

How `pretty` differs by engine:

- Chromium touches only the end of a paragraph. Its optimiser holds at most four lines, and it runs
  only when the last line is a single word narrower than a third of the available width, or when
  the two lines before the last are both hyphenated (`ShouldOptimize` in `score_line_breaker.cc`).
  If the result has a different line count it falls back to greedy wrapping. Chrome's article:
  "pretty only handles orphans, not widows." WebKit's post: "Chromium only makes adjustments to the
  last four lines of a paragraph."
- Safari applies pretty "to every line of text, not just the last four lines". It "prevents short
  lines, improves the rag" and cuts hyphenation ("reduces the need for hyphenation"). WebKit: "The
  block of text becomes more of a solid rectangle." It does not yet act on rivers.
- Firefox does not support `pretty` (MDN compat data, read 18 Nov 2026), so there it wraps normally.

Browser support (MDN browser compat data, read 18 Nov 2026):

| | `text-wrap: balance` | `text-wrap: pretty` | `text-wrap-style` longhand |
| --- | --- | --- | --- |
| Chrome | 114 | 117 | 130 |
| Edge | 114 (mirrors Chrome) | 117 (mirrors Chrome) | 130 |
| Firefox | 121 | not supported | 124 (pretty not supported) |
| Safari | 17.5 | 26 | 17.5 (pretty from 26) |

Can I use marks Chrome and Edge 114 to 129 as partial for balance, its note being "Only supports
text-wrap: balance, not text-wrap-style: balance". So write the shorthand. MDN lists
`text-wrap-style` as Baseline 2024, newly available since October 2024.

## Why it works

A heading is read as a shape before it is read as words. Greedy wrapping makes that shape depend
on where the measure happens to fall, so the same headline is a neat block at one width and a full
line over a one word stub at the next. That stub pulls the eye and makes the line above look like
it overran. Balanced lines make the heading one block whose last line looks meant. This used to be
hand work: Chrome calls it "a classic typography technique of hand-authoring line breaks" and notes
designers did it "by hand, or optically". The browser knows the font, size, language and width at
render time, which the designer does not, so it can redo the balancing at every width.

Pretty works on a different problem. A paragraph's last line is meant to be shorter, so evening
every line would look wrong, but a single word alone at the end breaks the paragraph's rhythm.

## Use it when

- Any heading likely to wrap to two to six lines: page titles, section headings, hero lines, card
  titles, modal and dialog titles, empty state headings. Chrome's suggested rule is
  `h1, h2, h3, h4, h5, h6, blockquote { text-wrap: balance; }`.
- Pull quotes, captions, teasers and short centred text, where equal lines read best. WebKit says
  balance is for "anything where you want all the lines to be the same length", especially
  headlines and captions, "where you do not mind if the overall group of lines is narrower than its
  container."
- Centred headings above all. A centred greedy heading with a one word last line looks like a
  triangle; balanced, it reads as a block (my judgment).
- Body paragraphs, intros and list items that wrap: `text-wrap: pretty`. WebKit says its
  performance cost only shows at "many hundreds or thousands of lines" in one element and "is not
  affected by how many elements on the page it's applied to".

## Do not use it when

- The text is body copy. Chrome: "Balancing main article text is not common as it doesn't need to
  stand out or catch a reader's eye." In Safari, which balances any length, a balanced paragraph
  narrows into an even block with empty space down its right side (by the mechanism above). Use
  `pretty`.
- The text can run past six lines at some width. Chromium stops balancing there and Safari does
  not, so the same block looks different by browser. Shorten the copy or let it wrap normally.
- The heading carries its own visible box: a background, a border, a pill or tag, a highlighted
  title bar, a card where the heading's box is the tinted area. The empty side of the box shows.
  Chrome names "headings inside of a card (or any container with borders or shadows)", and
  `fit-content` does not fix it today. Put the box on a parent sized by something else, or use
  `pretty`, which keeps lines full. WebKit suggests pretty for a headline that must fill its
  container, such as one under a teaser image.
- A left aligned heading whose full first line is part of the design: a headline that must run to a
  column or image edge, or a display line set as a long first line over a short one for rhythm. That
  is my judgment, not a source rule; balance shortens the first line on purpose.
- The text is being edited: contenteditable regions, live inputs, editors, chat composers. Balance
  re-solves every line as the person types, so words above the cursor jump (by the mechanism above).
  The spec's value for editable text is `stable`.
- The text animates in a way that makes it rewrap, such as a typewriter reveal or a live counter in
  a heading. Each frame re-balances, so lines shift. WebKit advises testing any text that "rewraps
  as it animates".
- It is set on `*` or on a container. The spec lists `text-wrap-style` as inherited, so a card or section rule reaches
  every paragraph inside it. Chrome marks a `*` rule as "Don't" and says "It is not a good idea to
  apply text-wrap balancing to your entire design", because of the six line limit and render
  speed.
- The text never wraps: buttons, nav items, single line labels. Balancing does nothing on one line
  (Figma: "Wrap style only affects text that breaks across more than one line").

## How: code

```css
/* short display text: balance */
h1, h2, h3,
.hero-title, .card-title, .dialog-title,
blockquote, figcaption {
  text-wrap: balance;   /* the shorthand, which Chrome 114 to 129 also read */
}

/* give it a measure, or a short heading may sit on one long line */
.hero-title { max-inline-size: 20ch; }

/* body copy: fix the runt, keep lines full */
p, li, dd { text-wrap: pretty; }

/* a heading that wears its own background: keep lines full instead */
.tag-title, .title-bar h2 { text-wrap: pretty; }

/* text people edit */
[contenteditable] { text-wrap: stable; }
```

Notes:

- Use the shorthand. Can I use notes Chrome and Edge 114 to 129 supported `text-wrap: balance` but
  not `text-wrap-style: balance`.
- Unsupported browsers drop the declaration and wrap normally. MDN on CSS error handling: "if either
  the property or the value is invalid, that property-value pair is ignored and discarded." So it
  is safe progressive enhancement, and Firefox users of `pretty` get ordinary wrapping.
- Balance needs a measure. Chrome: "the text needs to wrap and therefore have a maximum line length
  applied from somewhere", and its examples use `max-inline-size: 50ch`, which it calls "like
  max-width but can be set once for any language".
- `white-space: nowrap` wins over it. Chrome: "Balancing text competes with the white-space
  property"; unset `white-space` to let balance apply.
- Hard breaks split the job. The spec: "Groups of lines separated by a forced line break are
  processed separately." A `<br>` in a heading means each half is balanced on its own, so remove
  breaks typed into headline copy.
- With `line-clamp`, "the clamping effect is applied first, then the remaining lines are balanced"
  (spec).
- The 20ch on the hero is a starting value from my judgment, not a source figure.

## How: Figma

Figma has the setting. Select a text layer, open the type settings from the Typography section and
pick a Wrap style: Auto, Balance or Pretty. Figma's help:

- Balance: "Figma distributes text as evenly as possible across every line." "Balance is not
  recommended for blocks of text longer than six lines." The plugin API adds that `BALANCE` "only
  works for paragraphs that are 6 wrapped lines or under".
- Pretty: "Figma keeps each line full, but adjusts the last four lines to avoid an orphan."
- It can be set on a layer, a single paragraph or a text style ("applies to every layer using that
  text style"). The help page lists it for all plans.
- Dev Mode shows `text-wrap: balance;` or `text-wrap: pretty;` in Typography; Auto layers "don't
  add a property".
- "Browser support for these values varies, and browsers may calculate line breaks differently than
  Figma does."

Set Balance in the heading text styles rather than per layer so every heading picks it up, and set
Pretty in the body styles. A plugin or script can read it as `textWrapStyle` on a text node, with
values `'AUTO' | 'BALANCE' | 'PRETTY'`.

Two habits, both my judgment:

- Never fake balance with a manual line break or a hand narrowed text box. A typed break only holds
  at the width it was set at; at another width or with a longer translation it produces a stub
  mid heading. A narrowed box changes the layer's measure for every later edit. If a file predates
  Wrap style, swap the breaks for the style setting.
- Expect Balance on a fixed width text layer to leave the layer wider than its lines, as in CSS,
  so a filled frame hugging that layer shows the empty side. That is my inference from how
  balancing works; Figma's help does not say it. Check the heading against its container, not just
  its own lines.

## Defaults to start from

- `text-wrap: balance` on h1 to h3, hero lines, card and dialog titles, pull quotes and figcaptions.
- `text-wrap: pretty` on paragraphs, list items and description text.
- `text-wrap: stable` on contenteditable regions.
- A heading measure in `ch` so balance has a width to work in: about 16 to 24ch for a hero line,
  30 to 45ch for section headings (my judgment, adjust per typeface).
- Headings with their own background, border or pill: `pretty`, not `balance`.
- Copy length: keep balanced text to six lines or fewer at the narrowest width it ships at, so all
  three engines balance it.
- In Figma: Wrap style Balance in every heading text style, Pretty in body styles.

## How it goes wrong

- Balance set on a card or section, so it inherits into the card's body text. Chrome balances
  the short paragraphs and leaves the long ones; Safari balances them all into narrow even blocks.
- A tinted title bar or pill with balanced text inside, leaving a gap on the right that looks like a
  padding bug. `width: fit-content` added as a fix, which does not shrink the box.
- A designer types line breaks into a hero headline in Figma to make it look balanced at 1440. At
  375 the breaks land mid line and the heading gets stubs the browser cannot fix, because each
  group between breaks is balanced separately.
- Pretty trusted to clear every runt. In Chromium it only acts when the last line is one word
  shorter than a third of the line, so a long last word stays alone; in the test run for this
  entry, Chrome 153 left "possible" alone on the last line at 420px. Firefox ignores pretty.
- Balance on a live editor or a heading that types itself in, so lines jump while someone reads or
  types.
- A heading with no measure in a wide container. It sits on one line at desktop and the rule looks
  like it does nothing until mobile.
- Taking a line limit from an old article. The four line figure in posts from 2023 and in WebKit's
  2025 post is not Chromium's current balance limit.

## How to check it

Run in the browser at three widths: 375, 768 and 1440 px.

1. Computed styles. Pass if every h1, h2, h3, hero line, card title, dialog title, blockquote and
   figcaption has computed `text-wrap-style` of `balance` (or `pretty` where it carries its own
   background, border or shadow); every `p` and `li` of body copy is `pretty`; no `p` is `balance`;
   no `[contenteditable]` is `balance`.
2. Line shape. For every balanced element, measure its lines with the snippet below. Pass if it has
   six lines or fewer and a last line of more than one word, with its shortest line at least 60
   percent of its longest (the 60 percent is my threshold; a two line heading of 5 and 4 words
   passes, one of 9 and 1 fails).
3. Body runts. For each `pretty` paragraph, flag a last line of one word. Chromium will leave some;
   fix the copy if the paragraph matters.
4. Visible boxes. For a balanced element with a background, border or box shadow, compare its
   widest line to its content box width. Fail if the gap is more than 10 percent of the box (my
   threshold).
5. No forced breaks. Fail any heading whose text contains a `<br>` or a typed line break meant to
   shape it.
6. Figma. Pass if heading text styles read Wrap style Balance (`textWrapStyle === 'BALANCE'`)
   and body styles read Pretty. Fail any heading layer whose characters contain `\n` or `\u2028`
   typed to shape it.

```js
// lines(el): one entry per rendered line, with its word count and width in px
const lines = el => {
  const words = [];
  const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n; (n = walk.nextNode());) {
    for (const m of n.data.matchAll(/\S+/g)) {
      const r = document.createRange();
      r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
      const b = r.getBoundingClientRect();
      words.push({ top: Math.round(b.top), left: b.left, right: b.right });
    }
  }
  const rows = new Map();
  for (const w of words) { if (!rows.has(w.top)) rows.set(w.top, []); rows.get(w.top).push(w); }
  return [...rows.values()].map(ws => ({
    words: ws.length,
    width: Math.max(...ws.map(w => w.right)) - Math.min(...ws.map(w => w.left)),
  }));
};
const sel = 'h1, h2, h3, .hero-title, .card-title, .dialog-title, blockquote, figcaption';
for (const el of document.querySelectorAll(sel)) {
  const ls = lines(el), widths = ls.map(l => l.width);
  const ok = ls.length <= 1 || (ls.length <= 6 && ls.at(-1).words > 1 &&
    Math.min(...widths) >= 0.6 * Math.max(...widths));
  if (!ok) console.warn('unbalanced', el, ls);
}
```

The snippet groups words by their top edge, so it assumes one font size per element; mixed sizes
in one heading need a looser grouping.

## His take

Not yet given.

## Related

- optical-centre (Chrome says headline balancing "is often referred to as metric versus optical
  alignment"; both fix what the eye sees over what the box says)
- widow (not yet researched; the term for the runt pretty removes)
- line-length (not yet researched; balance needs a measure to work in)

## Sources

- https://drafts.csswg.org/css-text-4/#text-wrap-style : W3C CSS Text Module Level 4, editor's
  draft of 17 Nov 2026, sections 5.4 and 5.5. Values of `text-wrap-style`, the balance definition,
  the five line rule, the ten line allowance, forced breaks, line-clamp, pretty and stable intent,
  greedy `auto`, the shorthand.
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap : MDN. Shorthand of `text-wrap-mode`
  and `text-wrap-style`; balance limited to "six or less for Chromium and ten or less for Firefox".
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap-style : MDN. Values, pretty's
  performance note, Baseline 2024 since October 2024.
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/text-wrap.json : MDN
  browser compat data for the shorthand. Balance: Chrome 114, Firefox 121, Safari 17.5. Pretty:
  Chrome 117, Firefox false, Safari 26. Edge mirrors Chrome.
- https://raw.githubusercontent.com/mdn/browser-compat-data/main/css/properties/text-wrap-style.json :
  MDN browser compat data for the longhand. Chrome 130, Firefox 124, Safari 17.5; pretty Firefox
  false, Safari 26.
- https://caniuse.com/css-text-wrap-balance : Can I use. Chrome and Edge 114 to 129 partial
  (shorthand only), full from 130; Firefox 121; Safari 17.5.
- https://raw.githubusercontent.com/Fyrd/caniuse/main/features-json/css-text-wrap-balance.json : Can
  I use data. Note 1, "Only supports text-wrap: balance, not text-wrap-style: balance."
- https://developer.chrome.com/docs/css-ui/css-text-wrap-balance : Adam Argyle, Chrome for
  Developers, last updated 19 Dec 2023. Six line limit, headings and blockquote, not `*`, measure,
  white-space, the box not shrinking, cards, the binary search.
- https://developer.chrome.com/blog/css-text-wrap-pretty : Adam Argyle, Chrome for Developers, last
  updated 23 Oct 2023. Pretty from Chrome 117, orphans not widows, balance for headlines and pretty
  for paragraphs.
- https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/layout/inline/score_line_break_context.h :
  Chromium source. `kMaxLinesForBalance = 6`, `kMaxLinesForOptimal = 4`.
- https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/layout/inline/paragraph_line_breaker.cc :
  Chromium source. Balance skipped above the limit or an estimate of twice it; bisects for the width
  that keeps the line count.
- https://chromium.googlesource.com/chromium/src/+/refs/heads/main/third_party/blink/renderer/core/layout/inline/score_line_breaker.cc :
  Chromium source. `ShouldOptimize`: last line under a third of the width with no break inside it,
  or two hyphenated lines before it; greedy fallback on a different line count.
- https://raw.githubusercontent.com/mozilla-firefox/firefox/main/modules/libpref/init/StaticPrefList.yaml :
  Firefox prefs. `layout.css.text-wrap-balance.limit`, value 10.
- https://raw.githubusercontent.com/mozilla-firefox/firefox/main/layout/generic/nsBlockFrame.cpp :
  Firefox source. Balance loop counts lines to the limit, stops past it, accepts a trial only at the
  same line count and block end.
- https://webkit.org/blog/16547/better-typography-with-text-wrap-pretty/ : Jen Simmons, WebKit, 8 Apr
  2025. Safari's pretty on every line, Chromium's last four lines, performance, WebKit balance with
  no line limit, pretty for headlines that must fill their container.
- https://help.figma.com/hc/en-us/articles/360039956634 : Figma help, "Explore text properties".
  Wrap style Auto, Balance and Pretty, six line advice, last four lines, layer, paragraph and style
  levels, Dev Mode output, browser differences.
- https://developers.figma.com/docs/plugins/api/TextWrapStyle/ : Figma plugin API. `'AUTO' |
  'BALANCE' | 'PRETTY'`, balance at 6 wrapped lines or under.
- https://lists.w3.org/Archives/Public/public-css-archive/2025Jul/0575.html : Lea Verou, CSSWG issue
  12505, 20 Jul 2025. Balance unusable with a visible box; `fit-content` does not account for it.
- https://github.com/w3c/csswg-drafts/issues/12505 : the same issue, closed as a duplicate of 191.
- https://github.com/w3c/csswg-drafts/issues/191 : "How to shrink to fit the width?", open; 30 Oct
  2026 comment quoting the resolution to solve it with a new keyword or a change to `fit-content`.
- https://ishadeed.com/article/css-text-wrap-balance/ : Ahmad Shadeed, 9 Apr 2023. Balance does not
  change element width, "it can leave a big space", the early four line limit.
- https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_syntax/Error_handling : MDN. Invalid
  property value pairs are ignored and discarded, which makes new values safe to add.
- https://developer.mozilla.org/en-US/docs/Web/CSS/fit-content : MDN. `fit-content` as
  min(max-content, max(min-content, stretch)).
