---
name: sequence-migrations
description: Order a multi-step code, data, API, or dependency migration into units that each end in a deployable, checkable state, with compatibility windows and the point of no return named. Use when deployment order matters, several callers or layers must move, readers and writers change at different times, or a batch change would hide which step broke. Do not use for a small atomic fix; one change and its check suffice. Do not use to gate a single release action; use check-release-safety.
---

# Sequence migrations

Name the contract that is moving and every party that depends on it, cut the work into units that each end in a known verifiable state, put the riskiest unknown first, and execute one unit at a time from a recorded baseline.

## Route first

- The change is one atomic fix with a focused check: apply it; do not build a migration plan.
- The change is an API replacement whose consumers all live in this repository: `replace-an-api` in one wave.
- Each unit's remote action (merge, deploy, migration apply): `check-release-safety` gates it.
- Each unit must be safe to rerun: `make-side-effects-idempotent`.

## Identify the moving contract

Name the old contract, the target contract, and every party: consumers, writers, readers, stored data, generated artifacts, deployment environments, and the previous version of this service during a rolling deploy.

Find the ordering constraints: a reader cannot use a field before the schema exists; a writer must produce both forms during the window; a backfill must finish before reads switch; callers must move before the old path is deleted; a package consumer must accept both versions during rollout; rollback cannot cross an irreversible data transformation.

Decompose by contract transition, never by directory or role. "Database, backend, frontend, tests" hides the contract between steps.

## Cut units that end in a known state

Each unit has: one coherent contract change; a precondition established by earlier units; a check that can fail at the unit boundary; a deployable or intentionally isolated end state; a recovery or forward-fix path; and no dependency on an uncommitted later unit.

Use expand, migrate, verify, contract when independent deployment or external consumers require compatibility. Use direct migration and deletion in one bounded wave when the repository updates atomically and no external consumer needs a window. Confirm which case applies from evidence (deployment topology, consumer inventory); do not build compatibility layers for imaginary users.

Feature flags can make ordering safe only when the flag state and its removal unit are explicit. A disabled path still changes schemas, initialization, or public contracts.

## Put risk and proof in the order

Resolve high-impact unknowns before building dependent units (see `check-the-premise`). Capture the baseline and the verification mechanism before the change they must measure.

For every transition state: what becomes newly possible; what old behavior still works; what check proves the state; what must be true before the next unit; whether rollback remains possible. Name the point of no return as its own line; do not bury it in a routine step.

## Execute one unit at a time

Start from a recorded baseline. Apply one unit, run its declared check, inspect the diff, record the result, then advance. If a check fails, stop at that unit and diagnose (`find-the-bug`); do not batch the remaining edits and hope the final suite localizes the failure.

Re-run the whole path from the original supported state when fixtures or a disposable environment allow. Test rollback or the declared forward-fix at the last reversible boundary in a non-production target when possible; otherwise state that the path is declared but untested.

## Stop signals

- Your unit list reads like a directory list: re-cut by contract transition.
- A unit's correctness depends on a later unit: merge them or reorder.
- You cannot name the check that fails at a unit boundary: the unit is not a unit.
- You are about to apply two units before running the first check: stop and run it.
- The point of no return is not written down: write it before the unit that crosses it.

## Shortcuts that fail

- "Deploy everything together, it's all one feature": the rolling deploy runs old and new code side by side, and the batch hides which change broke.
- "Add the compatibility shim to be safe": a shim with no consumer is dual behavior that must itself be migrated out.
- "Run all the migrations then the suite": a failure at the end points at nothing; the unit that broke is unknown.
- "Rollback is just the reverse": the backfill already rewrote the rows; the reverse recreates nothing.

## Report

List the ordered units, each with its contract change, check, and end state; compatibility windows with their closing condition; the point of no return; units executed with check results; rollback or forward-fix tested or declared untested; and legacy paths that remain, each with the condition allowing removal. The migration is not finished while a removal condition is unrecorded. If one atomic change sufficed, say so in one line.

## Critical failures

- Units cut by directory or role rather than contract transition.
- A unit applied without running the previous unit's check.
- Compatibility layer added without evidence of an independent deployment or external consumer.
- Point of no return unnamed or hidden in a routine step.
- Migration reported finished with a dual path or legacy contract lacking a removal condition.
