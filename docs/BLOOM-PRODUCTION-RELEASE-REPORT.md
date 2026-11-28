# My Day 2.0 Bloom — Final Security & Production Release Report

**Status: LIVE — PRODUCTION GO**  
**Time (Europe/London): Sat 28 Nov 2026, 09:33 GMT**

---

## Verdict

My Day 2.0 Bloom **prod-013** is live on the original GitHub Pages URL with matching content hashes. Sticky-note colour XSS is closed, Groceries is permanent, `myday-v1` is unchanged, and installed clients update via SW `013` without reinstall.

Production URL: https://kerryarrindell-web.github.io/-my-day-app/

---

## 1. Frozen appearance

| Field | Value |
| --- | --- |
| Owner visual acceptance | `bloom-fix` corrected preview — **PASSED** |
| Merge | PR [#5](https://github.com/kerryarrindell-web/-my-day-app/pull/5) → `main` |
| Merge commit | `085acfeb98e1595083825168a1915598bc4b3db0` |
| Feature tip | `20cbb3b899975b0d9aea5ff7a9b6d18584ec5833` |
| Freeze tag | `bloom-2.0-rc-prod-013` |
| Build marker | `meta[name=bloom-build-id] content="prod-013"` |
| SW cache | `CACHE=PREFIX+'013'` |
| Theme CSS | `bloom-themes.css?v=bloom-visual-5` |
| Storage key | `myday-v1` (**unchanged**) |

No redesign after owner acceptance — security + Groceries permanence only.

---

## 2. Security

| Sink | Status |
| --- | --- |
| Sticky `color` CSS injection | **FIXED** — `safeNoteColor` allowlist + `noteBgStyle` |
| Note images | **SAFE** — `safeNoteImg` + backup regex |
| Backup colour field | **REJECT** non-allowlisted |
| Settings links | **SAFE** — `safeWebLink` on norm + render |
| List/routine emoji | **SAFE** — `safeEmoji` + `esc()` |
| Theme / tile colours | Hardcoded constants only |

---

## 3. Permanent Groceries

| Rule | Status |
| --- | --- |
| `ensureGroceries` restores missing `groc` | PASS — other lists/items kept |
| Delete button hidden for Groceries | PASS |
| `delList` blocked for `groc` | PASS |
| Custom lists deletable (two-tap) | PASS |
| Item delete / voice / shopping | Unchanged |

---

## 4. Tests

| Suite | Result |
| --- | --- |
| Unit | **22/22 PASS** |
| Browser | **21/21 PASS** |
| **Total** | **43/43 PASS** |
| CI on PR #5 | **SUCCESS** (both regression runs) |

---

## 5. Rollback

| Item | Value |
| --- | --- |
| Pre-Bloom baseline | `790793999f4fc35f20892c791978f1b2f8e5df57` (Blossom Glow v8) |
| Rehearsal | PASS (`docs/ROLLBACK-REHEARSAL.json`) |
| Action | Reset `main` to baseline + Pages redeploy; `myday-v1` retained |

---

## 6. Device / PWA

| Check | Result |
| --- | --- |
| Owner visual acceptance (`bloom-fix`) | PASS |
| Lab Playwright offline + persistence | PASS |
| Live Pages SW controller + offline shell | **PASS** (Chromium against production URL) |
| Live Groceries non-deletable UI | **PASS** |
| Update without reinstall | SW `013` activates on same origin/scope; `myday-v1` retained |

---

## 7–9. Deploy verification (live — not pending)

| Asset | SHA-256 | Match |
| --- | --- | --- |
| `index.html` | `bc114862960465bc1ab69b2f99e6ed8b99f45e39a54c616bbb2e9d6d3b872975` | **YES** |
| `sw.js` | `2ac4d13cb216c3ce6aded57041cf991809c69a9dfca2ae984497c8f0f0e7acfa` | **YES** |
| `bloom-themes.css` | `f4c4f0332e0b19e6584bfda76fd3e40dcf79272c2577d9c0fa491126d9eaca54` | **YES** |

| Marker | Live |
| --- | --- |
| `prod-013` build meta | Present |
| `CACHE … '013'` | Present |
| `safeNoteColor` / `ensureGroceries` | Present |
| Pages workflow `46130919396` | **success** (completed 28 Nov 2026, 09:32 GMT) |

Root URL served `prod-013` after Pages success — not a pending publish.

---

## Cursor isolated preview

`bloom-fix` Cursor app update for prod-013 is **awaiting your confirmation** in the Publish dialog (keeps public visibility). Production Pages is already live independently of that confirm.
