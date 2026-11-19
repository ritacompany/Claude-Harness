# Fidelity check, wave sample

Totals (40 ids): VERBATIM 37, CLOSE 0, NOT FOUND 0, NOT HIS 2, WRONG SESSION 1.

Of the 37 VERBATIM: 28 found in the raw event pages, 9 found only in the sessions-final copy (the raw pages do not hold them).

Method: exact substring match (whitespace normalised) of each quote against user events in the raw list_events pages. Each raw hit was in a plain text user event with client_platform web_claude_ai, in the named session, with created_at equal to the evidence timestamp. Sessions-final hits are plain text entries with platform=web_claude_ai and the same timestamp.

## Not VERBATIM

- E2484 WRONG SESSION. The text is verbatim and typed by him (2026-09-25T17:51:18.216430Z, msg 5ef278b8), but the raw event carries session_id session_01ByCW6sxio2TTKHk7TnrTvz, not session_019TMvtLPLFecAz9fEbEisVn as the evidence source says. The sessions-final file for 019TMv also lists that message (the two session files share 10 events), so it may be a forked or resumed pair. The raw page wins: fix the source to 01ByCW, or confirm the shared lineage.
- E2638 NOT HIS. Quote is the second sentence of the first message of session_01KYnAdaA7vwc1VVEeXfroDt (msg 53e87967, 2026-09-25T03:17:57Z): a long structured brief written for the build chat ("Chadwick lifted it for these fixes only..."), pasted in as plain text. Those are a brief's words, not his typing.
- E2665 NOT HIS. Quote is a checklist line inside the first message of session_01WMM1YYX2MUcJKbcRMk7xX1 (msg f4ed0acf, 2026-09-25T19:51:18Z), a brief ("Apply the approved region gap rule... this chat only builds it and proves it" with Read first, The rule and numbered steps). Not his words.

## Per id

| id | verdict | where |
|---|---|---|
| E2200 | VERBATIM | raw page, right session, timestamp matches |
| E2206 | VERBATIM | raw page, right session, timestamp matches |
| E2222 | VERBATIM | raw page, right session, timestamp matches |
| E2239 | VERBATIM | raw page, right session, timestamp matches |
| E2250 | VERBATIM | raw page, right session, timestamp matches |
| E2252 | VERBATIM | raw page, right session, timestamp matches |
| E2261 | VERBATIM | raw page, right session, timestamp matches |
| E2370 | VERBATIM | raw page, right session, timestamp matches |
| E2418 | VERBATIM | raw page, right session, timestamp matches |
| E2455 | VERBATIM | raw page, right session, timestamp matches |
| E2531 | VERBATIM | raw page, right session, timestamp matches |
| E2563 | VERBATIM | raw page, right session, timestamp matches |
| E2574 | VERBATIM | raw page, right session, timestamp matches |
| E2575 | VERBATIM | raw page, right session, timestamp matches |
| E2583 | VERBATIM | raw page, right session, timestamp matches |
| E2591 | VERBATIM | raw page, right session, timestamp matches |
| E2670 | VERBATIM | raw page, right session, timestamp matches |
| E2691 | VERBATIM | raw page, right session, timestamp matches |
| E2733 | VERBATIM | raw page, right session, timestamp matches |
| E2735 | VERBATIM | raw page, right session, timestamp matches |
| E2747 | VERBATIM | raw page, right session, timestamp matches |
| E2779 | VERBATIM | raw page, right session, timestamp matches |
| E2817 | VERBATIM | raw page, right session, timestamp matches |
| E2845 | VERBATIM | raw page, right session, timestamp matches |
| E2854 | VERBATIM | raw page, right session, timestamp matches |
| E2856 | VERBATIM | raw page, right session, timestamp matches |
| E2916 | VERBATIM | raw page, right session, timestamp matches |
| E2939 | VERBATIM | raw page, right session, timestamp matches |
| E2258 | VERBATIM | sessions-final only, timestamp matches |
| E2287 | VERBATIM | sessions-final only, timestamp matches |
| E2426 | VERBATIM | sessions-final only, timestamp matches |
| E2518 | VERBATIM | sessions-final only, timestamp matches |
| E2585 | VERBATIM | sessions-final only, timestamp matches |
| E2675 | VERBATIM | sessions-final only, timestamp matches |
| E2707 | VERBATIM | sessions-final only, timestamp matches |
| E2898 | VERBATIM | sessions-final only, timestamp matches |
| E2920 | VERBATIM | sessions-final only, timestamp matches |
| E2484 | WRONG SESSION | raw event is in session_01ByCW6sxio2TTKHk7TnrTvz |
| E2638 | NOT HIS | brief |
| E2665 | NOT HIS | brief |
