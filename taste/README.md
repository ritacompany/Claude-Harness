# Taste

A researched library of design craft: rules, techniques, terms, textures and trends, each written
so an agent can apply it, and each carrying Chadwick's verdict once he gives one. It lives in the
harness because it holds across every project: Mondai, the brochure site, the portfolio.

The skill that uses it is `skills/taste`. This file is the contract for adding to it.

## What it is for

A model already knows what kerning is. What it fails to do is reach for the right move at the
right moment without being told, and know where that move breaks. So an entry is written as a
decision: when to use it, when not to, what values to start from and how to check it was done
right. A definition alone is not an entry.

Three uses:

1. Ideas. "Find a few ideas for this hero." Filter INDEX.md by surface and layer, open the
   matching entries and propose the ones that fit the brief, each with its reason.
2. Defaults. While building, every entry marked default yes whose condition holds is applied.
3. Critique. When judging work, each matching default entry's "How to check it" line is run
   against the build.

## Where it is wired in

Decided by: Chadwick, 18 Nov 2026, "yes" to every page build applying the library's defaults and
running its checks. Each project names it at the step that builds or reviews a page, and its own
rules win where they disagree:

- Mondai brochure design: ritacompany/mondai, `mondai-design/steps/brochure.md` step 7 (ask A205).
- Mondai brochure code: ritacompany/mondai-site, CLAUDE.md, rules for every change.
- Portfolio site: ritacompany/portfolio, `docs/PROJECT_CONTEXT.md` guardrails, with `npm run taste`
  running six entries' checks on the shipped pages.

A cloud session only has the taste skill when it is turned on in the claude.ai account, so each
pointer also names this repo, where INDEX.md can be read directly.

## Folder

- `INBOX.md`: captured items waiting for research, with where each came from.
- `INDEX.md`: one row per researched entry. Agents read this and open only the rows they need.
- `entries/<id>.md`: one file per entry.

## Vocabulary

Surfaces, where an entry fits:
- product-ui: a screen someone uses to get a task done
- brochure: a marketing page, landing page or hero
- editorial: a case study, long read or deck
- graphic: a poster, social post, illustration or texture piece
- motion: anything that moves

Layers, what part of the design it touches: layout, type, colour, shape, image, texture, motion,
copy, interaction, state.

Kinds:
- rule: applies whenever its condition holds
- technique: an opt in move
- term: vocabulary to use precisely
- texture: a surface or background treatment
- trend: a look tied to its moment, with a note on when it reads dated

The surfaces field and the "Do not use it when" section handle overlap between UI and graphic
design, so no entry is forced into one bucket. Halftone fits graphic and brochure and
says why it fails in product-ui; multiply blending fits all four and says why it fails on dark
surfaces.

## Entry format

Header fields: id, kind, surfaces, layers, default, captured from, researched, confidence.
Then these sections, all required:

- In one line
- What it is: the mechanism, not just the name
- Why it works: the perceptual or practical reason
- Use it when
- Do not use it when: never empty; an entry with no limits is not understood yet
- How: code
- How: Figma
- Defaults to start from: real values
- How it goes wrong
- How to check it: concrete enough for a critic or a script
- His take: Chadwick's verdict in his words with a date, or "Not yet given"
- Related
- Sources

## Research standard

- The reel or post is where an item came from, never a source. Each entry opens at least three
  sources itself, including a primary one where it exists: a spec, platform guideline, the tool's
  own docs or the person who coined it.
- Every factual sentence traces to a listed source or follows from them by plain geometry or
  mechanism. Design judgment is fine and reads as judgment.
- Claims go through verify-claims (the claim-verifier agent, which never sees the entry) before
  the row enters INDEX.md. A claim that fails is fixed or cut.

## What wins

1. The project's own rules and its source of truth (for Mondai: its design system in Figma and the
   mondai-design skill).
2. His take on the entry.
3. The entry itself.

When an entry and a project rule disagree, neither silently wins: the conflict goes to Chadwick
with both sides and a pick.

## Adding to it

Chadwick sends screenshots, links or a note in any chat and says to add them to taste. The session
adds one line per item to INBOX.md with its source and date. A research batch ("research the taste
inbox") takes items in groups, researches each to the standard above, runs verify-claims, writes
the entries and moves their rows to INDEX.md.

Instagram does not let a cloud session read a reel (tested 16 Nov 2026: the profile redirects to a
login and automated download was refused). The screenshot of the list is enough to start research,
since the research does the explaining. If something the creator says matters, a line from
Chadwick about it goes in the inbox line.

## Capturing his verdicts

The entries are craft; his verdicts are what make the library his taste. When he rules on a move in any review ("I
hate the grain", "only on the brochure"), the session writes it into that entry's His take with
the date and his words, and updates the his take column in INDEX.md.
