# My Day — Christmas Edition polish (xmas-016)

## Status
Isolated preview only. Production remains **prod-013**.

## Corrections
1. Prayer / verse cards match Christmas Rose, Enchanted, and Midnight palettes (no generic purple).
2. Quick Add hides while scrolling; Christmas Home includes FAB clearance so prayer text is not covered at rest.
3. Calm mode uses `display:none`, clears snow/bauble/star nodes, and forces `animation:none` so seasonal animations stop processing.

Animated mode keeps gentle snowfall and slow fairy-light / star twinkle (no harsh flashing).

## Markers
- Build: **xmas-016**
- Service worker cache: **016**

## Tests
- Unit: 33 passed
- Browser: 32 passed (includes prayer theme, FAB scroll clearance, Calm animation stop)
