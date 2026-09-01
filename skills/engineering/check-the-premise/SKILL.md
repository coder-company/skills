---
name: check-the-premise
description: Run a disposable spike against the one plan assumption whose failure would invalidate the most downstream work, with the falsifying observation, budget, and cleanup declared first. Use when feasibility rests on unverified library capability, external behavior, runtime limits, or performance headroom, or a plan says assuming X works. Do not use for a design choice with no dependents; use prototype-the-question. Do not use to reproduce a bug; use find-the-bug.
---

# Check the premise

Write the assumption as a claim an observation can disprove, confirm that an experiment is cheaper than being wrong, run the smallest falsifier in a disposable location, and translate the result into one planning decision. Then delete the experiment.

## Route first

- The question has no downstream steps riding on it: `prototype-the-question`.
- An authoritative, versioned source settles the exact behavior: read it, state the constraint and its planning consequence, and stop. Do not spike what a document already answers.
- The uncertainty is a bug to reproduce: `find-the-bug`.
- The question is product desirability or user preference: ask the user; no experiment answers it.

## State one falsifiable assumption

Write the claim with environment, input, and threshold:

- "The proxy streams a 50 MB request body to the upstream without buffering it fully."
- "The pinned database version adds this index without blocking writes for more than two seconds on a table of 10 M rows."
- "The library's current parser preserves unknown fields through a read-write round trip."

Reject claims that cannot fail ("the approach should scale", "the API probably supports this").

Choose the assumption whose failure would invalidate the most downstream work, not the one that is easiest or most familiar to test. Name the downstream decisions that depend on it.

## Confirm the spike is warranted

Run it only when all four hold:

1. The answer is empirical, not fully specified by an authoritative source at the pinned version.
2. Obtaining the answer costs less than implementing the dependent work.
3. A wrong assumption would change or cancel at least two downstream decisions.
4. The experiment can run without unsafe production access or lasting side effects.

If any fails, say which and do not spike. Do not invent a different experiment to keep using the workflow.

## Design the cheapest falsifier

Declare before running:

- the exact command or small program;
- the representative input and environment, and how they differ from the target environment;
- the observation that supports the claim;
- the observation that falsifies it;
- a time, turn, or attempt budget;
- the disposable location and the cleanup command.

Test the uncertainty directly. A progress-bar prototype does not test whether a proxy streams; a laptop benchmark does not establish a production latency threshold unless the constraints match. Use a scratch directory, isolated branch, or temporary project outside production paths. Do not mix spike code into the implementation diff or add reusable abstractions to it.

## Stop on evidence

End when the predeclared supporting or falsifying observation appears, the budget is exhausted, or the environment cannot safely represent the behavior. Do not polish the experiment after the decision resolves. Do not move the threshold because the preferred plan failed.

Translate the result into exactly one decision:

- **Supported:** continue the plan; record the observation that removed the risk and the environment it was observed in.
- **Falsified:** change or abandon the dependent plan before implementation; name which downstream steps change.
- **Inconclusive:** name the missing environment or observation; the assumption is not settled and the plan must say so.

## Delete the experiment

Remove spike code, temporary dependencies, test data, services, and configuration. Confirm the implementation diff contains none of it. Keep a durable regression test only when the observed behavior is part of the product contract and the repository has a test boundary for it; rewrite it as maintained evidence, not the scratch experiment.

## Stop signals

- The claim has no threshold or environment: rewrite it until an observation could disprove it.
- You are spiking the familiar part of the plan: switch to the assumption with the most dependents.
- Documentation at the pinned version states the answer: stop and cite it.
- The preferred plan failed and you are adjusting the threshold: the result is falsified; report it.
- The spike is acquiring error handling or structure: the decision is resolved; delete it.

## Shortcuts that fail

- "Build it and see": the dependent work is the expensive way to discover the assumption was false.
- "The docs say it works": docs describe an intended version; behavior at the pinned version with your input is the question.
- "Test on my laptop, it's close enough": for latency, concurrency, and resource limits it is not; state the mismatch and what it means.
- "Keep the spike as a starting point": the spike lacks the error handling and structure of product code and carries its fakes into the implementation.
- "Spike the whole design": one falsifiable claim per spike; a broad prototype answers nothing precisely.

## Report

State the assumption with its dependents; whether the spike was warranted (all four conditions) or which failed; the falsifier as declared (command, input, environment, supporting and falsifying observations, budget); the observation recorded exactly; the decision (supported, falsified, inconclusive) and its consequence for the plan; and cleanup confirmed. Do not call the feature complete because the premise held.

## Critical failures

- A claim spiked that has no threshold or that an authoritative pinned source already settles.
- Falsifying observation not declared before running.
- Threshold or claim adjusted after the result.
- Spike code, dependencies, or data left in the implementation diff.
- An inconclusive result presented as supported.
