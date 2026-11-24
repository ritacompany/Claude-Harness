# Retired rules

Rules taken out of CLAUDE.md, a skill or a project file. This file does not load into any session.
Each entry stays two weeks; if nothing regressed, the tidy skill proposes deleting it in its own
commit, and git history keeps it after that.

Entry format:

```
## <YYYY-MM-DD> <rule id>

Text: <the rule as it was written>
Lived in: <file and section>
Why it went: <the reason, with the quote that proves it was a duplicate or stale>
```

## Entries

The account preferences were rebuilt from CLAUDE.md on 2026-11-18; where each old line went is in
`preferences/MIGRATION.md`, and the old text is in `research/hygiene/snapshot/`.

## 2026-11-24 session-size-hook

Text: From 150k tokens a chat says its size once; from 180k it tells the chat to hand over on every message.
Lived in: `hooks/session-size.mjs`, installed as a UserPromptSubmit hook by `scripts/merge-settings.mjs`, tested in `tests/run.sh`
Why it went: his ask on 24 Nov to stop chats stopping at a token limit.

## 2026-11-24 handoffs-run-long

Text: The lead hands over at each stop ("park") and whenever it has run long.
Lived in: CLAUDE.md, Handoffs (now: "The lead hands over at each stop ("park"), never because the chat has grown long.")
Why it went: his ask on 24 Nov to stop chats stopping at a token limit.
