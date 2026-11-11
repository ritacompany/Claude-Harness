---
name: resource-sourcing
description: Find the best existing skill, plugin, MCP server or other community resource for a need before building one. Use when asked to find, look for, recommend or compare skills, plugins, marketplaces, MCP servers, connectors or tools, when asked "is there something for X" or "what should we use for X", and before proposing to build a new skill, plugin, agent, script or tool from scratch. Searches the community ecosystem, not only Anthropic's catalogues.
---

# Resource sourcing

## Why this exists

A published community skill with real adoption has been used, broken and fixed by people who hit
the same problem. A skill written from scratch in one session starts at zero and will need that
same iteration before it is as good. So the default is to look outward first.

Two habits cause the misses this skill exists to stop:

- Stopping at the in-product search tools. `SearchSkills`, `SearchPlugins`, `SearchMcpRegistry`,
  `ListSkills` and the `/plugin` Discover tab search the user's own account, their org catalogue and
  Anthropic's marketplaces. They are a fine first stop and never the survey.
- Proposing to build. Building is allowed, but only after a real search, and the proposal has to
  say what was searched and why nothing fit.

Anthropic's sources get no extra rank for being Anthropic's. Rank by fit to the job, then by
evidence of quality.

## Procedure

1. **Frame the need in one line.** The job, the surface it runs on (Claude Code, claude.ai, Cowork)
   and the type that fits: a skill for know-how or a procedure, a plugin for a bundle with commands,
   hooks or agents, an MCP server for live access to a system or its data.
2. **Check what is installed.** If an installed skill might already cover it, judge it by its
   instructions, not its description. The skill-shortlist skill has that procedure.
3. **Search outward.** Use the in-product tools, then at least three independent community sources
   from `references/sources.md` that index the right type. Try two or three phrasings each: the
   job, the domain and the output. If the network blocks a site, go through its GitHub repo or a
   web search, and say which sources could not be reached.
4. **Shortlist three to six by fit.** For each, collect the signals the source exposes: installs or
   stars, last commit date, who maintains it, open issues, and whether it ships scripts, hooks or
   network calls.
5. **Read the finalists' actual files.** The SKILL.md, the plugin manifest or the MCP README. Note
   what it really instructs, what it expects as input, what it produces, any defaults that clash
   with the project's rules, and anything it executes. Never recommend on listing text or stars.
6. **Safety pass before anything is installed.** Community registries have carried prompt injection
   and malware in 2026, and a registry scan lowers the risk without removing it. Anything that runs
   code, hooks, MCP or fetches URLs goes through the skill-inspector skill, or a manual read of every
   executable file when that is unavailable. Never install silently. The user runs or approves it.
7. **Report.** One recommendation, what in its files earned it, the install step for the user's
   surface, what would change the pick, and one line on what was searched and anything unreachable.

## Adapt before build

A close community skill that needs edits is usually a better starting point than a blank file. Say
what would change and why. Build from scratch only when:

- the search came back empty or every finalist failed step 5 or 6, or
- the need is specific to this project, such as a procedure for one Figma file or one repo's rules.

Even then, borrow structure from the closest candidate and say which one.

## Match effort to the ask

- **Quick check** ("is there something for X"): in-product tools plus two community sources, read
  the top two. A few minutes.
- **Real selection** (anything that will be installed or relied on): the full procedure.
- Run the sweep in a subagent when it spans more than a few sources, so only the verdicts come back.

## Report shape

```
Recommendation: <name> from <source> (<installs or stars>, updated <date>)
Why: <what its SKILL.md or README actually does that fits, in two or three lines>
Install: <exact step for this surface>
Would change the pick: <the fact that would flip it>
Searched: <sources and phrasings>. Unreachable: <any>.
Runner up: <name, and the one reason it lost>
```
