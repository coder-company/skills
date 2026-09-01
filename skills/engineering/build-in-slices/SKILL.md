---
name: build-in-slices
description: Break a feature spanning several layers into thin end-to-end increments, each producing observable behavior and leaving the repository working. Use when a change touches storage, logic, API, and interface together, or a plan lists layers as tasks. Do not use for a small change crossing one boundary. Do not use to write the plan document; use write-a-plan.
---

# Build in slices

Choose one narrow scenario that passes through every layer the feature needs, build only what that scenario requires, verify it at the user-facing boundary, and repeat with the next scenario. Infrastructure is earned by the slice that uses it.

## Route first

- The tasks need paths, checks, and expected output written down: `write-a-plan`; this skill decides the order and shape of its tasks.
- Each slice's implementation: `watch-the-test-fail` when a cheap test boundary exists, otherwise `keep-code-boring` with `verify-real-behavior` at the end.
- The change is a wide mechanical migration rather than new behavior: `sequence-migrations`.

## Map the layers and the scenarios

List the layers the feature crosses (for example: schema, repository, domain logic, API, client, UI). Then list the concrete scenarios the feature must support, as user or system actions with observable results ("a user with no saved addresses adds one and sees it in the list after reload").

Pick the first slice by these rules, in order:

1. It exercises every layer at least minimally.
2. It is the scenario with the least branching (the default path, one entity, no optional fields).
3. Its result is observable at the outermost boundary the feature has (rendered state, response plus persisted record, CLI output).

Name the check that will prove the slice before building it.

## Build only what the slice needs

For each layer, add the minimum the current scenario requires:

- One column or field, not the full schema you expect later.
- One endpoint or command with the fields this scenario uses.
- The happy-path logic; error handling for the failures this scenario can actually produce.
- Rendering for this scenario's state.

Do not add: variants for future scenarios, generalized extension points, configuration with one value, compatibility shims for callers that do not exist yet, or a full validation layer for fields no slice sends. When later scenarios need them, the slice that needs them adds them.

Temporary scaffolding (a hardcoded value, a stub) is allowed only if the same slice removes it or the next slice has it as its first task. Record any scaffolding left in place.

## Finish each slice before the next

A slice is done when:

- production code, tests, generated artifacts, and required documentation for the scenario are complete;
- the check named up front passes at the outermost boundary;
- the repository builds and the relevant test suites pass;
- the change can be reviewed and merged on its own.

Do not open the next slice while the current one leaves the build red or a test skipped. Do not batch several partial slices into one working state; if slice three is needed for slice two to compile, the slicing is horizontal in disguise.

## Order the remaining slices

After the first slice, order by:

1. Scenarios that resolve the biggest unknown (an integration you have not exercised, a data shape you are unsure of).
2. Scenarios on the critical path for the user.
3. Edge and failure scenarios.

Re-check the ordering after each slice; what you learned may promote or demote the next one.

## Stop signals

- The first deliverable contains a schema, an interface, or a module with no observable behavior: reshape into a scenario.
- A slice's file list touches one layer only: it is a layer task, not a slice, unless the feature is single-layer.
- You are adding a field, variant, or branch no current scenario uses: remove it and note which future scenario would add it.
- Two slices must merge before anything works: collapse them into one narrower slice.
- The check for the slice is a unit test on an inner layer: find the boundary check or state why none exists.

## Shortcuts that fail

- "Build the data model completely first, then everything is easy": nothing observable exists until the last layer, and the model gets rebuilt when the first real scenario contradicts it.
- "Add the fields now so I don't touch the schema twice": untouched fields are guesses; the second migration is cheaper than carrying wrong fields.
- "Stub the API and finish the UI": a stubbed layer hides the integration defects the slice exists to surface.
- "Skip the boundary check on early slices, they're small": early slices are where integration mistakes are cheapest to find and most likely.
- "Turn the slices into tickets first": tracker ceremony is not what the user asked for unless they asked for tickets.

## Report

For each slice: the scenario, the layers touched with files, the boundary check with command and result, and scaffolding left in place (or "none"). Then the remaining scenarios in their current order with the reason for the first one. If the feature turned out to be single-boundary, say so and that slicing was not applied.

## Critical failures

- A first slice with no behavior observable at the feature's outer boundary.
- Speculative fields, variants, or extension points added for scenarios no slice covers.
- Opening a new slice while the previous one leaves the build or tests red.
- Slice completion claimed without the boundary check having run.
- Slices that only work once combined.
