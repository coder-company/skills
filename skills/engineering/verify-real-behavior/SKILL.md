---
name: verify-real-behavior
description: Verify a changed behavior at the nearest real user or system boundary, proving the changed path actually ran, before claiming it works. Use when about to say a feature, fix, integration, deployment, or flow works and only unit tests, mocks, build output, or reading the code have passed. Do not use to define what done means; use define-done. Do not use for visual parity; use match-the-reference.
---

# Verify real behavior

Name the boundary where the user or system observes the change, run the check there, prove that the check exercised the changed path, and report the observation. A green proxy is a claim about the proxy.

## Route first

- No completion condition exists yet: `define-done`.
- The check is visual parity with a reference: `match-the-reference`.
- The change is a release action: `check-release-safety` after this skill passes.

## Name the boundary

Identify who or what consumes the changed behavior and the observable result there:

- CLI: exit code, stdout, stderr, and file side effects.
- HTTP: response plus the persisted record or emitted event it promises.
- Browser: the interaction plus visible state after reload.
- Migration: the applied schema plus reads from the version that follows.
- Worker: the acknowledgment plus the durable effect.
- Package: the export as observed by a real consumer import from the built artifact.
- Terminal UI: an actual PTY, including resize and interruption.

A function return, a mocked call, a snapshot, a type check, or a green build supports verification without proving the boundary.

## Prove the changed path ran

Apply the items the current change could fool:

1. Confirm the command includes the changed test or code path: inspect filters, test discovery, workspace selection, and ignore rules.
2. Invalidate stale build artifacts that could bypass the changed source.
3. Show the check distinguishes the change: make it fail for the old behavior, or run it against the old revision.
4. Observe both the immediate response and the promised durable effect when the contract includes both.
5. Exercise the failure state that motivated the change, not only the happy path.

If the repository's normal smoke command can keep passing against stale state, report that gap; fix the command only when the task covers it.

An assertion about a mock you authored proves the mock. Prefer a stable in-process dependency, a disposable local service, a protocol-level fake the repository owns, or the nearest accessible real integration.

## Use the nearest accessible real seam

The boundary is not always production or a paid third-party call; it is the closest seam that preserves the behavior without unsafe access. When the final boundary is unavailable, verify the nearest accessible seam, state which boundary was not exercised and why, and name the remaining check with the environment or authority it needs. Do not request production credentials to satisfy this skill, and never mutate production without explicit authorization.

## Match depth to risk

Use the smallest check that can disprove the completion claim:

- Deterministic helper with an existing focused test: that test is the boundary. Show it failing before and passing after, then stop.
- Rendering or interaction: inspect the rendered state and exercise the control.
- Persistence: restart or reload before checking, so an in-memory value cannot hide a failure.
- Concurrency: repeat the contested path enough times to make the prior failure observable.
- Deployment: verify the running revision and its health path, not the build artifact.

Do not turn a routine change into a test campaign; add depth only where another layer can produce a false green.

## Stop signals

- You are about to write "works" or "fixed" with only unit tests or a build as evidence: run the boundary check.
- The check passed on the first run and you did not see it fail for the old behavior: you have not shown it tests the change.
- The test command has a filter, workspace, or ignore rule you have not read: read it.
- The evidence is an assertion about a mock you wrote: find a real seam.
- Your reply is a checklist with blanks to fill: replace it with the runnable commands or test code.

## Shortcuts that fail

- "Unit tests pass, so the feature works": the wiring between units is where changes fail, and no unit test crosses it.
- "The build is green": the build compiles the old artifact when the cache is stale or the changed file is excluded.
- "The response was 200": the contract promised a persisted record or an event; the response alone does not show it.
- "It's a small change, skip the smoke test": small changes to shared paths are the ones whose false greens reach users.

## Report

State the boundary exercised, the exact command or interaction, the observed result, the check used to prove the changed path ran (old-behavior failure or stale-state invalidation), and any boundary not exercised with the reason and remaining check. When you cannot run the check yourself, give the exact commands or test code the user runs, not a template. If only a proxy passed, write "Verified at proxy only: <proxy>. Not verified at <boundary>."

## Critical failures

- "Works" or "fixed" claimed with only a proxy (unit test, mock, build, static read) as evidence, without naming it as a proxy.
- A check reported that did not include the changed path.
- Production mutated without explicit authorization.
- The failure state that motivated the change left unexercised.
- Stale artifacts or caches not ruled out when they could bypass the change.
