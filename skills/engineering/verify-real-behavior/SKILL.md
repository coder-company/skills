---
name: verify-real-behavior
description: Verify changed behavior at the nearest real user or system boundary. Use before claiming that a feature, fix, integration, deployment, or interactive flow works when lower-level tests, mocks, build output, or static inspection could pass without exercising the changed path.
---

# Verify real behavior

## Name the boundary

Identify who or what consumes the changed behavior. Name the observable result at that boundary before choosing a verification command.

Examples include:

- a CLI exit code, stdout, stderr, and file side effect;
- an HTTP response plus the persisted record or emitted event it promises;
- a browser interaction plus visible state after reload;
- a database migration plus reads from the schema version that follows it;
- a background worker plus the queue acknowledgment and durable effect;
- a package export as observed by a real consumer import;
- a terminal workflow through an actual PTY, including resize and interruption.

Do not substitute an implementation detail for the boundary. A function return, mocked call, snapshot, type check, or green build can support verification without proving the user-facing path.

## Prove that the changed path ran

Guard against false green results, applying only the items that the current change could actually fool:

1. Confirm the command includes the changed test or code path. Inspect filters, test discovery, workspace selection, and ignored files.
2. Remove or invalidate stale build artifacts when they can bypass the changed source.
3. Make the check fail for the old behavior or otherwise show that it distinguishes the change.
4. Observe both the immediate response and the promised durable effect when the contract includes both.
5. Exercise the failure state that motivated the change, not only the happy path.

If the repository's normal smoke command can keep passing against stale state, report that gap and fix the command only when the task already covers it. A one-time direct invocation proves the current result but does not close a repeatable false-green path.

Assertions about a mock that the agent authored prove the mock contract. They do not prove the external seam. Prefer a stable in-process dependency, disposable local service, protocol-level fake owned by the repository, or the nearest accessible real integration.

## Use the nearest accessible real seam

The real boundary does not always mean production or a paid third-party call. Use the closest seam that preserves the behavior under test without unsafe access.

When the final boundary is unavailable:

- state exactly which boundary was not exercised and why;
- verify the nearest accessible seam;
- avoid claims that extend beyond that evidence;
- name the remaining check and the environment or authority it requires.

Do not request production credentials merely to satisfy this skill. Do not mutate production unless the user explicitly authorized that operation.

## Match verification to the risk

Use the smallest check that can disprove the completion claim.

- For a deterministic helper whose existing focused test calls it directly, that test is the boundary. Show it failing before the change and passing after, then stop.
- For a rendering or interaction change, inspect the rendered state and exercise the control.
- For persistence, restart or reload before checking the result when an in-memory value could hide a failure.
- For concurrency, repeat the contested path enough times to make the prior failure observable.
- For deployment, verify the running revision and external health path rather than the build artifact alone.

Do not turn routine changes into an exhaustive test campaign. Add depth only where another layer can produce a false green result.

## Report evidence, not confidence

Before saying the work is fixed or complete, report:

- the boundary exercised;
- the exact command or interaction;
- the observed result;
- the failure or stale-state check used to prove the new path ran;
- any boundary not exercised.

If only a proxy passed, name it as a proxy. Do not convert "unit tests pass" into "the feature works" when the integration or user path remains untested.
