# Keeping the agent setup clean without losing rules

Research done 18 Nov 2026 in a cloud session. Supporting files in this folder: `sourcing.md` (the tool
survey), `deep-research.md` (published practice and evidence), `claims.md` (every external claim with
an independent check), `measure-dup.mjs` (the measurement below, rerunnable) and `snapshot/` (what this
session actually loaded).

## Answer in short

Nobody has solved this whole. The built in `/doctor prompt-audit` in Claude Code and a handful of
community skills each cover a slice, and none of them reads the claude.ai account preferences, handoff
files and every project at once. The research is consistent on how to clean safely: report first, one
home per rule, small edits instead of rewrites, a quarantine before any delete and a proof requirement
for every removal.

The bigger finding is in your own setup: most of the duplication comes from how rules reach each
surface. Every judgment rule in your CLAUDE.md is written in at least three places
that all load into a cloud session, and one of those copies has already drifted. So the fix is half
structure (fewer copies by design) and half a light, report only tidy pass that you approve.

## What I measured in your setup

Measured by `measure-dup.mjs` against the files this cloud session loaded and the harness repo. Each
figure is rechecked by the script against this file.

### One rule, many homes

| Rule | Places it is written |
| --- | --- |
| No dashes | 6 <!-- dup:dashes=6 --> |
| No Oxford commas | 5 <!-- dup:oxford-comma=5 --> |
| Never invent facts | 4 <!-- dup:never-invent=4 --> |
| Default to deciding | 3 <!-- dup:default-to-deciding=3 --> |
| Ask only what only I hold | 3 <!-- dup:ask-only-what-i-hold=3 --> |
| One question or none | 3 <!-- dup:one-question=3 --> |
| No status messages | 3 <!-- dup:no-status-messages=3 --> |
| Lead with the answer | 3 <!-- dup:lead-with-answer=3 --> |
| No implied shared memory | 3 <!-- dup:no-implied-memory=3 --> |
| Agreement is a complete answer | 3 <!-- dup:agreement-complete=3 --> |
| Separate checked from inferred | 3 <!-- dup:checked-vs-inferred=3 --> |

The places are: the claude.ai account preferences, the CLAUDE.md pasted into cloud sessions, the
harness CLAUDE.md, the harness README, the humanizer skill and the turn check hook. Not all of these
are waste. The hook enforces the dash and comma rules, so its copy is the enforcement, not a
duplicate. The humanizer's "never invent facts" is scoped to rewriting copy and belongs there. The
waste is the three prose copies of every judgment rule: account preferences, the cloud copy and the
harness CLAUDE.md, worded differently, all loaded together.

### The account preferences reach Claude Code

The research agent could not find a doc that says
whether claude.ai preferences load in Claude Code. They do: this cloud session received them in full,
next to the CLAUDE.md. I checked this directly.

### One copy has already drifted

The CLAUDE.md pasted into cloud sessions is missing the rule "Design
is explored in Claude Code first". It was added to the harness after the setup script was pasted, and
nothing noticed. This is the stale copy problem in miniature.

### Skills load twice

19 skills <!-- dup:skills-loaded-twice=19 --> arrive both from a plugin and
from the claude.ai account under the same name (all the Figma skills, design critique, accessibility
review, UX copy and others). The account carries 152 skills <!-- dup:account-skills=152 -->, and every
one adds its description to every session.

### Overlapping skills that disagree

Four ways to hand work over, with four different homes: the
CLAUDE.md lead chat rotation (a short file kept in git), the ledger protocol in the account preferences
(LEDGER.md), the `handoff` skill (the operating system's temp folder, which dies with the container) and
the `remember` skill (a `.remember` folder). Also `grill-me` next to `grilling`, and a
`memory-management` skill that drives a tool (claude-flow) this setup does not use.

### Skills point at files that are not there

The copies the claude.ai account serves contain
only each SKILL.md, so 10 files <!-- dup:missing-skill-files=10 --> the skills tell Claude to read are
missing in cloud sessions: nine of unlazy's templates and references, plus resource-sourcing's
`references/sources.md`, which does not exist in the harness either. unlazy's scripts are missing too.
This session had to fetch the harness repo to run gates at all.

### A real contradiction

The humanizer skill says a writing sample outranks its em dash rule ("if the
sample uses em dashes, keep them"). Your CLAUDE.md says no dashes in every reply and file, and the hook
blocks them. One of these has to win on purpose.

### The same file twice in one session

When a session works inside the harness repo, the harness
CLAUDE.md loads as the user file and again as the project file. Anthropic's docs say all CLAUDE.md
files are joined rather than one replacing another, so the content is in context twice.

## What exists

Every candidate was read from its own files, not its listing. Full notes in `sourcing.md`.

### 1. Claude Code `/doctor prompt-audit` (built in, Anthropic)

- Link: https://code.claude.com/docs/en/memory
- Last updated: 2026-11-18 (docs page as read; the command arrived in Claude Code 2.1.283, this
  container runs 2.1.327)
- Does: reads CLAUDE.md, AGENTS.md, rules, skills, commands and agents in the project and in
  `~/.claude`, and reports instructions written for older models, references to missing files or
  commands and files that contradict each other. Nothing changes until you ask. It refuses to edit the
  global layer because one project disagrees with it.
- Misses: the claude.ai preferences, handoff and memory files, and counting one rule across files is
  not a stated goal.
- Test run on the harness: see "The built in audit, tested" below.

### 2. setup-audit (jdickey1)

- Link: https://github.com/jdickey1/claude-skills/tree/main/plugins/setup-audit
- Last updated: 2026-05-06
- Does: one report only pass over the global CLAUDE.md, project CLAUDE.md files, skills, memory and
  hooks. Tests each rule for restating defaults, contradicting another rule, duplicating one (with a
  "keep which" column), being a one off fix or being vague. Says to "err on the side of keeping".
- Misses: thin (0 stars, 4 commits), memory path hard coded to the author's machine, no handoff files
  or account preferences.

### 3. extract-ssot in docs-hygiene (Melodic Software)

- Link: https://github.com/melodic-software/claude-code-plugins/tree/main/plugins/docs-hygiene/skills/extract-ssot
- Last updated: 2026-11-17
- Does: gives one repeated block of markdown a single home and rewrites the other places to point at
  it. Rule of three: no new shared file for fewer than three copies. Every decision must rest on a
  read or search done in the same session. Has an undo action.
- Misses: one git repo only; its execute mode writes and commits by default.

### 4. memory-sync from claude-brewcode (Maksim Kochetkov)

- Link: https://github.com/kochetkov-ma/claude-brewcode/tree/main/brewdoc/skills/memory-sync-setup
- Last updated: 2026-11-17
- Does: generates a project skill that checks facts, removes duplicates, then compresses, with an
  independent read only checker on every edited batch. The best deletion safeguards found: "an
  unproven duplicate stays", salvage before removal, the global layer is reported and never written.
- Misses: deletes by default once installed and forbids any file from growing; more aggressive than
  you want.

### 5. ctxlint (Yaw Labs)

- Link: https://github.com/YawLabs/ctxlint
- Last updated: 2026-11-16
- Does: a Node command line check for broken paths, wrong commands, stale memory entries and skill
  trigger collisions. Widely used (about 156,000 npm downloads in the last month).
- Misses: does not compare prose rules across files, so it does not touch the core duplication.

### 6. instrlint (Jed Lin)

- Link: https://github.com/jed1978/instrlint
- Last updated: 2026-04-10
- Does: flags near duplicate rule lines (a word overlap score of 0.7 or more) and simple contradictions inside one
  project's CLAUDE.md and rules.
- Misses: paraphrased copies mostly slip under its threshold; does not read `~/.claude` or skills.

Also looked at and rejected: Anthropic's `claude-md-management` plugin (it names duplicate text across
CLAUDE.md files as a red flag but only proposes additions, never merges), reflect-memory (sound deletion rule but one file only, and it edits without asking
for the mechanical class) and a dozen listing only linters with schema checks and nothing on
duplicates.

## The built in audit, tested

I ran `/doctor prompt-audit` on the harness in read only mode to test whether it could be the whole
answer. It edited nothing. Its report is kept here as `prompt-audit-full.md`.

What it caught that I had not: nine Figma skills whose account copies are older than the plugin copies
and disagree with them, a custom cursor rule recommended in one design skill and banned in another,
dated phrasing in several account skills ("Think step by step", shouted MUST and NEVER) and the
missing design line in the copy of CLAUDE.md. It also flagged your "No progress or status messages"
rule as the kind of line that makes the current model go quiet, because its own run needed two nudges
from the platform to post a status line. This session got the same nudges several times, so the platform
and that rule are pulling against each other.

What it missed: it does not read the account preferences, so the three prose copies of every judgment
rule never came up. It treats identical duplicate skills as "working redundancy, not a finding", which
is the opposite of your concern. It did not notice the ten missing skill files, the four handoff
mechanisms, `grill-me` next to `grilling` or the humanizer dash conflict.

Verdict: it is a good second opinion inside one project. It cannot be the hygiene process on its own.

## What the research says

Full evidence with quotes and links in `deep-research.md`. Each claim there went through an
independent check; results in `claims.md`.

1. Anthropic's docs say every CLAUDE.md is joined into one context, and when two
   instructions contradict, "Claude may pick one arbitrarily". User and project rules do not override
   each other either. So if paraphrased copies drift, the agent picks one without telling you. A study of conflicting instructions found models rarely flag the conflict.
2. In a study of AGENTS.md style files, agents
   followed the files closely, ran more steps and some re-read files already in context. This is the
   closest measured match to your "extra turns verifying" problem. Neither the research nor the independent
   check found a study of one rule copied across several files, so the link is plausible, not proven.
3. The ACE paper measured a model rewriting its own notes in one pass:
   18,282 tokens became 122 and accuracy fell below the no notes baseline. Safe curation there uses
   stable item ids, small additions and edits merged by plain code and a separate dedup step.
4. Mem0's curator chooses add, update, delete or no change per item, and its
   graph version marks old facts invalid instead of erasing them.
5. `/doctor prompt-audit` changes nothing until you
   approve. Its plain `/doctor` trim keeps "pitfalls, rationale, and conventions that differ from tool
   defaults": a usable definition of load bearing.
6. One home per fact with pointers elsewhere, decision
   records marked superseded rather than deleted, soft delete with a recovery window, a tombstone left
   where something was removed and one commit per change so `git revert` undoes it. HTML comments in
   CLAUDE.md are stripped before loading, so a tombstone or a "why this rule exists" note costs nothing.
7. Anthropic's best practices page says a rule that
   cannot bend should be a hook, and warns that at forty hooks most are preferences. Your harness
   already does this for dashes, commas, the footer and nothing unasked.

## Recommendation

Fix the structure first, then add a small tidy pass that only reports and only changes what you
approve. Do not adopt any tool whole.

### Structure, which removes most duplicates by design

1. Make the harness CLAUDE.md the one home for every personal rule, and give each rule a short id in
   an HTML comment (free in context) with one line on why it exists.
2. Shrink the account preferences to what CLAUDE.md cannot reach: the claude.ai chat and Cowork. Since
   they also load in Claude Code, keep them short and generate them from the CLAUDE.md with a script so
   the two can never say different things.
3. Stop pasting CLAUDE.md into cloud environments. The harness repo is public, so the setup script can
   fetch the current file at session start; the pasted copy is the one that already drifted. If the
   environment's network blocks GitHub's raw file host, a drift check in the harness tests is the
   fallback.
4. Pick one handoff mechanism (your CLAUDE.md's rotation file in git, which the ledger can be) and turn
   off `handoff`, `remember` and `grill-me` in the account. Turn off the account copies of the skills a
   plugin already provides, and `memory-management`.
5. Upload unlazy and resource-sourcing to the account as full folders so their scripts and references
   exist in cloud sessions, and fix resource-sourcing's missing `references/sources.md`.
6. Decide the humanizer dash conflict in one line in CLAUDE.md.

### The tidy pass, which keeps it clean

A `tidy` skill in the harness, adapted from setup-audit's report
with extract-ssot's one home rule and brewdoc's proof rules, plus an inventory script grown from
`measure-dup.mjs`. It runs when you ask, when a rule is added and at each park or handoff. It never runs on a
schedule. It produces one list of findings, each with a class (duplicate, drift, contradiction, dead
reference, overlap, stale), quoted proof and a proposed action, where "leave it" is always allowed. You
approve in one pass. Changes land as one small commit per finding. Run `/doctor prompt-audit` beside it
on a computer for stale and contradicting text inside each project.

### What would change it

The test above shows `/doctor prompt-audit` does not read the account
preferences or handoff files and accepts identical duplicates. If a later version covers those, it
becomes the tidy pass and the custom skill shrinks to the inventory script. If Mondai turns out to restate many personal rules in its
own repo (I could not open it from here), the inventory needs a cross repo mode before anything else.

## Safeguards against deleting what matters

1. A copy may be removed only if its home loads on every surface where the copy loads. The account
   preferences copy is load bearing for Cowork today, so "dedupe" there means shrink and generate, not
   delete.
2. A duplicate claim must quote both lines. An unproven duplicate stays.
3. Enforcement is not duplication: a rule keeps its prose line and its hook. A rule restated inside a
   skill for that skill's job (humanizer's "never invent facts") is scoped, not duplicate.
4. No model rewrites a whole file. Edits are named, small and one per commit.
5. Nothing is removed for age or disuse. A rule that prevents a rare mistake looks unused until the day
   it matters.
6. Removal is two step: the rule moves to a retired file that does not load, with the date, the reason
   and a tombstone comment where it was. It is deleted after two weeks with no regression, and `git
   revert` undoes either step.
7. The checker is not the writer: the inventory script recounts after every change, and the harness
   tests rerun.
8. Every removal is listed in the next handoff, so the next sessions are checked against it.

## Sources

Primary sources behind the claims in this report. All 48 are listed with read dates in
`deep-research.md`.

1. https://code.claude.com/docs/en/memory
2. https://code.claude.com/docs/en/best-practices
3. https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
4. https://arxiv.org/abs/2510.04618 (Agentic Context Engineering)
5. https://arxiv.org/abs/2504.19413 (Mem0)
6. https://arxiv.org/abs/2602.11988 (evaluating AGENTS.md files)
7. https://github.com/jdickey1/claude-skills/tree/main/plugins/setup-audit
8. https://github.com/melodic-software/claude-code-plugins/tree/main/plugins/docs-hygiene/skills/extract-ssot
9. https://github.com/kochetkov-ma/claude-brewcode/tree/main/brewdoc/skills/memory-sync-setup

## Not checked

- The Mondai repo: access to it was refused in this session, so its copies of personal rules are not
  counted.
- Cowork: I could not see what loads there; the surface claims come from the harness README and
  Anthropic's docs.
