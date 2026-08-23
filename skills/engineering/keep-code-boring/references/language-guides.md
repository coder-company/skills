# Language guide index

Use only the guide that matches the task. Follow the repository's formatter, linter, language version, and established conventions before any external guide. Read the matching section in `engineering-practices.md` for semantic and design guidance.

| Language | Guidance and scope | Standard tooling boundary |
|---|---|---|
| C | [SEI CERT C](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard), a secure-coding standard rather than a general style guide | Repository compiler, formatter, warnings, and sanitizers |
| C++ | Cross-industry [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines), organization-specific [Google C++](https://google.github.io/styleguide/cppguide.html) | Configured `clang-format`, `clang-tidy`, compiler, and sanitizers |
| C# | [.NET conventions](https://learn.microsoft.com/en-us/dotnet/csharp/fundamentals/coding-style/coding-conventions) | Configured `.editorconfig`, formatter, analyzers, and nullable policy |
| Go | [Effective Go](https://go.dev/doc/effective_go), [Go review comments](https://go.dev/wiki/CodeReviewComments), [Google Go decisions](https://google.github.io/styleguide/go/decisions) | `gofmt` or `goimports`, `go vet`, configured analyzers |
| Java | Organization-specific [Google Java](https://google.github.io/styleguide/javaguide.html) | Repository formatter, compiler level, and static analysis |
| Kotlin | [Kotlin conventions](https://kotlinlang.org/docs/coding-conventions.html) | Configured IntelliJ, `ktlint`, or Detekt rules |
| Rust | [Rust API Guidelines](https://rust-lang.github.io/api-guidelines/), [Rust style guide](https://doc.rust-lang.org/style-guide/) | `rustfmt`, Clippy, configured MSRV, and safety checks |
| Swift | [Swift API Design Guidelines](https://www.swift.org/documentation/api-design-guidelines/) | SwiftFormat or SwiftLint only when configured |
| Objective-C | [Google Objective-C](https://google.github.io/styleguide/objcguide.html), [Apple modernization guide](https://developer.apple.com/library/archive/releasenotes/ObjectiveC/ModernizationObjC/AdoptingModernObjective-C/AdoptingModernObjective-C.html) | Repository formatter, Clang warnings, and analyzer settings |
| Python | [PEP 8](https://peps.python.org/pep-0008/), [typing best practices](https://typing.python.org/en/latest/reference/best_practices.html) | Configured Ruff, Black, formatter, type checker, and supported versions |
| Ruby | Language reference [Ruby syntax](https://docs.ruby-lang.org/en/master/syntax_rdoc.html), community formatter [Standard Ruby](https://github.com/standardrb/standard) | Repository Standard or RuboCop configuration |
| PHP | PHP-FIG community [PER Coding Style](https://www.php-fig.org/per/coding-style/), language reference [PHP type declarations](https://www.php.net/manual/en/language.types.declarations.php) | Configured PHP-CS-Fixer, PHP_CodeSniffer, PHPStan, or Psalm |
| JavaScript | Organization-specific [Google JavaScript](https://google.github.io/styleguide/jsguide.html), ecosystem reference [MDN JavaScript guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide) | Repository formatter, linter, module system, and runtime targets |
| TypeScript | Organization-specific [Google TypeScript](https://google.github.io/styleguide/tsguide.html), TypeScript project [handbook](https://www.typescriptlang.org/docs/handbook/intro.html) | Repository formatter, linter, compiler options, and generated schemas |
| Dart | [Effective Dart](https://dart.dev/effective-dart) | `dart format`, `dart analyze`, and configured lints |
| Scala | [Scala style guide](https://docs.scala-lang.org/style/) | Configured Scalafmt, Scalafix, compiler, and Scala version |
| Elixir | [Elixir code anti-patterns](https://hexdocs.pm/elixir/code-anti-patterns.html) | `mix format`, compiler warnings, Dialyzer, and configured Credo rules |
| R | Posit ecosystem [Tidyverse style](https://style.tidyverse.org/), not an R Core standard | Repository formatter, `lintr`, package checks, and supported R version |
| Shell | Organization-specific [Google Shell](https://google.github.io/styleguide/shellguide.html), analyzer [ShellCheck](https://www.shellcheck.net/) | Repository shell target, `shfmt`, and ShellCheck configuration |
| HTML and CSS | [Google HTML/CSS](https://google.github.io/styleguide/htmlcssguide.html), [WHATWG HTML](https://html.spec.whatwg.org/) | Repository formatter, linter, browser targets, and design system |
| JSON | [RFC 8259](https://www.rfc-editor.org/rfc/rfc8259), [Google JSON](https://google.github.io/styleguide/jsoncstyleguide.xml) | Schema, generator, serializer, and repository formatter |
| Markdown | [CommonMark](https://spec.commonmark.org/current/), [Google Markdown](https://google.github.io/styleguide/docguide/style.html) | Repository dialect, formatter, and documentation generator |
| SQL | Database dialect documentation and repository schema conventions | Migration framework, query formatter, database version, and plan tooling |

For an unlisted language, follow the discovery order in `engineering-practices.md`. Do not mix conventions across languages. Do not reformat unrelated code solely to match an external guide.
