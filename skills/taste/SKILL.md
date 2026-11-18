---
name: taste
description: Chadwick's researched library of design craft (rules, techniques, terms, textures, trends) with his verdicts. Use when he says taste, taste engine or "add to taste"; when he asks for ideas for a hero, background, section or visual treatment; when building or critiquing a screen, page or graphic and the project's own rules leave the choice open; and when he sends design tip lists or screenshots to save.
---

# Taste

The library lives in the harness repo at `taste/`. Find it in this order:

1. Two folders above this skill's real path (`realpath` of this folder, then `../../taste`).
2. `~/Code/claude-harness/taste` on a computer.
3. In a cloud session, `/home/user/Claude-Harness/taste`; if the repo is not there, attach
   `ritacompany/claude-harness` with add_repo (read access) and clone it.

Read `taste/README.md` once per session before writing to the library. To use it, read only
`taste/INDEX.md` and the entries it points to. Never load the whole entries folder.

## Modes

**Ideas.** Filter INDEX.md by the job's surface and layer. Open the matching entries. Propose
three to five that fit the brief, each with why it fits and where it would break, and draw them
when the job is visual. Entries whose his take says never are out.

**Defaults.** While building, apply every default yes entry whose condition holds, following its
"Defaults to start from".

**Critique.** When judging work, run the "How to check it" line of every matching default yes
entry and report failures with the entry id.

**Capture.** When he sends items, add one line each to INBOX.md with the source and date. Do not
research in the same turn unless he asks.

**Research.** When he asks to research the inbox, follow the research standard in README.md:
three or more opened sources per entry, all sections filled, verify-claims before the row enters
INDEX.md. Use the main model for writing entries; Haiku or Sonnet only for quote checks.

**Verdict.** When he rules on a move in any chat, write his words and the date into the entry's
His take and the INDEX.md row.

## Precedence

The project's own rules and source of truth win, then his take, then the entry. A conflict
between an entry and a project rule goes to him with both sides and your pick.
