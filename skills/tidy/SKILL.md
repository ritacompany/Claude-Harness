---
name: tidy
description: Report what has drifted from "one home per rule" across the personal layer, projects, skills, memory, handoff files and the claude.ai preferences, then apply only the fixes the owner approves. Use when the owner says tidy, clean up the rules or audit the setup, after a rule is added to CLAUDE.md and at each park.
---

# Tidy

Keep the rules clean without losing one. Every personal rule has one home, the harness `CLAUDE.md`.
This skill finds where that has slipped and proposes the smallest fix. It never deletes on its own,
and doing nothing is always an allowed answer for a finding.

Borrowed, with thanks: the five tests and "err on the side of keeping" from jdickey1's setup-audit,
the one home rule and evidence discipline from Melodic Software's extract-ssot and the proof and
salvage rules from claude-brewcode's memory-sync. The reasons behind each safeguard are in
`research/hygiene/REPORT.md` in the harness repo.

## 1. Inventory (read only)

Run the inventory that ships in this skill's `scripts` folder. It finds the harness by itself when
the skill sits in the harness repo or install.sh linked it; otherwise pass `--harness <folder>`. Add
every project the owner works in that is on this machine, and the owner's pasted claude.ai
preferences if they gave them:

```bash
node <skill-dir>/scripts/tidy-inventory.mjs --project <path> --prefs <pasted-preferences.md> --out tidy-report.md
```

It reports these classes, each with the lines it rests on:

| Class | What it means |
| --- | --- |
| drift | a copy no longer matches its source: generated preferences, a pasted CLAUDE.md, an account copy of a harness skill |
| missing-file | a skill tells Claude to read a file that is not there |
| dead-reference | a CLAUDE.md names a file that is not there |
| loaded-twice | one skill name arrives from two sources |
| overlap | several skills do one job (for example more than one handoff method) |
| restated | a rule's match phrase appears outside its home |
| near-duplicate | a sentence says what a CLAUDE.md sentence says |
| retired-due | a retired rule has passed its two week window |
| size | a CLAUDE.md over 200 lines, or a MEMORY.md past the 200 lines that load |

Without the harness folder (a Cowork session, for example), read the files yourself and use the
same classes.

## 2. Judge each finding

Read both ends of every finding yourself; the inventory is a lead list, not proof. Then also look
for what a script cannot see: two rules that cannot both be followed, a rule written for an older
model and a rule that restates what Claude does by default. For each finding decide one of:

- **Leave it.** A rule restated inside a skill for that skill's job, a hook that enforces a rule and
  docs that describe the setup are not duplicates. Propose a line for `tidy-keep.txt` so it stops
  coming back.
- **Point to the home.** Replace a restatement with a pointer to the `CLAUDE.md` section, or remove
  it if the home already loads everywhere the copy loads.
- **Move it home.** A rule that exists only outside `CLAUDE.md` (an account preference with no home,
  a rule in one project that is really personal) moves into `CLAUDE.md` first, then the copy goes.
- **Regenerate or re-upload.** Drift in generated or uploaded copies is fixed at the source, then
  rebuilt: `node scripts/build-preferences.mjs` and `bash scripts/skill-zip.sh` in the harness.
- **Turn off.** A skill loaded twice or a second skill for one job is turned off in the claude.ai
  account by the owner.
- **Resolve.** A contradiction needs the owner's one line answer on which rule wins.

## 3. Safeguards (all of them, every time)

1. **Surfaces.** A copy may go only if its home loads on every surface where the copy loads. The
   claude.ai preferences reach Cowork and chat; CLAUDE.md does not. Check the table in the harness
   README before removing anything.
2. **Quoted proof.** A duplicate claim quotes both lines. An unproven duplicate stays.
3. **No loss on a move.** Before a copy is replaced, every sentence in it has a home, listed the way
   `preferences/MIGRATION.md` lists the old preferences.
4. **Small edits.** Never rewrite a whole file. One finding, one small edit, one commit.
5. **No age rule.** Nothing is removed for being old or unused. A rule that prevents a rare mistake
   looks unused until the day it matters.
6. **Two step removal.** A removed rule goes to `retired.md` under `## <YYYY-MM-DD> <rule id>` with
   the text, where it lived and why it went, and the old spot keeps an HTML comment tombstone
   (`<!-- retired <date>: <rule id>, see retired.md -->`), which costs nothing in context. Delete the
   entry after two weeks with no regression, in its own commit.
7. **The checker is not the writer.** After applying, rerun the inventory and the harness tests
   (`bash tests/run.sh`, `node tests/tidy-cases.mjs`, `node scripts/build-preferences.mjs --check`).
8. **Remember what changed.** List every removal in the ledger or handoff, so the next sessions are
   checked against it.
9. **Edit at the source.** Account skills sync from claude.ai and a local edit is overwritten; plugin
   skills belong to their repos. Change the harness and re-upload, or tell the owner what to switch.

## 4. Report to the owner

One list, most important first. For each finding: the class, the quoted lines, the proposed action,
the surface check and what could go wrong. Group the account switches (preferences to paste, skills
to upload or turn off) at the end, since only the owner can do them. Change nothing until the owner
approves, then apply only what was approved.
