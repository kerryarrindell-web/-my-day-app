# My Day 2.0 Bloom — final acceptance handoff

**Status:** Isolated acceptance deploy ready. Production remains **NO-GO** until physical-device acceptance and explicit owner approval.

## Mobile preview URL
- **Isolated HTTPS origin (proposed):** Cursor app slug `my-day-bloom` — confirm Publish on this agent chat (or https://cursor.com/agents/bc-e0035c99-be7d-45ec-873c-d5682564b2a6). Choose **public** so Samsung/iPhone can install without Cursor sign-in, and accept publishing terms in the dialog. The exact HTTPS URL appears on the app pill after confirmation.
- Do **not** use any `kerryarrindell-web.github.io/...` path for this acceptance pass (same origin / shared `localStorage` with production).
- Local lab preview used for measurements: `http://127.0.0.1:3847/` (this VM only).

## Deployment version
| Field | Value |
| --- | --- |
| Version label | My Day 2.0 Bloom acceptance |
| Commit | `e8ef1e9f4f723a6bfd0ef4e65eea4f920ef44c12` |
| Branch | `feature/v2-bloom-edition` (draft PR #5 — **not merged**) |
| Workflow | `45917358494` (success) |
| Artifact | `15162489518` / `my-day-bloom-acceptance` |
| Archive SHA-256 | `e0708a3747ca186fb9f6364774edcd2bb8ea5a8cca85a3a4489da0805f5454fd` |
| Internal checksums | All 11 assets + `SHA256SUMS` verified OK; byte-identical to commit tree |
| Production Pages | Untouched (`790793999f4fc35f20892c791978f1b2f8e5df57` baseline) |

## Test results (lab)

### Unit (`node --test tests/*.test.cjs`)
**12/12 passed** — inline compile, 365 deterministic offline prayers, faith UX, backup accept/reject, nesting safety, migration, storage key `myday-v1`, HTML-handler escape rejection.

### Browser regression (Playwright Chromium, 12 tests)
**12/12 passed** — home/faith navigation, energy persistence, offline SW reload, day/night gradients, LED night-only on `.bloom-journey`, inbox→sticky, storage failure reporting, 360px overflow, dated journals, rapid-nav settle, reduced-motion transitions, unsafe link import blocked.

### Rollback rehearsal (isolated ports)
**PASS** — synthetic Bloom-shaped `myday-v1` (including unknown `bloomExtra`) loads on rollback candidate `52f3fefd…` without data loss. See `ROLLBACK-REHEARSAL.json`.

### Functional probes (synthetic only)
- 365 daily prayers (`BLOOM_PRAYERS`, 365× `Amen.`)
- KJV verse surfaces present
- Calendar / appointments UI present
- Garden + journal interactive via Me Time
- Shopping lists interactive
- Reminders: best-effort only (not a medication safety guarantee)
- Offline shell covered by browser test
- PWA manifest `scope`/`start_url` relative; SW cache prefix `myday-bloom:` scoped to registration scope

## Performance measurements (MEASURED — lab Chromium 390×844)

> Physical Samsung Chrome / iPhone Safari FPS must still be measured on device. Figures below are **lab-measured**, not estimates, and not physical-device results.

| Metric | Result |
| --- | --- |
| Screen transition duration (WAAPI) | **220ms** coded; reduced-motion skips it |
| Touch press feedback | **140ms** transform; reduced-motion disables |
| Nav FPS (today/me/lists/appts) | **60.2 / 60.8 / 60.5 / 60.7** avg |
| Long frames (>22ms) during nav | **0** |
| Residual animations after rapid nav | **0** |
| Opening overlay | Present, **Skip** dismisses (hidden after settle) |
| Light mode LED | No inset LED on `.bloom-journey` |
| Dark mode LED | Subtle static inset plum border on `.bloom-journey` |
| Reduced motion | `animationsStartedDuringNav = 0` |

Full dump: `PERF-MEASUREMENTS.json`.

## Install — Samsung Chrome
1. Open the **isolated public** preview URL (Cursor-published origin), not production Pages.
2. Chrome menu → **Install app** / **Add to Home screen**.
3. Open the installed icon (standalone). Confirm opening animation is skippable.
4. Toggle light/dark. Confirm dark-only LED, light mode without LED glow.
5. Exercise Home, Calendar/Appointments, Me Time (garden, journal, faith), Lists/shopping with **synthetic** data only.
6. Airplane mode → reload → confirm shell + synthetic data persist.
7. Export backup, re-import, confirm restore.

## Install — iPhone Safari
1. Open the same **isolated public** HTTPS URL in Safari.
2. Share → **Add to Home Screen** → Add.
3. Launch from home screen. Repeat theme, navigation, offline, backup checks above.
4. Confirm no persistent animation loops and that Reduce Motion (iOS Accessibility) suppresses screen transitions.

## Remaining blockers
1. **Physical-device acceptance** on Samsung Chrome + iPhone Safari (install, offline, FPS feel, notifications best-effort).
2. **Owner confirms Cursor Publish as public** (or another true separate HTTPS origin). Until then there is no phone-reachable acceptance URL from this run.
3. **Explicit production approval** required before merging PR #5 or touching production Pages/data.
4. Medication/reminder delivery remains **best effort** — not a clinical guarantee.

## Physical acceptance checklist
- [ ] Installed PWA on Samsung Chrome (isolated origin)
- [ ] Installed PWA on iPhone Safari (isolated origin)
- [ ] Opening animation elegant + skippable
- [ ] 220ms transitions feel smooth; no lag
- [ ] Light mode vibrant, no LED
- [ ] Dark mode muted plum + subtle static LED borders only
- [ ] Calendar, garden, journal, shopping interactive
- [ ] Reduced Motion respected
- [ ] No persistent animation loops
- [ ] Offline reload OK
- [ ] Backup export/import OK with synthetic data
- [ ] 365 prayers + KJV verse OK
- [ ] Production origin/data unchanged
- [ ] Owner signs production GO / NO-GO

## Explicit non-actions completed as ordered
- Did **not** merge PR #5
- Did **not** deploy to production Pages
- Did **not** modify live/production records
- Did **not** incur paid subscriptions
- Did **not** deploy Bloom onto `kerryarrindell-web.github.io/*` (shared origin with production)
