---
name: watch-the-test-fail
description: Implement a feature or bug fix through a focused failing test before production code. Use when the user requests TDD, test-first, or red-green-refactor work and a practical executable test boundary exists. Do not force TDD when the test path requires disproportionate harness work.
---

# Watch the test fail

## Choose a useful boundary

Identify the smallest stable behavior that would prove the requirement. Prefer an existing test level and public seam. Avoid a unit test coupled to private control flow when a focused component or integration test is practical.

If no affordable executable boundary exists, explain why and use the nearest real verification. Do not build a large harness only to claim TDD.

## Red

Write one focused test for the missing behavior. Run it before editing production code. Confirm it fails because the behavior is absent, not because the fixture, import, or environment is broken. A passing test is not red.

## Green

Make the smallest production change that passes the test. Run the focused test after each meaningful change. Do not weaken assertions, over-mock the owning behavior, or replace the test with a snapshot that cannot explain a failure.

## Refactor

Improve names or structure only after green. Keep the behavior test passing. Run nearby tests and the repository checks proportional to the change.

Report the behavior the new test encodes, the command you ran, its red failure reason and exit result, its green result, and any broader checks. Never reconstruct or imply a red run that did not happen.
