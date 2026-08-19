---
name: replace-an-api
description: Replace an internal or public API by migrating its consumers and removing the obsolete path without leaving accidental dual behavior. Use when renaming, reshaping, or retiring a function, endpoint, command, event, or configuration contract. Do not use for additive APIs where the old path remains intentionally supported.
---

# Replace an API

## Inventory the contract

Identify direct, dynamic, generated, external, documented, and test consumers. Record input, output, errors, side effects, ordering, and version guarantees. Distinguish repository-owned callers from consumers that require a staged compatibility period.

## Choose one replacement path

Define the new contract and how each consumer maps to it. If all consumers can move in one change, migrate them and delete the old path in that change. Do not keep a deprecated alias for hypothetical users.

When current external consumers require overlap, define the support window, compatibility behavior, usage signal, migration instructions, and removal condition. Keep one source of behavior behind both surfaces.

## Prove removal

Search declarations, re-exports, dynamic registries, generated artifacts, documentation, examples, fixtures, and configuration. Run consumer-level tests and inspect the delivered package or service surface.

Do not declare replacement complete while the old API remains reachable unintentionally or while known consumers still call it.
