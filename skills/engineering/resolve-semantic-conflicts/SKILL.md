---
name: resolve-semantic-conflicts
description: Resolve merge, rebase, cherry-pick, or revert conflicts by reconstructing the behavior each side intended. Use for unmerged behavioral files or when both branches changed the same configuration, state machine, contract, or policy even if Git merged the text automatically.
---

# Resolve semantic conflicts

## Find textual and semantic conflicts

Inspect the operation state, merge base, commits being combined, and complete diff from each side. Do not limit the search to conflict markers.

A semantic conflict exists when both sides change behavior that interacts, including:

- different fields in the same policy or configuration object;
- adjacent transitions in the same state machine;
- a caller contract on one side and its implementation on the other;
- schema, serializer, and consumer changes split across branches;
- deletion on one side and extension on the other;
- renamed symbols whose old name is edited by the other side.

Generated files, lockfiles, snapshots, and import blocks usually need mechanical regeneration after their owning sources are resolved. Do not spend behavioral judgment on derived noise.

## Reconstruct each side from the base

For every behavioral conflict, state:

1. What the base did.
2. What side A intended to change and the evidence for that intent.
3. What side B intended to change and the evidence for that intent.
4. What behavior a combined result would create.
5. Whether that combined behavior is compatible with both intentions.

Use commit messages, tests, issue or specification references, changed callers, and repository history as evidence. Do not equate `ours` with correct or `theirs` with incoming. Those labels change meaning across merge and rebase operations.

## Choose an intentional result

Use one of these outcomes:

- preserve side A because side B is obsolete or superseded;
- preserve side B because side A is obsolete or superseded;
- combine both because their invariants remain compatible;
- redesign the combined behavior because neither textual version satisfies both intentions;
- stop for an authority decision because the sides encode incompatible product, policy, or data choices.

Do not take both merely because the lines compose. Do not choose the version that compiles while silently dropping an invariant.

## Verify the merged behavior

When you run the operation yourself, pause before it records a commit (for example, with `--no-commit`) so semantic checks run first. For a merge, the resolution belongs in the merge commit that retains both parents. For a rebase, cherry-pick, or revert, it belongs in the commit being created. Do not report the operation as complete when the repair is only a follow-up commit above an already-broken result, unless repository policy requires that history shape.

Identify an existing check for each preserved intention. Write a new one only where loss of that intention would otherwise be silent. Run checks against the resolved result, not against either parent in isolation.

Also inspect:

- conflict markers and unmerged paths;
- generated outputs after regeneration;
- callers affected by renamed or deleted contracts;
- tests from both branches that may not run in the same default target;
- the final diff relative to the merge base for accidental loss.

If Git auto-merged interacting behavioral edits, add the missing combined-behavior check. A marker-free merge can still encode a policy no author chose.

## Preserve history and scope

Do not rewrite published history, force-push, drop commits, or resolve unrelated working-tree changes unless the user authorized those actions. Preserve user-owned modifications around the operation. Treat unrelated staged, stashed, or unpushed work as a separate Git preservation task rather than folding it into conflict resolution.

Report each behavioral conflict as: side A intent, side B intent, chosen result, and proof. Keep mechanical conflict details brief.
