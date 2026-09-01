---
name: dispatch-subagents
description: Delegate bounded work to subagents with self-contained briefs, disjoint write scopes, a fixed return contract, and independent verification of results. Use when work splits by failure domain, module, or read scope, when bulk reading would flood context, or the user says fan out, in parallel, or delegate. Do not use for one tightly coupled change or when the subagent would need the whole conversation.
---

# Dispatch subagents

Split the work by independent responsibility, give each subagent a brief that stands alone, keep write scopes disjoint, and verify every result against the workspace rather than the subagent's report. You own the outcome; the subagent owns only its brief.

## Route first

- The work is a plan with ordered tasks: write it with `write-a-plan` first, then dispatch one task per subagent.
- Several attempts at the same artifact should compete: `run-parallel-candidates`.
- The main context is filling up but the work is not divisible: `keep-execution-state`, not delegation.

## Decide the partition

Partition by one of these, and only one per dispatch wave:

- **Failure domain:** each distinct failing test file, service, or error class gets one investigator. Do not group failures that may share a cause into separate agents until a shared cause is ruled out.
- **Read scope:** each agent reads one subsystem, directory, or source and returns a summary with file:line pointers.
- **Write scope:** each agent edits a disjoint set of files or modules. Two agents may not both edit the same file, lockfile, generated artifact, or shared configuration in one wave. If two tasks touch the same file, serialize them or merge them.

For write work, prefer isolated working copies (separate git worktrees on separate branches) when the harness supports it. Confirm the worktree path is ignored (`git check-ignore -q <path>`) before creating one inside the repository.

Before dispatching, write the merge plan: which results combine, in what order, and what check runs after integration.

## Write the brief

Every brief must be executable by an agent that has not seen this conversation. Include:

1. **Objective:** one sentence, with the observable result that ends the task.
2. **Context pointers:** file paths, commands, and symbols to start from. Point to files; do not paste large contents into the brief.
3. **Scope:** files it may edit, files it must not edit, and whether it may run mutating commands, install dependencies, or touch the network.
4. **Constraints:** the repository rules and task constraints that apply, copied verbatim, not summarized.
5. **Return contract:** exactly what to return and in what shape (below).
6. **Budget:** a turn, time, or attempt limit and what to return when it is exhausted.

Do not include your expected answer or a bias about the result ("this is probably the cache", "do not flag X"). A brief that pre-judges the finding produces a report that confirms it.

Return contract for every subagent:

```
STATUS: DONE | DONE_WITH_CONCERNS | BLOCKED | NEEDS_CONTEXT
RESULT: <the artifact or answer, or a path to it>
EVIDENCE: <commands run and their observed results, file:line for claims>
CHANGED: <files created, modified, deleted; "none" for read-only work>
CONCERNS: <anything the controller must decide; "none">
```

Cap the return at a stated length (for example 30 lines) and have detail written to a file the brief names.

## Dispatch

- Launch independent agents in the same turn, not sequentially.
- Do not dispatch more agents than you can review. Reviewing is the cost; if you cannot read every diff, the wave is too wide.

## Verify results yourself

Treat every report as unverified:

1. For write work, read `git status` and `git diff` for the files in scope. Confirm `CHANGED` matches reality and no file outside scope moved. Run the check named in the brief.
2. For read work, spot-check at least one cited file:line per report. A citation that does not say what the report claims invalidates the report's other claims until re-checked.
3. For `DONE_WITH_CONCERNS` or `BLOCKED`, decide before dispatching anything that depends on it.

Integrate in the planned order and run the post-integration check. Two agents that each passed in isolation can conflict in combination (duplicate helpers, incompatible signatures, both editing a generated file through different sources).

## Re-dispatch rules

- A subagent that returns `NEEDS_CONTEXT` was given a brief that failed. Fix the brief; do not answer with a chat reply that only that agent will see.
- Resume the same agent for a follow-up on the same slice at most twice. After that, dispatch a fresh agent with a consolidated brief; chained resumes drop earlier directives.
- Never re-dispatch a completed task. Record completed tasks in your state before launching the next wave (see `keep-execution-state`).

## Stop signals

- Two briefs list the same file under "may edit": stop and re-partition.
- A brief contains "do not flag", "probably", or your hypothesis: remove it.
- You are about to report a subagent's success without having read its diff or output: read it first.
- The results disagree with each other: the partition hid a shared cause. Consolidate before acting.

## Shortcuts that fail

- "The subagent said done": self-reports are claims. The failure this catches most is a report of passing tests that were never run, or run on the wrong revision.
- "One agent can do all the failures": unrelated failures investigated in sequence contaminate each other's hypotheses, and the context fills with dead ends.
- "They can both edit the file; I'll merge": concurrent edits to one file produce silent overwrites or conflicts that neither agent saw. Serialize.
- "I'll summarize the conversation in the brief": summaries drop the constraint that mattered. Copy constraints verbatim and point to files.

## Report

State the partition and why, list each subagent with its slice, status, and the verification you performed on its result (command or file read), then the integration result with the check that ran. List concerns that need a user decision. If no subagent was needed after inspection, say "Dispatched: none" and why.

## Critical failures

- Two subagents given overlapping write scope in the same wave.
- Reporting a subagent result as verified without reading its diff, output, or cited location.
- A brief that requires knowledge of this conversation to execute.
- A re-dispatch of a task already recorded as complete.
- Integration performed without running the post-integration check.
