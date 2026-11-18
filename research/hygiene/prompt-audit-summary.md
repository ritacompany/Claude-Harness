The audit found one high-confidence issue and five medium ones, all of them in skills under your home folder. Your `CLAUDE.md` has one dated line. Nothing has been edited.

**The two that matter most**
- **Nine Figma skills load twice and the copies disagree.** Your account has older copies of nine Figma skills, and the Figma plugin has newer ones under the same names. For example, the plugin's `figma-use` has a session step the account copy lacks. Both load in every session, so which instructions run depends on which copy gets picked. There's no history to show which is newer, so I proposed no edit.
- **"No progress or status messages" makes Opus 5.5 go quiet** (line 26 in both copies of `CLAUDE.md`). This session showed it: the harness had to ask me twice for a status line. I propose a rewrite that keeps your no-recap, no-preview, no-closing-offer rule and allows a one-line note during long work. Decline it if the silence is what you want.

**Smaller fixes, all with ready edits**
- Five research skills end with "Think step by step". It does nothing when thinking is always on.
- Six "Do not be lazy" lines in `image-to-code` and `imagegen-frontend-mobile` can go. Each already sits next to a plain rule saying when to make more images or screens.
- `design-taste-frontend-v1` (21 markers) and `frontend-design` shout with MUST, NEVER and CRITICAL. I'd turn those into plain wording and keep every rule, including the named "AI tells" lists. Lists like that work well on this model.
- `context-engineering` budgets context for the retired `claude-3` at 200K. The current model has 1M.
- `session-start-hook` has three IMPORTANT markers. The cloud environment may restore that file.

**Flagged without edits**
- `frontend-design` recommends custom cursors and `design-taste-frontend-v1` bans them.
- `image-to-code` is written for Codex and relies on an image step Claude Code doesn't have built in.
- Your project `CLAUDE.md` has a Design line that your global copy lacks. Nothing in the project justifies editing the global file.
- Eight other skills are exact copies of plugin skills. Since they match, they're harmless.

**Where the edits have to go**
- **Account skills:** fixes to the synced skills must be made in your claude.ai account. A local edit is overwritten on the next sync.
- **Global file:** an edit to `~/.claude/CLAUDE.md` changes every project.

The full report and diff are in `/root/.claude/plans/prompt-audit-fizzy-twilight.md`.

Decision: delete the nine older Figma copies from your account.
- **Yes:** only the plugin's Figma skills load from then on, and the conflicts go away.
- **No:** both sets keep loading side by side.

My pick is yes, because the plugin copies are the ones being kept current and the account copies are missing the newer steps.

[skills: claude-api]
