---
name: confirm-destructive-actions
description: Gate destructive or difficult-to-reverse operations on exact targets, exclusions, authority, and recovery. Use when a task could delete data, discard work, rewrite history, replace remote state, or make a change that the agent cannot undo from the current environment.
---

# Confirm destructive actions

## Resolve the action before running it

Treat an operation as destructive when it can remove or overwrite user-owned state, invalidate a recovery point, or change a shared system in a way the current environment cannot reverse.

Before running it, establish:

1. **Target:** The exact files, records, resources, branches, accounts, or environments affected.
2. **Ownership:** Which state belongs to the user, another contributor, the agent, or a disposable test environment.
3. **Exclusions:** Named state that must remain untouched.
4. **Effect:** What will be deleted, replaced, rewritten, published, or made unreachable.
5. **Recovery:** The verified backup, snapshot, reflog, down migration, inverse command, or other usable path back.
6. **Authority:** The user instruction or repository workflow that authorizes this exact effect.

Use read-only commands to resolve these facts. Inspect status, effective configuration, resource identity, parent relationships, and current remote state as appropriate. Do not infer a target from a broad directory, unresolved variable, wildcard, account default, or display name when a stable identifier is available.

If the user authorized the class of action but the exact target remains ambiguous, stop before mutation and ask for the missing decision. Do not turn urgency into target resolution.

## Choose the least destructive complete action

Prefer an action that preserves recovery without changing the requested result:

- move recoverable files to Trash instead of permanently deleting them;
- create a new commit instead of rewriting published history;
- disable or detach before deleting when the platform supports recovery;
- use an explicit path list instead of a recursive parent target;
- preserve a snapshot before a destructive migration when that snapshot can actually be restored;
- remove only agent-created instrumentation or temporary state.

Do not create a backup as theater. Verify that it covers the target, is readable, and has a plausible restore path. A snapshot in the same failure domain may not be a recovery point.

## Recognize routine disposable cleanup

Do not add an approval ceremony when all affected state is demonstrably disposable and agent-owned, such as:

- a temporary directory created during the current task;
- generated build output that can be recreated from unchanged sources;
- a local test database created for the current run;
- an isolated worktree or branch created by the agent and not shared;
- dependency caches with no user-authored content.

A user statement that the exact path was created for the current task and holds only generated files is sufficient authority. If filesystem tools are available, one read-only listing of that literal path can disprove the statement, but lack of a listing tool does not reopen approval. Remove that literal path directly when mutation tools are available. Otherwise, endorse the exact scoped cleanup without asking for a second confirmation, creating a backup, or substituting a different path.

Still resolve the exact target. Disposable ownership removes the recovery requirement, not the target requirement.

Route release, deployment, publication, and remote merge gates to the repository's shipping workflow when one exists. This skill owns destructive target and recovery judgment, not routine release verification.

## Execute with bounded scope

Immediately before mutation:

1. Re-read the exact command or API request and confirm it matches the resolved target, cannot match an exclusion, and still has its recovery point when recovery is required.
2. Avoid environment variables, command substitution, globs, or aliases that could widen the target after review.
3. Use the platform's narrowest supported operation.

After mutation, inspect the authoritative state. An accepted asynchronous request is not proof of deletion or completion. Poll or re-read the resource until the requested terminal state is visible or report that completion remains pending.

## Report the irreversible result

State:

- what changed, using stable identifiers or explicit paths;
- which exclusions remained;
- what recovery point exists, if any, and whether its restore path was checked;
- whether the result was verified at the authoritative boundary;
- any part of the operation that is still pending or cannot be undone.

Do not claim recoverability when the restore path was not checked. If no recovery exists and the action was explicitly authorized, say so before the action and again in the result.
