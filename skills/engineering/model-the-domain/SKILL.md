---
name: model-the-domain
description: Define or repair domain concepts, names, invariants, and relationships from real scenarios, and replace scattered conditionals with a structure that owns the rules. Use when one term means several things, the same rule is checked in many places, a switch grows a branch per feature, or a boolean must stay in sync with another field. Do not use for identifier renames or module placement; use design-module-boundaries.
---

# Model the domain

Collect the real scenarios, define each concept by what it includes, excludes, and guarantees, walk the scenarios through the proposed concepts until none needs an unexplained flag, then encode the invariants in the one structure that owns them.

## Route first

- The question is where a module lives or what its interface is: `design-module-boundaries`.
- The concepts are settled and the problem is types allowing invalid combinations: `make-invalid-states-impossible`.
- The task is a rename with no meaning change: make it, or `refactor-without-regressions` when it spans callers. Do not recite the domain checks you skipped. Without the code, show the rename as an illustrative diff and say it is not applied; never report an edit you did not make.

## Collect scenarios, not opinions

Gather:

- representative operations, one per user-facing action;
- edge cases already handled in code (each `if` on a domain value is a scenario);
- persisted values, enum members, status strings, and their producers;
- public contract fields and their documented meaning;
- the words domain owners use in issues, docs, and UI copy;
- tests, which state intended behavior.

## Find the model defects

Each of these signals is a concept problem, not a style problem:

- **Overloaded term:** one name with different rules in different places ("account" meaning customer in billing and login identity in auth).
- **Synonyms:** several names for one concept across modules or between code and UI.
- **Scattered rule:** the same condition checked in more than one place, or a rule enforced by callers rather than by the value.
- **Sync fields:** a boolean or status that must be kept consistent with another field by convention (`isActive` and `deletedAt`).
- **Growing chain:** an `if/else` or `switch` on a domain value that gains a branch with each feature.

Record where each defect lives and which scenarios exercise it.

## Define each concept

For every important term, write:

- **Name:** the word the domain owners use.
- **Includes / excludes:** what it is and the near neighbors it is not.
- **Identity:** what makes two instances the same.
- **Lifecycle:** the states it moves through and the transitions allowed.
- **Invariants:** what must always hold, stated so a test could check it.

Split an overloaded term when its meanings have different rules or lifecycles. Merge synonyms only when they share rules in every scenario; otherwise name the hidden distinction.

Do not rename public language (API fields, persisted values, UI labels) for elegance; if the internal name must differ, record the mapping at the translating boundary.

## Test the model against the scenarios

Walk at least one normal scenario, one boundary case, one invalid input, and one lifecycle transition through the proposed concepts. The model fails a scenario when it needs:

- a flag whose meaning you have to explain in prose;
- two definitions of one term;
- a conditional outside the concept that owns the rule;
- a state that the lifecycle does not allow but the scenario produces.

Fix the model, not the scenario. If a scenario cannot be expressed, decide whether the model is wrong or the scenario is out of scope, and record it.

## Choose the owning structure

Encode each rule once, where it is hard to bypass:

- A set of states with allowed transitions: a state machine or a sum type with a transition function.
- A rule that varies by kind: a table, registry, or polymorphic type keyed by the kind, not a chain of conditionals.
- A value with an invariant: a constructor or parser that rejects invalid values at the boundary (see `make-invalid-states-impossible`).
- Fields that must stay in sync: one field that derives the other, or one state that replaces both.
- A calculation repeated in several places: one function named after the domain rule.

Record definitions in the smallest durable place the repository already uses (glossary, ADR directory, schema comments, type definitions); do not add a documentation system.

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

List the concepts defined (name, includes/excludes, invariants), the defects found with locations, the scenarios walked and whether each passed, the structure chosen for each rule and where it now lives, public names preserved and any boundary mapping, and unresolved language conflicts with the evidence needed to settle each. If the model was already sound, say so in one sentence and list the scenarios that showed it. For a request this skill does not own, do the work and skip this report.

## Critical failures

- A concept renamed or merged without walking the scenarios that distinguish it.
- A persisted value, API field, or UI label changed for internal naming preference.
- A rule still enforced in more than one place after the change.
- A new sync-by-convention field introduced.
- A documentation system or glossary created that the repository did not already have and the user did not ask for.
