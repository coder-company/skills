---
name: write-a-skill
description: Create, revise, or evaluate an agent skill from an observed failure, with a description that selects the right tasks and rejects near misses, a body organized as decisions, and cases that could show the skill does nothing. Use when asked to write a SKILL.md, improve a skill, make it trigger on X, or test whether it changes behavior. Do not use to pick the mechanism after a task retro; use capture-the-lesson. Do not write a skill for a rule a linter can enforce.
---

# Write a skill

Start from a failure the skill must prevent, decide whether a skill is the right mechanism, write the contract, then the body as decisions, then cases that could falsify it. Test the description and the body separately; a good body that loads for the wrong tasks is a bad skill.

## Route first

- The input is a finished task with reworks and you have not yet chosen the mechanism: `capture-the-lesson`.
- The rule is deterministic (formatting, forbidden imports, file naming): build the linter, hook, or test; do not write a skill.
- The request is for one artifact only (a description, a set of cases): produce that artifact and stop.

## Start with the failure

Write, before any instruction:

1. The task the user was trying to complete.
2. What the agent did without the skill.
3. Why that was wrong or costly.
4. The observable result that would have been better.
5. What evidence would show the proposed skill does not help.

Use a real failure when one exists, preserving the prompt, context, output, and result with secrets removed. Label an invented case as authored. Never invent a baseline transcript, incident, fixture value, test result, or adoption claim; mark missing evidence unrun.

## Decide whether a skill is warranted

Write a skill only when the behavior recurs and needs task-specific judgment, procedure, or constraints. Do not write one when:

- one direct answer solves the request;
- repository instructions already own the behavior;
- a formatter, linter, type checker, test, hook, or permission boundary enforces it more reliably;
- the content is facts the agent can retrieve from an authoritative source;
- the scope bundles unrelated jobs that should trigger independently.

For deterministic rules, build the tool and let the skill say when to run it and how to read its result.

When a skill is not warranted, say so in one or two sentences, do the direct work if it is small, and stop. Do not propose lint rules, conventions, or workflows the user did not ask for.

## Define the contract

Write these down before drafting:

- **Trigger:** the user phrases, repository states, or task conditions that load the skill. Include three to six literal phrases a user would type.
- **Near misses:** similar requests that must not load it, and which sibling skill owns each.
- **Authority:** which user, repository, safety, or platform rules take precedence.
- **Scope:** what the agent may read, change, create, or publish.
- **Decision points:** the choices that need judgment and the evidence that resolves each.
- **Completion:** the observable result that proves the work done.
- **Critical failures:** outcomes that fail the task even when the prose sounds good, checkable from the output and workspace alone.

If any of these cannot be stated, investigate the task further before writing.

## Write the description for selection

```yaml
---
name: verb-object-in-kebab-case
description: What the skill does. Use when [concrete triggers, including literal user phrases]. Do not use [near misses, naming the sibling skill that owns each].
---
```

The name is a short specific action without organization prefixes or vague nouns. The description states what the skill does, then "Use when" triggers, then "Do not use" near misses: under 500 characters, no angle brackets, no unquoted colon-space, no praise or effectiveness claims.

Test the description on its own with at least three positive prompts, two hard negatives, and two near misses. Fix the description, not the body, when selection is wrong.

## Write the body as decisions

Open with an H1 naming the action and a first paragraph stating the key action. Then:

- a routing section naming the sibling skills to use instead and when;
- procedure sections organized by the decisions the agent makes, each instruction stating the condition, the required action, and the observable result, with an exception only when a real case needs it;
- `## Stop signals`: thoughts or situations that mean return to an earlier step, each with the action;
- `## Shortcuts that fail`: four to eight `"tempting shortcut": why it fails and what to do` items, each tied to a real failure;
- `## Report`: the exact output contract, including the sentence for a null result;
- `## Critical failures`: three to six checkable outcomes.

Use exact commands, paths, schemas, or templates where precision matters, and judgment criteria where several implementations are correct.

Voice: imperative, present tense, plain US English. No persona, slogans, all-caps rules, fake quotations, moralizing, or effectiveness claims. No em or en dashes. Do not let a quality adjective (the collection's validator lists them) carry an instruction; write the observable behavior. Preserve binding words (only, except, unless, not, never, must, may). State each rule once, where the decision happens.

The body loads only on trigger; keep it between 350 and 1000 words (1350 for a broad skill). Move optional detail into a references file linked by its exact relative path. Add a script only when deterministic code beats prose. Do not add setup, configuration, telemetry, or persistent state the present behavior does not need.

## Test behavior before polishing prose

1. Record the no-skill baseline on representative prompts.
2. Write assertions and critical failures before finalizing the text; each must be gradable from the response and workspace.
3. Run the skill in a fresh context. Verify deterministic outcomes with code; use blinded model grading only for judgment code cannot settle.
4. Add a pressure case for each shortcut the baseline or candidate attempted, and negative and near-miss prompts for the trigger.
5. Hold out some cases while revising. Repeat runs when variance could change the conclusion.

Include an equally specific control prompt when you need to separate the skill from generic good advice. Record model, harness, skill version, case version, and verifier result. Never weaken an assertion because the candidate failed it; change it only when the contract was wrong, and record why.

## Revise from evidence

For each failed case: find the exact instruction the agent missed or worked around; decide whether the failure belongs to the trigger, the instructions, a tool, the verifier, or the task setup; make the smallest change for that class; rerun the failed case and its neighbors. Do not add rules for imagined failures. If every case confirms the design, add one that could falsify it.

## Stop signals

- You are writing instructions with no failure recorded: return to the failure.
- The description has no "Do not use" clause or no literal user phrases: fix it before the body.
- An assertion would pass a response that ignored the skill: rewrite the assertion.

## Shortcuts that fail

- "Write the skill, then find failures it prevents": a skill written from a topic contains advice, not decisions, and no case can fail it.
- "The body is good, the description can be generic": generic descriptions load on unrelated tasks and displace the right skill.
- "Add a warning for that case too": warnings accumulate and get skimmed; put the rule where the decision happens or make it a check.
- "The candidate failed the assertion, so soften it": softening hides the failure the skill exists to prevent.

## Report

State the failure the skill addresses (real or authored); the contract; the description with trigger test results; body word count; cases written with their types; evaluation results with model, harness, repetitions, and verifier outcomes, or "unrun" per case; and missing evidence. Do not call a skill proven from a small authored set. If a skill is not warranted, say so in one or two sentences and name the mechanism to use instead; no contract, word count, or evaluation sections.

## Critical failures

- A skill written without a recorded failure it prevents.
- A description without "Use when" triggers or "Do not use" near misses.
- An invented baseline, transcript, fixture value, or test result presented as real.
- An assertion weakened because the candidate failed it.
- Evaluation results reported that did not run, or a skill called proven from authored cases alone.
