---
name: prove-the-blast-radius
description: Find what a change could break outside its diff and prove the one or two facts its safety depends on by running code or inspecting a real artifact, not from a caller list. Use when a change touches a shared function, type, schema, serialized value, cache, config key, or default, or the user asks what could this break or is this safe. Do not use as a general review; use review-the-diff.
---

# Prove the blast radius

Name the contract that changed, find every consumer that depends on the old behavior including the ones text search misses, rank the plausible breakage, then identify the hinge facts and prove them by running something. Report each fact with the level of evidence you reached.

## Route first

- The user wants the whole change reviewed: `review-the-diff`; call this skill for the specific shared contract inside it.
- A consumer must move to a new contract: `replace-an-api`.
- A hinge fact turns out to be a plan assumption for future work: `check-the-premise`.

## Name what changed

State the changed contract precisely: which value, type, default, ordering, timing, side effect, error, persisted shape, or lifecycle transition differs, and for which inputs. "Changed the formatter" is not a contract; "the `status` field is now lowercase for every response" is.

If the diff touches several contracts, list them and handle each.

## Find the consumers

Search from the repository root, then look where search stops:

- direct callers and importers;
- dynamic references: string keys, reflection, dependency injection, route tables, plugin registries, feature flags;
- serialization: anything that persists or transmits the value (database rows, caches, queues, cookies, URLs, logs parsed by tools);
- generated consumers: clients, schemas, typed wrappers built from the contract;
- configuration and infrastructure: environment files, deployment manifests, cron schedules, dashboards, alerts;
- background work: jobs, retries, replays that will read old data with new code or new data with old code;
- external consumers: other repositories, deployed services, mobile clients, partners, and the previous version of this service during a rolling deploy;
- library internals: when the change alters what you pass to a dependency, read the dependency's source at the pinned version, not its documentation.

A search that finds nothing is an answer for repository-internal contracts and not an answer for public or persisted ones; say which kind you have.

## Rank the plausible breakage

For each consumer, write the assumption it makes about the old behavior and how the change violates it. Rank by reach (how many users or systems), consequence (data loss, outage, wrong result, cosmetic), likelihood (does the violating input occur), and observability (would anyone notice). Drop consumers whose assumption the change cannot violate, and say why.

Do not deliver a flat caller list. The output is the ranked set of ways it could break.

## Prove the hinge facts

For the top-ranked risks, identify the one or two facts on which safety depends ("no persisted row contains an uppercase status", "the mobile client ignores unknown fields", "the cache is keyed by version"). Then prove each by the strongest available means, and report which level you reached:

1. **Asserted:** you believe it. Not evidence.
2. **Documented:** a document says so. Weak; documents drift.
3. **Read:** you read the code or schema that makes it true, at the pinned version.
4. **Ran:** you executed a query, test, script, or request and observed the fact.
5. **Ran against the real artifact:** you observed it on production-shaped data, the built package, or the deployed service.

Aim for level 4 or 5 on every hinge fact. A fact stuck at level 1 or 2 is an unresolved exposure; write it as such with the smallest check that would settle it. Do not write it up as safe.

Keep the assessment read-only unless the user asked for fixes. Use disposable scripts and queries; do not modify the repository under review.

## Stop signals

- You have a caller list but no assumption per caller: write the assumptions.
- You are about to write "should be fine": find the hinge fact and prove it.
- The search covered `src/` only: extend to configuration, infrastructure, persisted data, and external consumers.
- A hinge fact depends on a library's behavior: open the library source at the pinned version.
- You are editing code to fix a risk you found: stop; report it unless fixes were requested.

## Shortcuts that fail

- "Grep found three callers, all updated": grep does not find the queue message, the cached value, the cron job, or the other repository.
- "The tests pass": tests exercise the contracts someone wrote tests for; the blast radius is the contracts nobody did.
- "The docs say the client ignores unknown fields": the client's source at its shipped version is the fact; the docs are a claim about it.
- "Old and new deploy together": rolling deploys, queued messages, and cached data mean old code reads new data and new code reads old data.
- "I'll list every caller so nothing is missed": an unranked list transfers the judgment to the reader and hides the one consumer that matters.

## Report

Return: the changed contract(s); consumers found by class, with the assumption each makes; the ranked breakage list with reach, consequence, likelihood, and observability; each hinge fact with the evidence level reached and the command, query, or artifact that established it; unresolved exposures with the smallest check that would settle each; and confirmed breakage, if any, with the failing consumer. If no consumer can be affected, say so and cite the search scope that establishes it. If no fact reached level 4, the first line says the change is not proven safe.

## Critical failures

- Safety asserted from a caller list without hinge facts.
- A hinge fact reported as proven at evidence level 1 or 2.
- Persisted, cached, queued, or external consumers not considered for a changed serialized value.
- The repository under assessment modified during a read-only assessment.
- A flat caller list delivered in place of ranked breakage.
