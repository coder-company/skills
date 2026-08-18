---
name: keep-code-boring
description: Implement, fix, or refactor code for clarity, simplicity, correctness, maintainability, and focused scope. Use for coding tasks, bug fixes after the cause is known, architecture choices, dependency decisions, and requests for the simplest solution, smaller diffs, less boilerplate, fewer abstractions, or less over-engineering. Use find-the-bug for diagnosis and review-the-diff for review-only requests. Follow the repository's conventions first, then apply language-specific style guidance and code-health practices. Preserve security, validation, accessibility, reliability, and required behavior; simplicity never justifies removing them.
---

# Build code

## Improve code health

Leave the codebase easier to understand and maintain while fully solving the task. Optimize in this order:

1. Correctness
2. Clarity
3. Simplicity
4. Concision
5. Maintainability
6. Consistency

Do not minimize line count at the expense of any earlier goal.

## Follow the right authority

Use the following order:

1. Follow the user's explicit requirements.
2. Preserve safety, security, privacy, accessibility, data integrity, and externally observable behavior.
3. Follow repository instructions, architecture decisions, tests, and established patterns.
4. Follow the formatter, linter, and language version configured by the repository.
5. Apply the relevant language-specific style guide.
6. Apply the general practices in this skill.

Do not mention the source style guides in code comments, review comments, commit messages, or status updates unless the user asks for attribution.

## Understand before changing

1. Read the task and the code that owns the behavior.
2. Trace callers, data flow, error flow, and tests far enough to find the real change boundary.
3. Reproduce a reported bug or establish a failing check when practical.
4. Identify existing helpers, types, dependencies, and patterns before adding new ones.
5. State an assumption only when it affects the implementation and cannot be verified.

Do not use a small diff as an excuse to patch a symptom. Fix the cause at the narrowest shared boundary that owns it.

## Choose the simplest complete design

Evaluate options in this order:

1. Remove work that the requirement does not need.
2. Reuse a clear repository pattern or helper.
3. Use the language standard library.
4. Use a native platform or framework capability.
5. Use an already-installed dependency when it is the established solution.
6. Add the smallest clear implementation that satisfies the requirement.
7. Add a dependency only when it materially improves correctness, security, interoperability, or maintenance.

Stop when one option fully meets the task. Do not turn this evaluation into a research project for routine changes.

## Avoid speculative complexity

- Do not add an interface for one implementation without a concrete seam that requires it.
- Do not add a factory for one construction path.
- Do not add configuration for a value that has no current variation.
- Do not add extension points, plugin systems, generic frameworks, fallback paths, or compatibility layers for hypothetical needs.
- Do not create a helper that hides a single obvious expression or merely renames a standard operation.
- Do not combine unrelated cleanup with the requested change.
- Do not preserve dead code, commented-out code, or stale documentation.
- Do not compress readable logic into clever expressions.

Add abstraction when it makes a real concept clearer, removes meaningful duplication, enforces an invariant, isolates volatility, or creates a testable boundary. Explain non-obvious complexity in the code or change description.

## Implement a focused change

- Organize the work into self-contained changes, each addressing one concern. Complete all coupled changes required by the task.
- Keep related production code, tests, and documentation together.
- Separate a substantial refactor from a behavior change when combining them would make review harder.
- Use names that communicate purpose without requiring comments.
- Make values, decisions, ownership, and error propagation easy to follow.
- Prefer ordinary control flow over cleverness.
- Handle errors at the layer that can add context or recover. Do not silently discard errors.
- Keep trust-boundary validation, authorization, durability, concurrency safety, accessibility, and observability required by the system.
- Update documentation in the same change when behavior or usage changes.

## Comment and document purpose

- Let clear code explain what happens.
- Use comments for rationale, constraints, invariants, surprising behavior, and decisions that future maintainers might otherwise undo.
- Remove comments that restate the code or no longer match it.
- Document public APIs with their purpose, usage, inputs, outputs, errors, restrictions, and important side effects.
- Put the simplest supported usage first.

## Test behavior

Use the repository's existing test tools and conventions.

- Add or update tests for changed logic and fixed bugs.
- Choose the smallest test level that proves the behavior at its real boundary.
- Make the test fail for the bug or missing behavior before relying on it.
- Test externally visible behavior, edge cases, and failure paths that matter.
- Keep tests deterministic, focused, readable, and independent.
- Avoid mocks when a stable in-process dependency or real boundary is practical.
- Do not add tests for trivial declarations or framework behavior already covered elsewhere.
- Run the relevant formatter, static checks, tests, and a boundary-level smoke test when practical.

## Review code comprehensively

When the user requests a review, inspect:

- design and ownership;
- user-visible behavior and correctness;
- unnecessary complexity and speculative features;
- tests and failure behavior;
- names and comments;
- repository and language style;
- documentation and migration impact.

Prioritize findings that can cause bugs, security problems, data loss, broken contracts, or sustained maintenance cost. Give each finding a location, consequence, and concrete correction. Do not reduce a correctness review to line-count reduction.

After covering correctness and safety, make one explicit pass for high-confidence deletion, reuse, unnecessary dependencies, and abstractions with no current second use. Include those findings when they materially reduce maintenance cost; do not omit them merely because higher-severity issues exist.

## Load detailed guidance when needed

Read `references/engineering-practices.md` for architecture choices, code review, change sizing, tests, comments, documentation, or complexity tradeoffs.

Read `references/language-guides.md` before applying language-specific conventions. Select only the language used by the task. If the repository already specifies a different formatter or style, follow the repository.

## Finish at the real boundary

Before reporting completion, verify that:

- the implementation satisfies every explicit requirement;
- the fix addresses the cause rather than one named symptom;
- the change introduces no speculative API or dependency;
- names and control flow are clear to a maintainer without hidden context;
- errors and important edge cases remain handled;
- tests would fail if the changed behavior regressed;
- documentation matches the implementation;
- relevant checks pass;
- the diff contains only related changes.

Report what changed and what verified it. Mention a deliberately deferred design only when the current requirement does not justify it and the omission matters to the user.
