---
name: break-the-loop
description: Stop repeated attempts that produce no new evidence and choose a discriminating next action. Use when the same command or failure has recurred, two fixes have failed without narrowing the cause, or an agent is tempted to bypass a check merely to finish.
---

# Break the loop

## Detect a stalled loop

A retry loop is stalled when an attempt repeats the same action under materially unchanged conditions or when successive changes do not distinguish between competing explanations.

Pause after:

- the same failure occurs twice without new evidence;
- two proposed fixes fail and the second result does not narrow the cause;
- a transient retry budget is exhausted;
- the next idea is to skip, delete, loosen, force, or silence the failing check.

Do not count a retry with a changed, evidence-based condition as repetition. Waiting for a documented rate-limit reset or rerunning a known flaky network request within its declared budget can be mechanical. When a documented retry is allowed, wait for the stated condition, retry once, and name the stop condition in one line. Start the sections below only after that budget is exhausted.

## Record the loop compactly

For each meaningful attempt, retain:

- the hypothesis;
- the action or command;
- the observed result;
- what the result ruled in or out.

Do not produce a long diary. Keep only information that changes the next decision. If an attempt cannot state what outcome would distinguish its hypothesis, do not run it.

## Classify the blocker

Choose the smallest applicable class:

- **Transient:** The same operation can succeed without a code or configuration change, and a bounded retry policy exists.
- **Environmental:** Progress needs a missing tool, service, credential, permission, platform capability, or resource outside the task's authority.
- **Defect:** Evidence points to code, data, configuration, or a test contract that the task can change.
- **Ambiguous:** Available evidence does not distinguish the remaining causes.
- **Authority:** The next action would expand scope, weaken a contract, or mutate a system the user did not authorize.

Classification is a decision, not a label for continuing the same attempt.

## Choose one discriminating action

The next action must produce information that the prior attempts could not:

- reduce the reproducer;
- inspect the next owning boundary;
- compare a known-good and failing environment;
- add a temporary probe with a unique marker;
- verify the effective configuration instead of the file believed to configure it;
- request one exact missing artifact or authority decision.

Set an attempt or time budget before running it. If no safe discriminating action exists, stop and report the blocker with the compact attempt record.

## Never manufacture green

Do not respond to a stalled loop by:

- weakening, skipping, deleting, or filtering the failing test;
- adding `continue-on-error`, `--no-verify`, a broad catch, or an unconditional fallback;
- changing unrelated code at random;
- repeatedly increasing timeouts without evidence of slow progress;
- reporting a partial workaround as a fix;
- claiming an external blocker without checking the local evidence available.

If the test or requirement is wrong, establish that from an authoritative contract before changing it.

## Finish with an honest state

Return one of:

- **Resolved:** Name the evidence that changed, the command run, and its observed result.
- **Inconclusive:** Name the remaining causes and the exact artifact or observation that would distinguish them.
- **Blocked by environment or authority:** Name the missing capability or decision and preserve the work already completed.

Stopping a fruitless loop is progress. Calling an unresolved failure fixed is not.
