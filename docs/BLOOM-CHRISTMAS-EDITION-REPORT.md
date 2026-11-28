# My Day 2.0 — Bloom Christmas Edition Report

**Status: READY FOR ISOLATED DEVICE ACCEPTANCE (not production)**  
**Time (Europe/London): Sat 28 Nov 2026, ~09:55 GMT**

## Baseline

| Item | Value |
| --- | --- |
| Rollback / prod baseline | `prod-013` @ `085acfeb98e1595083825168a1915598bc4b3db0` |
| Tag | `bloom-2.0-rc-prod-013` |
| Branch | `feature/bloom-christmas-edition` |
| Build marker | `xmas-014` |
| SW cache | `014` |
| Storage key | `myday-v1` (unchanged) |

Production Pages remains **untouched** until owner acceptance + authorisation.

## Delivered

- Three Seasonal Collection themes: Christmas Rose, Enchanted Christmas, Midnight Christmas
- Original five Bloom themes preserved
- Christmas opening (CSS tree) for seasonal themes; original video retained otherwise; reduced-motion skips
- Home: festive greeting, local-date countdown, Christmas prayers/KJV, seasonal encouragement — prayer still before check-in
- Festive garden ornaments without wiping blossom counts
- Optional Christmas gifts list inside Shopping (not a new tab); Groceries remains permanent
- Security: gift field sanitisation; existing colour/image/backup protections preserved

## Tests (executed)

| Suite | Result |
| --- | --- |
| Unit (`tests/*.test.cjs`) | **28/28 PASS** |
| Browser (`tests/browser.spec.cjs`) | **27/27 PASS** |
| **Total** | **55/55 PASS** |

## Screenshots

Captured under `docs/xmas-screens/` (40 files: 8 themes × 5 tabs). Artefact copies: `/opt/cursor/artifacts/xmas-screens/`.

## Rollback

Revert to `085acfe` / tag `bloom-2.0-rc-prod-013` and redeploy Pages. `myday-v1` retained; unknown fields survive via `norm`.

## Commits

| Commit | Summary |
| --- | --- |
| `dce84f36276e6791eae11776b2c8c6cbdad69cef` | Christmas Edition feature commit on `feature/bloom-christmas-edition` |
| Rollback baseline | `085acfeb98e1595083825168a1915598bc4b3db0` (`prod-013`) |

## Source hashes (xmas-014)

| File | SHA-256 |
| --- | --- |
| `index.html` | `8f01e9d5631c731d7167605158fef8498e5368101fef268afe42de22405f7ba2` |
| `sw.js` | `7254f59e5a080efe881d11677e02f34ae6dce3541bde16f602edc4151c2e3c25` |
| `bloom-themes.css` | `20e8c4d26d9d73f7baeb8efafd03b6c1bcb0a5e4bae731e01e46ed2fd0497d6f` |
| `bloom-christmas.css` | `7a57b863f3ca1427f81a0c0135fd28b0442ae6a158cad7b0f44a005394dd67bf` |

## Isolated preview

Cursor publish for slug **`bloom-xmas`** is **awaiting your confirmation** (choose **Public** for Samsung/iPhone install without Cursor sign-in, and accept publishing terms).  
Nothing is live until that confirm completes — do not treat a pending dialog as a URL.

Production Pages remains on **prod-013** and is unchanged.

## Remaining blockers

1. Confirm Cursor publish of `bloom-xmas` as **Public**
2. Explicit physical-device acceptance (Samsung + iPhone installed PWA) on the verified public preview
3. Explicit production authorisation before merge/deploy
