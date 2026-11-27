# My Day 2.0 Bloom — Production Release Report

**Status: BLOCKED — missing essential physical-device confirmation**  
**Time (Europe/London): Fri 27 Nov 2026, ~01:52 GMT**

Owner production approval is on record. Manual visual acceptance is **PASSED**.  
Merge of PR #5 and GitHub Pages deploy were **not** performed because installed-PWA acceptance on **Samsung Chrome** and **iPhone Safari** is not documented as confirmed.

---

## 1. Frozen visual redesign

| Field | Value |
| --- | --- |
| Freeze tag | `bloom-2.0-rc1` |
| Approved commit | `fe5fdeb7220017de3a48e6889a3cce86ffb9fe9b` |
| Branch | `feature/v2-bloom-edition` |
| PR | [#5](https://github.com/kerryarrindell-web/-my-day-app/pull/5) (open, draft, mergeable, checks green) |
| SW cache | `011` |
| Storage key | `myday-v1` (unchanged) |

No further features or design changes were introduced after visual acceptance.

---

## 2. Regression tests (release gate)

| Suite | Result |
| --- | --- |
| Unit (`node --test tests/*.test.cjs`) | **12/12 PASS** |
| Browser (`playwright tests/browser.spec.cjs`) | **15/15 PASS** |
| **Total** | **27/27 PASS** |
| CI on PR #5 (`Bloom checks` / regression) | **SUCCESS** |

---

## 3. Installed PWA — Samsung & iPhone

| Device | Status |
| --- | --- |
| Samsung Chrome (installed PWA) | **NOT CONFIRMED** in this run |
| iPhone Safari (Add to Home Screen) | **NOT CONFIRMED** in this run |

Lab Chromium / isolated preview checks are not a substitute.  
**Release stopped here per safety rule.**

To clear this gate, confirm installed PWA acceptance on both devices (install, offline reload, data still present).

---

## 4. Data preservation / backup / migration

| Check | Result |
| --- | --- |
| `KEY === 'myday-v1'` | PASS |
| Bloom fields survive normalisation | PASS |
| Backup validation tests | PASS |
| Offline shell reload | PASS |

---

## 5. Rollback readiness

| Item | Value |
| --- | --- |
| Production baseline | `790793999f4fc35f20892c791978f1b2f8e5df57` (Blossom Glow v8) |
| Rollback candidate | `52f3fefd4283147ed71d700693e17503bfa18a81` |
| Rehearsal | PASS — Bloom-shaped synthetic `myday-v1` loads on Bloom RC and v8 |

Rollback: restore `main` to baseline and redeploy Pages. Same `myday-v1` key → records kept.

---

## 6–9. Merge / deploy / live verify

**Not performed** (physical PWA gate missing).

Production URL (unchanged): https://kerryarrindell-web.github.io/-my-day-app/

---

## Decision

**PRODUCTION: NO-GO** until Samsung + iPhone installed-PWA confirmation is provided.
