# Claude harness

My personal layer for Claude: the rules, skills and guards that hold in every project, on both of
my Claude accounts. Each project keeps its own layer on top (Mondai keeps its stages, critic, Figma
checks, replay set and product facts in its own repo).

## What is in it

| Piece | What it does |
| --- | --- |
| `CLAUDE.md` | My working preferences and the one home for every personal rule: deciding, holding a position, how to talk to me, copy rules, truth, agents in one batch, usage as a share of the week, handoffs through the ledger, session titles, kept logs |
| `preferences/claude-ai.md` | The claude.ai account preferences, built from `CLAUDE.md` by `scripts/build-preferences.mjs` (paste it into each account; `preferences/MIGRATION.md` shows where each old line went) |
| `skills/unlazy` | Writes gates before substantial work and checks them before anything is called done (MIT, by Leonxlnx; this copy carries the fix from 4 Nov that lets a turn wait on running agents) |
| `skills/humanizer` | Strips the signs of AI writing from copy (MIT) |
| `skills/resource-sourcing` | Searches for an existing skill, plugin or tool before anything is built |
| `skills/tidy` | Reports duplicate, drifted and dead rules and overlapping skills without changing anything, then applies only the fixes I approve |
| `retired.md`, `tidy-keep.txt` | Where removed rules wait two weeks before deletion, and the restatements kept on purpose |
| `scripts/package-skills.sh` | Zips each skill as a whole folder for upload to claude.ai |
| `hooks/usage-guard.sh` | At 75% of the weekly limit it tells Claude to wrap up; at 85% it refuses to start agents or workflows |
| `hooks/turn-check.mjs` | At the end of each turn, blocks a reply with a dash, an Oxford comma or no footer, and one that started a scheduled task, reminder or PR watch nobody asked for in that chat |
| `hooks/unlazy-stop.sh` | Runs unlazy's own check, which refuses a done claim while gates are unmet |
| `hooks/auto-update.sh` | At session start, at most once an hour, pulls the latest harness in the background and reinstalls when it changed |
| `statusline/usage-statusline.sh` | Shows weekly and five hour usage, and saves the weekly figure for the guard |
| `templates/lever-scorecard.md` | The ten lever review, for any project's agent setup |
| `install.sh` | Puts all of the above in place on a computer |
| `cloud/print-setup-script.sh` | Prints the setup script that fetches the current `CLAUDE.md` into cloud sessions at each start |
| `tests/` | Tests for the install, the guard, the turn check, the self update, the cloud setup and the tidy inventory |

## Where each piece reaches

Claude reads these from different places depending on where a session runs, so there are three
ways in (from Anthropic's docs, checked 11 Nov 2026):

| | On a computer | Cloud session | Cowork |
| --- | --- | --- | --- |
| `CLAUDE.md` | install script | setup script | no |
| Account preferences | claude.ai account | claude.ai account (seen 18 Nov 2026) | claude.ai account |
| Skills | install script, or the claude.ai account | claude.ai account only | claude.ai account only |
| Hooks (turn check, unlazy, usage guard) | install script | no: user hooks do not run in the cloud | no |

So the skills also need to be turned on in each claude.ai account; that is the only route into
cloud sessions and Cowork. The account preferences reach every surface, which is why they are
built from `CLAUDE.md` instead of written by hand: in Claude Code both load, so they must never say
different things. A guard that must hold in cloud sessions has to live in that project's
own repo.

## What is enforced and what is only written

Enforced by a tested hook, on a computer: no dashes, no Oxford commas, the footer, nothing scheduled
or watched unasked, unlazy's gates and the usage guard. The tests plant each mistake and check the
hook catches it, and plant clean replies (including two real false alarms) and check it stays quiet.

Written only: deciding, holding a position, plain words, checking before sending, handoffs and
agents in one batch. These need judgment, so no script can hold them.

In cloud sessions none of the personal hooks run. A project that needs these checks there keeps
them in its own repo; Mondai does. When a project runs its own turn check or unlazy hook, the
harness versions stand aside so nothing runs twice.

The turn check blocks at most three times in a row, then lets the turn end and says why, so it can
never trap a session. Every run is logged to `~/.claude/state/turn-check.jsonl`.

## Install on a computer

Do this once on each computer, signed in to the account you use there. It needs git and node.

```bash
git clone https://github.com/ritacompany/claude-harness ~/Code/claude-harness
cd ~/Code/claude-harness
./install.sh
```

Then start a new Claude session. Updates come in by themselves: at the start of a session, at most
once an hour, the harness pulls its latest version in the background and reinstalls if anything
changed. It never overwrites edits made in the folder; those skip the update and say so in
`~/.claude/state/auto-update.log`. Keep the folder where it is, since the links point to it.

What it changes in `~/.claude`:
- links `CLAUDE.md`; if you already had one, it is moved to `CLAUDE.md.before-harness` first
- links each skill, except one whose name you already have (it says which it skipped)
- adds the usage guard and status line to `settings.json` and keeps a dated backup; a status line
  you already have keeps showing first, with the weekly figure added after it (its command is
  saved in `~/.claude/state/statusline-wrapped.json`)

The weekly figure only exists on Pro, Max and Ultra plans. With no figure the guard stays quiet.
The levels can be changed with `HARNESS_WEEKLY_WARN` and `HARNESS_WEEKLY_STOP`.

## Set up each claude.ai account

On each of the two accounts:

1. Skills: run `bash scripts/package-skills.sh` and upload each zip from `dist/skills/` in the skills
   settings on claude.ai (or Customize in the desktop app sidebar), replacing any older copy. Upload
   the whole folder: the account keeps only what is uploaded, so a skill uploaded as SKILL.md alone
   runs without its scripts, templates and references. Skills there reach cloud sessions, Cowork and
   any computer signed in to that account.
2. Preferences: run `node scripts/build-preferences.mjs --stdout` and paste the text over the
   account preferences. Do it again whenever a section marked `surfaces: all` in `CLAUDE.md`
   changes; `node scripts/build-preferences.mjs --check` says when.

## Set up cloud environments

Run `./cloud/print-setup-script.sh` and paste what it prints into the environment's setup script,
at claude.ai/code under the environment's settings, once per environment. At each session start it
fetches the current `CLAUDE.md` from this public repo's main branch (the raw file first, a shallow
clone second), so a change reaches cloud sessions once it is merged and there is nothing to repaste.
If both routes fail, the session starts without the personal layer and its setup log says so.

## Keeping the rules clean

Every personal rule has one home, `CLAUDE.md`. Each section carries an HTML comment with its id, the
surfaces it is for and the phrases that would show it restated somewhere else; comments cost no
context. The tidy skill runs when asked, after a rule is added and at each park. Its inventory is
read only:

```bash
node skills/tidy/scripts/tidy-inventory.mjs --project ../mondai --prefs pasted-preferences.md
```

It reports drift between copies, skills pointing at missing files, dead references, skills loaded
twice or doing the same job, rules restated outside their home and retired rules past their window.
Nothing changes until I approve; removed rules wait in `retired.md` for two weeks, and restatements
kept on purpose go in `tidy-keep.txt`. The research behind it is in `research/hygiene/REPORT.md`.

## Test it

```bash
bash tests/run.sh
```

It installs into a throwaway folder twice and checks the links, the backups, the stop hooks and the
guard at planted levels (90%, 80%, 40%, an old figure and none). It prints `HARNESS TESTS OK` when
every case passes. `node tests/turn-check-cases.mjs` runs the planted replies for the turn check and
prints `TURN CASES OK`. `bash tests/auto-update-test.sh` checks the self update against a throwaway
remote and prints `AUTO UPDATE OK`. `bash tests/cloud-setup-test.sh` runs the printed cloud setup
script with a working and a failing fetch and prints `CLOUD SETUP OK`. `node tests/tidy-cases.mjs`
plants each kind of mess for the tidy inventory and prints `TIDY CASES OK`.
`node scripts/build-preferences.mjs --check` fails when the preferences need rebuilding.

## Why we built it rather than adopting a base

On 11 Nov 2026 I read six community setups and Anthropic's docs. The large ones (ECC,
Superpowers) are coding systems shipped as plugins, and plugins installed in Claude Code on a
computer do not reach cloud sessions (plugins enabled on the claude.ai account do; seen 18 Nov 2026). The
install pattern here borrows from PaulRBerg/dot-claude. The full comparison is
`process/harness-engineering/BASE-RESEARCH.md` in the Mondai repo.
