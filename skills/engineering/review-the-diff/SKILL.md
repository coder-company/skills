---
name: review-the-diff
description: Review code changes, branches, pull requests, patches, or working-tree diffs for correctness, security, user intent, maintainability, and test coverage. Use when the user asks for a code review, PR review, diff audit, regression check, or assessment against a specification. Report only actionable findings, ordered by severity, with precise locations and consequences.
---

# Review the change that matters

## Define the review boundary

Resolve the target from the request and repository state. It can be a pull request, supplied patch, working tree, commit range, branch comparison, or selected files. When no comparison is stated, use this order:

1. For a pull request, compare its head with the merge base of its target branch.
2. For a feature branch, compare `HEAD` with the merge base of the repository's default branch.
3. For local work, inspect staged and unstaged changes against `HEAD`, plus relevant untracked files.

State the resolved base, included local state, and comparison commands. Do not silently review only the working tree when the branch contains committed changes.

Keep the reviewed repository read-only. Do not stash, checkout, reset, clean, stage, or otherwise alter its branch, index, files, or untracked state. Inspect historical content with `git show` and diffs. If an executable check requires another revision, use a disposable copy or temporary worktree and leave the reviewed tree unchanged.

Do not invent command output, repository state, file contents, or checks. If the repository or diff is unavailable, state that no review was executed and request the missing artifact or give the exact commands needed to collect it. Do not issue a merge verdict from a described scenario alone.

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

Including staged, unstaged, or untracked state in the review boundary does not make each changed item a finding. Do not report harmless working notes, comments, test names, magic numbers, or optional cleanup unless they violate a repository rule or produce a concrete present-day consequence. A `P3` still needs an actionable defect or demonstrated maintenance cost; it is not a bucket for preferences.

Mark each finding as introduced by the change, newly reachable because of the change, or pre-existing. Only the first two categories belong in the merge verdict. Report a serious unrelated pre-existing issue separately when the user needs to know, without presenting it as a regression in the diff.

For every `P0` or `P1`, show the evidence that establishes the triggering path: an executable reproducer, a failing test, a trace, or a complete static call path. If the outcome remains hypothetical, label it unverified and state what evidence is missing. Do not write an inferred consequence as an observed fact.

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

Before returning, remove any finding whose only consequence is preference, tidiness, or marginal clarity. In the boundary summary, list only commands actually executed; do not present shorthand or synthetic diff notation as a command.

Do not implement fixes unless the user asks. Do not claim the change is safe merely because tests pass.
