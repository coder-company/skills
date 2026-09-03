---
name: watch-the-test-fail
description: Implement a feature or fix by writing one focused test, observing it fail for the intended reason, then making the smallest production change that passes it. Use when the user says TDD, test first, red-green, or a bug has a cheap executable test target. Do not use when no affordable test boundary exists; use verify-real-behavior. Do not use to backfill tests for finished code.
---

# Watch the test fail

Write the test, run it, read the failure, and only then write production code. The observed red run is the evidence that the test can detect the behavior; a test that was never seen failing proves nothing about the change.

## Route first

- No affordable executable boundary exists (the behavior is only observable through an expensive integration or manual step): say so in one sentence, use `verify-real-behavior`, and do not build a harness to claim TDD.
- The bug's cause is unknown: `find-the-bug` first; the failing test comes from the reproduced cause.
- The behavior spans several layers: `build-in-slices` decides the slice; this skill drives each slice.

## Choose the seam

Pick the smallest stable boundary that would prove the requirement: a public function, a module interface, an HTTP handler, a CLI command, a rendered component. Prefer an existing test level and fixture style over a new one.

Avoid a unit test coupled to private control flow when a focused test at the public seam is practical. Tests that lock in implementation detail fail on every refactor and pass on every bug that keeps the shape.

State the seam and why before writing the test. If the seam requires more than a few lines of new fixture, stop and reconsider.

## Red

Write one test for the missing behavior. Before writing it, name the production change that would make it fail. If you cannot, the test does not test the requirement; redesign it around an observable behavior.

Expected values come from an independent source of truth: the specification, a hand-computed result, a recorded real output. Do not compute the expected value with the same logic the code will use.

Run the test before touching production code. Read the failure and confirm three things:

1. It fails, rather than erroring out of the harness (import error, missing fixture, wrong path).
2. It fails because the behavior is absent or wrong, not because of a typo in the test.
3. The failure message is the one a future maintainer would recognize as this requirement.

If the test passes, you are testing existing behavior. Fix the test; do not proceed. If it errors, fix the harness problem and rerun until it fails for the intended reason.

Record the command, the exit status, and the failure text.

## Green

Make the smallest production change that passes the test. Do not generalize, add configuration, or handle cases the test does not name. Run the focused test after each meaningful edit.

Forbidden ways to reach green:

- weakening or deleting the assertion;
- mocking the behavior under test;
- special-casing the test's input;
- replacing the assertion with a snapshot that cannot explain a failure;
- marking the test skipped or expected-to-fail.

When green, run the nearest related tests to catch collateral breakage.

## Refactor

Only after green: rename, extract, or simplify while the test stays green. Do not add behavior here; a new behavior starts a new red.

## Add the next test

If the requirement has more cases (an edge, a failure path, an invalid input), repeat red, green, refactor for each. Stop when the requirement's named cases are covered. Do not add tests for framework behavior or trivial declarations.

## Stop signals

- You are writing production code and no test is red: stop, write the test, run it.
- The test passed on its first run: you are not testing the change. Fix the test.
- You are computing the expected value with the code's own logic: replace it with an independent value.
- The fixture is growing past the size of the change: the seam is wrong or TDD does not fit here.
- You are about to edit the assertion to make it pass: the code is wrong or the requirement was misread. Decide which.

## Shortcuts that fail

- "I'll write the tests after; same result": a test written against working code passes immediately and never demonstrates it can fail, so it does not protect the behavior.
- "I saw it fail in my head": a red run that did not happen is not evidence; the harness, path, and fixture are where tests silently misfire.
- "Snapshot it, that's a test": a snapshot fails on any change and explains none; it cannot say which behavior broke.
- "One big test covers everything": a single failing assertion in a large test hides which requirement is unmet.
- "Mock the dependency to keep it unit-sized": mocking the behavior you are implementing tests the mock.

## Report

State the seam and why; the test name and the behavior it encodes; the red run (command, exit status, failure text); the green run (command, result); the refactor made, if any; broader checks run with results. Never reconstruct or imply a red run that did not happen. If TDD was not used, say why and what verification replaced it.

## Critical failures

- Production code written before a test was observed failing.
- A red run reported that was not actually executed, or a test that passed on first run treated as red.
- Reaching green by weakening, skipping, mocking the behavior under test, or special-casing.
- Expected values derived from the implementation's own logic.
- A harness built at a cost exceeding the change in order to claim TDD.
