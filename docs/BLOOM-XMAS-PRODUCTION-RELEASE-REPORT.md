# My Day — Christmas Edition Final Production Release Report

**Status: IN PROGRESS — authorised GO**  
**Time (Europe/London):** Sat 28 Nov 2026, ~11:55 GMT

Owner acceptance (iPhone PWA, Samsung PWA, final visual) **PASSED**.  
Accepted public preview: https://bloom-xmas-final-016.apps.grok.bot/  
Production authorisation: **GRANTED**.

---

## 1. Pre-deploy verification

| Check | Result |
| --- | --- |
| Source tip | `feature/bloom-christmas-edition` @ `fd488e4` (code `f11d715`) |
| Build marker | `xmas-016` |
| SW cache | `016` (includes `bloom-christmas.css`) |
| Live preview hashes | Match source (`index.html` after host OG strip) |
| Local regression | **65/65 PASS** (unit 33 + browser 32) |
| Production before deploy | `prod-013` / SW `013` (confirmed intact) |
| Rollback tag | `bloom-2.0-rc-prod-013` preserved |

### Accepted asset hashes

| File | SHA-256 |
| --- | --- |
| `index.html` | `13df70a3be6be617781a4e2838f523b5aaec78691ad8936dfa936345632bd278` |
| `sw.js` | `0b090c4ed92605d229a9edc70f0be02df2e371b3865d9f65af63943af8f675f3` |
| `bloom-christmas.css` | `e383f59aab8c482ccf02ac19759846dd638d830e1391e94279aa496848529d5f` |
| `bloom-themes.css` | `20e8c4d26d9d73f7baeb8efafd03b6c1bcb0a5e4bae731e01e46ed2fd0497d6f` |

---

## 2. Protections preserved

| Protection | Status |
| --- | --- |
| Storage key `myday-v1` | Unchanged |
| Groceries permanent (`ensureGroceries` / `delList` guard) | Preserved |
| Sticky-note colour allowlist (`safeNoteColor`) | Preserved |
| Note image / link / emoji sanitisation | Preserved |
| Backup import validation | Preserved |
| Offline SW shell cache | Bumped 013 → 016; activate drops prior `myday-bloom` caches |

---

## 3. Release steps (this run)

1. Preserve prod-013 rollback baseline (tag already on remote)
2. Merge `feature/bloom-christmas-edition` → `main`
3. Deploy via GitHub Pages (`main` `/`)
4. Verify live production build / SW / hashes
5. Confirm PWA update path (cache `016` + activate cleanup; no reinstall required)
6. Tag `bloom-christmas-xmas-016`
7. Freeze handoff to maintenance-only

---

## 4. Post-deploy (filled after live verify)

| Field | Value |
| --- | --- |
| Merge commit | _pending_ |
| Production URL | https://kerryarrindell-web.github.io/-my-day-app/ |
| Live build | _pending_ |
| Live SW | _pending_ |
| Live hash match | _pending_ |
| Release tag | `bloom-christmas-xmas-016` |
| Mode | Maintenance-only |

---

## 5. Rollback procedure

```text
git checkout main
git reset --hard 085acfeb98e1595083825168a1915598bc4b3db0
# or: git reset --hard bloom-2.0-rc-prod-013
git push --force-with-lease origin main
```

Then wait for Pages rebuild. `myday-v1` records remain; Christmas-only fields survive via `norm` if rolled forward again.
