---
name: refactor-without-regressions
description: Change code structure while preserving externally observable behavior. Use for refactors, internal rewrites, extractions, private renames, or representation changes where behavior must remain unchanged. Do not use when consumers must migrate to a replacement contract; use replace-an-api. Do not use when the requested outcome intentionally changes product behavior.
---

# Refactor without regressions

## Freeze the behavior boundary

List the public APIs, serialized values, side effects, error behavior, ordering, timing constraints, and supported inputs that must remain stable. Use tests, callers, documentation, production artifacts, and history as evidence. Repository search alone does not define an external contract.

Add characterization tests only where behavior is important and otherwise unprotected. Do not bless an obvious defect as intended behavior without evidence.

## Change one structural axis

Separate movement, renaming, representation changes, and behavior changes when combining them would hide regressions. Keep the repository runnable after each meaningful step. Avoid compatibility wrappers unless a current consumer requires a staged transition.

## Compare before and after

Run the same behavior checks on both sides when practical. Inspect generated output, public exports, schemas, fixtures, and runtime side effects, not only unit tests. Treat unexpected output changes as failures until explained.

Report the preserved contract, structural change, checks, and any intentional behavior difference authorized by the user. Do not call a rewrite behavior-preserving from compilation alone.
