---
name: capture-the-lesson
description: Turn what went wrong or slow in a finished task into at most three durable changes (a check, script, trigger fix, or one-sentence skill edit), limited to skills and tools that were actually in play. Use when the user says retro, reflect on this, what should we learn, or after a task with reworks or missed triggers. Do not use to write a skill with no observed failure; use write-a-skill. Do not use after a task that went as planned.
---

# Capture the lesson

Find the moments in the finished task where the agent did the wrong thing, took too long, or needed a correction; trace each to the instruction, tool, or trigger that failed; then make the smallest structural change that would have prevented it. Text is the last resort: a check that runs beats a sentence that must be remembered.

## Route first

- No transcript or record of the task exists: there is no evidence to reflect on; say so and stop.
- The lesson is a brand-new behavior with no existing skill or instruction to fix: `write-a-skill`, starting from this failure as the baseline case.
- The lesson is about the repository's code rather than the agent's process: file it as an issue or fix; this skill owns agent behavior.

## Collect the evidence

Read the task record (transcript, decision log, execution state, commits) and list every event of these kinds, each with a pointer (turn, timestamp, or commit):

- **Correction:** the user or a check contradicted what the agent did or claimed.
- **Rework:** the agent undid or redid its own work.
- **Missed trigger:** a skill or tool that should have loaded did not, or loaded late.
- **Wrong tool:** the agent did by hand what a script, codemod, or existing helper does.
- **Stall:** repeated attempts with no new evidence.

For each event, name the skill, instruction, rule, or tool that was in play when it happened. If nothing was in play, the event belongs to the trigger category: something should have loaded.

## Diagnose each event

Ask, for each event, which of these is true, and write down the evidence:

1. The instruction existed and the agent did not load it: **trigger** failure. Fix the description of the skill that should have loaded.
2. The instruction was loaded and the agent did not follow it: **instruction** failure. Find the exact sentence the agent missed or worked around. The fix is to that sentence, or to replace it with a check.
3. The instruction was followed and the outcome was still wrong: **content** failure. The instruction is wrong for this case; change it or narrow its trigger.
4. No instruction could reasonably have prevented it and a tool could: **tooling** gap. Write the script, lint, test, or hook.
5. The failure was a one-off caused by missing context or a broken fixture: **no change**. Record it and move on.

Adding text to a skill the agent never opened during the task changes nothing about the next run; route those events to a trigger fix or a tooling fix.

## Choose the change

Prefer, in order:

1. An executable check (lint rule, test, type, pre-commit hook, CI step, validator) that fails when the mistake recurs.
2. A script or codemod that replaces the by-hand step.
3. A trigger-description change to the skill that should have loaded, with a new near-miss or positive phrase taken from the actual request.
4. A one-sentence edit to an existing instruction at the point the decision is made.
5. A new repository instruction (AGENTS.md or equivalent) only for a rule specific to this repository.

Cap the output: at most three changes per task. More than three means either the task record is being over-read or the underlying problem is one structural gap that the three should be collapsed into.

## Make and verify the change

- For a skill edit, apply `write-a-skill`: the event you found is the baseline case; record it as such. Run the collection's validator.
- For a description change, write the request that failed to trigger as a positive case and one near miss, and check that the new description would select the first and not the second.
- For a check or script, run it against the recorded failure and confirm it fails or fires, then confirm it passes on the corrected state.
- For a repository instruction, confirm no existing instruction already covers it; if one does, the failure was a trigger or instruction failure, not a missing rule.

Wait for the user's approval before committing changes to shared skills or repository instructions. Show each proposed change as a diff with the event it addresses.

## Stop signals

- You are proposing a change to a skill that was not loaded during the task: reroute to trigger or tooling.
- The proposed change is a paragraph of guidance: find the one sentence, or build the check.
- You have more than three changes: collapse or drop.
- You are writing "be more careful" or "always verify" in any form: replace with the specific check.

## Shortcuts that fail

- "Add a warning to the skill": warnings accumulate and get skimmed; the agent that skipped the instruction will skip the warning.
- "Reflect from memory of the session": memory keeps the story and drops the moment the instruction was missed. Read the record.
- "Every mistake gets a rule": rules that fire on one incident bloat the instruction set and dilute the ones that matter.
- "Skip verification for a text change": an unverified description change can stop the skill from triggering on the cases that worked.

## Report

For each event kept: pointer, category, the instruction or tool in play, the chosen change with its diff or file, and how it was verified against the recorded failure. Then the events dropped and why. If no change is warranted, write "No durable change warranted" with the events considered.

## Critical failures

- A change to a skill or instruction that was not in play during the task, presented as preventing the failure.
- An event with no pointer into the task record.
- More than three changes without collapsing them.
- A check or script delivered without running it against the recorded failure.
- Shared skills or repository instructions modified without the user's approval.
