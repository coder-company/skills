---
name: prototype-the-question
description: Build disposable code or a small experiment to answer one design or feasibility question. Use when observing a behavior is cheaper and more reliable than debating it. Do not use when the requested artifact is production code, an existing test can answer the question directly, or the question is a plan assumption whose failure would invalidate downstream steps; use check-the-premise for that assumption.
---

# Prototype the question

## State the question

Write one question, the competing outcomes, and what observation would distinguish them. A prototype without a decision it can change is unfinished product code.

## Choose disposable fidelity

Include only the surfaces needed to observe the answer. Use realistic data or a real boundary when the question depends on them. Fake everything else plainly. Keep the prototype outside production paths unless isolation would invalidate the result.

Do not add compatibility, polish, generalized APIs, telemetry, migrations, or exhaustive tests. Label authored fixtures and simulated conditions.

## Observe and discard

Run the prototype and record what happened, including uncertainty and environmental limits. Decide which option the evidence supports.

Delete the prototype when the question is answered unless the user asks to keep it. If kept, mark it clearly as experimental and do not present it as production-ready.
