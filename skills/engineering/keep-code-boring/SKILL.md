---
name: keep-code-boring
description: Implement, fix, or refactor code so the result is correct, readable, scoped to the request, and free of speculative structure, following repository conventions first. Use when writing or changing code, applying a known fix, choosing between designs or dependencies, or the user asks for the simplest solution, smaller diff, or fewer abstractions. Do not use for diagnosis; use find-the-bug. Do not use for review-only requests; use review-the-diff.
---

# Keep code boring

Understand the code that owns the behavior, choose the least design that fully meets the requirement, implement one concern per change with tests that would fail if the behavior regressed, and verify at the real boundary. Report exactly what was run.

## Route first

- The cause of a failure is unknown: `find-the-bug`.
- The request is to review, not change: `review-the-diff`.
- The change removes generated excess without altering behavior: `remove-code-slop`.
- The change crosses several layers: `build-in-slices` decides the increments; this skill implements each.
- A cheap test boundary exists and the user wants test-first: `watch-the-test-fail`.

## Optimize in this order

1. Correctness
2. Clarity
3. Simplicity
4. Concision
5. Maintainability
6. Consistency

Never trade an earlier goal for a later one. Line count is not a goal.

## Follow the right authority

1. The user's explicit requirements.
2. Safety, security, privacy, accessibility, data integrity, and externally observable behavior.
3. Repository instructions, architecture decisions, tests, and established patterns.
4. The formatter, linter, and language version the repository configures.
5. The language's style conventions (see `references/language-guides.md`, selecting only the task's language).
6. The practices in this skill and `references/engineering-practices.md`.

Do not cite style guides or their sources in comments, commit messages, or status updates.

## Understand before changing

1. Read the task and the code that owns the behavior.
2. Trace callers, data flow, error flow, and tests far enough to find the real change boundary.
3. Establish a failing check when practical.
4. Find existing helpers, types, dependencies, and patterns before adding new ones.
5. State an assumption only when it changes the implementation and cannot be verified.

Fix the cause at the narrowest shared boundary that owns it; a small diff at the symptom is not a small fix. Before changing a shared signature, serialized value, public export, or externally visible contract, identify its consumers (see `prove-the-blast-radius`). If the owning fix expands beyond the request or can break another consumer, choose a contract-preserving fix unless the user authorizes the broader change.

## Choose the least complete design

Evaluate in order and stop at the first option that fully meets the task:

1. Remove work the requirement does not need.
2. Reuse a clear repository pattern or helper.
3. Use the language standard library.
4. Use a native platform or framework capability.
5. Use an already-installed dependency when it is the established solution.
6. Add the smallest clear implementation.
7. Add a dependency only when it materially improves correctness, security, interoperability, or maintenance, and record why.

Do not turn this into research for a routine change.

## Refuse speculative structure

Do not add:

- an interface for one implementation without a concrete seam that needs it;
- a factory for one construction path;
- configuration for a value with no current variation;
- extension points, plugin systems, generic frameworks, fallback paths, or compatibility layers for hypothetical needs;
- a helper that hides a single expression or renames a standard operation;
- clever expressions in place of readable control flow;
- unrelated cleanup inside the requested change.

Add abstraction only when it names a real concept, removes meaningful duplication, enforces an invariant, isolates volatility, or creates a testable boundary. Where the design is not self-evident, explain it in the code or the change description.

Remove dead code, commented-out code, or stale documentation only inside the change boundary and only with evidence it is unused. A repository search does not prove a public export, reflective target, dynamically loaded component, or external API is dead; report those candidates instead of deleting them.

## Implement one concern per change

- Complete every coupled change the task requires; do not leave the repository half-migrated.
- Keep production code, tests, and documentation for one behavior together.
- Separate a substantial refactor from a behavior change (see `refactor-without-regressions`).
- Choose names that carry purpose without a comment.
- Make values, decisions, ownership, and error propagation followable in one read.
- Handle errors at the layer that can add context or recover; never discard an error silently.
- Keep trust-boundary validation, authorization, durability, concurrency safety, accessibility, and required observability.
- Update documentation in the same change when behavior or usage changes.

Comments state rationale, constraints, invariants, surprising behavior, and decisions a maintainer might otherwise undo. Delete comments that restate the code or have drifted from it. Document public APIs with purpose, usage, inputs, outputs, errors, and side effects, simplest usage first.

## Test behavior

- Use the repository's test tools and conventions.
- Add or update tests for changed logic and fixed bugs, at the smallest level that proves the behavior at its real boundary.
- Make each test fail for the bug or missing behavior before relying on it.
- Test externally visible behavior, edge cases, and failure paths that matter; skip trivial declarations and framework behavior.
- Prefer a stable in-process dependency or the real boundary over a mock.
- Never delete, skip, broaden, or weaken a valid test to make the suite pass. Change a test only when the intended contract changed, and say so.

## Finish at the real boundary

Before reporting, confirm:

- every explicit requirement is met;
- the fix addresses the cause, not one named symptom;
- no speculative API or dependency was introduced;
- names and control flow are clear without hidden context;
- errors and important edge cases remain handled;
- tests would fail if the changed behavior regressed;
- documentation matches the implementation;
- the formatter, static checks, relevant tests, and a boundary-level smoke check (see `verify-real-behavior`) were run;
- the diff contains only related changes.

## Stop signals

- You are writing an interface, factory, or options object with one use: delete it.
- The diff includes a change the request did not need: move it out.
- A test had to be weakened to pass: the code or the contract is wrong; stop.
- You are patching where the error appears rather than where the bad value is produced: move the fix.
- You are about to write "should work" for a check you did not run: run it or report it as not run.

## Shortcuts that fail

- "Add a small wrapper to keep it flexible": the wrapper has one caller, hides the operation, and becomes the second surface that diverges.
- "Fix it at the call site, it's a one-liner": the sibling call sites keep the bug; the shared function was wrong.
- "Clean up these other things while I'm here": the reviewer cannot separate the requested change from the drive-by, and neither can a revert.
- "Skip the boundary check, the unit tests pass": unit tests pass with the wiring wrong; the user's boundary is where the change is observed.
- "Delete it, grep found nothing": grep does not see dynamic loading, reflection, configuration, or external callers.

## Report

State what changed and where; the design option chosen from the ladder and why earlier options did not meet the task (one line); the checks run with exact commands and results; checks you could not run and why; and any deliberately deferred design that matters to the user. Never imply an unrun check passed.

## Critical failures

- Speculative structure (interface, factory, config, extension point) shipped for a hypothetical need.
- Symptom patched at a consumer while the owning boundary stays wrong.
- A valid test weakened, skipped, or deleted to reach green.
- A check reported as run or passing that was not run.
- Unrelated changes bundled into the requested change.
