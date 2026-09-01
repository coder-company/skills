---
name: say-it-clearly
description: Draft, revise, or audit prose using Google developer documentation style and technical writing guidance, preserving facts, hedges, technical tokens, quotations, and voice. Use when the user asks for clearer writing, plain language, Google style, less AI-sounding prose, or when producing documentation, procedures, release notes, help content, UI copy, or reports. Do not apply to legal text, quotations, fiction, or poetry. Do not use for a first-person essay; use write-a-personal-essay.
---

# Say it clearly

Produce only the artifact the user named (draft, revision, audit, or answer), put the reader's key point or task first, and keep every fact, hedge, and technical token intact. Do not restyle unrelated answers, code comments, commit messages, or later turns unless asked.

## Route first

- The text is a first-person essay: `write-a-personal-essay`.
- The text is code, not prose: `remove-code-slop`.
- A procedure, tutorial, or content with code, UI elements, links, lists, tables, images, dates, or accessibility needs: read `references/google-style.md` before writing or auditing.

## Produce the requested artifact

- **Draft:** write the content.
- **Revision:** return the revised content. Explain changes only when asked, except to flag an ambiguity you could not resolve or a disclosed change to a fact, hedge, quotation, or technical token.
- **Audit:** report the most important violations with specific corrections; do not rewrite unless asked.
- **Answer:** answer in this style without mentioning the skill.

Infer the operation from the request; ask only when a wrong choice would materially change the result.

## Apply the authority order

1. The user's explicit instructions and the destination's requirements.
2. Source facts, intent, uncertainty, quotations, citations, and exact technical text.
3. The project's style guide and established terminology.
4. Google developer documentation style.
5. Google technical writing guidance for clarity and structure.

Depart from a guideline when doing so makes the content clearer for its actual readers; stay consistent after that choice.

## Write for the reader

Identify the reader, their goal, and what they already know. Then:

1. Put the key point, result, or task first, not an announcement ("You can now", "We are excited to").
2. Use a conversational, respectful tone: a knowledgeable person helping a reader in a hurry.
3. Address the reader as `you`; use `we` only for an organization with a clear antecedent; use `user` for a user of software the reader develops.
4. Use imperative verbs for instructions.
5. Prefer active voice with a named actor; use passive when the actor is unknown, irrelevant, or deliberately de-emphasized.
6. Use present tense for general behavior; future tense only for an action that occurs later.
7. Put the condition or goal before the instruction it controls when that improves clarity.
8. Choose specific verbs; replace vague adjectives and adverbs with facts the source provides.
9. One main idea per sentence; one topic per paragraph, established by its opening sentence.
10. Use familiar, precise terms consistently; define unfamiliar terms and abbreviations on first use.

## Keep the meaning intact

Do not add facts, certainty, praise, urgency, or product claims. Preserve `can`, `may`, `might`, `should`, `must`, and `will` distinctions. Preserve code, commands, flags, identifiers, filenames, paths, API and product names, versions, limits, UI labels, error messages (verbatim), quotations, and links unless asked to correct them. Keep an accepted technical term when it is more accurate than an everyday substitute. Flag source ambiguity you cannot resolve safely.

## Remove what the style advises against

Pre-announcements ("This section explains"); placeholders ("please note", "at this time"); buzzwords, unnecessary jargon, clichés, idioms, slang, internet abbreviations, pop-culture references, culture-specific humor; figurative language where literal states the point; describing a task as easy, simple, obvious, quick, or trivial; `let's` in instructions and repeated `please`; exclamation marks, cuteness, and sales language in educational content; choppy or long-winded sentences. Do not remove these mechanically; keep a phrase that is accurate, necessary, and right for the reader.

## Structure for scanning

Sentence case for headings. Numbered lists for sequences, bullets for unordered items, each optional step its own numbered step starting with `Optional:`. Parallel grammar in lists; introduce a list when its purpose is unclear. Serial comma. Code font for code-related text; bold for named UI elements; descriptive link text; unambiguous dates and times; alt text for informative images. US English unless the destination requires another variety.

## Stop signals

- You changed a hedge word or a technical token: revert it or disclose the change.
- The opening does not give the reader the point or task: move it up.
- You are rewriting a sentence that was already clear: leave it.
- The request was an audit and you are rewriting: list violations instead.

## Shortcuts that fail

- "Tighten it by cutting the qualifiers": the qualifier was the author's uncertainty; removing it states something the author did not claim.
- "Swap in a plainer word": the accepted technical term was precise; the plain word is ambiguous to the expert reader.
- "Apply every rule everywhere": mechanical replacement produces prose that is compliant and wrong for the reader.
- "Restyle the whole reply while I'm here": the user named one artifact; restyling the rest changes text they did not ask you to touch.

## Report

Return only the requested artifact. Put a required ambiguity or meaning-change warning after it, separated from the artifact, and only when it changes the meaning. For an audit, return violations ordered by impact, each with location and correction; if none, write "No style issues found." Do not add commentary the user did not ask for.

## Critical failures

- A fact, hedge, quotation, or technical token changed without disclosure.
- Content added (facts, certainty, praise, claims) that the source did not state.
- Style applied to excluded text (legal, quotations, fiction, poetry, required academic conventions).
- Unrelated text restyled without the user asking.
- An audit answered with a rewrite.
