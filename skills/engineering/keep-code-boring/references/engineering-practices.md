# Engineering practices

Use these principles to resolve design, review, and maintenance questions. They summarize official engineering guidance; consult the linked source for details.

## Readable code

For Go, optimize readable code in this order: clarity, simplicity, concision, maintainability, and consistency. Across languages, make purpose and rationale clear. Avoid unnecessary abstraction, hidden value flow, and clever code. When complexity is required, add it deliberately and document why.

Source: [Go style principles](https://google.github.io/styleguide/go/guide).

## Focused changes

Make one self-contained change that addresses one concern. Include related tests. Keep the system working after each change. Separate substantial refactoring from feature or bug-fix work when combining them obscures review. A focused change is conceptually small; line count alone does not determine quality.

Source: [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html).

## Code review

Review design, functionality, complexity, tests, naming, comments, style, and documentation. Consider the whole file and system, not only changed lines. Reject speculative features and complexity that reduce code health. Distinguish required corrections from optional improvements.

Sources: [What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html), [The standard of code review](https://google.github.io/eng-practices/review/reviewer/standard.html), and [How to write code review comments](https://google.github.io/eng-practices/review/reviewer/comments.html).

## Tests

Add appropriate tests in the same change as new or changed logic. Verify that each test fails when the behavior breaks. Keep assertions useful and tests maintainable. Use unit, integration, or end-to-end tests according to the boundary that owns the behavior; do not assume every change needs the same test shape.

Sources: [Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html) and [What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html#tests).

## Names, comments, and documentation

Choose names that communicate purpose. Prefer self-documenting code over comments that restate operations. Use comments to explain rationale, constraints, and non-obvious decisions. Keep API documentation accurate and useful to future callers. Maintain a small set of current documentation, update it with code, and delete stale or duplicate material.

Sources: [Documentation best practices](https://google.github.io/styleguide/docguide/best_practices.html), [C++ comments](https://google.github.io/styleguide/cppguide.html#Comments), and [Go clarity](https://google.github.io/styleguide/go/guide#clarity).

## Change descriptions

Summarize what changed in a short, specific first line. Explain why the change exists, important decisions, and known limitations in the body when needed. Keep the description useful to a future maintainer who cannot see the current conversation.

Source: [Writing good CL descriptions](https://google.github.io/eng-practices/review/developer/cl-descriptions.html).

## Source boundary

Use these sources as engineering guidance, not as attribution text to insert into the user's code or messages. Repository-specific requirements and the actual behavior of the system take precedence.
