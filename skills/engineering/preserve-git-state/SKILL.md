---
name: preserve-git-state
description: Keep user-owned and unrelated Git state intact while editing, committing, rebasing, or cleaning, by inventorying the checkout first, touching only task-owned paths, and staging by explicit path or hunk. Use when the checkout already has staged, unstaged, untracked, stashed, or unpushed work not clearly owned by the current task, or before any git add, commit, stash, or restore in a dirty tree. Do not use for target and recovery judgment on a destructive command; use confirm-destructive-actions.
---

# Preserve Git state

Inventory the checkout before the first Git mutation, record what the task creates or changes, operate only on that set with explicit paths, and compare the final state with the inventory before reporting.

## Route first

- A destructive command (`reset --hard`, `clean`, `checkout --`, `restore`, stash drop, branch delete, history rewrite, force-push) is needed: `confirm-destructive-actions` for its target and recovery.
- The task is shaping commits for review: `make-the-pr-reviewable`, which applies this skill's staging rules.
- The tree has unmerged paths: `resolve-semantic-conflicts`.

## Inventory before changing

Record, before any mutation:

- current branch and `HEAD`; upstream and ahead or behind counts;
- staged, unstaged, and untracked paths (`git status --porcelain=v2 --branch`);
- stashes (`git stash list`);
- unpushed commits and any active merge, rebase, cherry-pick, or revert state;
- submodules or nested repositories the task touches.

A change present when the task began belongs to the user or another workflow unless evidence says otherwise. Do not infer ownership from the diff content. Keep a task-owned set (paths and Git state the task creates or changes); it controls staging and cleanup.

## Work around unrelated state

- Edit only requested paths.
- Stage and commit with explicit path lists; inspect `git diff --cached` and `git diff` separately.
- Use an isolated worktree or branch when the operation needs a clean checkout.
- Leave pre-existing instrumentation, untracked notes, stashes, and local commits in place.
- Rebase or merge only after deciding how local and upstream work are preserved.

Do not use `git add -A`, `git add .`, `git commit -a`, or broad restore or clean commands when they could capture or discard unrelated state. Do not stash user work to make the tree look clean; a stash is a state change that gets lost.

When a path has mixed ownership, stage by hunk (`git add -p` is interactive; use `git apply --cached` with a filtered patch instead) and stop before overwriting a conflicting user hunk.

## Recognize disposable output

Reproducible task-owned output (ignored build output, an agent-created temporary worktree, current-task scratch files) may be removed after confirming ownership and the exact target. Untracked does not mean disposable.

## Commit intentionally

1. List the exact intended paths.
2. Stage those paths or hunks only.
3. Inspect the staged diff and confirm every change belongs to the task.
4. Leave unrelated staged changes staged and outside the task commit.

When Git cannot create the intended commit without including unrelated staged state, build the commit from a temporary index (`GIT_INDEX_FILE`) or a separate worktree. Do not unstage and recommit someone else's work.

## Verify preservation

Compare the final state with the inventory. Every pre-existing staged, unstaged, untracked, stashed, and unpushed item must still be present unless the user explicitly authorized moving or transforming it.

## Stop signals

- You are about to type `git add .` or `-A` in a tree with pre-existing changes: list the paths instead.
- A stash would make the next step easier: the next step is not worth losing user work; use a worktree.
- A file in your diff has hunks you did not write: stage by hunk.
- "Get to a clean state" appears in the request: that authorizes nothing destructive; ask what to do with the existing work.

## Shortcuts that fail

- "Stash it, do the work, pop it": the pop conflicts or is forgotten, and the user's work is buried in a stash they do not know about.
- "Commit everything, they can sort it out": mixing user hunks into a task commit makes both unrevertable on their own.
- "It's untracked, so nobody wants it": untracked is where notes, local configs, and half-written work live.
- "Reset to make the tests run clean": the reset discards the user's uncommitted change that the tests were about to exercise.

## Report

List task-owned files changed and committed; pre-existing staged, unstaged, untracked, stashed, and unpushed state confirmed intact (by comparison with the inventory); any state moved or transformed with the user's explicit authority; and the final branch, `HEAD`, and upstream relationship when history changed. Do not call the tree clean when preserved user work remains; say "User work preserved: <paths>".

## Critical failures

- A pre-existing change staged, committed, stashed, restored, or deleted without explicit authority.
- `git add -A`, `git add .`, or `git commit -a` used in a tree with pre-existing changes.
- User work stashed to simplify the task.
- Final state not compared with the initial inventory.
- Tree reported clean while user work remains.
