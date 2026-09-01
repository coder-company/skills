---
name: write-a-plan
description: Turn an agreed design into an executable plan of small tasks, each with exact file paths, interfaces, a check with expected failure and success output, and dependencies. Use when the user asks for a plan, tickets, a task breakdown, or work will span sessions or agents. Do not use to decide what to build; use sharpen-requirements or define-done first. Do not use for a one-commit change.
---

# Write a plan

Produce a plan that an implementer with no project context and no access to this conversation can execute task by task, verifying each task before starting the next. A plan that requires judgment calls the reader cannot make is a design note, not a plan.

## Route first

- The requirement is still ambiguous in a way that changes the design: `sharpen-requirements`.
- Completion has no observable condition yet: `define-done`.
- A plan step rests on an unverified assumption (library capability, performance headroom, external behavior): run `check-the-premise` before planning on top of it.
- The plan is done and you are about to execute it with helpers: `dispatch-subagents`.

## Establish the plan header

Write these before any task:

- **Goal:** the observable end state, copied from the agreed requirement.
- **Constraints:** compatibility, performance, security, style, or scope limits that apply to every task, stated verbatim from the source that set them.
- **Out of scope:** what a reader might reasonably add and must not.
- **Verification baseline:** the exact command(s) that must pass before task 1 and after every task, with the current result.

Confirm the baseline by running it. A plan built on a red baseline hides which task broke what.

## Slice the work

Order tasks so that each one leaves the repository working and produces something observable. Prefer a first task that traces one narrow path through every layer over a first task that builds one whole layer. Use `build-in-slices` for the slicing decision when the feature spans layers.

Size each task to fit one focused context: a reader should complete it, including its check, without needing to hold more than the files it names. If a task needs more than roughly five files or two interfaces, split it.

Mark dependencies explicitly: "Task 4 requires Task 2 (uses `parseToken`)". Tasks with no dependency edge between them can run in parallel; say so.

For a wide mechanical change (rename across many call sites, schema migration), use expand, migrate, contract: one task adds the new path, N tasks migrate batches sized by risk, one final task removes the old path and is blocked on all migrations. See `sequence-migrations` when intermediate deployments matter.

## Write each task

Use this template for every task. Fill every field; do not leave a field for the reader to infer.

```markdown
### Task N: <verb phrase>

Depends on: <task numbers or "none">

Files:
- Create: <path>
- Modify: <path>:<line range or symbol>
- Test: <path>

Interfaces:
- Consumes: <exact signature, type, schema, or CLI flag it relies on, with the file it comes from>
- Produces: <exact signature, type, schema, or output it must expose>

Steps:
1. Write the check first: <test name or command>. Expected before implementation: FAIL with "<expected message fragment>".
2. <smallest implementation step, naming the function or block>
3. Run <exact command>. Expected: PASS. Then run the verification baseline.
4. Commit: `git add <paths> && git commit -m "<message>"`

Done when: <observable result at the task's boundary>
```

State the expected failure text for each check. If you cannot say how the check fails before the task, the check does not test the task.

## Forbidden placeholders

Do not write any of these; replace each with the concrete content:

- "add appropriate error handling" (name the error cases and what happens)
- "handle edge cases" (list them)
- "similar to Task N" (repeat the content)
- "update tests as needed" (name the test and assertion)
- "TBD", "TODO", "etc."

## Review the plan before handing it over

Read the plan as the implementer:

1. Every path exists or is created by an earlier task. Check with `ls` or `git ls-files`.
2. Every interface in `Consumes` is produced by an earlier task or already exists at the named location.
3. Every task has a check with an expected failure and success.
4. No task changes behavior outside its named files without saying so.
5. The header constraints are not violated by any task.
6. Two readers could not implement any task in materially different ways. Where they could, add the missing decision.

## Stop signals

- You are writing a task whose check you cannot make fail first: the task is either already done, untestable at that boundary, or too large. Reshape it.
- A task's file list is growing past five: split.
- You are about to write "the implementer should decide": make the decision or route it to the user as a product question.

## Shortcuts that fail

- "Descriptions are enough; the implementer will find the files": path lookup is where a fresh context burns its budget and drifts into unrelated edits. Name the paths.
- "One big task keeps it coherent": a failure inside a large task cannot be attributed, and a compaction mid-task loses the progress. Small tasks with commits survive.
- "The plan mirrors the layers (schema, then model, then API, then UI)": nothing observable exists until the last layer; defects surface late. Slice by behavior.

## Report

Deliver the plan as one document in the location the repository or user already uses for plans (an issue, a `docs/` plan file, or the response itself when no location exists). Include the header, the ordered tasks, the dependency edges, and the parallelizable groups. End with the review results (paths checked, interfaces resolved, tasks without a failing check: "none" or the list). Do not start implementing unless the user asked for implementation.

## Critical failures

- A task names a file or interface that does not exist and is not created earlier in the plan.
- A task has no check, or its check has no expected failure text.
- A forbidden placeholder appears anywhere in the plan.
- The plan reorders or changes the agreed requirement without flagging it.
- The verification baseline was not run, or its result is not recorded.
