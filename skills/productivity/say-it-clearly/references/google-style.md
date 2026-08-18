# Google developer style reference

Use this reference with `SKILL.md`. It summarizes high-frequency guidance from official Google sources. Consult the linked live page for specialized or disputed cases.

## Procedures

- Introduce a procedure only when the introduction adds context that the heading does not provide.
- Use numbered steps for a sequence. For a single-step procedure, use one sentence in a bulleted list.
- Start each step with an imperative verb when practical.
- Put one action in each step. Combine closely related actions only when separating them would make the procedure harder to follow.
- Put a condition before the instruction when the condition controls whether the instruction applies: "If X, do Y."
- Put the location before the action when the reader needs it to complete the step: "In the Google Cloud console, go to the Monitoring page."
- Put the goal before the action when it helps the reader understand the step: "To create a document, click **New**."
- Make each optional action its own numbered step. Start the step with `Optional:` rather than nesting it in another step or putting `(optional)` at the end.
- State the action before its result or justification.
- For a command step, present information in this order: action, command, placeholder definitions, explanation, output, and result.
- Put a warning immediately before the step that can cause harm. Format it as a standalone notice; don't indent it under the preceding step.

Source: [Procedures](https://developers.google.com/style/procedures) and [Sentence structure](https://developers.google.com/style/sentence-structure).

## Person, voice, and tense

- Address the reader as `you`; use the imperative for instructions.
- Use third person for actions performed by software or by an end user of software that the reader develops.
- Prefer active voice because it identifies the actor. Use passive voice when the object matters more or the actor does not matter.
- Use present tense for general product behavior. Use future tense only when timing is genuinely in the future.
- Avoid hypothetical `would` when a present-tense condition states the behavior accurately.

Sources: [Second person and first person](https://developers.google.com/style/person), [Active voice](https://developers.google.com/style/voice), and [Present tense](https://developers.google.com/style/tense).

## Sentences, paragraphs, and documents

- Choose strong verbs and clear subjects. Rewrite unnecessary `There is` and `There are` openings.
- Keep one main idea in each sentence. Split embedded lists and independent thoughts.
- Remove unnecessary words without removing required context.
- Give each paragraph one topic and establish that topic in its opening sentence.
- Prefer cohesive paragraphs of roughly three to five sentences. Split paragraphs that grow beyond about seven sentences; combine repeated one-sentence paragraphs when they belong together.
- State the document's key points near the beginning.
- Organize information around the reader's needs and expected questions.

Sources: [Clear sentences](https://developers.google.com/tech-writing/one/clear-sentences), [Short sentences](https://developers.google.com/tech-writing/one/short-sentences), [Paragraphs](https://developers.google.com/tech-writing/one/paragraphs), and [Documents](https://developers.google.com/tech-writing/one/documents).

## Lists and tables

- Use a numbered list when sequence matters and a bulleted list when order does not matter.
- Do not use a list for a single item unless it is a one-step procedure.
- Introduce the list with a complete sentence when the heading does not supply enough context.
- Keep items parallel in grammar and logical category.
- Start each list item with a capital letter. Use consistent end punctuation.
- Use a table when readers need to compare multiple properties across items. Keep headers clear and cells concise.

Source: [Lists](https://developers.google.com/style/lists) and [Lists and tables](https://developers.google.com/tech-writing/one/lists-and-tables).

## Code, commands, and UI elements

- Put code, commands, filenames, paths, parameters, and identifiers in code font.
- Preserve exact capitalization and spelling for technical tokens.
- Distinguish placeholders from literal values and explain each placeholder after the command.
- Put visible UI labels in bold. Do not put quotation marks around them.
- Use the exact UI label. Mention the control type only when it helps the reader find or use the control.
- Use established interaction verbs such as `click`, `select`, `enter`, `press`, `go to`, `turn on`, and `turn off`.
- Describe menu sequences consistently and in the order the reader selects them.

Sources: [Text-formatting summary](https://developers.google.com/style/text-formatting) and [UI elements and interaction](https://developers.google.com/style/ui-elements).

## Global, accessible writing

- Use short, unambiguous sentences, active voice, present tense, and consistent terminology.
- Avoid idioms, slang, humor, phrasal verbs when a simpler verb works, and references tied to one culture, region, sport, holiday, or season.
- Avoid long noun strings and misplaced modifiers. Put `only` immediately before the word or phrase it modifies.
- Use diverse example names and unambiguous dates, times, and units.
- Do not convey meaning only through color, position, shape, sound, or an image.
- Write alt text that communicates the purpose of an informative image. Do not repeat nearby text.

Sources: [Write for a global audience](https://developers.google.com/style/translation), [Write accessible documentation](https://developers.google.com/style/accessibility), and [Voice and tone](https://developers.google.com/style/tone).

## Core Google source order

Use the following official sources in order:

1. [About this guide](https://developers.google.com/style/)
2. [Highlights](https://developers.google.com/style/highlights)
3. [Voice and tone](https://developers.google.com/style/tone)
4. The relevant topic page in the [Google Developer Documentation Style Guide](https://developers.google.com/style/)
5. [Google Technical Writing One](https://developers.google.com/tech-writing/one) for clarity and teaching fundamentals

Do not treat third-party style guides as Google guidance. If project-specific guidance conflicts with Google, follow the project guidance and keep the result consistent.
