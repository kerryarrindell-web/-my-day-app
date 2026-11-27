# My Day 2.0 Bloom — final acceptance handoff

**Status:** Isolated acceptance preview (patched). Production remains **NO-GO** until physical-device acceptance and explicit owner approval.

## Mobile preview URL
- Cursor app slug **`my-day-bloom`** (public). Exact HTTPS URL is on the app pill after publish confirms.
- Do **not** use `kerryarrindell-web.github.io/*` (same origin / shared `localStorage` with production).

## Patch build (settings + grocery)
- Commit: `d7179d68e6dd600728d031b1dfd5e15adde37b6c`
- Base acceptance: `e8ef1e9f4f723a6bfd0ef4e65eea4f920ef44c12` / artifact `15162489518`
- Fixes: dark/light toggle during settings sheet-in; grocery `#ni` clears only after successful save
- SW cache: `myday-bloom…:008`
- Regression: unit **12/12**, browser **15/15** (3 new targeted tests)

## Deployment version
| Field | Value |
| --- | --- |
| Version label | My Day 2.0 Bloom acceptance + patch |
| Deploy commit | `d7179d68e6dd600728d031b1dfd5e15adde37b6c` |
| Branch | `feature/v2-bloom-edition` (draft PR #5 — **not merged**) |
| Production Pages | Untouched |

## Test results (lab)
- Unit: 12/12 pass
- Browser: 15/15 pass (includes dark-during-slide-in, scrim-guard, grocery clear-after-save)
- Visual QA: premium checks previously passed; appearance/LED/220ms motion intentionally unchanged by this patch

## Install — Samsung Chrome / iPhone Safari
1. Open the **public** isolated preview URL (not production Pages).
2. Install to home screen; confirm SW activates; airplane-mode reload with synthetic data.
3. Re-check Dark toggle during settings open and grocery add clearing.

## Remaining blockers
1. Physical Samsung + iPhone acceptance
2. Explicit production approval before merging PR #5
3. Reminders remain best-effort (not a medication safety guarantee)

## Explicit non-actions
- Did **not** merge PR #5
- Did **not** modify production Pages or live personal records
- Did **not** incur paid charges
