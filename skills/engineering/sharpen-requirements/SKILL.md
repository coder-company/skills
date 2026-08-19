---
name: sharpen-requirements
description: Resolve consequential ambiguity in a feature, plan, or design before implementation. Use when different reasonable interpretations would change behavior, scope, data, or interfaces. Do not use when the request is already specific enough to implement safely.
---

# Sharpen requirements

## Find the consequential gaps

Read the request, existing behavior, issue history, tests, and product language. List only ambiguities whose answers would change the result. Do not turn every unstated detail into a question.

For each gap, state:

- the decision that is missing;
- the plausible interpretations supported by current evidence;
- the consequence of each interpretation;
- your recommended answer and why.

## Ask answerable questions

Ask the smallest batch that unblocks the next decision. Prefer concrete scenarios over abstract preference questions. Include a recommendation when evidence favors one answer.

Do not ask the user for facts available in the repository or through safe inspection. Do not begin implementation when two live interpretations would produce incompatible behavior. If no remaining interpretation would change behavior and a reversible default is safe, state it and proceed.

## Close the contract

Restate the resolved behavior in observable terms, including important exclusions and error cases. Separate confirmed requirements from assumptions. Stop when remaining uncertainty cannot change the next implementation step.

Do not create a specification, ticket system, or questionnaire unless the user asks for that artifact.
