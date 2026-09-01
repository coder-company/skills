---
name: sharpen-requirements
description: Resolve ambiguities whose different readings would change behavior, scope, data, or interfaces, answering from the repository first, then experiment, then asking the user only product decisions in rounds with a recommendation each. Use when the user says grill me, is this spec complete, clarify requirements, or two reasonable readings exist. Do not use when the request is specific enough to implement. Do not use to define completion checks; use define-done.
---

# Sharpen requirements

List only the gaps whose answers would change what gets built, resolve each by the cheapest source (repository, then experiment, then user), and close with the behavior restated in observable terms. Every question to the user carries a recommendation.

## Route first

- The gap is what "done" looks like rather than what to build: `define-done`.
- The gap is a fact you can observe by running something: `prototype-the-question` or `check-the-premise`; do not ask the user.
- The requirement is agreed and needs tasks: `write-a-plan`.
- The request is already specific enough that two implementers would produce the same behavior: implement; do not run this skill.

## Find the consequential gaps

Read the request, the surrounding conversation, existing behavior, related issues, tests, and product copy. For each candidate ambiguity, ask: would implementations under the different readings differ in behavior, scope, data shape, or interface? Keep only those. Unstated details with one reasonable default are not gaps; note the default and continue.

For each kept gap, write:

- the decision that is missing;
- the interpretations the evidence supports (two to four);
- the consequence of each interpretation for the user or the code;
- the evidence that favors one, and your recommended answer.

## Resolve by the cheapest source

In order:

1. **Repository and artifacts:** existing behavior, tests, schema, documentation, history (`git log -S`), configuration. If the answer is there, record it with the pointer and do not ask.
2. **Experiment:** if the answer is an observable behavior, timing, or capability, observe it. The ask is the slow path.
3. **User:** only product intent, priorities, and preferences that no artifact or experiment settles.

## Ask in rounds

Group the remaining questions into a round. A question whose answer depends on another open question waits for the next round. Cap a round at five questions; if more remain, the request is under-specified enough to propose a scope instead and ask for confirmation of the scope.

For each question:

- state the concrete scenario, not an abstract preference ("when a user with two saved cards deletes the default, which card becomes default?");
- list the options as multiple choice where possible;
- mark your recommendation and the evidence for it, so the user can accept it in one word;
- state what you will do if they do not answer (the default you will take, if it is reversible).

Do not begin implementation while two live interpretations would produce incompatible behavior. If every remaining gap has a reversible default, state the defaults and proceed.

## Close the contract

Restate the resolved behavior in observable terms: inputs, outputs, exclusions, error cases, and what stays unchanged. Separate confirmed requirements (with the source) from assumptions you are taking (with the default). Stop when no remaining uncertainty would change the next implementation step.

Do not produce a specification document, ticket set, or questionnaire unless the user asked for that artifact. The closed contract lives in the reply, the task, or the location the repository already uses.

## Stop signals

- You are asking about a detail whose readings produce the same behavior: drop the question.
- You are asking for a fact in the repository: look it up.
- You are asking about a behavior you could observe: prototype it.
- A round has more than five questions: propose a scope instead.
- You are implementing while two incompatible readings are open: stop and resolve.

## Shortcuts that fail

- "Ask everything up front to be safe": a wall of questions stalls the user and mixes decisions they must make with facts you should have found.
- "Pick the reading that's easiest to build": the user reads the result as wrong, and the rework costs more than the question.
- "Ask one question per message for everything": serial questions on independent decisions multiply round trips; batch independent questions, serialize dependent ones.
- "The spec is long, so it's complete": length does not close the two-interpretation test; check each behavior for a second reading.
- "Leave the ambiguity in the code as a flag": a configuration flag for an undecided requirement ships two behaviors and decides neither.

## Report

Give the gaps found with their interpretations and consequences; how each was resolved (repository pointer, experiment result, or user answer); the defaults taken for reversible gaps; the closed contract in observable terms with confirmed items separated from assumptions; and open questions, if any, with your recommendation for each. If no consequential gap existed, say "No consequential ambiguity found" and name the checks you did.

## Critical failures

- A question asked whose answer was available in the repository or by a cheap experiment.
- Implementation started while two incompatible interpretations remained open.
- A question without a recommended answer.
- An ambiguity resolved by choosing the easiest interpretation without evidence or the user's answer.
- A specification or ticket artifact created without being asked.
