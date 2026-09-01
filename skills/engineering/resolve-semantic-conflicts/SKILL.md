---
name: resolve-semantic-conflicts
description: Resolve merge, rebase, cherry-pick, or revert conflicts by reconstructing what each side intended from the merge base and choosing a result that satisfies both or stopping for a decision. Use when the tree has unmerged paths, when the user says resolve the conflicts or fix the merge, or when both branches changed the same configuration, state machine, contract, or policy even though Git merged the text cleanly. Do not use for unrelated dirty-tree work; use preserve-git-state.
---

# Resolve semantic conflicts

Find every place both sides changed interacting behavior, not only the marker blocks; reconstruct what the base did and what each side intended; choose one of five intentional outcomes; and verify the merged behavior before the operation records a commit.

## Route first

- Unrelated staged, stashed, or unpushed work sits in the tree: `preserve-git-state` before touching the operation.
- A resolution requires force-pushing or rewriting shared history: `confirm-destructive-actions`.
- The two sides encode incompatible product or policy choices: stop and surface the decision; do not choose.

## Find textual and semantic conflicts

Inspect the operation state (`git status`, the `.git/MERGE_HEAD` or rebase directory), the merge base (`git merge-base`), the commits being combined on each side, and each side's complete diff against the base.

Semantic conflicts exist without markers when both sides change behavior that interacts: different fields of one policy or configuration object; adjacent transitions in one state machine; a caller contract on one side and its implementation on the other; schema, serializer, and consumer changes split across branches; deletion on one side and extension on the other; a rename on one side and an edit to the old name on the other.

Generated files, lockfiles, snapshots, and import blocks are regenerated after their owning sources are resolved (see `fix-generated-files`); do not spend judgment on them.

## Reconstruct each side from the base

For every behavioral conflict, write:

1. What the base did.
2. What side A intended, with evidence (commit message, test, issue, changed callers).
3. What side B intended, with evidence.
4. What behavior the combined text would produce.
5. Whether that combination satisfies both intentions.

`ours` and `theirs` swap meaning between merge and rebase. Name sides by branch or commit, never by those labels.

## Choose an intentional result

Exactly one of:

- keep side A because side B is obsolete or superseded;
- keep side B because side A is obsolete or superseded;
- combine both because their invariants remain compatible;
- redesign the combined behavior because neither text satisfies both intentions;
- stop for an authority decision because the sides encode incompatible choices.

Do not take both because the lines compose. Do not choose the version that compiles while dropping an invariant.

## Verify before recording

When you run the operation, pause before it commits (`git merge --no-commit`, or resolve during the rebase step) so checks run on the resolved tree. For a merge, the resolution belongs in the merge commit with both parents; for a rebase, cherry-pick, or revert, in the commit being created. A follow-up fix above a broken merge is not a resolution unless repository policy requires that shape.

Run, against the resolved tree:

- an existing check for each preserved intention; write a new one only where loss would otherwise be silent;
- regeneration of derived files, then their consumer checks;
- tests from both branches, including ones not in the default target;
- callers of renamed or deleted contracts;
- `git diff <merge-base>` for accidental loss, and `git diff --check` for leftover markers.

If Git auto-merged interacting edits, add the combined-behavior check; a marker-free merge can encode a policy no author chose.

## Stop signals

- You are resolving by choosing `ours` or `theirs` without stating each side's intent: reconstruct first.
- The combined text compiles and you have not checked that both invariants hold: check.
- Both sides changed the same config object and Git reported no conflict: inspect it as a semantic conflict.
- The resolution is a commit above the merge rather than in it: redo it inside the operation.

## Shortcuts that fail

- "Take theirs, it's the newer branch": the older side may carry the fix the newer side never saw; newer is not correct.
- "No markers, merge is done": the two policy fields Git merged cleanly now describe a state neither author wanted.
- "Fix it in a follow-up commit": the merge commit itself is broken, and any bisect or revert lands on it.
- "Regenerate the lockfile and move on": the lockfile conflict came from source manifests that still disagree.

## Report

For each behavioral conflict: side A intent, side B intent, chosen outcome, and the proof (check run and result). Mechanical conflicts in one line each. Then the checks run on the resolved tree, the merge-base diff review result, and any decision surfaced for the user. If the operation was completed, state the resulting commit and that no markers remain.

## Critical failures

- A resolution chosen by `ours`/`theirs` label without reconstructing intent.
- A semantic conflict in an auto-merged file left unexamined.
- Checks run against a parent instead of the resolved tree.
- Resolution recorded as a follow-up commit above a broken merge without policy requiring it.
- Conflict markers or unmerged paths remaining at completion.
