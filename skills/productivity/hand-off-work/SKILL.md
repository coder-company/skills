---
name: hand-off-work
description: Preserve the minimum exact state needed to resume incomplete work across a context boundary. Use before compaction, session transfer, or handoff when the task remains unfinished, the tree is dirty, or the next agent needs decisions and evidence that are not recoverable from the repository alone.
---

# Hand off work

## Use a handoff only for unfinished work

Create a handoff when control will move to a fresh context and important state would otherwise be lost.

Do not create one for a completed task, ordinary progress update, commit message, or pull request description. Those artifacts have different readers and contracts.

Prefer repository and tracker state over duplicated prose. Record only information a fresh agent cannot recover cheaply or safely.

## Record rejected paths

List alternatives that a reasonable successor might retry, with the exact evidence that rejected each one. Omit this section when nothing was ruled out.

For each rejected path, include:

- the action or design considered;
- the observed result or constraint;
- the command, file, trace, decision, or authority that supports the rejection;
- whether changed conditions could make it valid later.

Do not record speculation as a rejected path.

## Pin the working state

Capture the smallest applicable set:

- repository path;
- branch and exact `HEAD` SHA;
- upstream ref and SHA;
- concise staged, unstaged, and untracked inventory;
- stashes created during the task, with their refs;
- active merge, rebase, cherry-pick, revert, or bisect state;
- relevant process, session, worktree, deployment, or resource identifiers;
- exact command and result for the last meaningful verification;
- files or artifacts containing durable evidence.

Do not write "tests pass" without the command, scope, and revision tested. Do not write "working tree clean" when untracked or preserved user work remains.

Never include secrets, tokens, credential values, or private data. Name the credential source or permission needed without copying the secret.

## Preserve decisions and the next action

State:

1. The current objective and observable completion condition.
2. Decisions already made and the evidence behind them.
3. Work completed but not yet verified.
4. Work remaining.
5. The single next action and why it is next.
6. Known blockers and the condition that clears each one.

Keep history only when it constrains the next move. A conversation summary that omits current state is not a handoff.

## Verify resumability

Before handing off, check that referenced paths, SHAs, commands, and artifacts exist. Ensure the next action can be understood without relying on pronouns or unstated conversation context.

Reread the handoff as if you had no prior context. Repair it if the next action is ambiguous, a rejected path still looks attractive, or the working state cannot be located from what is written.

Store the handoff only where the active workflow expects resumable state. Do not add a permanent repository document when the harness already preserves handoff context or a temporary task message is sufficient.
