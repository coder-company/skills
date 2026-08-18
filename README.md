# Make your coding agent less annoying

Coding agents can produce clever code, plausible guesses, shallow reviews, unsupported claims, and prose nobody wants to read.

These skills push back.

Each skill targets one failure mode. Use one, combine several, or change them to fit your team. They do not own your workflow.

## Install

You need Node.js and `npx`. Start the interactive installer:

```sh
npx skills@latest add coder-company/skills
```

The installer asks which skills and coding agents to use. To inspect the collection without installing it, run:

```sh
npx skills@latest add coder-company/skills --list
```

To install one skill for Codex in the current project without prompts, run:

```sh
npx skills@latest add coder-company/skills --skill keep-code-boring --agent codex -y
```

## The skills

### Your agent made the code clever

**[`keep-code-boring`](./skills/engineering/keep-code-boring/SKILL.md)** directs the agent to choose the smallest complete design, follow the repository before an external style guide, and reject abstractions built for imaginary requirements.

It preserves correctness, security, accessibility, and reliability as hard constraints. Boring does not mean careless.

### Your agent jumped to a root cause

**[`find-the-bug`](./skills/engineering/find-the-bug/SKILL.md)** directs the agent to start with the failure, build the tightest useful feedback loop, and separate evidence from inference.

An existing focused test can be the whole feedback loop. An intermittent or production-only failure gets a deeper investigation. A trace is evidence, not a local reproduction.

### Your agent rubber-stamped the diff

**[`review-the-diff`](./skills/engineering/review-the-diff/SKILL.md)** directs the agent to review changes in risk order: correctness, security, data integrity, user impact, tests, and maintainability.

Every finding needs a trigger, a consequence, and a precise location. If there is no actionable problem, the skill says so.

### Your agent invented a confident answer

**[`show-your-sources`](./skills/engineering/show-your-sources/SKILL.md)** directs the agent to answer technical questions from current primary sources and keep facts, inferences, and recommendations distinct.

It answers in the conversation by default. It does not litter the repository with research notes unless the decision belongs there.

### Your agent wrote sludge

**[`say-it-clearly`](./skills/productivity/say-it-clearly/SKILL.md)** directs the agent to write for the reader, preserve the facts, and remove throat-clearing, fake certainty, vague verbs, and decorative structure.

It follows the Google Developer Documentation Style Guide and Google Technical Writing guidance without making every sentence sound institutional.

## Design rules

These skills are small enough to understand and strict where agents commonly fail:

- Evidence before diagnosis.
- Risk before style in code review.
- Repository conventions before personal taste.
- Primary sources before confident claims.
- The reader's task before the writer's performance.

The prompts and expected behaviors used to test each skill live in [`evals/cases.json`](./evals/cases.json). Validate the skill structure, metadata, internal links, and evaluation manifest with:

```sh
node scripts/check-skills.mjs
```

A successful run reports the number of skills and evaluation cases, then exits with status `0`.

## License

[GNU General Public License v3.0](./LICENSE)
