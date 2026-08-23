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

## Apply language-specific engineering practices

Use the section for the language being changed. These practices concern semantics, API design, error handling, ownership, concurrency, and maintainability. Let the repository's formatter and linter own mechanical layout.

### C

- Make ownership, allocation, release, buffer size, and lifetime visible at the call boundary. Pair acquisition with one auditable cleanup path.
- Check bounds, integer conversions, overflow, and object lifetime before performing memory or pointer operations. Do not rely on undefined behavior or implementation accidents.
- Prefer the project's compiler, warning level, sanitizer, and portability policy. Treat a clean build under weaker settings as insufficient evidence for memory safety.

Security guidance: [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard). This is a secure-coding standard, not a general C style guide.

### C++

- Use RAII and automatic storage to bind resource lifetime to object lifetime. Express ownership with values or smart pointers; a raw pointer or reference should normally be non-owning.
- Prefer value semantics, scoped enums, `const`, and standard-library types. Use views such as `std::span` or `std::string_view` only when the referenced lifetime is guaranteed.
- Keep templates, operator overloads, macros, casts, and metaprogramming behind a clear payoff. Preserve exception safety and class invariants across every exit path.

Sources: the cross-industry [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines) and the organization-specific [Google C++ style guide](https://google.github.io/styleguide/cppguide.html).

### C#

- Enable nullable reference analysis where the project supports it. Model absence explicitly rather than spreading defensive null checks through trusted code.
- Dispose resources through `using` or `await using`. Propagate cancellation through asynchronous call chains, and reserve `async void` for event handlers.
- Prefer ordinary language features and concrete types. Add an interface when a real consumer boundary, alternate implementation, or test seam requires it.

Sources: [.NET C# coding conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions), [.NET dispose guidance](https://learn.microsoft.com/en-us/dotnet/standard/garbage-collection/implementing-dispose), and [C# asynchronous programming](https://learn.microsoft.com/en-us/dotnet/csharp/asynchronous-programming/).

### Go

- Make zero values useful when practical. Keep constructors for validation, required dependencies, or non-zero invariants, not as ceremony.
- Return errors for expected failure, add context without discarding the cause, and handle each error once. Do not use panic for ordinary control flow.
- Define small interfaces where they are consumed. Make goroutine ownership, cancellation, channel closure, and completion observable; never start a goroutine without knowing how it stops.

Sources: [Effective Go](https://go.dev/doc/effective_go), [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments), and [Google Go style decisions](https://google.github.io/styleguide/go/decisions).

### Java

- Prefer immutable state and constructors that establish valid objects. Use records when their value semantics and API constraints fit the domain.
- Close resources with try-with-resources. Preserve interrupt status or propagate interruption rather than swallowing it.
- Use exceptions for exceptional outcomes, not branch logic. Keep inheritance shallow; prefer composition unless subtype substitutability is part of the contract.

Sources: the organization-specific [Google Java style guide](https://google.github.io/styleguide/javaguide.html), [Java records](https://dev.java/learn/records/), and Oracle's [try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) tutorial.

### Kotlin

- Prefer immutable `val` state, expression-oriented code, and data or sealed types that encode the real variants. Keep nullable values at the boundary instead of using `!!` inside trusted logic.
- Use scope functions only when their receiver and return behavior remain clear. Avoid nested chains of `let`, `run`, `apply`, `also`, and `with`.
- Preserve structured concurrency: child work belongs to a scope, cancellation propagates, and blocking work does not run on a constrained coroutine dispatcher.

Sources: [Kotlin coding conventions](https://kotlinlang.org/docs/coding-conventions.html), [Kotlin null safety](https://kotlinlang.org/docs/null-safety.html), and [Kotlin coroutines guide](https://kotlinlang.org/docs/coroutines-guide.html).

### Rust

- Let ownership and borrowing express who may retain or mutate data. Do not add clones, reference counting, interior mutability, or unsafe code merely to silence the borrow checker without understanding the ownership need.
- Use `Option` for absence and `Result` for recoverable failure. Add context at abstraction boundaries and reserve panic for violated invariants or unrecoverable programmer errors.
- Keep `unsafe` blocks small. Document the invariant that makes each operation sound, expose a safe interface, and test the boundary with the same care as foreign-function code.

Sources: [The Rust Book, ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html), [The Rust Book, error handling](https://doc.rust-lang.org/book/ch09-00-error-handling.html), and [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/).

### Swift

- Optimize names and argument labels for clarity at the call site. Prefer types and APIs that read as ordinary Swift rather than exposing implementation terminology.
- Prefer value types when identity and shared mutation are not required. Use optionals and exhaustive enums for real state instead of sentinel values and loosely related booleans.
- Make ARC relationships intentional. Break reference cycles with `weak` or `unowned` only when the lifetime guarantee justifies that choice.

Sources: [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/), [Swift language guide, automatic reference counting](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/automaticreferencecounting/), and [Swift language guide, error handling](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/errorhandling/).

### Objective-C

- State nullability, ownership, and generic collection element types in public APIs. Keep ARC reference relationships and block captures explicit.
- Establish object invariants through designated initializers and route convenience initializers through them.
- Follow Cocoa naming and `NSError` conventions so callers can predict behavior. Avoid exposing C-style status flags when the platform has an established object or error pattern.

Sources: [Google Objective-C style guide](https://google.github.io/styleguide/objcguide.html) and [Apple, Adopting Modern Objective-C](https://developer.apple.com/library/archive/releasenotes/ObjectiveC/ModernizationObjC/AdoptingModernObjective-C/AdoptingModernObjective-C.html).

### Python

- Prefer direct, readable control flow and ordinary data structures. Use comprehensions only while the transformation remains easy to read; use a loop when it carries state, branching, or error handling.
- Do not use mutable default arguments. Use context managers for resource lifetime and catch the narrowest exception at the layer that can recover or add context.
- Add type annotations where they clarify public contracts and important domain values. Do not add annotation noise to obvious local code or use `Any` to hide an unresolved type problem.

Sources: [PEP 8](https://peps.python.org/pep-0008/), [Python tutorial, errors and exceptions](https://docs.python.org/3/tutorial/errors.html), and [Python typing best practices](https://typing.python.org/en/latest/reference/best_practices.html).

### Ruby

- Follow the repository's formatter because Ruby has no single language-owner style standard. Prefer small methods, explicit state changes, and ordinary objects over metaprogramming that hides the call path.
- Use blocks and `ensure` to make resource cleanup reliable. Raise and rescue specific exception classes; do not use exceptions as expected branch logic.
- Use dynamic dispatch deliberately. Avoid `method_missing`, monkey patches, and implicit global changes when an explicit method, module, or dependency boundary can express the same behavior.

Sources: [Ruby syntax documentation](https://docs.ruby-lang.org/en/master/syntax_rdoc.html), [Ruby exception documentation](https://docs.ruby-lang.org/en/master/syntax/exceptions_rdoc.html), and [Standard Ruby](https://github.com/standardrb/standard).

### PHP

- Use the project's supported PHP version, `strict_types` policy, and static analyzer. Add scalar, return, property, and union types when they express a real contract.
- Keep request input untrusted until parsed and validated. Use parameterized queries and established framework escaping at output boundaries.
- Throw specific exceptions at the layer that owns failure semantics. Close resources and avoid hidden mutation through globals, superglobals, or service locators inside domain logic.

Sources: the PHP-FIG community's [PER Coding Style](https://www.php-fig.org/per/coding-style/), [PHP type declarations](https://www.php.net/manual/en/language.types.declarations.php), and [PHP exceptions](https://www.php.net/manual/en/language.exceptions.php).

### JavaScript

- Prefer `const`, lexical scope, modules, and explicit data flow. Use mutation when it is local and clearer than rebuilding a value, not as shared ambient state.
- Use promises and `async` functions consistently. Await or return every meaningful promise, propagate rejection with context, and make cancellation or cleanup explicit where the platform supports it.
- Avoid implicit coercion, sparse arrays, prototype mutation, and clever metaprogramming. Validate values crossing network, storage, DOM, worker, or process boundaries.

Sources: the organization-specific [Google JavaScript style guide](https://google.github.io/styleguide/jsguide.html) and the ecosystem reference [MDN JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide).

### TypeScript

- Enable the repository's strictness settings and treat external data as `unknown` until parsed. Do not use `any`, unchecked assertions, or non-null assertions to suppress a model mismatch.
- Model variants with discriminated unions and exhaustiveness checks. Prefer inference for local implementation details and explicit types at public, serialized, or cross-module boundaries.
- Derive types from the authoritative schema when one exists. Do not maintain hand-written copies that can drift from generated clients, validators, or protocol definitions.

Sources: the organization-specific [Google TypeScript style guide](https://google.github.io/styleguide/tsguide.html), plus the TypeScript project's guidance on [narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) and the [`strict` compiler option](https://www.typescriptlang.org/tsconfig/strict.html).

### Dart

- Use sound null safety and make absence explicit. Prefer `final` for values that are not reassigned and immutable value objects where shared mutation is unnecessary.
- Return `Future` or `Stream` according to the actual asynchronous shape. Await futures that affect correctness and close stream subscriptions owned by the component.
- Avoid `dynamic` when a type parameter, union-like sealed hierarchy, or boundary parser can express the contract.

Sources: [Effective Dart](https://dart.dev/effective-dart), [Dart null safety](https://dart.dev/null-safety), and [Dart asynchronous programming](https://dart.dev/libraries/async/async-await).

### Scala

- Prefer immutable values, pure transformations, and algebraic data types. Keep effects and mutation at named boundaries.
- Avoid `null`, partial pattern matches, and broad implicit conversions. Make contextual parameters discoverable and use exhaustive matches for closed variants.
- Choose collections and concurrency abstractions for their semantics, not terseness. Do not hide expensive traversal or blocking work inside elegant-looking chains.

Sources: [Scala style guide](https://docs.scala-lang.org/style/), [Scala 3 reference, contextual abstractions](https://docs.scala-lang.org/scala3/reference/contextual/), and [Scala collections](https://docs.scala-lang.org/overviews/collections-2.13/overview.html).

### Elixir

- Use pattern matching and explicit tagged results for normal success and failure. Reserve exceptions for exceptional conditions.
- Keep data transformations in functions and use processes for isolation, state ownership, and failure boundaries, not as a default abstraction for every module.
- Design supervision and restart behavior around recoverable state. Do not create atoms from untrusted input or hide sequential bottlenecks behind unnecessary processes.

Sources: [Elixir code anti-patterns](https://hexdocs.pm/elixir/code-anti-patterns.html), [Elixir processes](https://hexdocs.pm/elixir/processes.html), and [Elixir try, catch, and rescue](https://hexdocs.pm/elixir/try-catch-and-rescue.html).

### R

- Prefer explicit inputs and returned values over mutation of global state. Keep data transformations readable as a sequence of named operations.
- Use vectorized operations when they preserve meaning and type behavior. Do not force vectorization when a clear loop is safer or easier to verify.
- Qualify package functions where ambiguity matters, control randomness in tests, and state missing-value behavior explicitly.

Ecosystem sources: the Posit-maintained [Tidyverse style guide](https://style.tidyverse.org/) and [R Packages, code](https://r-pkgs.org/code.html). These are not R Core standards.

### Shell

- Use shell for small orchestration around existing commands. Move complex parsing, data structures, concurrency, or business logic into a language with stronger error and test support.
- Quote expansions, prefer arrays for argument lists, use `local` and `readonly` where supported, and pass filenames as arguments rather than constructing executable strings.
- Handle failures deliberately. Do not assume `set -e` covers every conditional, pipeline, substitution, or subshell. Run ShellCheck and test destructive commands against disposable targets.

Sources: the organization-specific [Google Shell style guide](https://google.github.io/styleguide/shellguide.html), [ShellCheck](https://www.shellcheck.net/), and the GNU [Bash manual, Bourne shell builtins](https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html). Confirm the repository's shell because Bash guidance does not govern every shell.

### HTML and CSS

- Use semantic HTML and native controls before recreating behavior with generic elements. Preserve keyboard access, labels, focus, document structure, and meaningful fallback content.
- Let CSS own presentation. Keep selector specificity low, avoid dependence on incidental DOM depth, and use logical properties when directionality matters.
- Treat accessibility and responsive behavior as functional contracts. Validate rendered states, not only markup or a single screenshot.

Sources: [Google HTML/CSS style guide](https://google.github.io/styleguide/htmlcssguide.html), [WHATWG HTML standard](https://html.spec.whatwg.org/), and [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/).

### JSON

- Treat JSON as a serialization format, not an extensible programming language. Do not add comments, trailing commas, non-finite numbers, or duplicate keys when interoperability matters.
- Define field meaning, required and optional states, versioning, and unknown-field behavior in a schema or contract. Keep producers and consumers compatible across rollout order.
- Account for number precision and Unicode handling across runtimes. Use strings for identifiers or integers that a consumer cannot represent exactly.

Sources: [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259) and [Google JSON style guide](https://google.github.io/styleguide/jsoncstyleguide.xml).

### Markdown

- Follow the repository's Markdown dialect and formatter. Use a consistent heading hierarchy, language-tagged code fences, descriptive links, and real lists instead of visual indentation.
- Keep examples executable and technical tokens exact. Do not wrap or reflow content when doing so changes commands, tables, generated sections, or embedded formats.
- Prefer ordinary Markdown over raw HTML unless the target renderer requires HTML for a supported feature.

Sources: [CommonMark specification](https://spec.commonmark.org/current/) and [Google Markdown style guide](https://google.github.io/styleguide/docguide/style.html).

### SQL

- Follow the database dialect, schema conventions, migration framework, and query formatter configured by the repository. SQL portability is a requirement only when the system actually targets multiple engines.
- Use parameters for values and allow-list identifiers that must be dynamic. Make transaction, locking, isolation, retry, and failure behavior explicit for multi-statement changes.
- Name selected columns, inspect the query plan for performance claims, and test migrations with representative data and both deployment orders when compatibility matters.

Sources: [PostgreSQL SQL syntax](https://www.postgresql.org/docs/current/sql-syntax.html), [PostgreSQL transaction isolation](https://www.postgresql.org/docs/current/transaction-iso.html), and [OWASP SQL Injection Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html).

### Unlisted languages

Do not borrow conventions from a superficially similar language. Use this order:

1. Read the repository's formatter, linter, compiler, language version, and established code.
2. Find the language maintainer's current style, API, safety, and tooling guidance.
3. Find the dominant ecosystem guide only when the language owner does not publish one, and label that scope accurately.
4. Extract only guidance that changes the current decision. Do not load an entire style guide into a routine edit.
5. State when no authoritative convention exists and follow the repository rather than inventing one.

## Source boundary

Use these sources as engineering guidance, not as attribution text to insert into the user's code or messages. Repository-specific requirements and the actual behavior of the system take precedence.
