---
name: work-unattended
description: Run a task to completion without human turns by fixing a falsifiable stop predicate, an autonomy boundary, and a stall rule up front, proceeding on reversible work and pausing only for irreversible actions. Use when the user says run until done, going to bed, be fully autonomous, or loop until X passes. Do not use when the user is reviewing each step. Do not use to authorize destructive actions; use confirm-destructive-actions.
---

# Work unattended

Before the first action, write the predicate that ends the run, the actions you may take without asking, and the condition that means you are stalled. Then work from explicit state, log every judgment call, and stop only when the predicate is observed true, you are stalled, or the next action is irreversible and outside your authority.

## Route first

- Facts and ruled-out paths must survive many steps: `keep-execution-state` (required for this skill).
- Judgment calls must be auditable afterward: `log-decisions` (required for this skill).
- The next action deletes, force-pushes, deploys, or messages people: `confirm-destructive-actions`.
- The same failure keeps recurring: `break-the-loop`.
- The run must pause with work unfinished: `hand-off-work`.

## Fix the stop predicate

Write the predicate as an observation, not an intention:

- Good: "`npm test` exits 0 on the branch head and `gh pr checks 412` shows every required check passing on that SHA."
- Good: "The p95 of `/search` over the recorded workload is under 300 ms in three consecutive runs of `bench.sh`."
- Bad: "the feature works", "CI is fixed", "the migration is done".

State how you will observe it (the exact command or interaction) and record the baseline result now. If the user's request has no observable end, derive one with `define-done` before starting and record it as an assumption in the decision log.

The predicate is fixed for the run. If it turns out to be wrong (unreachable, or satisfied by something that does not solve the problem), stop and report; do not rewrite it mid-run.

## Fix the autonomy boundary

Proceed without asking on: reading, running tests and builds, editing files in the task's scope, committing to the task's branch, opening or updating the task's PR, installing dependencies the repository already pins, retrying within the stated budgets.

Stop and wait for the user on: force-pushing shared branches, deleting data or files outside the task's scope, deploying, changing production configuration, sending messages to people, spending money, expanding scope beyond the request, and anything the user or repository rules mark as requiring approval.

When a needed action falls on the stop side, do everything that does not depend on it, write the decision log row, and end with the exact action awaiting approval and what it unblocks.

Session overrides ("be fully autonomous") widen the proceed side only for reversible actions. They never authorize the irreversible list.

## Fix the stall rule

Set budgets before starting: attempts per failure (default three), total fix-push cycles for CI (default five), wall-clock or turn budget for the run if the harness exposes one. Record them.

You are stalled when a budget is exhausted, when two consecutive attempts produce no new evidence, or when the next step needs authority you do not have. Stalled means stop and report the state, not try harder. A plateau below the predicate is not permission to move the predicate.

## Run

Loop:

1. Read the execution state. Choose the action `next` names.
2. Act. Record new facts and ruled-out paths in the state.
3. If the action was a judgment call, append a decision-log row.
4. Check the predicate when the state suggests it could be true. Record the observation whether or not it passed.
5. If the predicate is true, run the audit in `log-decisions` and stop. If stalled, stop. Otherwise continue.

Verify at the real boundary before checking the predicate true (see `verify-real-behavior`). A green proxy (unit tests, a build) does not satisfy a predicate written about the user's boundary.

Delegate bulk reading or independent sub-tasks (see `dispatch-subagents`) and verify their results yourself before recording them as facts.

## Stop signals

- You are about to edit the predicate: stop the run and report instead.
- You cannot state why the current action is closer to the predicate than the last one: you are stalled.
- The action you are about to take is on the irreversible list: end the turn with the request for approval.
- The decision log has no rows after a stretch of work that involved choices: log them before continuing.
- A verification you called passing was a proxy: run the boundary check.

## Shortcuts that fail

- "Close enough, the user will understand": the user left because they trusted the predicate. Report the gap; do not redefine done.
- "It's reversible in principle, so I can force-push": a rejected push means the remote moved; overriding it discards someone's work. Rejected pushes are irreversible in practice.
- "Keep trying, the user said don't stop": "don't stop" widens the proceed side; it does not turn a stall into progress. Stopping with a clear state is what they asked for when the predicate is unreachable.
- "I'll remember the decisions": autonomous runs are exactly where memory fails and the audit trail is the only account.
- "Tests pass, so the predicate is met": the predicate names the user's boundary; check it there.

## Report

End the run with: the predicate and the observation that satisfied it (command and output) or the stall reason with budgets consumed; the attention section from `log-decisions`; the closing execution state; actions awaiting approval, if any, with what each unblocks; and the location of the trail and any artifacts. If the predicate was not met, the first line says so: "Not done: <predicate> not observed. Stopped because <reason>."

## Critical failures

- Declaring the run complete without the recorded observation that satisfies the predicate.
- Changing the predicate during the run.
- Taking an action on the irreversible list without approval.
- Continuing past a stall budget instead of reporting.
- A run of judgment calls with no decision log, or no execution state.
