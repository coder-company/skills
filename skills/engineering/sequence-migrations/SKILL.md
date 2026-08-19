---
name: sequence-migrations
description: Order a multi-step code, data, API, or dependency migration into verifiable states that preserve compatibility and recovery. Use when intermediate deployment order matters, several callers or layers must move, or a batch change would hide the step that introduced a failure.
---

# Sequence migrations

## Identify the moving contract

Name the old contract, target contract, consumers, writers, readers, stored data, generated artifacts, and deployment environments involved.

Find ordering constraints such as:

- a reader cannot use a field before the schema exists;
- a writer must produce both old and new forms during a compatibility window;
- a backfill must complete before reads switch;
- callers must migrate before the old API is deleted;
- a package consumer must accept both versions during rollout;
- a rollback cannot cross an irreversible data transformation.

Do not decompose work by directory or job title. A list of "database, backend, frontend, tests" hides the contract between steps.

This skill orders the steps. It does not replace the pre-mutation checks for any single remote release action.

## Choose units that end in a known state

Each unit must have:

- one coherent contract change;
- a precondition established by earlier units;
- a check that can fail at the unit boundary;
- a deployable or intentionally isolated end state;
- a recovery or forward-fix path;
- no dependency on an uncommitted later unit for correctness.

Prefer expand, migrate, verify, and contract when compatibility across deployments is required. Prefer direct caller migration and legacy deletion in one bounded wave when the repository can update atomically and no external consumers require a compatibility window.

Do not create compatibility layers for imaginary users. Determine whether independent deployment or external consumption actually exists.

## Put risk and proof in the order

Resolve high-impact unknowns before building dependent units. Capture the baseline and verification mechanism before the change whose success they must measure.

For every transition, state:

1. What becomes newly possible.
2. What old behavior still works.
3. What check proves the state.
4. What must be true before the next unit starts.
5. Whether rollback remains possible after this point.

Name the point of no return when one exists. Do not hide it inside a routine step.

## Recognize the near miss

Do not split a small atomic bug fix into a migration plan. Say that one atomic change and its focused check are sufficient, then proceed. Do not wrap the change in migration-unit fields, compatibility tables, hypothetical phases, rollback sections, or post-deploy ceremony that the task does not need.

Do not force user-visible vertical slices onto a mechanical rename, codemod, or behavior-preserving refactor when one atomic change and check is safer.

Feature flags can make horizontal ordering safe, but the flag state and removal path must be explicit. A disabled path is not automatically harmless if it changes schemas, initialization, or public contracts.

## Execute and verify one unit at a time

Start from a known baseline. Apply one unit, run its declared check, inspect the diff, and record the result before advancing. If the check fails, stop at that unit and diagnose it. Do not batch the remaining edits and hope the final suite localizes the problem.

Re-run the full migration path from the original supported state when fixtures or a disposable environment make that practical. Test rollback or the declared forward-fix at the last reversible boundary when a disposable or non-production target allows it. Otherwise, state that the path is declared but untested.

Report the ordered units and their checks, plus compatibility windows, point of no return, and legacy cleanup where they exist. If obsolete contracts or temporary dual-write paths remain, name each one and the condition that allows its removal. Do not report the migration as finished while that condition is unrecorded.
