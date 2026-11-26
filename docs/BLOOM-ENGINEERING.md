# Bloom Edition engineering foundation

Baseline: 790793999f4fc35f20892c791978f1b2f8e5df57 (Blossom Glow v8).
Previous rollback candidate: 52f3fefd4283147ed71d700693e17503bfa18a81. Rehearsal pending.

## Invariants
- Preserve localStorage key `myday-v1` and all existing records, unknown fields and backup compatibility.
- Never use real personal records in tests; isolate preview origin from production.
- No deployment or main merge before explicit release approval.
- Keep existing five tabs, KJV, sticky notes, medication reminder and baby guidance.
- Medication alerts are best effort; never promise background delivery.
- Keep native CSS and vanilla JS unless measured benefit justifies a dependency.

## Release gates
Syntax and asset checks; browser regression tests; backup round-trip and migration; offline/update tests; accessibility and reduced motion; iPhone Safari and Samsung Chrome installed PWA acceptance; rollback rehearsal.

## Toolkit
Evaluate Lucide, date-fns, RRule, Playwright and Workbox against existing code. No dependency approved or installed yet. Shared toolkit README verified; full audit pending.
