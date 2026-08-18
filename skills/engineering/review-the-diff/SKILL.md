---
name: review-the-diff
description: Review code changes, branches, pull requests, patches, or working-tree diffs for correctness, security, user intent, maintainability, and test coverage. Use when the user asks for a code review, PR review, diff audit, regression check, or assessment against a specification. Report only actionable findings, ordered by severity, with precise locations and consequences.
---

# Review the change that matters

## Define the review boundary

Resolve the target from the request and repository state. It can be a pull request, supplied patch, working tree, commit range, branch comparison, or selected files. When no comparison is stated, inspect the current changes against their natural base instead of blocking on a question.

Read the repository instructions and the code around each changed area. Identify the intended behavior from the user's request, linked issue or specification, tests, commit messages, and existing contracts. State when no reliable specification is available.

## Review in risk order

Inspect each changed behavior through these lenses:

1. Correctness and contract compatibility
2. Security, privacy, authorization, and trust boundaries
3. Data integrity, concurrency, durability, and failure recovery
4. User-visible behavior, accessibility, and operational impact
5. Tests, observability, migrations, and rollout safety
6. Design, ownership, naming, comments, and maintainability
7. Scope control, dead code, avoidable dependencies, and speculative abstraction

Use repository rules and configured tooling as the primary style authority. Do not report formatting that an existing formatter or linter handles unless it blocks the change.

## Prove each finding

A finding must identify:

- the smallest useful file and line range;
- the behavior or rule that is wrong;
- the concrete input, state, or sequence that triggers it;
- the likely consequence;
- a practical correction when it is not obvious.

Trace callers and downstream effects far enough to verify the issue. Run focused tests or a safe reproducer when that materially increases confidence. Do not infer a bug from an unusual pattern alone.

Classify severity by impact and likelihood:

- `P0`: immediate, widespread, or irreversible harm; blocks release.
- `P1`: serious correctness, security, or data-loss risk; should be fixed before merge.
- `P2`: real defect or maintainability problem with bounded impact; should be fixed.
- `P3`: worthwhile improvement that does not block the change.

Avoid style preferences, speculative future risks, and praise. If no actionable finding survives verification, say so plainly and mention any material test gap or unverified boundary.

## Compare intent and implementation

When a specification exists, check both directions:

- Every required behavior appears in the change.
- The change does not introduce unrequested behavior that raises risk or maintenance cost.
- The implementation matches the requirement under edge cases and failure paths.

Keep intent findings in the same severity-ranked list as code findings. Reviewers need one decision-ready view, not parallel reports that hide priority.

## Return a concise review

List findings first, ordered by severity and then by location. Use a short title, evidence-backed explanation, and precise location for each finding. Follow with open questions or assumptions only when they affect the verdict. End with a brief summary of the review boundary and checks run.

Do not implement fixes unless the user asks. Do not claim the change is safe merely because tests pass.
