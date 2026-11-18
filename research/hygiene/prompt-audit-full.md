# Prompt audit: Claude Code configuration for claude-harness

## Context

You asked for a `prompt-audit` of the Claude Code configuration that loads into sessions in this
project. This file holds both deliverables: the audit report and the proposed diff. Nothing has been
edited. The plan, if approved, is to apply the hunks in the diff section below and nothing else.

## Assumptions

- **Target model:** Claude Opus 5.5 (`claude-opus-5-5`), the model running this session. No audited
  file pins its own model except the brand-voice plugin agents (report only).
- **Scope read:** `CLAUDE.md` (project root, the only instruction file in the project tree);
  `~/.claude/CLAUDE.md`; 152 skills under `~/.claude/skills/` (151 synced from your claude.ai
  account plus `session-start-hook`); 49 plugin files under `~/.claude/plugins/` (report only).
- **Not present:** `CLAUDE.local.md`, `AGENTS.md`, `.claude/` in the project, ancestor
  `CLAUDE.md` files, `rules/`, `commands/`, `agents/` and `output-styles/` under either `.claude/`, a
  managed policy `CLAUDE.md`. Neither `CLAUDE.md` imports anything.
- **Not read, by your instruction:** settings files, `.mcp.json`, `~/.claude.json` and its backups.
- **Out of scope:** the repo's own `skills/` folder. Its `unlazy`, `humanizer` and
  `resource-sourcing` are byte identical to the synced copies, so their findings would carry over.
- **Where edits land:** every edit under `~/.claude/` affects all projects. The synced skills are
  pulled from your claude.ai account and a local edit is overwritten on the next sync, so those hunks
  have to be made to the account copy of each skill to stick.
- No non-Anthropic provider markers matter here; `image-to-code` names Codex (finding F4).
- Git history is one commit, so `git blame` orders nothing.

## Summary

The two biggest issues sit in skills, not in your `CLAUDE.md`. Nine Figma skills exist twice: an
older account copy and a newer one from the Figma plugin. Both load every session and their text
disagrees in places (F1). Five research skills end with "Think step by step", a scaffold that does
nothing on a model whose thinking is always on (H1). In `CLAUDE.md` the one dated line is "No
progress or status messages", the update suppressor pattern that makes Opus 5.5 go quiet; this
session needed two harness nudges to post a status line (M1).

Counts: Group 1: 7 findings (1 high, 6 medium). Group 2: 4 flags. Group 3: not applicable (no tool
definitions). Group 4: not applicable (no request code); sub-agent roster check found zero issues.

## Findings

### H1. "Think step by step" in five research skills (high, all projects)

- **Location:** `~/.claude/skills/synced/.../empathy-map/SKILL.md:35`, `user-persona/SKILL.md:37`,
  `journey-map/SKILL.md:38`, `usability-test-plan/SKILL.md:27`, `interview-script/SKILL.md:32`
- **Evidence:** `7. Think step by step. Present the empathy map in a clear, visual-friendly format.`
  (same sentence in all five)
- **Pattern:** 1b, scaffold replaced by an API feature.
- **Why obsolete:** thinking is always on for Opus 5.5 and depth is set by `effort`. The sentence is a
  pre-thinking incantation. Claude Code's own settings control effort, so no frontmatter swap.
- **Action:** rewrite: drop the sentence, keep the format instruction.

### M1. "No progress or status messages" (medium, project file and all projects)

- **Location:** `CLAUDE.md:26-27`; `~/.claude/CLAUDE.md:26-27`
- **Evidence:** `No progress or status messages: each message delivers something to review or asks a
  question I need to answer. No recap, preview or closing offer.`
- **Pattern:** 1d, update suppressor written for chatty models.
- **Why obsolete:** Opus 5.5 under-narrates with this kind of line present. In this session the
  harness twice had to ask for a one line status. The rule also pulls against your own line 61/63
  ("one line on what is taking time"). The rewrite keeps your no recap, no preview, no offer intent
  and says when a short note is wanted.
- **Action:** rewrite in both files (hunks M1a, M1b). You may decline this as taste.

### M2. "Do not be lazy" boosters (medium, all projects)

- **Location:** `image-to-code/SKILL.md:107,137,1122,1212`; `imagegen-frontend-mobile/SKILL.md:137,215`
- **Evidence:** `Do not be lazy with image count.` / `Do not be lazy with screen count.`
- **Pattern:** 1a, "Be thorough. Do not be lazy."
- **Why obsolete:** current models are proactive by default. Each instance already sits next to the
  positive rule ("If more images would improve extraction quality, generate more images"), which is
  the form to keep.
- **Action:** remove the six lines.

### M3. Shouting density in design-taste-frontend-v1 (medium, all projects)

- **Location:** `design-taste-frontend-v1/SKILL.md` (21 caps markers: lines 13, 18, 21, 26, 30, 31,
  32, 57, 64, 69, 72, 75, 77, 85, 90, 98, 110, 125, 193, 208)
- **Evidence:** `**ANTI-EMOJI POLICY [CRITICAL]:** NEVER use emojis ... Emojis are BANNED.`
- **Pattern:** 1a, pressure language. When every rule is critical the markers carry no information
  and Opus 5.5 applies them rigidly.
- **Keep:** every rule and the named "AI tells" list (lines 97-126). On Opus 5.5 a list naming the
  specific defaults to avoid is the form that works (1e exception).
- **Action:** rewrite markers to plain voice, rules unchanged. Representative hunks below; the same
  transform applies to the other lines.

### M4. Shouting in frontend-design (medium, all projects)

- **Location:** `frontend-design/SKILL.md:19,36,38,40`
- **Evidence:** `**CRITICAL**: Choose a clear conceptual direction...`; `NEVER use generic
  AI-generated aesthetics like overused font families (Inter, Roboto, Arial...)`
- **Pattern:** 1a. Same reasoning as M3; the named font and color defaults on line 36 stay.
- **Action:** rewrite markers.

### M5. Retired model pinned in context-engineering (medium, all projects)

- **Location:** `context-engineering/SKILL.md:209`
- **Evidence:** `"claude-3": 200_000,`
- **Pattern:** 1d fossil (retired model name) and Group 2 volatile specific.
- **Why obsolete:** Claude 3 models are retired; the current default model has a 1M context window.
  An example that budgets context from this table teaches a wrong figure.
- **Action:** rewrite the Claude row to a current model.

### M6. IMPORTANT markers in session-start-hook (medium, all projects)

- **Location:** `~/.claude/skills/session-start-hook/SKILL.md:156,162,166`
- **Evidence:** `IMPORTANT: Verify dependencies are installed and script completes successfully.`
- **Pattern:** 1a. The steps are already numbered validation steps; the marker adds nothing.
- **Action:** rewrite. This skill looks installed by the cloud environment, so the edit may be
  replaced when the environment refreshes it.

### F1. Nine Figma skills loaded twice with diverging text (flag)

- **Location:** account copies `~/.claude/skills/synced/.../figma-{use,generate-design,design-to-code,
  create-new-file,use-motion,use-slides,implement-motion,code-connect,use-figjam}/SKILL.md` against
  the Figma plugin's copies of the same names.
- **Evidence:** `figma-use` differs by 144 lines; the plugin copy adds `call create_session with
  fileKey ... pass the returned sessionId` that the account copy lacks. `figma-generate-design`
  differs by 206 lines.
- **Pattern:** Group 2, instruction files that contradict each other.
- **Why flagged:** both load every session under different names (`anthropic-skills:figma-*` and
  `figma:figma-*`) with near identical triggers, so which instructions run depends on which one the
  model picks. No history orders them, and the plugin side is report only.
- **You decide:** whether to delete the nine account copies and rely on the plugin. Eight other
  duplicates (seven design skills and `view-pdf`) are byte identical, so they are working
  redundancy and not a finding.

### F2. Custom cursors: recommended in one skill, banned in another (flag)

- **Location:** `frontend-design/SKILL.md:34` vs `design-taste-frontend-v1/SKILL.md:105`
- **Evidence:** `...decorative borders, custom cursors, and grain overlays.` vs `**NO Custom Mouse
  Cursors:** They are outdated and ruin performance/accessibility.`
- **Pattern:** Group 2 conflict. Both can load on the same frontend task. No history orders them.
- **You decide:** which stance you hold; then remove "custom cursors" from one file.

### F3. Two near identical CLAUDE.md files load in this project (flag)

- **Location:** `CLAUDE.md` and `~/.claude/CLAUDE.md`
- **Evidence:** the files match except project `CLAUDE.md:57-58` ("Design is explored in Claude Code
  first...").
- **Pattern:** Group 2 (drift between copies). They agree today, so the duplication itself is
  working redundancy; the risk is the extra line, which says it belongs to the personal layer but
  only exists in the project copy.
- **Why flagged:** nothing in the project justifies editing `~/.claude/CLAUDE.md`. You decide
  whether the Design line belongs in your global file.

### F4. image-to-code is written for Codex (flag, low)

- **Location:** `image-to-code/SKILL.md:3,105,164-168`
- **Evidence:** `Elite website image-to-code skill for Codex. For visually important web tasks, it
  must first generate the design image(s) itself`
- **Why flagged:** the workflow depends on an image generation step Claude Code does not provide
  built in. Not a documented pattern row, so no edit.

## Proposed diff

One finding per hunk. Paths under `~/.claude/skills/synced/` are shortened to `synced/<skill>`.

```diff
--- a/synced/empathy-map/SKILL.md          (H1, same edit in the four files below)
+++ b/synced/empathy-map/SKILL.md
@@ -35 +35 @@
-7. Think step by step. Present the empathy map in a clear, visual-friendly format.
+7. Present the empathy map in a clear, visual-friendly format.
--- a/synced/user-persona/SKILL.md
@@ -37 +37 @@
-6. Think step by step. Present personas in a clear, structured format. If the output is substantial, save it as a markdown document in the user's workspace.
+6. Present personas in a clear, structured format. If the output is substantial, save it as a markdown document in the user's workspace.
--- a/synced/journey-map/SKILL.md
@@ -38 +38 @@
-7. Think step by step. Present in a clear, structured format.
+7. Present in a clear, structured format.
--- a/synced/usability-test-plan/SKILL.md
@@ -27 +27 @@
-4. Think step by step. Present in a ready-to-use format.
+4. Present in a ready-to-use format.
--- a/synced/interview-script/SKILL.md
@@ -32 +32 @@
-5. Think step by step. Present the script in a ready-to-use format.
+5. Present the script in a ready-to-use format.
```

```diff
--- a/CLAUDE.md                            (M1a, project file)
+++ b/CLAUDE.md
@@ -26,2 +26,3 @@
-- No progress or status messages: each message delivers something to review or asks a question I
-  need to answer. No recap, preview or closing offer.
+- Each message delivers something to review or asks a question I need to answer. During long work
+  a one line note on what is taking time is fine; the result stays the point. No recap, preview or
+  closing offer.
--- a/~/.claude/CLAUDE.md                  (M1b, affects all projects; same text)
@@ -26,2 +26,3 @@
  (identical hunk)
```

```diff
--- a/synced/image-to-code/SKILL.md        (M2)
@@ -107 +106,0 @@
-- Do not be lazy with image count.
@@ -137 +136,0 @@
-Do not be lazy with image count.
@@ -1122 +1121,0 @@
-7. do not be lazy with image count
@@ -1212 +1211,0 @@
-Do not be lazy with image count.
--- a/synced/imagegen-frontend-mobile/SKILL.md
@@ -137 +136,0 @@
-- Do not be lazy with screen count.
@@ -215 +214,0 @@
-Do not be lazy with screen count.
```
(After deleting 1122, renumber the list that follows it.)

```diff
--- a/synced/design-taste-frontend-v1/SKILL.md   (M3, representative)
@@ -13 +13 @@
-... Do not ask the user to edit this file. Otherwise, ALWAYS listen to the user: adapt these values ...
+... Do not ask the user to edit this file. Otherwise, follow the user: adapt these values ...
@@ -18 +18 @@
-* **DEPENDENCY VERIFICATION [MANDATORY]:** Before importing ANY 3rd party library (...), you MUST check `package.json`. If the package is missing, you MUST output the install ...
+* **Dependency verification:** Before importing a third party library (...), check `package.json`. If the package is missing, output the install ...
@@ -26 +26 @@
-* **ANTI-EMOJI POLICY [CRITICAL]:** NEVER use emojis in code, markup, text content, or alt text. Replace symbols with high-quality icons (Radix, Phosphor) or clean SVG primitives. Emojis are BANNED.
+* **No emojis:** Don't use emojis in code, markup, text content, or alt text. Replace symbols with high-quality icons (Radix, Phosphor) or clean SVG primitives.
@@ -30 +30 @@
-  * **Viewport Stability [CRITICAL]:** NEVER use `h-screen` for full-height Hero sections. ALWAYS use `min-h-[100dvh]` to prevent catastrophic layout jumping on mobile browsers (iOS Safari).
+  * **Viewport stability:** Use `min-h-[100dvh]` instead of `h-screen` for full-height hero sections, because `h-screen` jumps on mobile browsers (iOS Safari).
@@ -98 +98 @@
-To guarantee a premium, non-generic output, you MUST strictly avoid these common AI design signatures unless explicitly requested:
+Avoid these common AI design signatures unless the user asks for them:
```
(Apply the same transform to lines 21, 31, 32, 57, 64, 69, 72, 75, 77, 85, 90, 110, 125, 193, 208:
drop `MUST`/`NEVER`/`ALWAYS`/`CRITICAL`/`BANNED` markers, keep each rule and its reason. Leave the
list in lines 100-126 intact apart from its intro line.)

```diff
--- a/synced/frontend-design/SKILL.md      (M4)
@@ -19 +19 @@
-**CRITICAL**: Choose a clear conceptual direction and execute it with precision. ...
+Choose a clear conceptual direction and execute it with precision. ...
@@ -36 +36 @@
-NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), ...
+Avoid generic AI-generated aesthetics: overused font families (Inter, Roboto, Arial, system fonts), ...
@@ -38 +38 @@
-... Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.
+... Vary between light and dark themes, different fonts, different aesthetics. Don't converge on common choices (Space Grotesk, for example) across generations.
@@ -40 +40 @@
-**IMPORTANT**: Match implementation complexity to the aesthetic vision. ...
+Match implementation complexity to the aesthetic vision. ...
```

```diff
--- a/synced/context-engineering/SKILL.md  (M5)
@@ -209 +209 @@
-        "claude-3": 200_000,
+        "claude-opus-5-5": 1_000_000,
```

```diff
--- a/~/.claude/skills/session-start-hook/SKILL.md   (M6)
@@ -156 +156 @@
-IMPORTANT: Verify dependencies are installed and script completes successfully.
+Verify dependencies are installed and the script completes successfully.
@@ -162 +162 @@
-IMPORTANT: Figure out what the right command is to run the linters and run it for an example file. ...
+Find the command that runs the linters and run it on one example file. ...
@@ -166 +166 @@
-IMPORTANT: Figure out what the right command is to run the tests and run it for one test. ...
+Find the command that runs the tests and run it for one test. ...
```

No hunks for F1 to F4 (flags) or for plugin files (report only).

## Execution if approved

1. Apply M1a to `CLAUDE.md` in the repo and commit it on a branch.
2. Apply M1b to `~/.claude/CLAUDE.md` (all projects).
3. For H1, M2 to M5: edit the account copies in claude.ai, since local synced files are overwritten.
   Optionally mirror the edits locally for this session.
4. M6: edit locally, noting the environment may restore it.

## Verification

- `grep -rn "Think step by step\|Do not be lazy\|claude-3" ~/.claude/skills` returns nothing after a
  sync.
- `grep -c "No progress or status" CLAUDE.md ~/.claude/CLAUDE.md` returns 0 for both.
- Behavioral probe for M1: run one long task in a fresh session and check that a one line note
  appears during long stretches and that no recap or closing offer is added.
- Behavioral probe for H1: invoke `empathy-map` on a sample and confirm the output format is
  unchanged.
