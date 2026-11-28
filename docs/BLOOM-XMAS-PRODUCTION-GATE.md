# Christmas Edition production release — GATE GO

**Time (Europe/London):** Sat 28 Nov 2026, ~11:55 GMT  
**Decision:** **GO** — owner acceptance and production authorisation granted. Proceeding to merge, Pages deploy, live verify, tag, and maintenance-only.

## Gate results

| # | Gate | Result |
| --- | --- | --- |
| 1 | Accepted live preview is xmas-016 / SW 016 | **PASS** — https://bloom-xmas-final-016.apps.grok.bot/ |
| 2 | 65 regression tests | **PASS** — unit 33/33 + browser 32/32 on tip `fd488e4` (code tip `f11d715`) |
| 3 | Physical iPhone + Samsung acceptance | **PASS** (owner) |
| 4 | Final visual acceptance | **PASS** (owner) |
| 5 | Rollback readiness vs prod-013 | **READY** — tag `bloom-2.0-rc-prod-013` / commit `085acfe` |
| 6 | myday-v1 / backups / offline / security | **PASS** — `KEY='myday-v1'`, Groceries guard, colour allowlist preserved |
| 7 | Production authorisation | **GRANTED** (owner) |

## Accepted hashes (source = live preview after OG strip)

| File | SHA-256 |
| --- | --- |
| `index.html` | `13df70a3be6be617781a4e2838f523b5aaec78691ad8936dfa936345632bd278` |
| `sw.js` | `0b090c4ed92605d229a9edc70f0be02df2e371b3865d9f65af63943af8f675f3` |
| `bloom-christmas.css` | `e383f59aab8c482ccf02ac19759846dd638d830e1391e94279aa496848529d5f` |
| `bloom-themes.css` | `20e8c4d26d9d73f7baeb8efafd03b6c1bcb0a5e4bae731e01e46ed2fd0497d6f` |

## Rollback

If production verification fails: reset `main` to `085acfe` / tag `bloom-2.0-rc-prod-013` and redeploy GitHub Pages. Storage key `myday-v1` is unchanged.
