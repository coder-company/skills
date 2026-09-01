---
name: replace-an-api
description: Replace an internal or public API by defining the new contract, migrating every consumer, and removing the old path in the same wave or behind an explicit support window, leaving no dual behavior. Use when renaming, reshaping, or retiring a function, endpoint, command, event, or config key, or the user says deprecate or migrate callers. Do not use when the old path stays supported. Do not use for structure-only changes; use refactor-without-regressions.
---

# Replace an API

Inventory every consumer, define the one new contract, migrate the callers, then prove the old path is gone. An old path kept "for safety" with no known consumer is dual behavior that will diverge.

## Route first

- The change keeps the old contract stable and only moves internals: `refactor-without-regressions`.
- Consumers are in other deployments and the change must roll out in steps: `sequence-migrations` for the ordering; this skill defines the contract and the removal proof.
- The new shape's types allow states the old one forbade or vice versa: `make-invalid-states-impossible` when designing the target.

## Inventory the consumers

Search from the repository root and record every consumer class with locations:

- **Direct:** imports, calls, HTTP clients, CLI invocations, event subscribers.
- **Dynamic:** string-keyed lookups, reflection, dependency injection registrations, plugin manifests, route tables, feature-flag configs.
- **Generated:** clients, SDKs, OpenAPI or protobuf outputs, typed wrappers regenerated from the contract.
- **External:** other repositories, deployed services, mobile clients, partner integrations, scheduled jobs. A search in this repository cannot find these; check API gateways, access logs, package download stats, or ask the owner.
- **Documentation and examples:** READMEs, docs sites, tutorials, fixtures, recorded requests.
- **Tests:** tests that assert the old contract directly.

For each consumer record what it depends on: input shape, output shape, error types, ordering, timing, side effects, version guarantees. Distinguish consumers you can change in this repository from consumers that need a compatibility period.

## Define the one new contract

Write the new contract before touching callers: signature or schema, error behavior, side effects, versioning. Map each consumer to the new contract: what changes at its call site. If a consumer cannot be expressed in the new contract, the contract is incomplete; fix it before migrating.

Choose the path:

- **Single wave** when every consumer is in this repository or deploys with it: migrate all callers and delete the old path in one change. No alias, no deprecation shim.
- **Support window** when external consumers exist: keep both surfaces, backed by one implementation (the old surface adapts to the new one; never two implementations). State the removal condition (date, version, or usage threshold), the usage signal you will watch (metric, log, deprecation header), and the migration instructions for consumers. Record these where the repository tracks such decisions.

Do not keep the old path for hypothetical consumers. If you cannot name a consumer, you cannot name a removal condition.

## Migrate the callers

1. Introduce the new contract with its tests.
2. Change the old implementation to delegate to the new one, so behavior has one source during the migration.
3. Migrate callers in batches sized by risk (see `sequence-migrations` for wide sweeps). Use a codemod or script for mechanical call-site changes and check it in with the change; hand edits across many sites are where regressions hide.
4. Update generated artifacts by regenerating from the contract (see `fix-generated-files`), not by editing the output.
5. Update documentation, examples, and fixtures in the same change.
6. Delete tests that only pinned the old contract's shape; keep and migrate tests that pin behavior.

Run the consumer-level tests after each batch, not only the unit tests of the API itself.

## Prove removal

For a single wave, or at the end of a support window:

- Delete the old declaration, its re-exports, its route or handler registration, its schema entry, and its documentation.
- Search from the repository root for the old name, path, event type, and key, including strings (dynamic lookups) and configuration files.
- Rebuild generated artifacts and confirm the old surface is absent from them.
- Inspect the delivered artifact (the built package's exports, the running service's route list, the published schema) rather than the source alone.
- Run the full consumer test suite.

The replacement is complete when the old contract is unreachable and no known consumer calls it. "Nothing in `src/` references it" is not that proof for a public surface.

## Stop signals

- You are adding a deprecated alias with no named consumer: delete it and migrate the caller instead.
- Two implementations exist behind two surfaces: make one delegate to the other now.
- A caller cannot be mapped to the new contract: the contract is missing a case; stop migrating.
- The search was limited to one package: search from the root and check dynamic references.
- Generated client still exposes the old surface: regenerate; do not hand-edit.

## Shortcuts that fail

- "Keep the old function around in case": an unreferenced old path is untested, diverges from the new one, and becomes the bug nobody can reproduce.
- "Rename and let the compiler find callers": the compiler does not find string-keyed lookups, routes, configuration, or external consumers.
- "Migrate callers by hand, it's only twenty": twenty hand edits contain one mistake; a codemod contains zero or twenty, and the reviewer can read it.
- "Deprecate now, remove someday": without a removal condition and a usage signal, someday is never, and the two surfaces drift.

## Report

List the consumer inventory by class with counts and locations; the new contract; the path chosen (single wave or support window with removal condition, usage signal, and instructions); callers migrated with the codemod or script if used; the removal proof (searches run from root, generated artifacts rebuilt, delivered surface inspected, consumer tests run) with commands and results; and any consumer that still requires the old path with its owner and plan. If the old path remains reachable, say so on the first line.

## Critical failures

- Old path retained with no named consumer and no removal condition.
- Two implementations of one behavior behind two surfaces.
- Removal declared from a search that did not cover dynamic references, generated artifacts, or the delivered surface.
- A consumer left calling the old contract without a stated plan.
- Generated client edited by hand instead of regenerated.
