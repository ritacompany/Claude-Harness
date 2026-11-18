---
name: tool-defaults
description: Chadwick's standing defaults for any tool, page or interface Claude builds for him, written from 2,190 of his own quotes (Mar to Nov 2026). Load before building or changing an option set, review or decision board, design canvas, editor, tuner, playground, prototype, dashboard or tracker, deck, explainer, reading page, handoff page or small web tool for him, in any project. It sets the baseline every tool meets (collapsible sidebars, fully responsive, dark quiet chrome, autosave and hand back, plain labels) and routes to one short file per tool type. Not for Mondai product screens, which follow mondai-design.
---

# Tool defaults

He has explained these preferences to many sessions; this skill means he never has to again. Every
rule cites the ids of his own words in `evidence/EVIDENCE.md`; read a quote when a rule is unclear
or two rules seem to pull apart.

## How to use

1. Name the tool type in one line and open its file. A tool that mixes types opens each.
   - Option sets, alternatives, variations: `references/options.md`
   - Review boards, decision boards, quizzes, handoff and leadership boards: `references/boards.md`
   - Design canvases and comment boards: `references/canvases.md`
   - Editors, tuners, playgrounds, labs, mixers: `references/editors.md`
   - Prototypes, websites, effects and motion: `references/prototypes.md`
   - Explainers, decks, documents, guides, research pages: `references/reading.md`
   - Dashboards, trackers, status pages: `references/dashboards.md`
2. Write the running list of everything he asked for, his asides included, before building. It is
   the acceptance test.
3. Build to the baseline below plus the type file.
4. Run the check in "Before he sees it". Only then send it.

Choose the tool type and the tech yourself and say why in one line; do not ask him to choose.
Where a project's own skill is more specific (mondai-design for Mondai screens, the portfolio
rules for case studies), that skill wins for its own work.

## Baseline: every tool

Layout and shell
- Build it fully responsive without being asked: content fills and hugs its box at every width and
  nothing spills out. Checked at phone, tablet, laptop and wide desktop, with no sideways page
  scroll. (E2190, E2069, E0070, E0957, E2055)
- When the layout adapts to a narrower width, rebalance it so it still looks designed; do not just
  stack or stretch what was there. (E0498, E0499, E1257)
- Any sidebar or side panel collapses: a toggle on or beside it hides it to a slim rail or out of
  the way and the main area takes the room. A panel that holds controls can also be dragged wider
  or narrower. (E2190, E0052, E1638, E1448)
- Cap content at a max width on large screens and centre it; reading text sits in a column near
  normal line length. (E0142, E0342, E1047, E1766)
- Containers fill their parent and wrap their contents. No scroll box inside the page and no blank
  band at the bottom, unless it is a long list beside a detail area. (E0211, E0593, E2055, E2095, E1351)
- Tabs and viewer navigation sit in a bar across the top; never an info dock at the bottom. Tool
  controls may sit in a right sidebar. (E0303, E0659, E1584, E1448)
- No scrolling to reach a control or the thing under review; arrows and keyboard keys move through
  items. (E2017, E1638)

Look
- His tools are dark, neutral and quiet: black ground, light grey lines and text, square corners,
  Heebo with IBM Plex Sans Mono, no product green, nothing that reads as a call to action and
  nothing in the chrome competing with the work. (E1127, E1585, E2157, E1434, E2020, E2021, E2022)
- Every label and line is easy to read: nothing tiny or thin and no text that blends into a grey
  ground. (E0188, E0265, E0411, E1130, E1280)
- Basic craft everywhere: on a grid, aligned, related things grouped by tighter spacing, no random
  gaps or overlaps, no default two column split. (E0497, E1183, E0175, E1925)
- Use the full web toolkit the job needs (scripts, CSS motion, canvas, libraries); never a
  deliberately plain static page. (E0012, E0013, E0387)

Words
- Every option, screen, control and question says plainly what it is and where it sits. Name
  things; never "image 1" or a bare number. (E0020, E0217, E0941, E1347)
- Cut text to what changes what he does, in bullets or visuals. (E0635, E0779, E1057, E1533)
- No jargon or internal codes without a plain word beside them. (E0826, E0923, E2118, E1678)
- Sentence case, no em or en dashes, no Oxford commas, in the tool as in chat. (E1933, E0034, E0065, E0524)

Content
- When the tool shows his work, pull the current version with its exact values, components and
  behaviour at true scale; never approximate it or swap in another system.
  (E0072, E0096, E0075, E0163, E2141, E1728)
- Fill it with real content from the source in a realistic spread of lengths and volumes; no lorem,
  no repeated filler. (E0337, E0926, E0077, E0297)

Behaviour
- Every tab, control, hover, state and transition someone would try actually works. (E0038, E0221, E0019)
- Everything clickable has a hover and pressed state; nothing else looks clickable; a hover changes
  colour only and never moves or reflows text. (E0186, E1321, E1318, E1475, E2138, E0558)
- It saves on its own, so leaving and coming back loses nothing. Picks, notes and values go back to
  the session through one obvious finish or send, without him having to tell the chat.
  (E2031, E2030, E2034, E1657, E1576, E2027)
- Anything he will paste elsewhere (values, prompts, copy) has a copy button or sits in a plain
  code box. (E0354, E0781, E1850)

Scope
- Build the smallest thing that does the job today: no extra steps, features or plans he did not
  ask for. (E0416, E0591, E0656, E1580, E2009)
- Free libraries and what he already has; never route a build through paid software or an account
  he lacks. (E0319, E1556, E2112)
- On a fix, change only what he named and carry every settled decision forward; no rejected idea
  comes back. (E1666, E2103, E0173, E1341)
- On a new exploration round, change boldly; never return a lightly reworked last round.
  (E1896, E0722)
- Do every setup step yourself; the tool works without him editing config or running anything.
  (E0730, E1554, E1858)

## Delivery

- Send one link that opens the live working page, in the same reply as the build. Never only a file
  path, raw HTML or a description. (E1521, E1651, E0004, E0085)
- Show, don't describe: an idea, state or style under discussion gets rendered, not explained. A
  copy only ask, or a fix he already agreed, needs no page. (E0036, E0067, E0100, E0279, E1876)
- Keep one current version of each tool at one link and say which it is. (E1469, E1708, E2040)
- Design exploration happens on a canvas or page in Claude Code; his pick, and work he asks for
  there, goes where he names (Figma or Framer). (E1096, E1408, E1444, E2147, E1979, E2158, E1526)
- Save a tool he will reuse into the project repo, not only the chat. (E1546, E1657)
- Documents for other people go out as a downloadable PDF in the white house style; pages he
  reviews himself stay live and dark. (E1049, E0804, E0318, E0777, E2157)

## Before he sees it

- Open it in a real browser and click every tab, control and state at phone and desktop width.
  Run the checker and fix what it reports:
  `node <skill-dir>/scripts/tool-check.mjs <file.html or url>`.
  (E0019, E0088, E0194, E0301, E1994, E0957, E1823)
- Look at the screenshots the checker saves and compare them with his reference; judge what you
  see, not the code. (E1380, E1398, E1512)
- Tick every item on the running list; build anything missing.
  (E0049, E0517, E0562, E1993, E2116, E2153)
- End by saying in one line what is finished and whether anything is left that is ours to do.
  (E1809, E1848, E1855)

The checker covers what a script can see: sideways scroll and spill at five widths, a sidebar
without a working collapse, inner scroll boxes, tiny text, a light page where dark is the default,
controls with nothing saving them, dashes and Oxford commas in visible text, a missing title and
script errors. A tag on an element opts it out when the reason is real: `data-scroll-ok` on a long
list beside a detail area, `data-theme-ok` on a page meant to be light (a PDF style document).
Everything else above is judgment, so the list and the screenshots still decide.

## What is not here

- Mondai product screens: mondai-design and the Mondai kit.
- How he works with Claude in general (deciding, questions, usage, handoffs): the CLAUDE.md files.
