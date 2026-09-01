---
name: log-decisions
description: Keep an append-only decision trail during autonomous or long work, one row per judgment call with reason, evidence pointer, and cost if wrong, audited against what actually happened before the run ends. Use when the user says show me your work, going to bed, run until done, or keep a log. Do not use for short interactive tasks. Do not use as the execution state itself; use keep-execution-state.
---

# Log decisions

Write one line per decision as you make it, never after the fact, with a pointer to the evidence rather than a description of it. Before the run ends, audit the log against the transcript and the repository, fix the log where it disagrees with what happened, and lead the final message with the entries that need the user's attention.

## Route first

- The task needs to carry facts and ruled-out paths between steps: `keep-execution-state`. The decision log records choices; the state records knowledge.
- Control is leaving this context with work unfinished: `hand-off-work`, which references the log rather than duplicating it.
- A decision is irreversible (force-push to a shared branch, deletion, deploy, customer-facing message): `confirm-destructive-actions` before logging that you did it.

## Create the log

At the first decision, create the trail as a tab-separated file outside the repository unless the user wants it committed: `<os-temp>/<task-slug>-decisions.tsv`. Header:

```
ts	phase	decision	why	evidence	cost_if_wrong	result
```

Column rules:

- `ts`: ISO 8601 timestamp.
- `phase`: the step of the task (plan, implement, verify, ship, or the plan's task number).
- `decision`: what you chose, as a completed action or a commitment ("use existing `parseToken` instead of adding a parser").
- `why`: the reason in one clause.
- `evidence`: a pointer, not prose: a file:line, command, test name, URL, commit SHA, or log path. "none" when the decision rests on judgment alone; say so.
- `cost_if_wrong`: what the user loses if this was the wrong call, in one clause ("one extra migration", "a day of rework on the API", "nothing, reversible").
- `result`: filled in later when the outcome is known ("kept", "reverted at <sha>", "pending").

Append only. Never edit an earlier row except to fill `result`. If a decision is reversed, add a new row that references the earlier one.

Sanitize cell content: replace tabs and newlines inside a cell with spaces; prefix any cell that begins with `=`, `+`, `-`, or `@` with a single quote so a spreadsheet does not evaluate it. Never write a secret, token, or credential into the log; write the credential's name.

## Decide what counts as a decision

Log when you:

- choose between two or more viable approaches;
- proceed on an assumption you could not verify;
- skip a step a playbook, plan, or skill named;
- change scope (add, drop, or defer something the user asked for);
- take an action that is hard to reverse;
- classify a failure (flaky, environmental, defect) and act on the classification;
- accept or dismiss a review finding, test failure, or tool warning.

Do not log routine mechanics (reading a file, running the test suite) unless the result changed a decision.

## Audit before ending

When the task reaches its stop condition, before the final message:

1. Read the log top to bottom against the transcript and `git log`. For each row confirm the decision was actually taken and the evidence pointer resolves.
2. Where the log and reality disagree, fix the log with a new row that says what actually happened. Do not adjust the story to match the log.
3. Fill `result` for every row that is no longer pending.
4. Mark rows for attention: any row where `evidence` is "none", `cost_if_wrong` is not "nothing, reversible", scope changed, or a step was skipped.

Where the harness allows, have an independent agent read the log and the diff and return the rows it would question, so the attention list is not only your own judgment.

## Stop signals

- You made a choice three steps ago and have not logged it: log it now with the actual timestamp of the decision noted in `why`; do not backfill silently.
- You are writing a paragraph in the `evidence` column: replace it with a pointer.
- You are about to edit an earlier row: append a correction row instead.
- The log has no rows with a real `cost_if_wrong` after an hour of autonomous work: you are not recording the decisions that matter.
- A row's evidence pointer does not resolve during the audit: the decision is unverified; mark it for attention.

## Shortcuts that fail

- "I'll write the log at the end": a log reconstructed from memory records the story, not the decisions; the skipped steps and reversed calls are what memory drops.
- "The transcript is the log": the reader would need to re-read the whole session to find the six calls that mattered.
- "Evidence is the explanation": prose evidence cannot be checked; a pointer can.
- "Fix the wrong row": editing history hides the fact that you believed something false for a while, which is the information the reader needs.
- "Commit it so it is safe": a committed trail becomes repository noise; commit only when a reviewer needs the trail to trust the result, and say so in the commit message.

## Report

Lead the final message with an **Attention** section listing the marked rows (decision, cost if wrong, why it needs a human), then the path to the trail, the row count, and whether an independent reviewer read it (name it) or not. If no row needed attention, write "Attention: none; all decisions reversible and evidenced." and still give the path.

## Critical failures

- A decision that changed scope, skipped a step, or took an irreversible action is absent from the log.
- An earlier row edited instead of corrected by a new row.
- A secret or credential value written into the log.
- The audit not performed, or performed against the log alone without the transcript or repository.
- Attention section omitted or placed after the summary.
