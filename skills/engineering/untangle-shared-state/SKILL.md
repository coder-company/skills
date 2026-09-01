---
name: untangle-shared-state
description: Redesign concurrent access to mutable state by eliminating the sharing first (partition, own, or make immutable) and serializing only what must remain shared, with ownership explicit. Use when you see races, lost updates, stale reads, lock contention, two writers to one file or key, or you are about to add a lock. Do not use for single-owner synchronous updates. Do not use for retry-caused duplicates; use make-side-effects-idempotent.
---

# Untangle shared state

Identify every actor that reads or writes the state, remove the sharing where two actors do not need the same mutable value, and for what remains, give the state one owner and one serialization point. Treat "add a lock" as a design smell to examine before it is a fix.

## Route first

- The symptom is a duplicate effect from retries or redelivery: `make-side-effects-idempotent`.
- The race is intermittent and you cannot yet reproduce it: `observe-the-runtime` to capture the interleaving first.
- The redesign changes a module's interface or ownership: `design-module-boundaries` for placement.

## Inventory the sharing

For the state in question (a variable, file, table row, cache key, branch, singleton), list:

- every reader and writer, by file:line, including background tasks, signal handlers, subprocesses, other services, and tests;
- whether each actor needs the latest value, its own value, or a snapshot;
- the write pattern: set, increment, append, read-modify-write, delete;
- the current protection, if any, and whether every access goes through it.

An access that bypasses the protection (a direct write, a second code path, a test fixture) means the protection is not a guarantee.

## Eliminate sharing first

Apply the first that fits each actor pair:

1. **Partition:** each actor gets its own state (one output file per worker, one cache namespace per tenant, one branch per agent). Merge at a single point afterward if a combined view is needed.
2. **Ownership transfer:** one actor owns the state; others send it messages or requests instead of writing. The owner applies changes in order.
3. **Immutability:** actors receive snapshots and produce new values; the only mutation is a single atomic swap of the reference.
4. **Derive instead of store:** if the shared value can be computed from inputs the actors already own, compute it where needed and stop storing it.
5. **Narrow the lifetime:** shrink the mutable scope so the state exists only inside one call, not across the process.

Only after these fail for a given pair, serialize.

## Serialize what must remain shared

- One serialization point: a single lock, queue, actor, or database transaction that every access goes through. Two locks protecting one state, or one lock and one unguarded path, are not serialization.
- Hold the lock for the shortest span that covers the read-modify-write; never across I/O, callbacks, or awaits that can re-enter.
- For a database, use the database's mechanism (transaction with the right isolation, `SELECT ... FOR UPDATE`, optimistic version column, unique constraint), not an application-level check.
- For files, write to a temporary path and rename atomically; use an advisory lock or a lock file with the owner's identity if multiple processes write.
- Make the ownership visible in the code: name the guard, put the state and the guard in one type, and make the unguarded path unconstructible where the language allows.

Document the lock order when more than one lock exists, and check every acquisition site follows it.

## Verify under contention

Reproduce the interleaving before and after:

- run the contested path concurrently enough times to make the old failure observable (a stress loop, a test that spawns N workers, a scheduler that forces the interleaving);
- assert the invariant after every run (count, sum, no duplicate keys, file integrity);
- confirm no access bypasses the serialization point by searching for direct accesses from the repository root.

A test that runs once with one actor does not verify concurrency.

## Stop signals

- You are about to add a lock without listing the actors: inventory first.
- Two actors write the same file, key, or branch and you plan to coordinate by convention: partition instead.
- The lock is held across an `await`, callback, or network call: shrink it or restructure.
- There are two guards for one state: pick one and route everything through it.
- The fix passes a single-threaded test only: run it under contention.

## Shortcuts that fail

- "Wrap it in a mutex": a mutex on one path leaves the other paths racing and adds contention where partitioning would have removed the sharing entirely.
- "Tell everyone not to write to it": instructions and conventions are not concurrency control; the next contributor or retry does not read them.
- "Check the value, then write": the check and the write are separate steps; another actor acts between them.
- "It only happens under load, it's a flake": load is the normal case in production; the flake is the bug.
- "Make everything a global with a big lock": the lock becomes the bottleneck and the reentrancy bug moves inside it.

## Report

State the actors and their access pattern, which pairs were separated and how, which state remains shared and its single serialization point with the code location, the lock order if any, accesses found bypassing the guard (or "none found from repository root"), and the contention test with command, iterations, and result. If the state was not actually shared, say so and cite the inventory.

## Critical failures

- A lock added without an inventory showing every access goes through it.
- Two actors still writing the same path, key, or branch by convention.
- A guard held across I/O or a reentrant callback.
- Verification without concurrent execution of the contested path.
- A check-then-act sequence left in place across the serialization boundary.
