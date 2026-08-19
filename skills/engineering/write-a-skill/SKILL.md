---
name: write-a-skill
description: Create, revise, or evaluate an agent skill from observed failures and measurable behavior. Use when a user asks to write a SKILL.md, improve an existing skill, define when a skill should trigger, or test whether a skill changes agent behavior.
---

# Write a skill

## Start with the failure

Describe the behavior the skill must change before writing instructions.

Capture:

1. The task the user is trying to complete.
2. What the agent does without the skill.
3. Why that behavior is wrong or costly.
4. What observable result would be better.
5. What evidence would disprove the proposed skill.

Use a real failure when one is available. Preserve its prompt, relevant context, output, and result. Remove secrets and personal data. If the case is invented, label it as authored rather than presenting it as field evidence.

Never invent a baseline transcript, incident, fixture value, test result, provenance label, or adoption claim. When evidence is missing, write the proposed case and label it as unrun and authored.

Do not begin with a topic such as "a skill for databases." Begin with a failure such as "the agent changes a production schema before checking whether the migration can be rolled back."

## Decide whether a skill is warranted

Create a skill only when the behavior is reusable and the model needs task-specific judgment, procedure, or constraints.

Do not create a skill when:

- one direct answer solves a one-time request;
- repository instructions already own the behavior;
- a formatter, linter, type checker, test, hook, or permission boundary can enforce it more reliably;
- the proposed skill only repeats facts the agent can retrieve from an authoritative source;
- the scope combines unrelated jobs that should trigger independently.

Prefer executable enforcement for deterministic rules. Use the skill to explain when to run the tool, how to interpret its result, and what judgment remains.

## Define the contract

Write down these decisions before drafting `SKILL.md`:

- **Trigger:** What user language, repository state, or task condition should load the skill?
- **Near miss:** What similar request should not load it?
- **Authority:** Which user, repository, safety, or platform rules take precedence?
- **Scope:** What may the agent read, change, create, or publish?
- **Decision points:** Which choices require judgment, and what evidence resolves them?
- **Completion:** What observable result proves the work is done?
- **Failure:** What outcomes must fail an evaluation even if the prose sounds good?

If these boundaries cannot be stated, investigate the task before writing the skill.

## Write frontmatter for selection

Use the Agent Skills format required by the target agent. For the common format, provide at least:

```yaml
---
name: specific-action
description: What the skill does. Use when the user or task presents concrete trigger conditions.
---
```

Choose a short, specific, kebab-case name. Prefer an action or recognizable task. Avoid organization prefixes, vague nouns, and names that collide with common tools unless the skill truly owns that term.

Make the description sufficient for selection without turning it into a compressed copy of the workflow. Include what the skill does and the conditions that should trigger it. Use terms a user is likely to write. Do not add praise, history, implementation trivia, or unsupported claims.

Test the description separately from the body. Include positive prompts, hard negative prompts, and close near misses. A good skill that loads for the wrong tasks is still a bad skill.

## Write instructions as decisions

Put the key action first. Use imperative verbs and present tense. Organize the body around decisions the agent must make, not around an essay about the topic.

For each important instruction:

1. State the condition.
2. State the required action.
3. State the evidence or observable result.
4. State the exception only when a real case requires one.

Use exact commands, paths, schemas, or templates when precision matters. Use judgment criteria when several correct implementations exist. Match strictness to risk: fragile security or data operations need firm gates; exploratory writing or design work needs room for judgment.

Do not rely on words such as `properly`, `carefully`, `robust`, `comprehensive`, `seamless`, `best`, or `high quality` to carry an instruction. Replace them with the behavior that a reviewer or verifier can observe.

Do not use slogans, fake quotations, role-play titles, repeated warnings, or claims such as "state of the art." Do not describe a step as easy, simple, obvious, or quick. Do not mention a style guide in generated comments or user-facing artifacts unless the user asks for attribution.

Do not use em dashes in skill files. Use a colon, parentheses, or a new sentence.

Preserve facts, uncertainty, technical tokens, quotations, and the user's intended voice. Preserve binding words and operators such as `only`, `except`, `unless`, `not`, `MAY`, `MUST`, `AND`, and `OR`. For technical or normative text, prefer the smallest edit that improves clarity. If the source is already clear and the user forbids a meaning change, return it unchanged or make a formatting-only edit. Do not add a prohibition, fallback, verification step, error behavior, or optional expanded version that the source does not state. Do not replace exact terms required by the user or repository with a synonym.

Use plain US English unless the repository or user requires another variety. Use headings and lists only when they help the agent find or execute an instruction.

## Keep the skill small

Put the shortest complete workflow in `SKILL.md`. Remove background that does not change a decision.

Add a reference file only when the agent sometimes needs detailed material that would burden every invocation. Link directly from `SKILL.md`; avoid reference chains. Add a script only when deterministic code is more reliable than prose. Add an asset or template only when the task must reproduce a stable format.

Do not add setup systems, configuration, compatibility layers, telemetry, update checks, persistent state, or helper abstractions unless the skill's present behavior requires them.

Return the smallest artifact the user requested. A request for a description and trigger cases does not authorize a test runner, fixture suite, complete skill body, invented measurements, or publication workflow. Offer a larger artifact only when a concrete next step depends on it.

Treat explicit near misses as part of the contract. Do not relabel an excluded case as a trigger because the skill could still provide useful advice. Route that case to the appropriate task without loading this skill.

## Test behavior before polishing prose

Use an evaluation order that can reveal failure:

1. Record the no-skill baseline on representative prompts.
2. Define assertions and critical failures before finalizing the skill text.
3. Run the skill in a fresh context.
4. Verify deterministic outcomes with code when possible.
5. Use blinded model grading only for judgment that code cannot settle.
6. Add pressure cases based on shortcuts the baseline or candidate attempted.
7. Add negative and near-miss prompts for trigger behavior.
8. Keep some cases held out while revising the skill.
9. Repeat runs when model variance could change the conclusion.
10. Test on each agent or model family the skill claims to support.

Include an equally specific control prompt when you need to distinguish the skill from generic good advice. Record the model, harness, skill version, case version, and verifier result. Separate authored cases from cases taken from real work.

Do not weaken an assertion because the candidate failed it. Change an assertion only when the intended contract was wrong, and record that decision.

## Revise from evidence

For each failed case:

1. Identify the exact instruction the agent missed, misread, or worked around.
2. Decide whether the failure belongs in the trigger, instructions, tool, verifier, or task setup.
3. Make the smallest change that addresses that failure class.
4. Re-run the failed case and nearby regression cases.

Do not add rules for imagined failures. Do not grow the skill when the problem is a broken fixture, unavailable tool, or ambiguous request. If every evaluation confirms the author's expectation, add a case that could falsify the design rather than declaring victory.

## Report evidence honestly

State what was tested, which models and harnesses ran, how many repetitions completed, and which deterministic checks passed. Distinguish model preference from verified behavior.

Do not call a skill proven, production-ready, best, or generally portable from a small authored evaluation set. Name missing evidence, failed runs, unsupported agents, and untested boundaries.

Publish only when the skill meets its predeclared threshold and the repository checks pass. A user request to commit or publish does not turn a failed evaluation into a pass.

## Finish

Before returning or publishing the skill, verify that:

- the name and description select the intended tasks;
- near misses do not trigger it;
- every instruction changes a decision or prevents an observed failure;
- deterministic rules use deterministic enforcement where practical;
- the text contains no vague quality claims or decorative process;
- references, scripts, and assets are necessary and resolve correctly;
- critical failures remain explicit;
- held-out behavior meets the declared threshold;
- reported evidence matches the runs that actually completed;
- the diff contains only the skill, its required metadata, tests, and documentation.

If the proposed behavior does not justify a skill, say so and use the smaller enforcement mechanism.
