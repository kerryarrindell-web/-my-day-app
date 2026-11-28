# My Day — Christmas Edition visual refinement (xmas-015)

## Status
Isolated preview only. Production remains **prod-013**. Do not merge or deploy until owner visual + physical-device acceptance.

## What changed
- Immersive SVG/CSS atmosphere: evergreen garlands with fairy lights, hanging baubles, glowing stars, side light strands, corner botanicals, snowfall.
- In-flow `.xmas-rail` SVG garland on every Christmas tab.
- Theme-specific palettes: Christmas Rose (rose-gold/champagne), Enchanted (red/gold evergreen), Midnight (charcoal + gold LED card borders).
- Seasonal effects toggle (Lights & snow / Calm); reduced-motion; pause when backgrounded.
- Upgraded Christmas opening: decorated SVG tree, ornaments, snow, stars, My Day branding.
- Build marker **xmas-015**; service worker cache **015**.

## Preserved
Five Bloom themes unchanged; navigation/layouts; groceries protection; security fixes; prayers/KJV; countdown; gifts; garden; storage `myday-v1`; offline/backups.

## Verification
- Unit: 31 passed (`tests/*.test.cjs`)
- Browser: 29 passed (`tests/browser.spec.cjs`) including atmosphere, rail SVG, baubles/stars, reduced motion, theme isolation, clearance
- Screenshots: `docs/xmas-screens-015/` (3 themes × 5 tabs + opening)
