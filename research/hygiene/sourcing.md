# Sourcing: tools for keeping an agent setup clean

Need in one line: find rules restated in many places, stale rules and contradictions across a personal layer (global CLAUDE.md, skills, hooks), per project CLAUDE.md files, skills, memory and handoff files and the claude.ai account preferences, then fix them without deleting what matters, on a computer, in cloud sessions and in Cowork.

Searched on 2026-11-18. Every candidate below was read from its own files (SKILL.md, README, manifest or source) cloned into a scratch folder, except where marked. Dates are the last commit that touched the candidate's own folder, read with git log. Nothing was installed or run.

## Candidates

Ranked by fit to the whole need, then by quality evidence.

### 1. Claude Code /doctor prompt-audit (built in)

- Link: https://code.claude.com/docs/en/memory#audit-your-instruction-files
- Last updated: 2026-11-18 (the claude-code changelog as read from https://github.com/anthropics/claude-code on that date; the subcommand was added in 2.1.283 and the changelog entry in the same release says stale paths, stale commands and contradicting instruction files now lead the report)
- Stars or installs: not applicable, it ships inside Claude Code
- Maintainer: Anthropic
- What it actually does: the docs say it checks instruction files for instructions written for older models, references to files or commands that do not exist and files that contradict each other, then gives a report with proposed edits. The scope text read from the Claude Code 2.1.327 binary lists CLAUDE.md, CLAUDE.local.md and AGENTS.md in the project, its ancestors and nested folders, files they import, ~/.claude/CLAUDE.md and the rules, skills, commands, agents and output styles under both .claude/ and ~/.claude/. It reports on plugin skills but proposes no edits to them. It skips settings files and .mcp.json. It marks any edit under ~/.claude as affecting all projects and refuses to edit a file outside the project because the project disagrees with it. It does not list auto memory (MEMORY.md), handoff files or claude.ai preferences. Detecting the same rule restated in several files is not named as a target; it may surface some as contradictions (inferred). The detailed audit procedure (shared/prompt-audit.md) is compressed inside the binary and was not readable here.
- Destructive or report only: report first; nothing changes until the user asks Claude to apply an edit (docs)
- Executes code: no scripts of its own; it runs through the bundled claude-api skill and reads files (inferred from the handoff text)
- Surfaces: computer yes. Cloud sessions likely yes, since bundled skills ship with the CLI and this cloud container runs Claude Code 2.1.327 (inferred; not run). Cowork unknown (inferred not available as a slash command). It is unavailable when the claude-api skill is turned off.
- Verdict on fit: the best maintained piece and the right report shape, with the right safety rule for the global layer. It misses memory, handoff files and claude.ai preferences and is not built to count duplicates. Use it as one input, not the whole process.

### 2. setup-audit (jdickey1)

- Link: https://github.com/jdickey1/claude-skills/tree/main/plugins/setup-audit
- Last updated: 2026-05-06 (4 commits on this folder since 2026-03-23)
- Stars or installs: 0 stars, 0 forks (repo page)
- Maintainer: James Dickey
- What it actually does: one SKILL.md. Reads ~/.claude/CLAUDE.md, project CLAUDE.md files, everything in ~/.claude/skills/, the memory index and the files it lists and ~/.claude/settings.json (hooks, permissions). Judges every rule on five tests: restates default behavior, contradicts another rule, duplicates a rule in another file (with a "keep which" column), one off fix, vague. Also flags stale references and empty templates. Rules in the skill: read everything before judging, no changes without approval, cite file and line, "err on the side of keeping", plugin skills out of scope.
- Destructive or report only: report only; cuts happen after the user picks them
- Executes code: no
- Surfaces: plain markdown, so it works as a claude.ai account skill in cloud sessions and Cowork as well as on a computer (inferred). Its memory path is hard coded to the author's machine (`~/.claude/projects/-Users-james/memory/`), so it needs editing before it finds memory anywhere else.
- Verdict on fit: the closest match in scope (global layer, skills, memory, hooks in one pass) and in temperament (keep when unsure). Thin: no evidence rules, no canonical home logic, no handoff files, no claude.ai preferences, no adoption. A good base to adapt, not to install as is.

### 3. docs-hygiene extract-ssot (Melodic Software)

- Link: https://github.com/melodic-software/claude-code-plugins/tree/main/plugins/docs-hygiene/skills/extract-ssot
- Last updated: 2026-11-17 (49 commits on this folder since 2026-07-11; plugin version 4.0.12)
- Stars or installs: 32 stars, 7 forks for the repo (repo page)
- Maintainer: Melodic Software
- What it actually does: takes one cluster of repeated markdown (CLAUDE.md, AGENTS.md, .claude/rules, skill bodies, agent files, docs) and resolves it to one named home, then rewrites each other place to cite that home by exact heading. Rule of Three: it refuses to create a new shared file for fewer than three copies but still reports pairs and in place recaps and offers non abstracting fixes for them. Every decision must rest on grep output or reads done in the same session; a subagent summary is a lead, not proof. Has an unwind action to reverse a bad extraction. Bare invocation is read only and asks for scope before any whole repo sweep.
- Destructive or report only: report only by default. The execute and batch actions write files and, by default, commit each wave to the branch.
- Executes code: yes, a shell script (emit-verify-facts.sh); no network calls found in it. It calls sibling skills in the same plugin (rename-references, audit-encapsulation) and cites a skill from another plugin (/playbooks:skill-authoring).
- Surfaces: computer yes as a plugin. Scope is one git repo's tracked markdown, so it reaches the personal layer only because that layer lives in the harness repo; it does not see ~/.claude memory or claude.ai preferences. Cloud and Cowork would need the skill uploaded to the account with its sibling skills (inferred; plugins reportedly do not load in cloud sessions).
- Verdict on fit: the best method for the "one rule in six places" problem and the strongest quality evidence of the community set. Narrow on stale and contradictory rules, commits on its own when executing and tied to its plugin. Borrow its rules; do not run its execute mode unattended.

### 4. brewdoc memory-sync-setup (claude-brewcode)

- Link: https://github.com/kochetkov-ma/claude-brewcode/tree/main/brewdoc/skills/memory-sync-setup
- Last updated: 2026-11-17 (72 commits on this folder since 2026-08-08; plugin version 6.12.13)
- Stars or installs: 39 stars, 3 forks for the repo (repo page)
- Maintainer: Maksim Kochetkov
- What it actually does: a generator. It analyses a repo and writes a project local /memory-sync skill. That skill checks facts first, removes duplicates second and compresses third, under a rule that no file may grow. It sweeps CLAUDE.md files, rules, agents, skills and the auto memory folders in disjoint batches, with an independent read only checker per edited batch. Its memory guide says auto loaded context outranks memory, a memory row that restates context is deleted only with a quoted line as proof ("an unproven duplicate stays") and orphaned memory stores are salvaged before removal. The global ~/.claude layer is out of scope: findings there are reported, never written.
- Destructive or report only: destructive by design once installed (edits and deletes, with the safeguards above); status mode is read only; uninstall keeps user added files
- Executes code: yes, bash (generate.sh, scope-guard.sh); spawns parallel subagents
- Surfaces: computer yes. Project scoped and heavy; cloud and Cowork would need the emitted skill uploaded (inferred). Does not reach the personal layer, handoff files or claude.ai preferences.
- Verdict on fit: the best written deletion safeguards found (quoted proof, salvage before removal, verifier never the writer). Its no growth directive and default delete posture are more aggressive than this owner wants. Borrow the safeguards.

### 5. reflect-memory (ckorhonen/reflect)

- Link: https://github.com/ckorhonen/reflect/tree/main/skills/reflect-memory
- Last updated: 2026-09-26 (whole repo, shallow read)
- Stars or installs: 0 stars, 0 forks (repo page)
- Maintainer: ckorhonen
- What it actually does: one SKILL.md. Measures load per surface, then finds five kinds of decay: duplicates, merge candidates, stale references ("check, don't assume"), contradictions (flag when both look intentional) and wrong altitude. Applies exact duplicates and dead references directly; proposes everything that needs judgment. Boundary: never delete a rule unless it can be shown to be duplicated, stale or superseded; "seems unnecessary" is only a proposal.
- Destructive or report only: applies mechanical fixes on its own; proposes the rest
- Executes code: no
- Surfaces: plain markdown, works anywhere a skill loads (inferred). Scope is the project AGENTS.md or CLAUDE.md plus its own .reflect state; it does not reach the global layer, other skills or memory.
- Verdict on fit: right vocabulary and a sound deletion boundary, but too narrow in scope and it edits without asking for the mechanical class.

### 6. instrlint

- Link: https://github.com/jed1978/instrlint
- Last updated: 2026-04-10
- Stars or installs: 8 stars, 1 fork; 55 npm downloads in the month to 2026-11-17
- Maintainer: Jed Lin
- What it actually does: a Node CLI. Scans the project root CLAUDE.md, nested CLAUDE.md files and .claude/rules (and AGENTS.md or Cursor rules). Near duplicates are rule lines with a Jaccard similarity of 0.7 or more on stop word filtered words, compared across those files; skills are counted for token budget but not compared. Contradictions use negation word heuristics. Also flags rules a config file already enforces, stale file references and a root file over 200 lines. Has a /instrlint command where the host model judges low confidence findings.
- Destructive or report only: report by default; its fix flag deletes dead rules, stale references and exact duplicates and requires a clean git tree (a force flag skips that check)
- Executes code: yes, a Node CLI via npx; no network calls found in its source (inferred from a grep)
- Surfaces: anywhere Node and the npm registry are reachable, so computer and cloud (inferred). Does not read ~/.claude, skills content, memory or handoff files. Paraphrased copies of one rule will mostly fall under its threshold (inferred).
- Verdict on fit: a cheap mechanical tripwire for exact and near exact copies inside one project. Not enough on its own.

### 7. ctxlint (YawLabs)

- Link: https://github.com/YawLabs/ctxlint
- Last updated: 2026-11-16 (version 0.28.3)
- Stars or installs: 12 stars, 3 forks; 155,707 npm downloads of @yawlabs/ctxlint in the month to 2026-11-17
- Maintainer: Yaw Labs
- What it actually does: a Node CLI and MCP server. Checks project context files for sixteen tools against the codebase: broken paths, wrong commands, stale files, content the agent can infer, token cost. Its contradiction check is a fixed list of tool choices (for example Jest against Vitest), not general rules. Session mode flags memory entries citing missing paths, near duplicate memory across projects (over 60 percent overlap) and MEMORY.md past the load cap. A skills mode checks ~/.claude/skills for trigger collisions, broken references and orphans. Can scan the global settings for dead hook scripts.
- Destructive or report only: report by default; its fix flag rewrites broken paths only
- Executes code: yes, a Node CLI via npx; session checks read local transcripts and memory
- Surfaces: computer yes; cloud yes where npm is reachable (inferred). Does not compare prose rules across CLAUDE.md, skills and memory.
- Verdict on fit: the best mechanical check for stale paths and memory drift, widely pulled from npm. Does not address the core duplication problem.

### 8. claude-md-management (Anthropic official plugin)

- Link: https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-md-management
- Last updated: 2026-02-20 (4 commits on this folder since 2026-01-16)
- Stars or installs: not shown in the in product directory
- Maintainer: Anthropic
- What it actually does: its quality criteria list "Duplicate info across multiple CLAUDE.md files" as a red flag, but it has no deduplication step. A claude-md-improver skill that finds CLAUDE.md files in a repo, scores each on six criteria (commands, architecture, gotchas, conciseness, currency, actionability), prints a report, then proposes additions as diffs. A /revise-claude-md command adds session learnings to CLAUDE.md. Both ask before editing.
- Destructive or report only: report first, edits on approval; leans toward adding content
- Executes code: runs a find command; no scripts
- Surfaces: computer as a plugin; cloud and Cowork only if its skill is uploaded to the account (inferred). CLAUDE.md only: no skills, memory or cross file duplicates.
- Verdict on fit: poor. It grows files rather than deduplicating them.

## Searched

In product: SearchPlugins (Anthropic directory) with "claude md", "memory cleanup", "audit", "context hygiene", "lint instructions", "deduplicate rules", "stale instructions", "memory pruning", "agents.md" and "skills audit". Installed skills checked by name; none covers this job.

Anthropic sources: code.claude.com docs (commands, skills, memory pages), the claude-code changelog, the anthropics/claude-plugins-official repo (claude-md-management, claude-code-setup, session-report read or listed) and the Claude Code binary for the prompt-audit scope text.

Web search phrasings: "CLAUDE.md linter audit tool github", "AGENTS.md linter duplicate contradictory instructions", "claude code skill prune memory consolidate duplicate rules CLAUDE.md", "cursor rules lint tool .cursor/rules conflicts duplicates", "reddit ClaudeAI CLAUDE.md bloat duplicate rules cleanup tool", "Show HN context rot CLAUDE.md linter stale rules", "instrlint github near-duplicate contradicting rules claude code codex", "dedupe instructions across CLAUDE.md skills memory files cross-file single source of truth tool", "consolidate-memory skill MEMORY.md merge duplicates", "Claude Code /doctor CLAUDE.md trim suggestions", plus name searches for directory plugins.

Community sources reached: skills.sh, claudemarketplaces, smithery, skillsmp, openskillindex, claudepluginhub (all through search results), awesome-claude-code (cloned; its Linting section read), aitmpl claude-code-templates (cloned; no hygiene component found), npm (download counts), PyPI (agentslint listed), Hacker News (Algolia API with three phrasings), the Cursor forum.

Also seen and not shortlisted, with the reason: claudelint or claude-code-lint (structure and schema checks only, no duplicate or contradiction rules, read); claude-config-auditor (token cost and frontmatter lint, read; non destructive archive mode is a useful pattern); agnix (761 format rules; cross tool conflicts limited to build commands and tool constraints, read); cursor-doctor and cursor-mdc-lint (Cursor only, from listings); agents-lint and agentslint (AGENTS.md stale paths, from listings); spec-linter, cclint, cc-audit, asitis-agent-tools (listings only); Cairn Memory, Instructions Cleanup, Setup Audit by senzelden, claude-md-composer and Agent Smith (in the Anthropic directory; no public source found to read); consolidate-memory listings (no repo with that skill found in flonat/claude-research when cloned); robbyt condense and josephneumann claudemd-audit (cloned but not read past the listing, single file CLAUDE.md scope by their descriptions).

Unreachable or blocked: the GitHub API (both gh and api.github.com refused by this session's policy; stars were read from repo pages and dates from git clones instead); Reddit (HTTP 403, and search surfaced no threads); the prompt-audit procedure file inside the Claude Code binary (compressed, no zstd tool available).

Gaps no tool covers: none of the candidates reads handoff files as a category or the claude.ai account preferences, and none tracks a rule across the personal layer and every project at once.

## Verdict

Nothing fits whole; adapt setup-audit (jdickey1) as the cross layer report, widened to handoff files and a pasted copy of the claude.ai preferences, and give it extract-ssot's canonical home rules (Rule of Three, cite the home instead of restating) plus brewdoc's deletion safeguards (quoted proof or it stays, salvage before removal, a checker that is not the writer). Keep it report only and run /doctor prompt-audit beside it on a computer for stale and contradicting text.

What would change it: if a test run of /doctor prompt-audit on the harness shows it reports the same rule restated across files and reads auto memory, it becomes the pick, because it is built in, maintained and already report first.
