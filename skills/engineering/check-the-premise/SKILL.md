---
name: check-the-premise
description: Run a disposable technical spike against the plan assumption most likely to invalidate an implementation, before building on it. Use when feasibility depends on unverified external behavior, performance headroom, runtime constraints, or library capability and being wrong would invalidate multiple downstream steps.
---

# Check the premise

## State one falsifiable assumption

Write the assumption as a claim that an observation can disprove.

Good claims name the environment, input, and threshold:

- "The proxy streams a 50 MB request without buffering the full body."
- "The pinned database version can add this index without blocking writes for more than two seconds."
- "The library's current parser preserves unknown fields through a read-write round trip."

Avoid claims such as "the approach should scale" or "the API probably supports this." If the claim cannot fail, it cannot guide a spike.

Choose the assumption whose failure would invalidate the most downstream work. Do not spike the easiest or most familiar part of the plan.

## Check whether an experiment is warranted

Run a spike when all of these are true:

1. The answer is empirical rather than fully specified by an authoritative source.
2. The answer can be obtained more cheaply than implementing the dependent work.
3. A wrong assumption would change or cancel at least two downstream decisions.
4. The experiment can run without unsafe production access or lasting side effects.

Do not spike when authoritative documentation settles the exact versioned behavior. State the documented constraint and the immediate planning consequence, then stop unless the user asks for alternative designs. Do not invent a different experiment, cleanup procedure, or measurement program merely to keep using the spike workflow.

Do not use a technical spike to answer product desirability. Do not rename ordinary bug reproduction as a spike. Route those tasks to research, product discovery, or debugging.

This skill tests an assumption inside the implementation plan. It is not for disputing a user's stated requirement or their description of the system.

## Design the cheapest falsifier

Define before running:

- the exact command or small program;
- the representative input and environment;
- the observation that supports the claim;
- the observation that falsifies it;
- a time, turn, or attempt budget;
- the safe location and cleanup action.

Test the external uncertainty directly. A progress-bar prototype does not test whether a proxy streams uploads. A benchmark on a laptop does not establish a production latency threshold unless the relevant constraints match.

Use a disposable directory, isolated branch, temporary project, or clearly named scratch file outside production paths. Do not mix the spike into the implementation diff. Do not add compatibility layers or reusable abstractions to experimental code.

## Stop on evidence

End the spike when:

- the claim is supported by the predeclared observation;
- the claim is falsified;
- the budget is exhausted;
- the environment cannot represent the relevant behavior safely.

Do not continue polishing experimental code after the decision is resolved. Do not weaken the threshold because the preferred plan failed.

Translate the result into one decision:

- **Supported:** Continue the plan and record the observation that removed the risk.
- **Falsified:** Change or abandon the dependent plan before implementation.
- **Inconclusive:** Name the missing environment or observation and do not present the assumption as settled.

## Delete the experiment

Remove spike code, temporary dependencies, test data, services, and configuration after recording the result. Verify that the final implementation diff contains none of them.

Keep only a durable regression test when the observed behavior is part of the product contract and the repository has an appropriate test boundary. Rewrite that test as maintained product evidence rather than preserving the scratch experiment.

Report the assumption, falsifier, observation, resulting decision, and cleanup. Do not call the product feature complete because the spike succeeded.
