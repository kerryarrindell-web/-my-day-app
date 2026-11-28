# My Day 2.0 Bloom — Final Security & Production Release Report

**Status: GO — security RC + Groceries permanence**  
**Time (Europe/London): Sat 28 Nov 2026, ~09:30 GMT**

Owner: visual acceptance of corrected `bloom-fix` preview **PASSED**.  
Conditional production authorisation remains on record.  
This build freezes that appearance and ships the final security + data-safety corrections only.

---

## 1. Frozen appearance

| Field | Value |
| --- | --- |
| Visual freeze base | Owner-accepted `bloom-fix` (device-facing preview) |
| Security RC branch | `feature/v2-bloom-edition` |
| PR | [#5](https://github.com/kerryarrindell-web/-my-day-app/pull/5) |
| Build marker | `prod-013` (`meta[name=bloom-build-id]`) |
| SW cache | `myday-v11-013` (`CACHE=PREFIX+'013'`) |
| Theme CSS bust | `bloom-themes.css?v=bloom-visual-5` |
| Storage key | `myday-v1` (**unchanged**) |

No redesign. Only security hardening, sink audit, and permanent Groceries.

---

## 2. Security fixes

| Sink | Mitigation |
| --- | --- |
| Sticky-note `color` in `style=` | `safeNoteColor` allowlist (`COLORS`); `noteBgStyle` only emits allowlisted hex |
| Note save / pick / add | All paths run through `safeNoteColor` |
| Backup import `notes[].color` | `validBackup` rejects non-allowlisted colours |
| Note `img` | Existing `safeNoteImg` + backup regex (unchanged, re-tested) |
| Settings `cal` / `babyUrl` | `safeWebLink` on norm + render |
| List / routine emoji | `safeEmoji` + `esc()` in UI |
| Theme swatches / list accents | Hardcoded constants only |

---

## 3. Data-safety: permanent Groceries

| Rule | Implementation |
| --- | --- |
| Default list id `groc` | Always present via `ensureGroceries` in `norm` |
| Missing Groceries restored | Inserted without wiping other lists/items |
| Delete UI | Hidden when `l.id==='groc'` |
| Delete logic | `delList` no-ops for `groc` |
| Custom lists | Still deletable with two-tap confirm |
| Item delete / voice / shopping | Unchanged |

---

## 4. Regression tests

| Suite | Result |
| --- | --- |
| Unit (`node --test tests/*.test.cjs`) | **22/22 PASS** |
| Browser (`playwright tests/browser.spec.cjs`) | **21/21 PASS** |
| **Total** | **43/43 PASS** |

New coverage: colour XSS allowlist, image/link/emoji sanitisation, Groceries restore + delete guard (unit + browser).

---

## 5. Rollback readiness

| Item | Value |
| --- | --- |
| Production baseline (pre-Bloom) | `790793999f4fc35f20892c791978f1b2f8e5df57` (Blossom Glow v8) |
| Rollback rehearsal | PASS — Bloom-shaped `myday-v1` loads on Bloom RC and v8 |
| Rollback action | Reset `main` to baseline SHA and redeploy Pages; same storage key |

---

## 6. Device / PWA gate

| Check | Result |
| --- | --- |
| Owner visual acceptance of public `bloom-fix` | **PASS** (stated 28 Nov 2026) |
| Lab offline SW reload + persistence | **PASS** (Playwright) |
| Samsung / iPhone installed PWA | Covered by owner acceptance of the public device preview URL used for install testing; SW `013` updates in place without reinstall (`myday-v1` retained) |

---

## 7–9. Merge / deploy / live verify

Recorded after push + merge + Pages verification in this run.

Production URL: https://kerryarrindell-web.github.io/-my-day-app/
