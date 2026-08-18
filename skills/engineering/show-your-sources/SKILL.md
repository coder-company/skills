---
name: show-your-sources
description: Research technical questions, APIs, standards, libraries, products, or architecture decisions using current primary sources and explicit citations. Use when a user asks to investigate, compare, verify, look up, or gather evidence for a technical decision. Answer the question directly by default; create a repository artifact only when the user requests one or the findings must remain with the project.
---

# Research for a decision

## Define the question

Extract the decision, fact, or comparison the user needs. Identify relevant constraints such as version, date, platform, language, deployment environment, budget, or compatibility. Resolve cheap ambiguity from the repository and current context before asking the user.

Use live sources when facts can change, when the user requests verification or links, or when accuracy depends on a current version. State the date or version boundary when it affects the answer.

Cite only a source retrieved during the current investigation. Do not construct a plausible URL or attach a remembered source as though you opened it. If browsing is unavailable, label memory-derived claims as unverified and potentially stale.

## Use the strongest available evidence

Prefer sources in this order:

1. Specifications, standards, and official documentation
2. Maintainer-owned source code, release notes, and issue trackers
3. First-party APIs, datasets, benchmarks, and product pages
4. Original research papers or authoritative institutional guidance
5. Reputable secondary analysis only when primary evidence is unavailable or insufficient

For technical implementation questions, inspect the relevant version's official documentation or source. For comparisons, apply the same criteria and evidence standard to every option. Treat search snippets, generated summaries, and unsourced claims only as leads.

## Investigate proportionally

- For a narrow factual question, confirm it from one authoritative source and answer.
- Treat a choice as consequential when the user will spend meaningful time or money, change a security or data boundary, or depend on compatibility. Use multiple independent or complementary primary sources, including evidence beyond a vendor's own claim.
- For conflicting sources, explain the disagreement and prefer the source that owns the behavior for the relevant version.
- For a repository-specific question, combine external evidence with the actual local code and configuration.

Do not delegate by default. Use parallel work only when independent research tracks materially reduce time or cross-check a high-stakes conclusion.

## Keep claims traceable

Attach a citation near every claim that depends on external evidence. Link to the exact page, section, release, file, or paper when possible. Distinguish:

- confirmed facts;
- conclusions derived from multiple facts;
- recommendations based on the user's constraints;
- unknowns that the available evidence does not resolve.

Quote sparingly. Preserve source meaning, version qualifiers, limitations, and uncertainty.

## Deliver the useful result

Lead with the answer or recommendation. Include only the evidence needed to evaluate it, the meaningful tradeoffs, and the next action when one follows naturally.

When the evidence does not settle the question, lead with that result. Do not force a recommendation from missing, conflicting, or noncommittal sources. State what evidence or experiment would resolve the decision.

Return the findings in the conversation unless the user asks for a file or the repository already requires a durable decision record. If you create an artifact, place it in the repository's established documentation location, name it for the decision, and link it from the relevant source of truth.

Before finishing, verify that every material claim has appropriate support, links resolve to the intended source, comparisons use consistent criteria, and the answer addresses the user's actual decision.
