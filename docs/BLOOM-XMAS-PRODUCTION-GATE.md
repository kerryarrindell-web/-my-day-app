# Christmas Edition production release — GATE STOP

**Time (Europe/London):** 2026-11-28 late morning  
**Decision:** **NO-GO** — production merge/deploy halted.

## Gate results

| # | Gate | Result |
| --- | --- | --- |
| 1 | Accepted live preview is xmas-016 / SW 016 | **FAIL** — public bloom-xmas origin still serves **xmas-014** / SW **014** |
| 2 | 65 regression tests | **PASS** — unit 33/33 + browser 32/32 locally on tip `f11d715` |
| 3 | Physical iPhone + Samsung acceptance on accepted preview | **UNCONFIRMED** for xmas-016 (live public build is still 014) |
| 4 | Rollback readiness vs prod-013 | **READY** — prod-013 commit `085acfe`, SW `013` intact on production Pages |
| 5 | myday-v1 / backups / offline protections | **PASS** in source tip (`KEY='myday-v1'`, groceries guard, colour allowlist) |
| 6–12 | Merge, deploy, live verify, tag, maintenance | **NOT STARTED** (blocked by gates 1 and 3) |

## Live verification notes

- Public preview build meta: `xmas-014`
- Public preview SW: `CACHE … '014'`
- Local tip build meta: `xmas-016`
- Local tip SW: `CACHE … '016'`
- Production Pages: still `prod-013` / SW `013` (untouched)

## Required before GO

1. Confirm the pending **bloom-xmas** publish so public preview ships **xmas-016** / SW **016**.
2. Re-verify live preview markers/hashes match tip `f11d715` (or successor).
3. Explicit physical-device acceptance on that **xmas-016** public preview (iPhone Safari + Samsung Chrome installed PWA).
4. Re-issue production release authorization after those confirmations.
