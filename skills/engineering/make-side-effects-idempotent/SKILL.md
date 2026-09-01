---
name: make-side-effects-idempotent
description: Design or repair an operation so running it twice, resuming after a crash, or receiving it out of order converges on one end state with each effect applied once. Use when working on webhooks, queue consumers, jobs, payments, provisioning, or migrations, or the user asks what if this runs twice or make this safe to retry. Do not use for provably single-shot or read-only operations.
---

# Make side effects idempotent

Ask three questions about the operation: what happens if it runs twice with the same input, what happens if it crashes halfway and runs again, and what happens if two copies run at once. Fix the design until each answer is "the same end state, the effect applied once."

## Route first

- The duplicate effect comes from two actors sharing mutable state rather than a retried operation: `untangle-shared-state`.
- The operation is a multi-step migration whose intermediate states must each be deployable: `sequence-migrations`; this skill makes each step rerunnable.
- A specific duplicated effect is a reported bug: `find-the-bug` to reproduce it, then this skill for the fix.

## Map the effects

List every side effect the operation performs, in order: rows written, files created, messages published, external API calls, emails, counters incremented, caches invalidated. For each, record:

- whether it is naturally idempotent (setting a value) or not (incrementing, appending, charging, sending);
- whether it has a natural key (order ID, event ID) or only implicit identity (timestamp, position);
- whether it can be observed afterward to tell if it already happened.

The non-idempotent effects without a natural key are where duplicates will come from.

## Choose the mechanism

For each non-idempotent effect, apply the first that fits:

1. **Idempotency key:** derive a key from the input (event ID, request ID, natural business key). Record the key with the effect in the same transaction as the effect. On a repeat, look up the key first and return the recorded result. The key must come from the caller or the input, not from a timestamp or a random value generated inside the operation.
2. **Upsert by natural key:** write with "insert or update where key matches" instead of insert. Make the uniqueness a database constraint, not a check-then-insert.
3. **Absolute rather than relative writes:** set the balance to the computed value with a version check rather than adding a delta; set the state to `shipped` rather than toggling.
4. **Conditional external calls:** pass the idempotency key to the external service if it supports one (payments, email, cloud APIs). If it does not, record intent before the call and the result after it, and reconcile from the record on retry.
5. **Ordered by version, not arrival:** for out-of-order delivery, carry a version or sequence with each message and apply only if it is newer than the stored version.

The lookup, the effect, and the record of the effect must be atomic (one transaction, one compare-and-swap, or one file rename). Check-then-act across two steps is not idempotent under concurrency.

## Handle the partial failure

Walk the operation step by step and, after each step, ask "if the process dies here, what does the next run see?" For each point:

- The next run must be able to tell that this step completed (an observable marker).
- Steps that cannot be observed must be moved behind a recorded intent (write "about to call X with key K", then call, then record the result).
- Steps that cannot be made observable or recorded (an external side effect with no key and no record) are the residual risk; name them in the report.

Where compensation is possible (a created resource whose creation succeeded but whose record failed), decide whether the next run adopts it (look it up by key) or removes it, and implement that.

## Test it

Write or run tests that:

1. execute the operation twice with the same input and assert the effects happened once (row count, call count, balance);
2. kill or fail the operation after each side effect in turn and run it again, asserting convergence;
3. run two copies concurrently and assert one effect (use a real database constraint or lock, not a mocked one);
4. deliver two messages out of order and assert the newer state wins.

A test that only checks the happy path does not test idempotency.

## Stop signals

- The idempotency key is generated inside the operation: a retry generates a new key and defeats the mechanism.
- The dedupe check and the write are in different transactions or files: concurrent runs pass the check together.
- You are relying on a comment or a convention ("callers must not retry"): retries come from infrastructure that does not read comments.
- A step has no observable completion marker and no recorded intent: name it as residual risk or fix it.

## Shortcuts that fail

- "Check if it exists, then insert": two concurrent runs both see absence and both insert; only a uniqueness constraint or atomic upsert prevents it.
- "Retries are rare, ignore them": queue redelivery, client retries, and job rescheduling make duplicates routine; the first incident will be a double charge or a duplicate email.
- "Use the timestamp as the key": two runs have two timestamps; the key must be stable across runs of the same input.
- "Make it idempotent by deleting and recreating": the delete is itself a side effect, and a crash between delete and create loses the record.

## Report

List each side effect with its mechanism (key source, upsert constraint, absolute write, recorded intent, version ordering), the atomicity boundary that holds the lookup and the write together, partial-failure points and how each converges, residual non-idempotent effects with the reason, and the tests run (duplicate, crash-and-resume, concurrent, out-of-order) with commands and results. If the operation was already idempotent, say so and cite the mechanism and the test that shows it.

## Critical failures

- Idempotency key generated from a timestamp, random value, or anything not stable across retries.
- Dedupe check and effect not atomic, so concurrent runs duplicate.
- An external non-idempotent call made before intent is recorded, with no reconciliation path.
- Tests that do not run the operation at least twice.
- A residual non-idempotent effect left unnamed in the report.
