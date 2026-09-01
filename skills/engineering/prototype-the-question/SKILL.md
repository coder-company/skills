---
name: prototype-the-question
description: Build disposable code or a small experiment to answer one design or behavior question by observation, then discard it. Use when the user asks which approach is better, try both, mock it up, or when you are about to ask a question you could answer by running something. Do not use for production code. Do not use for plan assumptions with downstream dependents; use check-the-premise. Do not use for preference calls; ask the user.
---

# Prototype the question

Write the question and the observation that would answer it, build only the surface needed to make that observation, run it, decide, and delete the prototype. A prototype that outlives its decision is unfinished product code.

## Route first

- The question is a plan assumption with downstream dependents: `check-the-premise` (falsifiable claim, budget, cleanup).
- Several candidate designs should compete against a rubric: `run-parallel-candidates`.
- The question is a fact about a library or standard with an authoritative source: `show-your-sources`.
- The question is a preference or product decision (which wording, which feature to prioritize): ask the user; do not prototype.

## Classify the fork before asking anyone

When you are about to ask "which approach?" or "how should this behave?", classify the question first:

- **Observable:** the answer is a behavior, timing, layout, output, or capability you can see by running something. Prototype it; the ask is the slow path.
- **Documented:** an authoritative source states it. Read the source.
- **Preference:** no experiment distinguishes the options; the user's judgment decides. Ask, with a recommendation and the observations that inform it.

State the classification in one line before proceeding.

## Write the question

One question, written down before building:

- the decision it will change ("choose between streaming and batch for the export");
- the competing outcomes (two to four);
- the observation that distinguishes them ("the streaming variant renders the first row under 500 ms on the 50k-row fixture; batch does not");
- the environment and data the observation depends on.

If you cannot name the observation, you have a discussion, not a prototype.

## Choose disposable fidelity

Build the least that makes the observation possible:

- Include the real boundary the question depends on (the actual library, the real data shape, the real renderer). Faking it invalidates the answer.
- Fake everything else plainly, and label it as fake in the code.
- For UI questions, put variants behind one switcher (a query parameter, a flag) so they are compared under identical conditions; screenshot each under the same viewport and state.
- For logic questions, a single script or test file with a printed result is enough. State the question at the top of the file and print the observed state after each action so the output is the record.
- Keep the prototype outside production paths (a scratch directory, a `prototype/<name>` branch, a temp project) unless isolation would change the answer.

Do not add error handling, configuration, tests, documentation, telemetry, or reusable structure. Do not refactor production code to make room for the prototype.

Set a budget (time or attempts) before starting. When it is spent, report what was observed and stop.

## Observe and decide

Run it. Record the observation exactly (output, screenshot, timing with the conditions). Note environmental limits and authored fixtures.

Decide which outcome the evidence supports, or state that the observation did not distinguish them and what would. Do not let a preferred option survive an observation that went against it.

## Discard

Delete the prototype code, branch, dependencies, and fixtures. Confirm the production diff contains none of it. If the user wants the artifact kept, leave it in the scratch location, marked experimental, with the question and result at the top; never present it as production-ready or migrate it into the product without going through `keep-code-boring`.

## Stop signals

- You are about to ask the user something you could observe: classify, then prototype.
- You are adding polish, error handling, or structure to the prototype: the question is answered or the fidelity is wrong. Stop.
- The prototype fakes the boundary the question is about: rebuild with the real boundary.
- The observation does not distinguish the outcomes: refine the observation, not the prototype.
- You want to keep the prototype "as a starting point": the starting point is the answer, not the code.

## Shortcuts that fail

- "Let's discuss the tradeoffs": an hour of argument about behavior that a ten-minute script would show.
- "Ask the user which they prefer": handing a human a decision they cannot make without the observation you could have produced.
- "The prototype works, ship it": prototype code has no error handling, no tests, and fakes it did not clean up.
- "Compare the variants from memory of two screenshots": different viewport or state makes the comparison invalid; use one switcher.
- "Mock the library to keep it fast": the library's behavior was the question.

## Report

State the classification of the fork, the question with its competing outcomes and distinguishing observation, what was built (surface included, fakes labeled, location), the observation exactly as recorded, the decision it supports, environmental limits, and confirmation that the prototype was deleted (or where it was kept and how it is marked). If the observation did not settle the question, say so and name the next observation.

## Critical failures

- A question asked of the user that the prototype could have answered.
- The boundary under question faked.
- Prototype code, dependencies, or fixtures left in the production diff.
- An observation recorded inaccurately or a decision that contradicts the observation.
- A prototype presented as production-ready.
