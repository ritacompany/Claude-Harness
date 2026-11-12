# Claude harness

My personal layer for Claude: the rules, skills and guards that hold in every project, on both of
my Claude accounts. Each project keeps its own layer on top (Mondai keeps its stages, critic, Figma
checks, replay set and product facts in its own repo).

## What is in it

| Piece | What it does |
| --- | --- |
| `CLAUDE.md` | My working preferences: deciding, holding a position, how to talk to me, copy rules, truth, agents in one batch, usage as a share of the week, lead chat rotation, kept logs |
| `skills/unlazy` | Writes gates before substantial work and checks them before anything is called done (MIT, by Leonxlnx; this copy carries the fix from 4 Nov that lets a turn wait on running agents) |
| `skills/humanizer` | Strips the signs of AI writing from copy (MIT) |
| `skills/resource-sourcing` | Searches for an existing skill, plugin or tool before anything is built |
| `hooks/usage-guard.sh` | At 75% of the weekly limit it tells Claude to wrap up; at 85% it refuses to start agents or workflows |
| `hooks/turn-check.mjs` | At the end of each turn, blocks a reply with a dash, an Oxford comma or no footer, and one that started a scheduled task, reminder or PR watch nobody asked for in that chat |
| `hooks/unlazy-stop.sh` | Runs unlazy's own check, which refuses a done claim while gates are unmet |
| `hooks/auto-update.sh` | At session start, at most once an hour, pulls the latest harness in the background and reinstalls when it changed |
| `statusline/usage-statusline.sh` | Shows weekly and five hour usage, and saves the weekly figure for the guard |
| `templates/lever-scorecard.md` | The ten lever review, for any project's agent setup |
| `install.sh` | Puts all of the above in place on a computer |
| `cloud/print-setup-script.sh` | Prints the setup script that puts `CLAUDE.md` in place in cloud sessions |
| `tests/run.sh` | Tests the install and the guard in a throwaway folder |

## Where each piece reaches

Claude reads these from different places depending on where a session runs, so there are three
ways in (from Anthropic's docs, checked 11 Nov 2026):

| | On a computer | Cloud session | Cowork |
| --- | --- | --- | --- |
| `CLAUDE.md` | install script | setup script | no |
| Skills | install script, or the claude.ai account | claude.ai account only | claude.ai account only |
| Hooks (turn check, unlazy, usage guard) | install script | no: user hooks do not run in the cloud | no |

So the skills also need to be turned on in each claude.ai account; that is the only route into
cloud sessions and Cowork. A guard that must hold in cloud sessions has to live in that project's
own repo.

## What is enforced and what is only written

Enforced by a tested hook, on a computer: no dashes, no Oxford commas, the footer, nothing scheduled
or watched unasked, unlazy's gates and the usage guard. The tests plant each mistake and check the
hook catches it, and plant clean replies (including two real false alarms) and check it stays quiet.

Written only: deciding, holding a position, plain words, checking before sending, lead chat rotation
and agents in one batch. These need judgment, so no script can hold them.

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

On each of the two accounts, open the skills settings on claude.ai (or Customize in the desktop
app sidebar). Turn on `unlazy`, `humanizer` and `resource-sourcing`, or upload them from `skills/`
as zipped folders where the account does not have them yet. Skills turned on there reach cloud
sessions, Cowork and any computer signed in to that account.

## Set up cloud environments

Run `./cloud/print-setup-script.sh` and paste what it prints into the environment's setup script,
at claude.ai/code under the environment's settings. Do it once per environment, and again whenever
`CLAUDE.md` changes. The text goes in whole because a setup script cannot download a private repo
by itself.

## Test it

```bash
bash tests/run.sh
```

It installs into a throwaway folder twice and checks the links, the backups, the stop hooks and the
guard at planted levels (90%, 80%, 40%, an old figure and none). It prints `HARNESS TESTS OK` when
every case passes. `node tests/turn-check-cases.mjs` runs the planted replies for the turn check and
prints `TURN CASES OK`. `bash tests/auto-update-test.sh` checks the self update against a throwaway
remote and prints `AUTO UPDATE OK`.

## Why we built it rather than adopting a base

On 11 Nov 2026 I read six community setups and Anthropic's docs. The large ones (ECC,
Superpowers) are coding systems shipped as plugins, and plugins do not load in cloud sessions. The
install pattern here borrows from PaulRBerg/dot-claude. The full comparison is
`process/harness-engineering/BASE-RESEARCH.md` in the Mondai repo.
