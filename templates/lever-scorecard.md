# Ten lever scorecard

Use it to review any project's agent setup. For each lever, read the repo and name the file and
line that shows it, then give a verdict: Holds, Partial or Weak. A lever held only by prose that the
agent can skip counts as Partial at best; a lever held by a script, hook or check counts as Holds
only once that check has caught a planted mistake.

| Lever | What to look for | Verdict | Evidence (file and line) | Fix |
| --- | --- | --- | --- | --- |
| 1. Harness | Usage managed during the work, tool budgets, a named fallback when a tool refuses | | | |
| 2. Loop | Each loop has a budget, a machine signal that it is done and a reaction to a repeat | | | |
| 3. Context | Rules load by job; chat size is measured; long chats rotate | | | |
| 4. Tools | Few tools, each with a clear description; no duplicates | | | |
| 5. Memory | The right things kept in git (decisions, handoffs, logs); stale lists cut | | | |
| 6. Orchestration | Builder and critic kept apart by the setup, not by memory; handoffs in files | | | |
| 7. Guardrails | Output gates, permissions, merge checks; no waiver the checked agent writes itself | | | |
| 8. Evals | Recorded corrections replayed on every change; checks proven on planted mistakes | | | |
| 9. Human in the loop | Asks only for what only the person holds; the person is not the QA layer | | | |
| 10. Observability | Logs survive the container; a skipped step raises a signal | | | |

## Summary

The pattern across the ten levers, in two or three sentences, then the three fixes that would move
the most levers.
