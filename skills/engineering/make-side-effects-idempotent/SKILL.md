---
name: make-side-effects-idempotent
description: Design or repair an operation so retries and partial prior attempts converge without duplicating effects or corrupting state. Use for jobs, webhooks, payments, provisioning, migrations, or commands that can be delivered or resumed more than once. Do not use when an operation is provably single-shot and cannot be retried.
---

# Make side effects idempotent

## Define the operation identity

Choose the stable key that means two attempts are the same logical operation. State which effects must happen once, which may repeat, and what final state every successful retry must converge on.

Do not confuse idempotent HTTP verbs with idempotent business effects. A repeated request can still duplicate email, payment, quota, or downstream work.

## Find interruption boundaries

Enumerate durable writes and external effects in order. Consider interruption before and after each one, response loss after success, concurrent duplicate attempts, expired leases, and replay after deploy.

Use a durable uniqueness constraint, idempotency record, compare-and-set transition, transactional outbox, or naturally convergent write at the boundary that owns the invariant. In-memory flags and check-then-act without atomicity do not establish safety.

## Prove convergence

In a test or non-production environment, run the same operation twice, interrupt it at a meaningful boundary, and race duplicates when practical. Verify both final state and effect counts. State retention, key scope, conflict response, and recovery behavior.

Do not silently discard a retry whose prior outcome is unknown.
