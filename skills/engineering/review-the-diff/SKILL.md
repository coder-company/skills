---
name: review-the-diff
description: Review a pull request, branch, patch, or working tree for correctness, security, data integrity, intent match, tests, and maintainability, reporting only verified findings with location, trigger, consequence, and severity. Use when the user says review this, PR review, audit the diff, or is this ready to merge. Do not use to shape commits and description; use make-the-pr-reviewable. Do not use on a design with no code; use stress-test-the-design.
---

# Review the diff

Resolve the exact change under review, read it against its intent and its surrounding code, and report the findings that would change a merge decision, each proven with a trigger and a consequence, ordered by severity. The reviewed repository stays untouched.

## Route first

- No diff or repository is available: state that no review was executed and give the commands to collect it. Do not review a described scenario.
- The change is a design or plan, not code: `stress-test-the-design`.
- A shared contract changed and its safety hinges on facts outside the diff: run `prove-the-blast-radius` for that contract inside this review.
- A review comment from someone else needs checking: `validate-review-feedback`.

## Define the review boundary

Resolve the target from the request and repository state. When no comparison is stated:

1. Pull request: its head against the merge base with its target branch.
2. Feature branch: `HEAD` against the merge base with the default branch.
3. Local work: staged and unstaged changes against `HEAD`, plus relevant untracked files.

State the resolved base, the local state included, and the commands used. Do not review only the working tree when the branch has committed changes.

Keep the repository read-only: no stash, checkout, reset, clean, stage, or file edits. Inspect other revisions with `git show`. If an executable check needs another revision, use a disposable copy or a temporary worktree. Do not invent command output, file contents, or check results.

Read the repository instructions and the code around each changed area. Establish intended behavior from the request, linked issue or specification, tests, commit messages, and existing contracts. Say when no reliable specification exists.

## Review in risk order

Read every changed behavior through these lenses, in this order, and stop reporting on a later lens when an earlier one blocks the change:

1. Correctness and contract compatibility.
2. Security, privacy, authorization, injection, secrets, and trust boundaries.
3. Data integrity, concurrency, durability, idempotency, and failure recovery.
4. User-visible behavior, accessibility, and operational impact (logs, metrics, alerts).
5. Tests, migrations, rollout and rollback safety.
6. Design, ownership, naming, comments, and maintainability.
7. Scope control, dead code, avoidable dependencies, speculative abstraction.

Repository rules and configured tooling are the style authority. Do not report formatting a configured formatter or linter handles unless it blocks the change.

For a large diff, review the files where decisions live (logic, interfaces, schemas, configuration) before the mechanical fallout (renames, generated output, formatting), and say which files you read in full.

## Prove each finding

A finding names:

- the smallest useful file and line range;
- the behavior or rule that is wrong;
- the concrete input, state, or sequence that triggers it;
- the consequence;
- a practical correction when it is not evident.

Trace callers and downstream effects far enough to verify. Run focused tests or a safe reproducer when that materially raises confidence. Do not infer a bug from an unusual pattern alone.

Mark each finding as **introduced** by the change, **newly reachable** because of it, or **pre-existing**. Only the first two enter the merge verdict. Report a serious pre-existing issue separately when the user needs to know, without presenting it as a regression.

For every `P0` or `P1`, show the evidence that establishes the triggering path: an executable reproducer, a failing test, a trace, or a complete static call path. If the consequence remains hypothetical, label it unverified and say what evidence is missing.

Severity by impact and likelihood:

- `P0`: immediate, widespread, or irreversible harm; blocks release.
- `P1`: serious correctness, security, or data-loss risk; fix before merge.
- `P2`: real defect or maintenance cost with bounded impact; should be fixed.
- `P3`: worthwhile improvement that does not block.

A `P3` still needs an actionable defect or demonstrated maintenance cost. Preferences, tidiness, speculative future risk, and praise are not findings. Including working-tree state in the boundary does not make each changed item a finding.

## Compare intent and implementation

When a specification exists, check both directions: every required behavior is present, and no unrequested behavior was added that raises risk or maintenance cost. Check edge cases and failure paths named or implied by the requirement. Keep intent findings in the same ranked list as code findings.

## Make the deletion pass

After correctness and safety, make one pass inside the change boundary for high-confidence deletion, reuse of an existing helper, unnecessary dependencies, and abstractions with no second use. Include these when they materially reduce maintenance cost. Deletion is high-confidence only after checking references from the repository root, public contracts, dynamic use, and configured entry points.

## Return a concise review

Findings first, ordered by severity then location, each with a short title, evidence, and precise location. Then open questions or assumptions only when they affect the verdict. Then a verdict: **ready**, **ready after P2 fixes**, or **not ready**, tied to the findings. End with the boundary summary and the commands actually executed.

Remove any finding whose only consequence is preference or marginal clarity before returning. Do not implement fixes unless asked. Do not call the change safe because tests pass.

## Stop signals

- You are about to write a finding without a triggering input or sequence: find it or drop the finding.
- A `P1` rests on "this could happen": produce the path or downgrade with "unverified".
- You are reviewing the working tree only while `git log` shows commits on the branch: fix the boundary.
- You feel the urge to run `git stash` or `checkout` in the reviewed repository: use `git show` or a temporary worktree.
- The findings list has more than three `P3` items and no `P0` to `P2`: re-check whether they are preferences.

## Shortcuts that fail

- "Tests pass, looks good": tests cover the contracts someone thought of; the review exists for the ones nobody did.
- "This pattern is unusual, flag it": unusual is not wrong; a finding needs a trigger and a consequence.
- "Report everything so nothing is missed": an unranked list of forty items transfers the judgment to the reader and hides the two that block the merge.
- "Skim the big files, they're mechanical": the decision hides in the large file; read the decision files in full and say which they were.
- "Review from the description": the description states intent; the diff states behavior. Review the diff.

## Report

Deliver: the ranked findings with severity, location, trigger, consequence, correction, and introduced/newly reachable/pre-existing marker; open questions affecting the verdict; the verdict; the boundary (base, head, local state included) and files read in full; the commands executed. If no finding survives verification, write "No actionable findings" and name any material test gap or unverified boundary.

## Critical failures

- A finding without location, trigger, or consequence.
- A `P0` or `P1` without evidence of the triggering path and not labeled unverified.
- The reviewed repository modified during the review.
- A verdict issued without the diff or from a described scenario.
- The review boundary silently narrowed to the working tree or to a subset of files without saying so.
