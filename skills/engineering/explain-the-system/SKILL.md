---
name: explain-the-system
description: Explain how a subsystem or flow works from the code itself, as an entry-to-exit trace with file and line pointers, where things live, and what surprises a newcomer. Use when the user asks how does X work, walk me through, where does Y happen, or which module owns Z. Do not use for why it was built this way; use trace-code-history. Do not deliver a walkthrough when the user asked for a change.
---

# Explain the system

Trace the real code path from entry to exit, then explain it in the order a reader needs: what it is for, the concepts it relies on, how a request or event moves through it, where each piece lives, and what will surprise them. Every claim about behavior points to a file and line you read.

## Route first

- The question is "why was it built this way": `trace-code-history`.
- The question is a factual claim about an external library or standard: `show-your-sources`.
- The user wants the explanation as a teaching artifact for a third party: apply `say-it-clearly` to the final text.
- The user asked for a change and the explanation is your own preparation: read, then implement; do not deliver a walkthrough they did not ask for.

## Scope the question

Restate the question as a concrete path: an entry point (HTTP route, CLI command, event, UI action, cron), a trigger input, and the observable outcome. If the user's phrasing covers several paths ("how does auth work"), pick the primary path, say which one you chose, and list the others you are not covering.

Decide the depth by the code's size:

- One module or fewer than roughly ten files: read everything on the path yourself.
- Several modules or a cross-service flow: read the entry and exit yourself, then delegate one bounded read per module (see `dispatch-subagents`) with the return contract "summary plus file:line pointers", and verify at least one pointer per report before using it.

## Trace the path

1. Find the entry point by searching for the route, command, handler registration, or event subscription. Record file:line.
2. Follow calls forward, recording each hop: file:line, the function, what data it receives, what it transforms or decides, and what it emits. Stop at the boundary where the outcome becomes observable (response, write, emitted event, rendered state).
3. At each branch, note the condition and which branch the primary path takes. Name the other branches without tracing them unless they matter to the question.
4. Note state that is read or written outside the call chain: configuration, environment variables, feature flags, caches, database tables, global singletons. These are where explanations go wrong.
5. Find the tests that exercise the path; they are evidence of intended behavior and show how to run it.

Run the path when it is safe and cheap (a test, a local command, a request against a dev server). Observed output beats inference; say which claims you observed and which you read.

Distinguish three evidence levels in your notes and preserve them in the explanation: **observed** (you ran it), **read** (you read the code that does it), **inferred** (you concluded it from names, comments, or patterns without reading the implementation). Do not upgrade inferred to read.

## Write the explanation

Use this structure. Scale each section to the question; a single-module question may need two sentences per section.

1. **Overview:** what the subsystem does and for whom, in two to four sentences. Name the entry and the observable outcome.
2. **Key concepts:** the three to six terms the code uses that a reader must know, each defined in one sentence with the file that defines it. Use the code's own names; do not rename.
3. **How it works:** the path as an ordered list of hops, each with `file:line`, the transformation or decision, and the data shape in and out. Include the branch conditions that matter. Mark any hop you inferred rather than read.
4. **Where things live:** a short map from responsibility to location (routing, validation, business rules, persistence, tests, configuration). Include how to run or exercise the path.
5. **Gotchas:** behavior a newcomer would not expect: hidden state, ordering constraints, implicit defaults, environment-dependent branches, known workarounds, places where the name and the behavior disagree. Each with a pointer. Write "No gotchas found on this path" if that is the case; do not invent them.
6. **Not covered:** the branches and adjacent paths you excluded.

Use the reader's vocabulary and the code's identifiers. Do not include a diagram unless it carries information the list cannot (concurrency or fan-out); if you include one, build it from the hops you recorded, not from an idealized architecture.

## Stop signals

- You are describing a hop you did not open: open it or mark it inferred.
- The explanation has no `file:line` in a section about behavior: add the pointers.
- The path you are tracing is not the one the user asked about: restate the scope and confirm.
- A concept definition contradicts how the code uses the term: report the discrepancy as a gotcha rather than choosing one.

## Shortcuts that fail

- "The README explains it": documentation describes the intended design; the code describes the current one. Read the code and report where they differ.
- "The function names tell me what happens": names lie about side effects, caching, and error handling. Read the bodies on the path.
- "One subagent can read the whole subsystem": a single wide read returns a summary with no verifiable pointers. Bound each read and verify pointers.
- "Diagram first, then explain": a diagram drawn before the trace shows the architecture you expected. Trace first.

## Report

Deliver the six sections above. Every behavioral claim carries a `file:line` pointer and an evidence level where it is not "read". End with the commands you ran (or "No commands run; explanation is from reading") and the scope you excluded.

## Critical failures

- A behavioral claim with no file pointer, or with a pointer that does not contain the claimed behavior.
- An inferred hop presented as read or observed.
- Explaining the intended design from documentation where the code does the opposite, without noting the difference.
- Renaming the code's concepts to your own vocabulary.
- Inventing a gotcha or omitting the "Not covered" list when branches were excluded.
