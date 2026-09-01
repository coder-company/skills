---
name: model-the-domain
description: Define or repair domain concepts, names, invariants, and relationships from real scenarios, and replace scattered conditionals with a structure that owns the rules. Use when one term means several things, the same rule is checked in many places, a switch grows a branch per feature, or a boolean must stay in sync with another field. Do not use for identifier renames or module placement; use design-module-boundaries.
---

# Model the domain

Collect the real scenarios, define each concept by what it includes, excludes, and guarantees, walk the scenarios through the proposed concepts until none needs an unexplained flag, then encode the invariants in the one structure that owns them.

## Route first

- The question is where a module lives or what its interface is: `design-module-boundaries`.
- The concepts are settled and the problem is types allowing invalid combinations: `make-invalid-states-impossible`.
- The task is a rename with no meaning change: `refactor-without-regressions`.

## Collect scenarios, not opinions

Gather from the repository and the request:

- representative operations (the normal path, one per user-facing action);
- edge cases already handled in code (each `if` on a domain value is a scenario);
- persisted values, enum members, status strings, and their producers;
- public contract fields and their documented meaning;
- the words the users and the domain owners use, from issues, docs, and UI copy;
- tests, which state intended behavior directly.

## Find the model defects

Look for these signals; each is a concept problem, not a code-style problem:

- **Overloaded term:** one name with different rules in different places ("account" meaning customer in billing and login identity in auth).
- **Synonyms:** several names for one concept across modules or between code and UI.
- **Scattered rule:** the same condition checked in more than one place, or a rule enforced by callers rather than by the value.
- **Sync fields:** a boolean or status that must be kept consistent with another field by convention (`isActive` and `deletedAt`).
- **Growing chain:** an `if/else` or `switch` on a domain value that gains a branch with each feature.

For each defect, record where it lives and which scenarios exercise it.

## Define each concept

For every important term, write:

- **Name:** the word the domain owners use. Do not invent an abstraction they would not recognize.
- **Includes / excludes:** what it is and the near neighbors it is not.
- **Identity:** what makes two instances the same.
- **Lifecycle:** the states it moves through and the transitions allowed.
- **Invariants:** what must always hold, stated so a test could check it.

Split an overloaded term when its meanings have different rules or lifecycles. Merge synonyms only when they have the same rules in every scenario; otherwise you have found a hidden distinction, so name it.

Do not rename stable public language (API fields, persisted values, UI labels) for elegance. If the internal name must differ from the public one, record the mapping at the boundary that translates.

## Test the model against the scenarios

Walk at least one normal scenario, one boundary case, one invalid input, and one lifecycle transition through the proposed concepts. The model fails a scenario when it needs:

- a flag whose meaning you have to explain in prose;
- two definitions of one term;
- a conditional outside the concept that owns the rule;
- a state that the lifecycle does not allow but the scenario produces.

Fix the model, not the scenario. If a scenario cannot be expressed, either the model is wrong or the scenario is out of scope; decide which and record it.

## Choose the owning structure

Encode each rule once, in the structure that makes the rule hard to bypass:

- A set of states with allowed transitions: a state machine or a sum type with a transition function.
- A rule that varies by kind: a table, registry, or polymorphic type keyed by the kind, not a chain of conditionals.
- A value with an invariant: a constructor or parser that rejects invalid values at the boundary (see `make-invalid-states-impossible`).
- Fields that must stay in sync: one field that derives the other, or one state that replaces both.
- A calculation repeated in several places: one function named after the domain rule.

Put the invariant at the boundary that owns the value. Update the smallest durable place the repository already uses for definitions (existing glossary, ADR directory, schema comments, type definitions). Do not add a new documentation system.

## Stop signals

- You are proposing a name no domain owner uses: revert to their word or record why a new one is needed.
- The model needs a flag to explain a scenario: the concept is missing a state or a split.
- You are about to rename a persisted value or API field: stop and map at the boundary instead.
- The proposed structure has one branch per feature again: the kind you keyed on is not the domain's kind.

## Shortcuts that fail

- "Rename it and the confusion goes away": a rename does not split two meanings or merge two rules; the conditionals remain.
- "Add a boolean for the new case": the second boolean creates a fourth combination nobody defined; it becomes the next bug.
- "The code is the model": code encodes past decisions and accidents equally; only scenarios show which is which.
- "One big abstraction covers all the kinds": an abstraction the domain owners do not recognize hides the rules instead of naming them.

## Report

List the concepts defined (name, includes/excludes, invariants), the defects found with locations, the scenarios walked and whether each passed, the structure chosen for each rule and where it now lives, public names preserved and any boundary mapping, and unresolved language conflicts with the evidence needed to settle each. If the model was already sound, say so and list the scenarios that showed it.

## Critical failures

- A concept renamed or merged without walking the scenarios that distinguish it.
- A persisted value, API field, or UI label changed for internal naming preference.
- A rule still enforced in more than one place after the change.
- A new sync-by-convention field introduced.
- A documentation system or glossary created that the repository did not already have and the user did not ask for.
