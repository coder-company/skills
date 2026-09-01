---
name: keep-execution-state
description: Maintain an explicit state record (facts with sources, ruled-out paths, active resources, next action) for long multi-step work so decisions come from current facts, not the transcript. Use when a task exceeds about ten tool calls, runs unattended, or you re-read earlier output to remember results. Do not use for short single-boundary changes; use hand-off-work when control leaves this context.
---

# Keep execution state

Define a small state record at the start of the task, update it after every step that changes what you know, and make each next decision by reading the state and the latest observation rather than by re-reading the transcript.

## Route first

- Control is about to move to another context or session: finish this state, then use `hand-off-work`.
- The same failure has recurred and the state shows no new evidence: use `break-the-loop`.
- The task is a diagnosis: `find-the-bug` owns the evidence rules; this skill only owns how you carry them forward.

## Define the schema once

Before the first mutating step, write the state as a fenced block in your working notes (the todo list, a scratch file under the OS temp directory, or the harness's plan artifact). Use these fields; add a field only when a decision in this task needs it:

```yaml
objective: <observable completion condition, one sentence>
facts:          # established by observation, each with its source
  - <fact> (<command | file:line | tool output>)
ruled_out:      # hypotheses or approaches falsified, each with the evidence
  - <hypothesis> (<what showed it false>)
open:           # hypotheses or questions still live
  - <item>
active:         # resources that exist because of this task
  files: [<path>, ...]
  processes_or_resources: [<id or name>, ...]
  cwd: <path>
step: <current step number and name>
next: <the single next action and what result would change the plan>
blockers: [<blocker and the condition that clears it>]
```

The state must be a sufficient summary: a fresh agent given only the task prompt and this block should be able to take the `next` action without reading the transcript. Test this by reading the block as if you had no history.

## Update by patch, not by rewrite

After each step that produces new evidence, changes a resource, or completes a sub-goal:

1. Add new facts with their sources. Move falsified items from `open` to `ruled_out` with the evidence.
2. Remove `active` entries only when you removed the resource. Never drop a key you did not intend to delete; the common failure is rewriting the block from memory and losing earlier facts.
3. Set `step` and `next`.
4. Discard the reasoning that produced the patch. It is not state.

Do not record the same fact twice in different words. Do not record intentions as facts.

## Decide from the state

Before every action that costs more than one tool call:

- Read `ruled_out` first. Do not repeat an action listed there under unchanged conditions.
- Read `next` and confirm the action matches it. If it does not, update `next` first and state why the plan changed.
- Read `active` before creating a resource. Reuse or clean up what exists.

When an observation contradicts a recorded fact (a file is gone, a service moved, a test that passed now fails), treat the observation as authoritative: replace the fact, note the drift under `facts` with its source, and re-derive `next`. Do not spend turns reconciling the old belief.

## Keep the block short

Cap `facts` at what future steps need. When a fact stops mattering (a sub-goal completed and verified), replace the detail with the outcome and its verification command. If the block exceeds about 40 lines, compress: merge related facts, drop resolved `open` items, and keep every `ruled_out` entry that a successor might retry.

## Stop signals

- You scroll back through earlier tool output to remember a result: the state is missing a fact. Record it, then continue from the state.
- You are about to run a command that appears in `ruled_out`: stop and name what changed since, or choose a different action.
- The block has not been updated for five or more tool calls: update it before the next action.
- `next` reads "continue" or "keep going": rewrite it as a concrete action with the result that would change the plan.

## Shortcuts that fail

- "I remember what I found": memory of a transcript degrades as it grows; a fact without a recorded source gets re-verified or, worse, trusted wrongly. Record the source.
- "I'll summarize at the end": a summary written after the fact reconstructs history instead of carrying state; the failed approaches and their evidence are what get lost.
- "Rewriting the block is faster than patching": rewriting from memory drops keys. Patch the existing block.
- "The transcript is the state": distractor output (logs, telemetry, stale results) stays in the transcript and competes with current facts. The block filters it.
- "I'll define the schema when the task gets complicated": by then the early facts and rejected paths are already unrecorded.

## Report

In the final message include the closing state block (objective, facts with sources, ruled_out with evidence, remaining open items, active resources still present, blockers). If nothing was ruled out, write "Ruled out: none." If active resources remain, list each with the cleanup action.

## Critical failures

- Repeating an action recorded as ruled out under unchanged conditions.
- Dropping a previously recorded fact or ruled_out entry without a stated reason.
- Recording an inference or intention as a fact, or a fact without a source.
- Leaving an `active` resource unlisted at the end of the task.
- Continuing to act on a recorded fact after an observation contradicted it.
