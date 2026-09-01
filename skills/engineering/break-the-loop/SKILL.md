---
name: break-the-loop
description: Stop a retry loop that is producing no new evidence, record what the attempts ruled out, classify the blocker, and run one action that distinguishes the remaining causes, never silencing the failing check. Use when the same failure recurred, two fixes failed without narrowing the cause, a retry budget is exhausted, or you think one more try or skip that test for now. Do not use on a first failure with an untested hypothesis; continue find-the-bug.
---

# Break the loop

Detect the stall, write the attempts down compactly, classify the blocker, and run exactly one action whose result the previous attempts could not have produced. Stopping a fruitless loop with an honest state is progress; a manufactured green is not.

## Route first

- One attempt has failed and a hypothesis remains untested: stay in `find-the-bug`.
- The failure is a CI check with logs you have not read: `fix-the-ci` reads them first.
- A documented transient (rate limit, flaky network call) with budget remaining: wait for the stated condition, retry once, name the stop condition in one line, and only then return here.
- The loop is a long autonomous run: the stall rule in `work-unattended` invokes this skill.

## Detect the stall

Pause when any of these holds:

- the same failure appeared twice with no new evidence between;
- two proposed fixes failed and the second result did not rule anything out that the first had not;
- a retry budget is exhausted;
- the next idea is to skip, delete, loosen, force, or silence the failing check;
- you cannot say what result of the next attempt would change your belief.

A retry with a changed, evidence-based condition is not repetition. A retry because "it might work this time" is.

## Record the loop compactly

Write, for each meaningful attempt:

```
attempt N: hypothesis | action or command | observed result | ruled in / ruled out
```

Keep only entries that change the next decision. Before running any further attempt, state the outcome that would distinguish its hypothesis; an attempt that cannot state one does not run. Consult the record before every action so no attempt repeats under unchanged conditions (see `keep-execution-state` for carrying this across a long task).

## Classify the blocker

Choose the smallest class the evidence supports:

- **Transient:** the same operation can succeed without any change and a bounded retry policy exists. Evidence: a prior pass under the same conditions or an environmental error text.
- **Environmental:** progress needs a tool, service, credential, permission, capability, or resource outside the task's authority.
- **Defect:** evidence points to code, data, configuration, or a test contract that the task may change.
- **Ambiguous:** the evidence does not distinguish the remaining causes.
- **Authority:** the next action would expand scope, weaken a contract, or mutate a system the user did not authorize.

Classification is a decision that changes the next action. It is not a label for continuing the same attempt.

## Choose one discriminating action

The action must produce information no prior attempt could have produced. Choose the cheapest of these that fits:

- reduce the reproducer until one variable remains;
- inspect the next boundary that owns the value (the producer of the bad input, not its consumer);
- compare a known-good and a failing environment on one axis;
- add a temporary probe with a unique marker at the point that separates the hypotheses;
- verify the effective configuration the process actually loaded, not the file believed to configure it;
- for restart or deploy failures, inspect state (caches, migrations, stale artifacts) rather than code;
- request one exact missing artifact or one authority decision.

Set a budget (attempts or time) before running it. If no safe discriminating action exists, stop and report.

## Never manufacture green

Do not respond to a stall by:

- weakening, skipping, deleting, or filtering the failing test;
- adding `continue-on-error`, `|| true`, `--no-verify`, a broad catch, or an unconditional fallback;
- changing unrelated code to see what happens;
- raising a timeout without evidence the step was progressing;
- reporting a partial workaround as a fix;
- claiming an external blocker without checking the local evidence available.

If the test or requirement is wrong, establish that from the authoritative contract before changing it, and say so.

## Stop signals

- "One more try with the same change": the record already contains it; pick a different action or stop.
- "I'll just disable this check for now": that is the manufactured-green list; classify instead.
- You cannot name what result would change your belief: do not run the attempt.
- Three fixes have each revealed a new failure elsewhere: the model of the system is wrong; report an architectural finding rather than a fourth fix.
- The record shows the same hypothesis under two names: merge them and move on.

## Shortcuts that fail

- "It's flaky, rerun it": without a prior pass under the same conditions or environmental error text, "flaky" is a guess that hides a defect.
- "Bump the timeout": a step that was not progressing will not progress with more time; check the log timestamps first.
- "Try a few random changes to see what moves": each unpredicted result adds noise, not evidence, and the record becomes unreadable.
- "Report it fixed with the workaround": the user reads "fixed" as the cause resolved; the workaround fails next week in a form nobody connects to this one.

## Report

Return exactly one state:

- **Resolved:** the evidence that changed, the command run, and its observed result.
- **Inconclusive:** the compact attempt record, the remaining causes, and the single artifact or observation that would distinguish them.
- **Blocked (environmental or authority):** the missing capability or decision, the attempt record, and the work preserved.

Never return "fixed" without the observation. If the loop was not a stall (a documented transient resolved on the bounded retry), say so in one line.

## Critical failures

- A failing check weakened, skipped, filtered, or silenced to end the loop.
- An attempt repeated under unchanged conditions after the stall was detected.
- A failure classified as transient with no prior pass or environmental error text.
- "Fixed" or "resolved" reported without the observed result of the resolving action.
- The attempt record omitted from an inconclusive or blocked report.
