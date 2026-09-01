---
name: refactor-without-regressions
description: Change code structure while keeping every observable behavior identical, by freezing the behavior boundary, changing one structural axis at a time, and comparing outputs before and after. Use when extracting, moving, renaming internals, deduplicating, or the user says refactor or no behavior change. Do not use when consumers must move to a new contract; use replace-an-api. Do not use for intentional behavior changes.
---

# Refactor without regressions

Write down what must not change, protect it with checks that would fail if it changed, make one kind of structural change at a time, and compare the observable outputs on both sides. Compilation and green unit tests are necessary, not sufficient.

## Route first

- Any consumer must change its call: `replace-an-api`.
- The refactor is preparation for a behavior change: do the refactor as its own change, verified, then the behavior change (see `make-the-pr-reviewable` for the commit order).
- A defect is discovered during the refactor: record it, finish the behavior-preserving change, then fix the defect separately with `find-the-bug`.

## Freeze the behavior boundary

List what must remain identical, with the evidence that establishes it:

- public functions, exports, endpoints, commands, and their signatures;
- serialized formats, persisted values, file outputs, wire messages;
- error types, messages that consumers match on, exit codes;
- side effects and their order;
- performance characteristics that callers depend on (latency, memory, blocking behavior);
- supported inputs, including ones the tests do not cover.

Sources: tests, callers found from the repository root, documentation, production artifacts (schemas, recorded requests), and history (`git log -S` on the behavior). A search of this repository does not define an external contract; treat public surfaces as frozen unless the user says otherwise.

Where important behavior is unprotected by a test, add a characterization test that records the current output before any change. Do not "fix" a surprising current behavior in the characterization test; record it and report it as a possible defect.

## Change one structural axis at a time

Separate these into distinct steps, each leaving the repository building and tests passing:

1. **Move** (file or module relocation) with no content change.
2. **Rename** (internal identifiers) with no logic change.
3. **Extract or inline** (function, class, module) with the call sites updated mechanically.
4. **Representation change** (data structure, algorithm) with the same inputs and outputs.
5. **Dedupe** (replace copies with one implementation) after confirming the copies were identical in behavior, not only in text.

Commit after each step with the check that proves it. Do not add a compatibility wrapper unless a current consumer needs a staged transition; a wrapper for the refactor's own convenience is dual behavior.

Use tooling for mechanical steps (IDE rename, codemod, formatter) and check the script in when it exists; hand edits across many sites are where regressions hide.

## Compare before and after

Run the same observations on the original and the refactored code:

- the full relevant test suites, not only the tests near the change;
- generated outputs (schemas, clients, snapshots, build artifacts) diffed byte for byte where they should be identical;
- a recorded set of real inputs replayed through both versions, comparing outputs;
- the public export list, route table, or CLI help output;
- a smoke run at the user boundary (see `verify-real-behavior`).

Any difference is a regression until explained. If the difference is an intentional improvement, it is a behavior change: back it out of the refactor and propose it separately.

When history was rewritten to reorder steps, confirm the final tree matches the intended result (`git rev-parse HEAD^{tree}` against the pre-rewrite tree, or a diff that shows only the intended changes).

## Stop signals

- You are changing a condition, default, or error message "while you're in there": that is a behavior change. Revert it from this change.
- A test had to be modified to pass: either the test pinned implementation detail (delete it and say so) or behavior changed (stop and investigate).
- Two structural axes are in one commit: split them.
- The characterization test's recorded output looks wrong: report it; do not correct it in the refactor.
- The comparison shows a difference you cannot explain: the refactor is not behavior-preserving yet.

## Shortcuts that fail

- "It compiles and the tests pass": tests cover the cases someone thought of; the refactor changes the cases nobody did. Compare outputs on real inputs.
- "I'll fix that small bug while I'm here": the fix hides in a large structural diff, cannot be reviewed on its own, and cannot be reverted independently.
- "Rename and move in one commit": a reviewer cannot tell a moved line from a changed one; a regression in the move is invisible.
- "The two copies are the same, dedupe them": copies drift; compare their behavior on the inputs each receives before merging them.
- "Keep the old function as a wrapper": the wrapper is a second surface that will be called and diverge.

## Report

State the frozen boundary with its evidence; characterization tests added; the structural steps in order with the check run after each; the before-and-after comparison (suites, artifacts diffed, inputs replayed, boundary smoke) with commands and results; tests deleted because they pinned implementation detail; and defects observed but deliberately not fixed, each with a pointer. If any behavior differs, list it on the first line as an unauthorized change.

## Critical failures

- An observable behavior change shipped inside a refactor without the user's authorization.
- A characterization test edited to make a changed output pass.
- Compilation or unit tests alone offered as proof of behavior preservation.
- Multiple structural axes combined in a single step with no per-step check.
- A compatibility wrapper left in place with no current consumer requiring it.
