---
name: say-it-clearly
description: Draft, revise, or audit prose by applying the Google Developer Documentation Style Guide and Google Technical Writing guidance. Use for developer documentation, technical explanations, procedures, tutorials, release notes, help content, UI copy, reports, emails, and general answers when the user requests Google style, clearer writing, plain language, or less ChatGPT-like or Claude-like prose. Preserve facts, uncertainty, technical tokens, quotations, and the author's intended voice. Do not impose documentation style on legal text, quotations, fiction, poetry, or required academic conventions.
---

# Write for the reader

## Produce the requested artifact

- For a draft, write the content.
- For a revision, return the revised content. Explain changes only when asked.
- For an audit, report the most important violations with specific corrections. Do not rewrite unless asked.
- For an answer, answer the question in this style without mentioning the skill.

Infer the operation from the request. Ask only when a wrong choice would materially change the result.

## Apply the authority order

Use the following order:

1. Follow the user's explicit instructions and the destination's requirements.
2. Preserve source facts, intent, uncertainty, quotations, citations, and exact technical text.
3. Follow the project's style guide and established terminology.
4. Apply the Google Developer Documentation Style Guide.
5. Use Google Technical Writing guidance to resolve questions about clarity and structure.

Google treats its guidance as guidelines, not rigid rules. Depart from a guideline when doing so makes the content clearer for its actual readers. Stay consistent after making that choice.

## Write for the reader

Identify the reader, their goal, and what they already know. Then apply these rules:

1. Put the key point, result, or task first.
2. Use a conversational, friendly, respectful tone. Sound like a knowledgeable person helping a reader who might be in a hurry.
3. Address the reader as `you`. Use `we` only for an organization with a clear antecedent. Use `user` for a user of software that the reader develops.
4. Use imperative verbs for instructions. The subject `you` is implied.
5. Prefer active voice and name the actor. Use passive voice when the actor is unknown, irrelevant, or intentionally de-emphasized.
6. Use present tense for general behavior. Use future tense only for an action that actually occurs later.
7. Put a condition, circumstance, location, or goal before the instruction it controls when that order improves clarity.
8. Choose strong, specific verbs. Replace vague adjectives and adverbs with facts when the source provides them.
9. Keep one main idea in each sentence and one topic in each paragraph. Make the opening sentence establish the paragraph's point.
10. Use familiar, precise terms consistently. Define necessary unfamiliar terms and abbreviations on first use.

## Keep the meaning intact

- Do not add facts, certainty, praise, urgency, or product claims.
- Preserve distinctions such as `can`, `may`, `might`, `should`, `must`, and `will`.
- Preserve code, commands, flags, identifiers, filenames, paths, API names, product names, version numbers, UI labels, quotations, and links unless the user asks to correct them.
- Flag source ambiguity that you cannot resolve safely.
- Keep accepted technical terms when they are more accurate than an everyday substitute.

## Remove language Google advises against

- Remove pre-announcements such as "This section explains."
- Remove placeholder phrases such as "please note" and "at this time."
- Avoid buzzwords, unnecessary jargon, clichés, idioms, slang, internet abbreviations, pop-culture references, and culture-specific humor.
- Avoid figurative language when literal language states the point.
- Do not describe a task as easy, simple, obvious, quick, or trivial.
- Avoid `let's` in instructions and repeated `please`.
- Avoid excessive exclamation marks, cuteness, wackiness, or sales language in educational content.
- Avoid choppy prose and long-winded sentences. Vary sentence openings and use natural transitions when they help.
- Do not replace these patterns mechanically. Preserve a phrase when it is accurate, necessary, and appropriate for the reader.

## Structure for scanning

- Use sentence case for titles and headings.
- Use numbered lists for sequences and bulleted lists for most unordered items.
- In a procedure, make each optional action a separate numbered step that starts with `Optional:`.
- Use parallel grammar in list items and introduce a list when its purpose is not clear.
- Use a description list or equivalent structure for terms paired with descriptions.
- Use the serial comma.
- Format code-related text as code.
- Format named UI elements in bold, not quotation marks or code font.
- Use descriptive link text instead of generic text such as "click here."
- Use unambiguous dates and times.
- Provide useful alt text for informative images.
- Use US English unless the user or destination requires another variety.

## Load detailed Google guidance when needed

Read `references/google-style.md` before writing or auditing any of the following:

- a procedure or tutorial;
- content that includes code, commands, UI elements, links, lists, tables, images, dates, or accessibility requirements;
- content for a global or translation-sensitive audience;
- a request for Google Style Guide compliance or a line-level audit.

For a specialized question about punctuation, grammar, word choice, naming, units, mathematical notation, HTML, Markdown, filenames, or trademarks, consult the relevant live Google Developer Documentation Style Guide page when the answer is ambiguous or consequential, or when the user requests strict compliance.

## Check the result silently

Before returning the content, verify that:

- the opening gives the reader the key point or task;
- the audience and the meaning of `you` stay consistent;
- actors, actions, conditions, and pronoun referents are clear;
- general behavior uses present tense;
- each sentence carries one main idea;
- headings and lists help the reader scan instead of decorating the response;
- terminology, capitalization, punctuation, and formatting stay consistent;
- a global reader can understand the content without decoding idioms or cultural references;
- every fact, caveat, degree of certainty, and technical token remains intact.

Return only the requested artifact unless the user asks for commentary or an audit trail.
