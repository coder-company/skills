---
name: model-the-domain
description: Define or repair domain concepts, names, invariants, and relationships before encoding them in code or documentation. Use when the same business concept has conflicting names, one term hides several meanings, or rules are scattered across conditionals. Do not use for ordinary identifier cleanup.
---

# Model the domain

## Start from real scenarios

Collect representative operations, edge cases, existing terms, persisted values, public contracts, and user language. Treat code as evidence of the current model, not proof that the model is correct.

## Name concepts by meaning

For every important term, define what it includes, what it excludes, its identity, lifecycle, and invariants. Split one overloaded term when its meanings have different rules. Merge synonyms only when they denote the same concept in every relevant context.

Use vocabulary recognizable to people who own the domain. Do not invent grand abstractions or rename stable public language for elegance.

## Test the model

Walk at least one normal scenario, boundary case, invalid state, and lifecycle transition through the proposed concepts. A model fails when it needs unexplained flags, contradictory definitions, or conditionals scattered outside the owning concept.

## Encode only what is established

Put invariants at the boundary that owns them. Update the smallest durable glossary, ADR, schema, type, or documentation location already used by the repository. Do not create `CONTEXT.md` or an architecture system by default.

Report unresolved language conflicts and the evidence needed to settle them.
