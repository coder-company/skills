---
name: hand-off-work
description: Preserve the minimum exact state a fresh agent needs to resume unfinished work across a context boundary, with rejected paths and evidence, pinned repository state, decisions, and the single next action, verified resumable. Use when compaction, session transfer, or handoff is imminent and the task is unfinished or the tree is dirty. Do not use for a finished task, progress update, or PR description. Do not use as running state; use keep-execution-state.
---

# Hand off work

Write down only what a fresh agent cannot recover cheaply or safely: the ruled-out paths with their evidence, the exact working state, the decisions made, and the one next action. Then reread it as a stranger and repair anything ambiguous.

## Route first

- The task is complete: write the report or PR description; no handoff.
- The task is ongoing and you need to carry facts between steps: `keep-execution-state`; the handoff is derived from that state at the boundary.
- Judgment calls need an audit trail: `log-decisions`; the handoff references the trail path.
- The tree holds user work not owned by the task: `preserve-git-state` rules govern the inventory below.

## Record rejected paths

List alternatives a reasonable successor might retry, each with: the action or design considered; the observed result or constraint; the command, file, trace, or authority that rejected it; whether changed conditions could make it valid. Omit the section when nothing was ruled out. Speculation is not a rejected path.

## Pin the working state

Capture the smallest applicable set:

- repository path; branch and exact `HEAD` SHA; upstream ref and SHA;
- staged, unstaged, and untracked inventory (`git status --porcelain=v2 --branch`), marking which items are task-owned and which are pre-existing user work;
- stashes created during the task, with refs;
- active merge, rebase, cherry-pick, revert, or bisect state;
- process, session, worktree, deployment, or resource identifiers the task created;
- the exact command and result of the last meaningful verification, with the revision it ran on;
- files or artifacts holding durable evidence (logs, decision trail, execution state).

Never write "tests pass" without command, scope, and revision. Never write "tree clean" when untracked or preserved user work remains. Never include secrets, tokens, or credential values; name the credential source or permission needed.

## Preserve decisions and the next action

1. The objective and its observable completion condition.
2. Decisions made, each with its evidence.
3. Work completed but not yet verified.
4. Work remaining.
5. The single next action and why it is next, with the result that would change the plan.
6. Blockers and the condition that clears each.

Keep history only where it constrains the next move. A conversation summary without current state is not a handoff.

## Verify resumability

Check that every referenced path, SHA, command, and artifact exists (`git cat-file -e <sha>`, `test -e <path>`). Reread the handoff as if you had no context: the next action must be understandable without pronouns or unstated conversation; no rejected path should still look attractive; the working state must be locatable from the text alone. Repair before handing off.

Store the handoff where the active workflow expects resumable state (harness plan artifact, task message, tracker). Do not add a permanent repository document when the harness preserves handoff context or a task message suffices.

## Stop signals

- You are summarizing what happened rather than what is true now: rewrite as state.
- A rejected path has no evidence pointer: find it or remove the path.
- "Tests pass" or "tree clean" appears without qualification: add command, revision, and preserved work.
- The next action contains "continue" or "keep going": name the concrete action.

## Shortcuts that fail

- "The successor can read the transcript": transcripts are compacted, and the six facts that matter are buried in tool output.
- "Skip the rejected paths, they're obvious": the successor retries the most attractive one first, because it looked attractive to you too.
- "Tree is clean": the user's untracked notes and your stash are not clean; they are the first thing the successor deletes.
- "I'll note the credentials so they can continue": the credential value in a handoff leaks the moment the handoff is stored or shared.

## Report

Deliver the handoff with sections: Objective, Rejected paths (or "none"), Working state, Decisions, Completed unverified, Remaining, Next action, Blockers, Evidence locations. End with the resumability check results (paths and SHAs verified, ambiguities repaired). State where it was stored.

## Critical failures

- A secret or credential value in the handoff.
- "Tests pass" or "tree clean" without command, revision, or preserved-work qualification.
- A referenced path, SHA, or artifact that does not exist.
- Rejected paths omitted when alternatives were ruled out.
- Next action that requires conversation context to interpret.
