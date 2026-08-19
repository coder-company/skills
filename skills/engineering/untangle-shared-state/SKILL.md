---
name: untangle-shared-state
description: Redesign concurrent access to mutable state by reducing sharing and making ownership explicit. Use for races, lock contention, stale reads, reentrancy, or multiple writers. Do not use for ordinary synchronous state updates with one clear owner.
---

# Untangle shared state

## Map ownership and interleavings

Identify every reader and writer, the state each needs, the lifetime of sharing, and the invariant that concurrent operations can violate. Draw the smallest event sequence that produces stale, lost, duplicated, or reordered work.

## Remove sharing first

Prefer partitioning by key, immutable snapshots, message passing, per-request state, single ownership, or moving work to the actor that owns the data. Add a lock or global queue only when shared serialization is a real invariant.

If serialization is required, define the protected state, acquisition scope, ordering, cancellation, timeout, failure release, and reentrancy behavior. Do not hold locks across slow or untrusted external calls without explicit justification.

## Test adversarial schedules

Use barriers, deterministic schedulers, repeated stress, race detectors, or targeted fault injection when available. Verify the invariant, not only absence of a crash. Test cancellation and partial failure around ownership transfer.

Do not claim a race is fixed because one repeated run passed. Report the ownership model and the schedule the design now prevents.
