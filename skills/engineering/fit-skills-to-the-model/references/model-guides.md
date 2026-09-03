# Model guides for fitting skills

Checked 2026-09-04. Both pages change with each release. Fetch them before every audit; when a page disagrees with this file, the page wins and this file gets the correction in the same change.

| Model | Vendor guide | Companion pages |
|---|---|---|
| GPT-6 Astra (`gpt-6-astra`) | https://developers.openai.com/api/docs/guides/latest-model | Same page, sections "Prompting best practices" and "Migration quickstart" |
| Claude Fable 5.1 (`claude-fable-5-1`) | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1 | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices and https://platform.claude.com/docs/en/models/fable-5-1/whats-new-fable-5-1 |

Snippets below are the vendors' published text with typographic dashes and ellipses replaced by ASCII. The vendors report the wording has no effect on the model; keep the meaning, not the glyphs. Where a snippet is addressed to one product surface (system prompt, first user turn, turn-scoped message), that placement is part of the finding.

## Shared signals to grep

Run these over every SKILL.md, reference, and description before reading by eye. A hit is a candidate, not a finding; classify it against provenance first.

| Pattern | Regex | Why both guides flag it |
|---|---|---|
| Pressure language on behavior text | `\b(MUST|NEVER|ALWAYS|CRITICAL|IMPORTANT)\b` (caps) | Both models follow instructions closely; inflated emphasis over-applies and sets an anxious register |
| Hedges on requirements | `\b(try to|if possible|ideally)\b` | Read literally as permission to under-deliver |
| Step choreography for judgment tasks | `^\s*(STEP \d|\d+\.)\s` runs outside fragile operations | Over-prescription lowers output quality on both models |
| Prohibition runs | three or more consecutive lines matching `^- (Do not|Don't|Never|Avoid)` | Only reasoned prohibitions carry signal; the rest anchor toward the failure |
| Anti-narration | `hold (all )?(findings|results)|don't narrate|no interim` | Fable 5.1 already under-narrates; Astra asks and pauses more, and needs the opposite nudge |
| Anti-formatting | `never use (bullets|headers|bold)|no (bullet|header)` | Fable 5.1 under-formats; Astra over-formats and needs a conditional rule, not a ban |
| Numeric caps and cadences | `at most \d+ (words|sentences|bullets)|every \d+ (tool calls|messages)|under \d+ words` | Written against padding models; starve reasoning and get applied where they do not fit |
| Fossils | `gpt-4|o[13]-|claude-3|sonnet 3|opus 4\.[0-5]|no longer|now works|as of 20` | Text that describes a diff against a model the reader never saw |
| Grader vocabulary | `graded|rubric|hidden test` | Describes the scoring apparatus instead of the requirement |
| Trigger enumeration | descriptions whose `Use when` clause lists more than six near-synonyms | Costs every session; generalizes worse than intent categories |

## GPT-6 Astra

Behavior the vendor documents, and the published fix for each.

**Asks before acting.** Astra is "more likely to ask the user a question when additional input could materially change the result." Published fix, system prompt:

> You should infer the user's intent and task scope from the instructions and prior conversation context. Your job is to bias towards action and carry the user's intended task to completion.

> When the user's prompt indicates a request for action, such as 'can you...', 'I want to...', 'help me...' and similar expressions, treat these as instructions to do the work and take action.

> Before asking the user clarifying questions, you should complete the work that is already authorized from context and necessary to make the proposed action concrete and reviewable.

**Sensitive to context, including skills.** Astra is "stronger at general instruction following" but "can be more sensitive to information in context." A skill that says pause, confirm, or stop will be obeyed even when the user asked for the work. Published fix:

> The user's instructions take precedence over guidelines provided in a skill. If explicit user instructions conflict with a skill's instructions, prioritize the user's instructions.

> If a skill causes you to ask for permission or confirmation, pause, leave requested work unfinished, or diverge from the user's intent, name and link to the exact SKILL.md file you read, quote the relevant instruction, and briefly explain how it applies.

For a skill collection this means: any `Stop signals` or `Report` section that reads as "stop and ask" on an interactive request will fire on Astra. Keep stops for destructive, irreversible, or authority-bound actions and make the wording say so.

**Detailed, formatted output by default.** Astra "tends toward detailed, formatted responses." Published fix:

> Default to using clear, concise paragraphs, each developing one main idea. Use lists only when the information is genuinely parallel, sequential, or easier to compare.

> Avoid using slop words or phrases like 'Bottom Line:' in conclusions, 'delve,' 'foster,' 'leverage,' 'it's worth noting,' 'importantly,' 'Question? Answer.' or 'This isn't about X. It's about Y.'

Avoid contrastive framing ("X, not Y") and invented compound labels; state the intended action directly.

**Delegation.** Published fix:

> If at any point you can parallelize work by delegating tasks to another agent, you should do so using collaboration tools if it could save time or improve quality.

> Messages that you send to other agents and your final answer may be read by a human, so ensure they are legible.

**Testing.** Published fix:

> Do not write tests for reversible, low-impact changes that mirror the implementation. Run tests appropriate to the change and complete required checks. Once those pass, broaden or repeat testing only when new changes, failures, or unresolved concerns justify it.

**Request-code notes (outside skill text; report as flags only).** `reasoning.effort` `none` and `minimal` are unsupported; start at `low`. Remove `temperature`, `top_p`, `top_logprobs`, and `logprobs`. Tool calling requires the Responses API. `prompt_cache_retention` becomes `prompt_cache_options.ttl: "30m"`.

## Claude Fable 5.1

Behavior the vendor documents, and the published fix for each. The guide's own ordering is "start with the section that matches what you observe"; do the same, and add nothing for a behavior the collection's cases do not show.

**Effort is the primary control.** Start at `high`, then test `low`, `medium`, `xhigh`, and `max` on your own cases. Level names do not map to the same amount of thinking as on Claude Fable 5. At `low` the model calls search less and answers from memory more. At `xhigh` and `max` it can draft a long deliverable in thinking and again in the reply; run long deliverables at `high` unless a measured gain says otherwise.

**Fewer user-facing updates than Fable 5.** Order of fixes: confirm the harness requests progress notes (`thinking.display: "updates"`, beta); remove anti-narration text written for update-eager older models; only then add a line saying when text is wanted:

> Before you start, say in a line what you're about to do; brief updates while you work help the user follow along. Close with a short recap that stands on its own, what you found, what you did, and what's next, so a reader who only sees the last message has the full picture.

If the product hides tool output, tell the model, as a turn-scoped system message:

> Only you see that command's output; the user's terminal shows at most a few lines of it. If the user needs to read any of it, put it in your reply.

**One tool call per turn in implied loops.** In coding and computer-use loops it may issue independent calls one per turn. Measure the share of multi-call turns first. Placement matters more than wording: append a fresh copy after each tool-result message as a turn-scoped system message (`clear_at: "next_user_message"`, beta) and never delete earlier copies. Keep the word "privately":

> First privately list what you need next; then request every item that doesn't depend on another's result in this one response.

**Less bold, fewer headers and lists.** Remove anti-formatting rules or replace them with a conditional:

> Use lists and bullet points when asked to, or when the content is multifaceted enough that they help with clarity. If the person explicitly requests minimal formatting, always format your responses without bullet points, headers, lists, or bold emphasis, as requested. In conversational, personal, or emotional exchanges, keep to plain prose.

**Denser prose.** Define the anti-pattern, preferably in the first user turn:

> Mannered prose substitutes metaphor and flourish for direct statement. Instead of "a parameter worth varying," the mannered writer produces "a dial worth turning." Instead of "this point still matters," they write "this point earns its keep." The phrases exist to display the writer, not to convey the idea, and readers can tell. That is why mannered prose irritates: it makes the reader work harder so the writer can perform. It is also imprecise. Metaphors drag in connotations the writer did not choose and cannot control. The fix is to say what you mean. When a literal phrase is available, use it.

The short form "Please remove all mannered prose." also works.

**Ends the turn before the work is done, or asks permission for requested work.** Two system-prompt blocks; apply both, or the first alone when context is tight. The opening sentence carries most of the effect; keep it as written. This block also makes the model less likely to ask about ambiguous requests, so pair it with a case that checks that trade-off.

> You are operating autonomously. The user is not watching in real time and cannot answer questions mid-task, so asking 'Want me to...?' or 'Shall I...?' will block the work. For reversible actions that follow from the original request, proceed without asking. Stop only for destructive actions or genuine scope changes the user must decide. Offering follow-ups after the task is done is fine; asking permission before doing the work is not.
>
> Exception: when the user is describing a problem, asking a question, or thinking out loud rather than requesting a change, the deliverable is your assessment. Report your findings and stop. Don't apply a fix until they ask for one.
>
> Before ending your turn, check your last paragraph. If it is a plan, an analysis, a question, a list of next steps, or a promise about work you have not done ('I'll...', 'let me know when...'), do that work now with tool calls. That includes retrying after errors and gathering missing information yourself. Do not stop because the context or session is long. End your turn only when the task is complete or you are blocked on input only the user can provide.
>
> Before running a command that changes system state (such as restarts, deletes, or config edits), check that the evidence actually supports that specific action. A signal that pattern-matches to a known failure may have a different cause.

> The user's request, or the plan they approved, sets the scope, and the scope is the deliverable: don't quietly narrow, widen, or swap it. Read ambiguity the way a careful colleague would: make routine judgment calls yourself, and check in only when different readings would lead to materially different work. If you see a real problem with the task as specified, say so in a sentence or two and keep building under stated assumptions; if the user hears the concern and reaffirms, that is their decision, so deliver the full request.
>
> If a question comes up partway, first do everything that doesn't depend on the answer; then state the assumption you made, or, when going ahead on a wrong guess would be unsafe or would make the work useless, put the question at the end of a turn that also delivers that progress. If one part turns out to be blocked, complete every other part in full and say exactly what you left out and why; the whole task is the deliverable, and scaling it down is the user's call, not yours. A step you have decided on is something to run, not to announce: describing the next step and ending the turn leaves it undone until the user replies.
>
> Keep changes to what the request needs. Something else you notice worth doing, cleanup or documentation the task didn't call for, a change to a file the task didn't require, is a suggestion to make at the end, not a change to make; actions clearly beyond what the ask implies, and risky or destructive ones, still need the user's go-ahead.

**Unrequested fixes and test sprawl.** Published fix, no measured change in task success:

> If, while working or testing, you find a pre-existing bug, a performance concern, or behavior the task doesn't mention, don't fix, optimize or extend it in this change unless the requested behavior cannot work without it; report it as a follow-up in your summary. Where the task is ambiguous, implement the reading its wording and the surrounding code most directly support, state that assumption in your summary, and don't build for the other readings as well. Verify your work however you like; scratch scripts and quick checks need not be kept. Commit tests only where the task asks for them or this repository already keeps tests for this kind of change, sized like the neighboring test files, roughly one focused test per stated behavior, and don't turn scratch checks into additional permanent test files. This is about extras only: implement every behavior the task asks for, completely.

**Whole-file rewrites for small edits.** Append to the system prompt or first user message:

> The number of tokens used to edit files is best minimized, all else being equal. Therefore, when it will not affect the end result, try to surgically edit a file rather than rewrite the entire thing.

**Answers from memory at low effort.** Raise effort for those turns, or:

> When a query centers on a name you do not confidently recognize, or recognize from a fast-moving area like AI models and developer tools where the landscape shifts within months, the name itself is the thing to verify: search before answering, and include the name as the user wrote it in at least one query alongside any reformulations. This holds even when you have some background on it; partial background is exactly what makes an out-of-date answer sound authoritative, so familiarity is not a reason to skip the search.

**Progress claims on long runs.** From the vendor's migration guidance:

> Before reporting progress, audit each claim against a tool result from this session. Only report work you can point to evidence for; if something is not yet verified, say so explicitly. Report outcomes faithfully: if tests fail, say so with the output; if a step was skipped, say that; when something is done and verified, state it plainly without hedging.

**Other documented items.** Quoting retrieved sources (one complete worked example in the system prompt with a rationale line); compaction summaries (tell the model the six things to preserve); safeguard false positives (ask "are there any bugs" rather than "does this compile", give context for uncommon languages, remove base64 from tool output); lead agent keeps working while subagents run; vision gets a crop tool. Consult the page for the exact text when a case shows the behavior.

**Request-code notes (outside skill text; report as flags only).** Thinking is always on; `thinking: {type: "disabled"}` and `budget_tokens` return 400. Forced `tool_choice` `any` and `tool` return 400; use `auto` plus an instruction, `strict: true`, or structured outputs. Keep conversation history append-only; edited earlier turns invalidate thinking blocks for new accounts. Handle `stop_reason: "refusal"`.

## Where the two vendors overlap

Write the collection once. This table gives the neutral wording that serves both models; use a vendor snippet only where its product-specific placement matters.

| Gap both vendors document | Astra published fix | Fable 5.1 published fix | One wording for the collection |
|---|---|---|---|
| Asks or stops before finishing requested work | "bias towards action and carry the user's intended task to completion"; complete authorized work before asking | "You are operating autonomously..." block; "check your last paragraph" | Do the work the request authorizes before asking; stop only for destructive or authority-bound actions; end a turn with results, not a plan |
| Scope creep and extra tests | "Do not write tests for reversible, low-impact changes that mirror the implementation" | "report it as a follow-up in your summary"; tests "sized like the neighboring test files" | Change what the request needs; report adjacent findings instead of fixing them; add tests where the task asks or the repository already keeps them |
| Formatting | prose by default; lists only when parallel | lists when the content is multifaceted; plain prose in conversation | Use lists when items are parallel or compared; prose otherwise; honor an explicit request for minimal formatting |
| Stock phrases | slop-word list; no contrastive framing | "mannered prose" definition | Say what you mean in literal phrases; no stock transitions, no "X, not Y" framing, no invented labels |
| Delegation | delegate when it saves time or improves quality; keep messages legible | delegate independent subtasks and keep working while they run | Delegate independent work when it saves time; write every handoff so a person can read it |
| Final message | "your final answer may be read by a human" | outcome first, complete sentences, no working shorthand | Lead with the outcome; write for a reader who did not see the transcript |

Where the models pull in opposite directions (formatting, narration), the conditional rule is the only wording that fits both. A ban fits neither.

## Updating this file

Record the check date at the top. When a vendor changes a snippet, replace the quoted text and note the change in the commit message. Do not add a snippet the collection has no case for; the skill body says to add fits only where a case or transcript shows the gap.
