---
name: confirm-destructive-actions
description: Gate any operation that deletes, overwrites, rewrites, or publishes state the environment cannot undo, on an exact target, named exclusions, verified recovery, and explicit authority. Use when a task could delete files or records, discard work, rewrite history, force-push, or drop a table, or a command contains rm, reset --hard, clean, force, or drop. Do not add ceremony for agent-owned temp output. Do not use for release gating; use check-release-safety.
---

# Confirm destructive actions

Resolve the exact target, the exclusions, the effect, the recovery path, and the authority with read-only commands before mutating. Choose the least destructive action that still meets the request. After mutating, verify the terminal state from the authoritative system.

## Route first

- The action is a merge, tag, publish, or deployment: `check-release-safety`.
- The repository holds user work that must survive the operation: `preserve-git-state` for the inventory.
- The action is routine disposable cleanup (below): execute it without ceremony.

## Resolve the action

An operation is destructive when it can remove or overwrite user-owned state, invalidate a recovery point, or change a shared system the current environment cannot reverse. Before running one, establish:

1. **Target:** the exact files, records, resources, branches, accounts, or environments, by stable identifier or literal path. Never infer a target from a broad directory, unresolved variable, wildcard, account default, or display name when a stable identifier exists.
2. **Ownership:** which state belongs to the user, another contributor, the agent, or a disposable environment.
3. **Exclusions:** named state that must remain untouched.
4. **Effect:** what is deleted, replaced, rewritten, published, or made unreachable.
5. **Recovery:** the backup, snapshot, reflog entry, down migration, or inverse command, verified to cover the target, be readable, and have a plausible restore path. A snapshot in the same failure domain is not a recovery point.
6. **Authority:** the user instruction or repository workflow authorizing this exact effect.

If the class of action is authorized but the exact target is ambiguous, stop and ask for that one fact. Urgency does not resolve a target.

## Choose the least destructive complete action

Prefer, when it preserves the requested result: moving to Trash over permanent deletion; a new commit over rewriting published history; disabling or detaching before deleting where the platform allows recovery; an explicit path list over a recursive parent; a verified snapshot before a destructive migration; removing only agent-created state.

## Recognize disposable cleanup

Do not add approval steps when all affected state is demonstrably disposable and agent-owned: a temporary directory created in this task, build output recreatable from unchanged sources, a local test database for this run, an agent-created unshared worktree or branch, dependency caches with no user content.

A user statement that the exact path was created for this task and holds only generated files is sufficient authority. One read-only listing of that literal path can disprove it; lacking a listing tool does not reopen approval. Remove the literal path directly. Disposable ownership removes the recovery requirement, not the exact-target requirement.

## Execute with bounded scope

Immediately before mutation:

1. Re-read the exact command or request and confirm it matches the resolved target, cannot match an exclusion, and still has its recovery point when one is required.
2. Remove environment variables, command substitution, globs, and aliases that could widen the target after review.
3. Use the platform's narrowest operation.

After mutation, read the authoritative state. An accepted asynchronous request is not completion; poll or re-read until the terminal state is visible, or report it pending.

## Stop signals

- The target is a variable, glob, or parent directory: resolve it to literal identifiers first.
- You are about to create a backup you have not checked can restore: check it or say there is no recovery.
- The user said "clean up" and the tree contains work you did not create: that is not authority to discard it.
- The request is urgent: urgency changes nothing about target resolution.

## Shortcuts that fail

- "`rm -rf` the directory, it's mostly build output": the "mostly" is the user's uncommitted notes or a config file.
- "Force-push, I'll recover from reflog": the reflog is local; the remote's discarded commits are gone for everyone else.
- "Take a snapshot first": a snapshot on the same disk or in the same account fails with the thing it protects.
- "Ask for confirmation on every delete": approval ceremony on disposable temp files trains the user to approve without reading.

## Report

State what changed by stable identifier or literal path; which exclusions remained; the recovery point and whether its restore path was checked; whether the result was verified at the authoritative boundary; and anything pending or irreversible. If no recovery exists and the action was authorized, say so before the action and again in the result. If the action was blocked, name the missing fact.

## Critical failures

- Mutation run with an unresolved or inferred target.
- Recoverability claimed without checking the restore path.
- User-owned state discarded under authority for a different class of action or for disposable cleanup.
- Completion reported from an accepted asynchronous request without reading the terminal state.
- Approval ceremony added to demonstrably disposable agent-owned output.
