# Deep research: keeping an instruction set clean without losing what matters

All sources were read on 2026-11-18. Numbers in square brackets point to the numbered list under "Sources".

Each finding carries one of three labels:

- Official: what Anthropic's docs, changelog or engineering posts say.
- Measured: a result from a study with a stated method.
- Opinion: a practitioner's view, including Anthropic staff writing on a blog.

Where I drew a conclusion that no source states, I mark it as inference.

## 1. What Anthropic says about keeping CLAUDE.md, memory, skills and settings lean

### Size

Official. The memory page says: "target under 200 lines per CLAUDE.md file. Longer files consume more context and reduce adherence." [1] The features overview repeats the rule of thumb: "Keep CLAUDE.md under 200 lines. If it's growing, move reference content to skills or split into `.claude/rules/` files." [3]

Official. Claude Code warns at startup and in `/status` when an instruction file is over the recommended length. It also warns "when files that are each within that length add up past a combined limit at session start. Each CLAUDE.md, rules file, and `@path` import counts as a separate file." [1] A file over 4 MiB is skipped entirely. [1]

Official. Files that load on demand (a subdirectory CLAUDE.md, rules in a subdirectory, path-scoped rules) have a per-file limit. With a 200K context window it is 40,000 characters, and Claude gets only the start of a longer file. [1]

Official. The best practices page explains why size matters: "every line in it takes a little of Claude's attention on *every* task, whether it's relevant or not." It lists what belongs: the commands that confirm work, places where the code misleads, decisions not in the repo and "Anything you've had to correct twice already". [2] Its table of retired advice says to stop describing architecture and file layout in CLAUDE.md because "Claude reads the repo itself." [2]

Official. The context engineering post sets the general goal as "the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome", and adds that "minimal does not necessarily mean short". [7]

### Imports

Official. CLAUDE.md can import files with `@path/to/import`. Relative paths resolve from the importing file. Imports can nest "with a maximum depth of four hops". [1]

Official. Imports do not save context: "Imports help you organize a long file but don't reduce its context cost, because imported files load together with the CLAUDE.md that imports them." [1]

Official. Block-level HTML comments (a maintainer note wrapped in HTML comment markers) in CLAUDE.md are stripped before injection, so they cost no context tokens. Comments inside code blocks are kept. [1] This is the cheapest place to leave a note for a human, such as why a rule exists or where a retired rule went.

### The hierarchy and which file wins

Official. CLAUDE.md files live at four scopes: managed policy, user (`~/.claude/CLAUDE.md`), project (`./CLAUDE.md` or `./.claude/CLAUDE.md`) and local (`./CLAUDE.local.md`). [1]

Official. No CLAUDE.md file overrides another. "All discovered files are concatenated into context rather than overriding each other." Content is ordered from the filesystem root down to the working directory, and `CLAUDE.local.md` is appended after `CLAUDE.md` at each level. [1] The features overview says: "When instructions conflict, Claude uses judgment to reconcile them." [3]

Official. The memory page names the risk of contradictions twice: "if two instructions contradict each other, Claude may pick one arbitrarily", and for user and project rules, "Neither set overrides the other: if a user rule and a project rule conflict, Claude may follow either one, so keep the two consistent." [1]

Official. Settings are different. They do have a strict order: managed settings, then command line, then project local, then shared project, then user. List keys such as `permissions.allow` merge across files instead of overriding. [5] Skills with the same name override by priority, "managed > user > project", and hooks from every source all fire. [3]

Official, with a gap. The claude.ai help center describes account instructions as "account-wide settings" and says "Any instructions you add here will be applied to all of your conversations with Claude." It does not mention Claude Code. [11] The Claude Code memory page lists no claude.ai account setting among its instruction sources. [1] I found no page that says either way whether claude.ai preferences reach Claude Code sessions, so whether that restatement costs context in Claude Code is unverified.

### Rules directories

Official. Markdown files in `.claude/rules/` are discovered recursively. A rule with no `paths` frontmatter loads "at launch with the same priority as `.claude/CLAUDE.md`". A rule with `paths` loads only when Claude reads or edits a matching file. [1] Personal rules in `~/.claude/rules/` apply to every project. [1] The directory supports symlinks, so one set of rules can be linked into several projects. [1]

Opinion (Anthropic staff blog). "An unscoped rule is mechanically identical to putting the content in CLAUDE.md". [9] Splitting text into unscoped rule files reorganizes it but does not shrink it.

### Skills and progressive disclosure

Official. In a regular session only skill descriptions sit in context. "Full skill content only loads when invoked." [4] The engineering post calls progressive disclosure "the core design principle that makes Agent Skills flexible and scalable". [8]

Official. The combined `description` and `when_to_use` text "is truncated at 1,536 characters in the skill listing". [4] Setting `disable-model-invocation: true` removes the description from context until the user invokes the skill. [3] [4]

Official. "Keep `SKILL.md` under 500 lines. Move detailed reference material to separate files." [4] Once invoked, a skill "stays there across later turns", so "every line is a recurring token cost". [4] After compaction Claude Code re-attaches the most recent invocation of each skill, "keeping the first 5,000 tokens of each", within "a combined budget of 25,000 tokens". [4]

Official. "If descriptions are vague or overlap, Claude may load the wrong skill or miss one that would help." [3] Overlap between skills is a hygiene problem in its own right.

### How often to review and the tools for it

Official. The docs give no fixed interval. They say to "Review your CLAUDE.md files, nested CLAUDE.md files in subdirectories, and `.claude/rules/` periodically to remove outdated or conflicting instructions." [1] The features overview names triggers instead of a calendar: "A repeated mistake or a recurring review comment is a CLAUDE.md edit". [3]

Official. `/doctor prompt-audit` checks CLAUDE.md, CLAUDE.local.md, AGENTS.md and the rules, skills, commands, subagents and output styles under `.claude/` and `~/.claude/`. It looks for "instructions written for older models, references to files or commands that don't exist, and files that contradict each other." The important detail for safety: "nothing in your files changes until you ask Claude to apply them." It needs v2.1.283 or later. [1]

Official. Plain `/doctor` proposes trims for a checked-in CLAUDE.md: "it cuts content Claude can derive from the codebase, such as directory layouts, dependency lists, and architecture overviews, and keeps pitfalls, rationale, and conventions that differ from tool defaults." [1] The keep list is a useful definition of load bearing.

Official. The `InstructionsLoaded` hook can "log which `CLAUDE.md` and rules files are loaded, when they load, and why." [1] `/context all` lists the memory files that loaded. [1]

### The "#" shortcut and /memory

Official. The `#` shortcut is gone. The changelog entry for 2.0.70 reads: "Removed # shortcut for quick memory entry (tell Claude to edit your CLAUDE.md instead)". [6] Today `/memory` lists the memory files, opens them in an editor and toggles auto memory. Asking Claude to "remember" something saves it to auto memory, and asking it to "add this to CLAUDE.md" edits CLAUDE.md. [1]

### Auto memory

Official. Auto memory is on by default in local sessions. Claude writes notes of four types (`user`, `feedback`, `project`, `reference`) to `~/.claude/projects/<project>/memory/`, with a `MEMORY.md` index of one line per memory. [1]

Official. Auto memory deduplicates against CLAUDE.md by design: Claude "skips anything your CLAUDE.md files already say." [1]

Official. The first 200 lines or 25KB of `MEMORY.md` load each session, whichever comes first. Near the limit, Claude Code reminds Claude to "keep one line per entry, move detail into topic files, and merge or drop stale entries." Over the limit, the write succeeds but the rest is dropped on the next load. [1]

Official. Memory files carry a `modified` timestamp in their frontmatter, which "shows how current the fact is". [1] Auto memory is machine-local and is not shared across machines or cloud environments, and it is excluded from the transcript cleanup sweep. [1] Inference: memory on a laptop and memory in a cloud container can drift apart, and neither is in git unless the owner puts it there.

### Hooks versus prose

Official. "If something has to happen every time, make it a hook, a deny rule, or a managed setting. `CLAUDE.md` is for guidelines, and Claude is allowed to decide a guideline doesn't apply." [2]

Official. On emphasis: "piling on emphasis mostly makes Claude over-apply the rule. If it's a rule that can't bend, turn it into a hook or a deny rule. If the line is getting lost in a long file, the file needs to be shorter." [2]

Official. On the opposite failure: "keep the enforced set small. Every hook and deny rule will occasionally fire when it shouldn't, and someone has to maintain each one. If you ever find yourself at forty of them, most are probably preferences that Claude could have weighed on its own." [2]

## 2. The cost of bloat and duplication

### Measured findings

Instruction count. IFScale gave 20 models up to 500 keyword-inclusion instructions in a report-writing task. "Even the best frontier models only achieve 68% accuracy at the max density of 500 instructions." [12] The strongest reasoning models kept "near-perfect performance through 150 or more instructions before declining". Others declined linearly or exponentially. [13] Errors were mostly omissions, not distortions: "Models overwhelmingly err toward omission errors as instruction density increases." [13] Bias toward earlier instructions peaked "around 150-200 instructions" and flattened at 300 or more. [13] Limits: each instruction was "include this keyword", which is far simpler than a behavioral rule. The models date from mid-2025.

Context length. Chroma tested 18 models and found "model performance varies significantly as input length changes, even on simple tasks." "Even a single distractor reduces performance relative to the baseline". [14] Limits: these are retrieval and repetition tasks, not instruction following.

Position. Lost in the Middle found performance "is often highest when relevant information occurs at the beginning or end of the input context, and significantly degrades when models must access relevant information in the middle of long contexts". [15] Limits: 2023 models.

Context files in real coding agents. Gloaguen and colleagues ran coding agents with and without AGENTS.md style files on SWE-bench and on a new benchmark built from repositories with developer-written files. "Providing context files does not generally improve task success rates, while increasing inference cost by over 20% on average." [16] Developer-written files improved performance "by 2.4% on average (p = 21%)", which is not significant, and they did significantly better than LLM-generated files (p = 3.8%). [17] The agents did follow the files: "instructions in context files are well followed", which "leads to increased exploration, testing, and reasoning". [17] One model spent extra steps "issuing multiple commands to find the context files and (ii) reading them (multiple times) despite them being already included in the agent's context." [17] Length did not explain the result: "We observe no clear dependency between the success rate or the per-instance cost and the context file length." [17] The authors' advice: human-written files "should only include instructions required for coding agents that are not already present in the README". [17]

A second study points the other way on cost. Across 10 repositories and 124 pull requests, AGENTS.md was "associated with a lower median runtime (Δ28.64%) and reduced output token consumption (Δ16.58%), while maintaining a comparable task completion behavior." [18]

How files grow. A study of 2,303 context files from 1,925 repositories found they "are not static documentation but complex, difficult-to-read artifacts that evolve like configuration code through frequent, small additions." [19] An earlier study of 253 CLAUDE.md files found content "dominated by operational commands, technical implementation notes, and high-level architecture." [20]

Conflicting instructions. IHEval (3,538 examples) found "All evaluated models experience a sharp performance decline when facing conflicting instructions", and the best open-source model resolved conflicts with 48% accuracy. [21] ConInstruct found that strong models detect conflicts well (Claude 4.5 Sonnet scored an average F1 of 87.3%), yet "LLMs rarely explicitly notify users about the conflicts or request clarification". [22] Inference for this setup: a contradiction between two copies of a rule is likely to be resolved silently, one way or the other, without the owner hearing about it.

Repetition. Google researchers repeated the whole input prompt. Without reasoning, "Prompt repetition wins 47 out of 70 tests, with 0 losses." [24] With reasoning on, the result was "neutral to slightly positive (5 wins, 1 loss, 22 ties)". [24] A padding control of equal length did not help, which points to repetition of content rather than length. [24] Limits: this is verbatim repetition of the whole prompt in one place. It says nothing about paraphrased copies of one rule spread across six files, and Claude Code sessions usually run with reasoning on.

What is not measured. Neither this search nor an independent check found a study of restating a single rule in several instruction files of one agent setup. The nearest, arXiv 2605.10039, tests file architecture and contradictions. The evidence above is indirect. It says that more instructions and more tokens lower adherence at scale, that conflicts cut compliance sharply and get resolved silently, that agents follow what they read and spend steps doing so and that exact repetition of a whole prompt helps only when reasoning is off.

### Official guidance that is not a measurement

Official. "If two instructions contradict each other, Claude may pick one arbitrarily." [1] "Longer files consume more context and reduce adherence." [1] "Piling on emphasis mostly makes Claude over-apply the rule." [2] These are Anthropic's statements, not published experiments.

Official. "Overly aggressive compaction can result in the loss of subtle but critical context whose importance only becomes apparent later." [7] This is the closest Anthropic statement to the owner's worry about over cleaning.

### Practitioner opinion

Opinion. HumanLayer claims that "as instruction count increases, instruction-following quality decreases uniformly" and that "Claude Code's system prompt contains ~50 individual instructions". [44] The first claim sits uneasily with IFScale's measured primacy effect in the 150 to 200 range. [13] The second comes from their own proxy logging and is not checkable from the post.

Inference about wasted verifying turns. Copies of one rule in several places give the agent several sources to reconcile. The measured re-reading behavior [17] and the official note about arbitrary picks [1] make it plausible that duplication drives extra checking. No study measures this directly.

## 3. Published methods for curating an evolving instruction or memory set

### Agentic Context Engineering (ACE)

Measured. ACE names two failure modes of LLM-curated context. Brevity bias "drops domain insights for concise summaries". Context collapse is where "iterative rewriting erodes details over time." [25] The worked example: "at step 60 the context contained 18,282 tokens and achieved an accuracy of 66.7, but at the very next step it collapsed to just 122 tokens, with accuracy dropping to 57.1", worse than the 63.7 baseline with no adaptation. [26] The authors call this "a fundamental risk of end-to-end context rewriting". [26]

ACE's safeguards:

- Itemized entries. Context is "a collection of structured, itemized bullets", each with "a unique identifier and counters tracking how often it was marked helpful or harmful". [26]
- Delta updates instead of rewrites. The Curator writes "compact delta entries, which are merged deterministically into the existing context by lightweight, non-LLM logic." [26]
- Grow and refine. "Bullets with new identifiers are appended, while existing bullets are updated in place". Then "a de-duplication step then prunes redundancy by comparing bullets via semantic embeddings." This runs "proactively (after each delta) or lazily (only when the context window is exceeded)". [26]

Measured. ACE reported "+10.6% on agents and +8.6% on finance". [25] Its stated limit is "reliance on a reasonably strong Reflector". [26]

Note the tension. ACE argues "contexts should function not as concise summaries, but as comprehensive, structured playbooks". [26] That is a claim about task playbooks for long-context models, not about always-loaded rule files, but it is a real counterweight to "shorter is always better".

### Mem0

Measured and described. For each candidate fact, Mem0 lets the LLM pick one of four operations: "ADD for creation of new memories when no semantically equivalent memory exists; UPDATE for augmentation of existing memories with complementary information; DELETE for removal of memories contradicted by new information; and NOOP when the candidate fact requires no modification". [28] Its graph variant does not hard delete. An update resolver marks outdated relationships "as invalid rather than physically removing them to enable temporal reasoning." [28] Reported results include a "91% lower p95 latency" and over 90% token savings against a full-context baseline. [27]

Inference. NOOP is the safeguard most relevant here. A curator that is allowed to do nothing will not churn content just because it ran.

### Letta: sleep-time agents and dreaming

Described. Letta's sleep-time agents rewrite memory in the background: "Offloading memory to a sleep-time agent allows memory management to happen asynchronously." The primary agent "is not provided with tools to edit its core memory". [29] The current docs call this dreaming and say it uses "background subagents to review recent conversations, consolidate useful lessons, and update memory". [31] Memory lives in "MemFS, a git-backed memory filesystem". [31] An optional setting has an agent "review and revise proposed memory updates in a second background conversation", which "does not ask you for approval." [31]

Measured. The sleep-time compute paper reports that it can cut test-time compute "by ~ 5x" for the same accuracy on two stateful reasoning tasks. [30]

Inference. Letta's guard against loss is git history, not human review. For instructions a person relies on, the automatic version is the wrong default.

### Anthropic: compaction, note taking and the memory tool

Official. Compaction keeps "architectural decisions, unresolved bugs, and implementation details while discarding redundant tool outputs or messages." [7] For tuning: "Start by maximizing recall to ensure your compaction prompt captures every relevant piece of information from the trace, then iterate to improve precision by eliminating superfluous content." [7] The lightest form is clearing old tool results. [7] Structured note-taking means the agent "regularly writes notes persisted to memory outside of the context window." [7]

Official. The API memory tool docs list storage safeguards: cap file sizes, "Periodically delete memory files that haven't been accessed in a long time", and validate every path. [10] The tool refuses to rename onto an existing file: "Return an error (do not overwrite)". [10] Inference: expiry by last access suits an agent's scratch memory. It does not suit standing rules, because a rule that prevents a rare mistake may go untouched for months and still be load bearing.

### What the methods share

| Method | Guard against losing content |
| :- | :- |
| ACE | Item IDs, delta edits, deterministic merge, no full rewrite |
| Mem0 | NOOP option; graph variant marks invalid instead of deleting |
| Letta | Git-backed memory; optional second-pass review |
| Anthropic compaction | Tune for recall first, then precision |
| Claude Code auto memory | Index under a hard limit, timestamps, skips what CLAUDE.md says |
| `/doctor prompt-audit` | Report only; nothing changes until approved |

## 4. Transferable practice from software and docs maintenance

| Practice | Source | What it gives | Cost for one person | Fit |
| :- | :- | :- | :- | :- |
| One source of truth | DRY: "Every piece of knowledge must have a single, unambiguous, authoritative representation within a system" [32] | Removes drift between copies | Low | Strong |
| References instead of copies | `@path` imports and rule symlinks [1]; HumanLayer "Prefer pointers to copies" [44] | One edit updates every consumer | Low | Strong |
| Docs as code | Write the Docs: write docs "with the same tools as code" (version control, review, automated tests) [33] | Diffs, history, review | Low | Strong |
| Markdown lint | markdownlint supports custom rules for "project-specific requirements"; MD024 flags "Multiple headings with the same content" [34] | Catches structural duplicates | Low | Good |
| Prose lint | Vale "brings code-like linting to prose" with custom rules [35] | Moves the copy rules out of prose into a checker | Medium | Good |
| Dead link check | lychee finds broken links in Markdown and has an offline mode that checks only local files [36] | Flags rules that point at moved or deleted files | Low | Strong |
| Decision records with superseded status | Nygard: "If a decision is reversed, we will keep the old one around, but mark it as superseded." [37] | Keeps the why after the rule changes | Low | Strong |
| CODEOWNERS and review | Owners "are automatically requested for review" [38] | Second pair of eyes | Needs a second person | Weak; a reviewer agent or a diff the owner reads does the same job |
| Deprecation windows | Google: advisory versus compulsory deprecation; compulsory needs "an enforcement mechanism"; warnings "rarely lead to migration" [39] | Staged removal; respects hidden dependents (Hyrum's law) | Low | Good |
| Soft delete | Azure keeps deleted data for 1 to 365 days and recommends at least seven [40] | A recovery window | Low | Strong |
| Tombstones | "A tombstone is a deleted record in a replica of a distributed data store." [41] | A visible marker that something was removed on purpose | Low | Strong, via HTML comments that cost no tokens [1] |
| Git history as undo | `git revert` records new commits that reverse old ones [42] | Undo without losing the record | Already in place | Strong, if each cleanup is its own commit |
| Chesterton's fence | "If you don't see the use of it, I certainly won't let you clear it away. Go away and think." [43] | A rule for removal | Free | Strong |

Inference on fit. The cheap ones for a one-person setup are a single canonical home per rule with pointers elsewhere, one commit per cleanup, a quarantine step before deletion, a tombstone comment, a local link check and a duplicate check. CODEOWNERS and formal deprecation schedules add little for one person beyond what a reviewer agent and a dated quarantine already give.

## 5. What practitioners report (all opinion unless marked)

Anthropic staff blog. "Keep CLAUDE.md under 200 lines, give it an owner, and review changes to it like code." The post describes the failure this owner is seeing: "every team appends its own instructions and nothing gets deleted." [9]

HumanLayer. Their root CLAUDE.md is "less than sixty lines". They advise against `/init` and auto-generated files, keeping task instructions in separate files that CLAUDE.md lists, "Prefer pointers to copies" and "Never send an LLM to do a linter's job". [44] They also wrote that "Anthropic does not have an official recommendation" on length. That is out of date: the docs now say under 200 lines. [1]

Builder.io. "Every few weeks, I ask Claude to review and optimize my CLAUDE.md." "Delete what's obsolete. Consolidate what's redundant. Clarify what's ambiguous." [45] The same post advises "Mark critical rules with emphasis, but only the truly critical ones" [45], which conflicts with the official note that emphasis makes Claude over-apply rules. [2]

Hacker News. On the HumanLayer thread, one commenter found that "a linting update or an additional test often is more effective than trying to tinker with the Claude.md file." [46] On an Ask HN about maintaining these files, one commenter reported that regression constraints "work consistently if each individual item doesn't exceed one sentence and describes a failure I've already observed." [47] Another keeps only "a table of contents and some highlights" in the root file and moves the rest into other files. [47] These are single anecdotes.

Simon Willison quoted Anthropic's announcement that from Claude Code 2.1.277, "if there is no CLAUDE.md in a folder, Claude will check for and use AGENTS.md." [48]

Official, and directly about pointers. The memory docs keep one file across tools with an `@AGENTS.md` import in CLAUDE.md, and note that keeping the import "never makes Claude read `AGENTS.md` twice". [1] They also separate a real pointer from a pointer in words: with "A `CLAUDE.md` that tells Claude in words to read `AGENTS.md`", Claude "sees `AGENTS.md` only if it decides to open the file." And a `SessionStart` hook that prints AGENTS.md "adds a second copy to the context" once Claude reads AGENTS.md directly. [1] Inference: hooks that print text are a duplication path worth checking in this setup.

Measured counterpoint. The AGENTS.md evaluation found developer-written context files gave no significant gain on average and raised cost. [16] [17] Practitioner enthusiasm for long, detailed files is not backed by that study. Neither is the idea that length alone drives the harm. [17]

## Implications for a safe hygiene process

This is my synthesis. Each point names the evidence it rests on.

### What the process must include

1. An inventory before any edit. List every rule once, with an ID, its canonical home and every place it is restated (CLAUDE.md files, rules, skills, hooks, handoff and memory files, the claude.ai account instructions). ACE's per-item IDs [26] and the DRY rule [32] support this. The duplicate count is then a measured number, not a feeling.

2. One canonical home per rule, picked by how it loads. Always-needed facts go in CLAUDE.md. Rules that matter only for some files go in path-scoped rules. Procedures go in skills. Zero-exception rules go in a hook. [1] [2] [3] Every other copy becomes a pointer or is removed. An `@` import or a symlink guarantees the content loads; a "see X" line in words loads it only if Claude decides to open X. [1] So a words pointer suits optional reference material, and an import suits anything that must always be present. Contradictions get resolved arbitrarily [1] and silently [22], so leaving two paraphrases in place is the riskier option.

3. Provenance for each rule. Record why the rule exists, ideally the incident that caused it, in a decision record or an HTML comment, which costs no context tokens. [1] [37] This is what makes a Chesterton's fence check possible later. [43] The `/doctor` keep list ("pitfalls, rationale, and conventions that differ from tool defaults") is a working definition of load bearing. [1]

4. Report first, then approve. Any automated pass, whether `/doctor prompt-audit` or a custom one, produces a proposal and changes nothing until the owner approves it. This is how Anthropic built its own audit. [1]

5. Small delta edits, never a whole-file rewrite by a model. Context collapse and brevity bias are measured failures of full rewrites. [25] [26] Merge by replacing or removing named items, as ACE does with deterministic logic. [26] The curator should be allowed to do nothing (Mem0's NOOP). [28]

6. A two-stage delete. Stage one moves the rule to a quarantine file that does not load, or leaves a tombstone comment in place, with a date and the reason. Stage two deletes it after a window with no regressions. Azure's floor of seven days for soft delete is one reference point. [40] One commit per stage, so `git revert` undoes either one. [42] Mem0's graph variant does the same thing by marking entries invalid. [28]

7. Watch behavior after a removal. The agents in the AGENTS.md study followed the files they were given [17], so removing a rule will change behavior. Keep a short list of what was removed and check the next sessions against it. The `InstructionsLoaded` hook can show which files actually load. [1]

8. Cheap mechanical checks. A duplicate detector over the inventory, a local link check for references to moved files [36], markdownlint for repeated headings [34] and, if the owner wants it, Vale for the dash and comma rules instead of prose rules. [35] Mechanical rules belong in checkers, not in the instruction text. [2] [44]

9. Event-driven review with a light calendar backstop. The docs name triggers rather than intervals [3]. Run the inventory when a rule is added, when the agent makes a repeated mistake and on a regular backstop. Builder's "every few weeks" is opinion. [45]

### What the process must avoid

1. Asking a model to "make this shorter" across a whole file. It is the documented route to context collapse. [26]

2. Deleting on age or disuse alone. The memory tool's expiry advice is for scratch memory. [10] A rule that prevents a rare failure looks unused right up to the day it matters. [7] [43]

3. Unattended deletion. Letta's dreaming applies changes without approval [31]. That is acceptable for an agent's own notes and not for rules the owner relies on.

4. Treating a split into `@` imports or unscoped rule files as a size reduction. It is not one. [1] [9]

5. Fixing ignored rules by adding emphasis or another copy. Official guidance says emphasis leads to over-application. [2] Repetition is measured to help only in a different setting: whole-prompt repetition without reasoning. [24]

6. Moving preferences into hooks wholesale. Every hook misfires sometimes and needs upkeep. [2]

7. Assuming shorter always wins. Length showed no clear effect on outcomes in one study [17]; ACE found detailed playbooks beat summaries [26]; Anthropic says minimal "does not necessarily mean short". [7] The target is no duplicates, no contradictions and nothing Claude can derive from the repo. Line count is a symptom, not the goal.

### What would change this

A measured test on the owner's own setup would outrank everything above. For example: run a fixed set of past tasks with the current files and with the deduplicated files, then compare rule violations, verifying turns and tokens. If the deduplicated set does no worse, the case for cleanup is proven for this setup. If it does worse, the removed copies were load bearing and should come back from quarantine.

## Sources

1. https://code.claude.com/docs/en/memory (read 2026-11-18)
2. https://code.claude.com/docs/en/best-practices (read 2026-11-18)
3. https://code.claude.com/docs/en/features-overview (read 2026-11-18)
4. https://code.claude.com/docs/en/skills (read 2026-11-18)
5. https://code.claude.com/docs/en/settings (read 2026-11-18)
6. https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md (read 2026-11-18)
7. https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents (published 2025-09-29, read 2026-11-18)
8. https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills (published 2025-10-16, read 2026-11-18)
9. https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more (published 2026-06-18, read 2026-11-18)
10. https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool (read 2026-11-18)
11. https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features (read 2026-11-18)
12. https://arxiv.org/abs/2507.11538 (IFScale, 2025-07-15, read 2026-11-18)
13. https://arxiv.org/html/2507.11538 (IFScale full text, read 2026-11-18)
14. https://www.trychroma.com/research/context-rot (Chroma, 2025-07-14, read 2026-11-18)
15. https://arxiv.org/abs/2307.03172 (Lost in the Middle, read 2026-11-18)
16. https://arxiv.org/abs/2602.11988 (Evaluating AGENTS.md, 2026-02-12, read 2026-11-18)
17. https://arxiv.org/html/2602.11988 (Evaluating AGENTS.md full text, read 2026-11-18)
18. https://arxiv.org/abs/2601.20404 (AGENTS.md efficiency, 2026-01-28, read 2026-11-18)
19. https://arxiv.org/abs/2511.12884 (Agent READMEs, 2025-11-17, read 2026-11-18)
20. https://arxiv.org/abs/2509.14744 (Agentic coding manifests, 2025-09-18, read 2026-11-18)
21. https://arxiv.org/abs/2502.08745 (IHEval, 2025-02-12, read 2026-11-18)
22. https://arxiv.org/abs/2511.14342 (ConInstruct, 2025-11-18, read 2026-11-18)
23. https://arxiv.org/abs/2512.14982 (Prompt repetition, 2025-12-17, read 2026-11-18)
24. https://arxiv.org/pdf/2512.14982 (Prompt repetition full text, read 2026-11-18)
25. https://arxiv.org/abs/2510.04618 (ACE, read 2026-11-18)
26. https://arxiv.org/html/2510.04618 (ACE full text, read 2026-11-18)
27. https://arxiv.org/abs/2504.19413 (Mem0, 2025-04-28, read 2026-11-18)
28. https://arxiv.org/html/2504.19413 (Mem0 full text, read 2026-11-18)
29. https://www.letta.com/blog/sleep-time-compute (published 2025-04-21, read 2026-11-18)
30. https://arxiv.org/abs/2504.13171 (Sleep-time compute, 2025-04-17, read 2026-11-18)
31. https://docs.letta.com/guides/agents/architectures/sleeptime (read 2026-11-18)
32. https://en.wikipedia.org/wiki/Don%27t_repeat_yourself (read 2026-11-18)
33. https://www.writethedocs.org/guide/docs-as-code/ (read 2026-11-18)
34. https://github.com/DavidAnson/markdownlint (read 2026-11-18)
35. https://docs.vale.sh/ (read 2026-11-18)
36. https://github.com/lycheeverse/lychee (read 2026-11-18)
37. https://www.cognitect.com/blog/2011/11/15/documenting-architecture-decisions (published 2011-11-15, read 2026-11-18)
38. https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners (read 2026-11-18)
39. https://abseil.io/resources/swe-book/html/ch15.html (read 2026-11-18)
40. https://learn.microsoft.com/en-us/azure/storage/blobs/soft-delete-blob-overview (read 2026-11-18)
41. https://en.wikipedia.org/wiki/Tombstone_(data_store) (read 2026-11-18)
42. https://git-scm.com/docs/git-revert (read 2026-11-18)
43. https://en.wikipedia.org/wiki/G._K._Chesterton#Chesterton's_Fence (read 2026-11-18)
44. https://www.humanlayer.dev/blog/writing-a-good-claude-md (published 2025-11-25, read 2026-11-18)
45. https://www.builder.io/blog/claude-md-guide (published 2026-01-13, read 2026-11-18)
46. https://news.ycombinator.com/item?id=46100137 (comment on HN thread 46098838, read 2026-11-18)
47. https://news.ycombinator.com/item?id=48169873 (reply by luodaint in Ask HN thread 48160604, read 2026-11-18)
48. https://simonwillison.net/2026/Sep/18/thariq-shihipar/ (published 2026-09-18, read 2026-11-18)
