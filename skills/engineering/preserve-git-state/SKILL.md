---
name: preserve-git-state
description: Preserve user-owned and unrelated Git state while changing, committing, rebasing, or cleaning a repository. Use when the checkout contains pre-existing staged, unstaged, untracked, stashed, or unpushed work that is not clearly owned by the current task.
---

# Preserve Git state

## Inventory before changing Git state

Inspect:

- the current branch and `HEAD`;
- upstream and ahead or behind state;
- staged, unstaged, and untracked paths;
- existing stashes;
- unpushed commits and active merge, rebase, cherry-pick, or revert state;
- nested repositories or submodules relevant to the task.

Do not infer ownership from the current diff. A change that was present when the task began belongs to the user or another workflow unless evidence establishes otherwise.

Record the paths and Git state the current task creates or changes. This task-owned set controls later staging and cleanup.

## Work around unrelated state

Prefer operations that leave unrelated state untouched:

- edit only the requested paths;
- stage and commit with explicit path lists;
- use `git diff --cached` and `git diff` separately;
- create an isolated worktree or branch when the operation needs a clean checkout;
- preserve pre-existing instrumentation, untracked notes, stashes, and local commits;
- rebase or merge only after resolving how local and upstream work must be preserved.

Do not use `git add -A`, `git add .`, `git commit -a`, broad restore commands, or cleanup commands when they could capture or discard unrelated state. Do not stash user work merely to make the tree look clean. A stash changes state and can be lost or forgotten.

If isolation is impossible and the task requires touching a path with mixed ownership, inspect hunks and stage only the task-owned changes. Stop before overwriting a conflicting user hunk.

## Separate destructive Git actions

Commands such as `reset --hard`, `clean`, `checkout --`, `restore`, stash deletion, branch deletion, history rewrite, and force-push require exact target and recovery judgment. When one is necessary, resolve its exact target, exclusions, recovery path, and user authority before running it.

Do not run them as routine preparation. A request to "get to a clean state" does not authorize discarding or hiding user work.

## Recognize disposable output

Do not protect reproducible task-owned output as though it were user work. Generated files in an ignored build directory, an agent-created temporary worktree, or current-task scratch files may be removed after confirming ownership and the exact target.

Do not classify an untracked file as disposable merely because Git does not track it.

## Commit intentionally

Before committing:

1. List the exact intended paths.
2. Stage those paths or hunks only.
3. Inspect the staged diff.
4. Confirm that every staged change belongs to the task.
5. Keep unrelated staged changes staged and outside the task commit.

When Git cannot create the intended commit without including unrelated staged state, use a temporary index through `GIT_INDEX_FILE` or a separate worktree. Do not silently unstage or recommit someone else's work.

## Verify preservation

At completion, compare the current state with the initial inventory. Report only the lines that apply:

- task-owned files changed and committed;
- pre-existing staged, unstaged, untracked, stashed, and unpushed state left intact;
- any state moved or transformed with explicit user authority;
- the final branch, `HEAD`, and upstream relationship when Git history changed.

Do not call the tree clean when preserved user work intentionally remains.
