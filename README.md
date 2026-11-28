# My Day 2.0 Bloom

A calm, offline-first daily companion for home tasks, shopping, appointments, sticky notes, and Me Time (garden, journal, KJV verses, and a 365-day prayer companion).

## Bloom visual themes

Choose an app-wide look from **More → Bloom themes**:

| Theme | Mode | LED |
| --- | --- | --- |
| Blossom Pink | Light | No |
| Lavender Dream | Light | No |
| Sage Garden | Light | No |
| Peach Sunrise | Light | No |
| Midnight Plum | Dark | Soft static perimeter LED |
| Christmas Rose | Light (Seasonal) | No |
| Enchanted Christmas | Light (Seasonal) | No |
| Midnight Christmas | Dark (Seasonal) | Soft static gold LED |

Theme choice is saved in `localStorage` (`myday-v1`) and survives reload and offline restart. Settings **Dark** maps to Midnight Plum; **Light** returns to a light Bloom theme.

## Tabs

**Home · Calendar · Me Time · Shopping · More**

## Run locally

```bash
python3 -m http.server 8080 --bind 127.0.0.1
# open http://127.0.0.1:8080/
```

Or any static file server. A service worker caches the shell for offline use (`sw.js` cache `016`).

**Production freeze:** Christmas Edition `xmas-016` on GitHub Pages. Maintenance-only — no further feature development or redesign.

## Tests

```bash
node --test tests/*.test.cjs
npx playwright test tests/browser.spec.cjs --workers=1
```

Serve the app on `http://127.0.0.1:8080/` before Playwright.

## Data

Storage key `myday-v1` is unchanged. Backups, shopping categories, appointments, sticky notes, KJV verses, 365 prayers, and offline support remain compatible.
