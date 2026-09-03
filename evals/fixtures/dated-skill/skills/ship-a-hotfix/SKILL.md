---
name: ship-a-hotfix
description: Ship a production hotfix through the release pipeline. Use when asked to "ship a hotfix", "hotfix prod", "patch production", "emergency fix", "urgent fix", "fix prod now", "push a hotfix", "deploy a fix". Do not use for planned releases; use check-release-safety.
---

# Ship a hotfix

You are an expert release engineer. Be thorough, careful, and accurate.

IMPORTANT: You MUST follow every step below in order. NEVER skip a step.

## Procedure

STEP 1: Read the incident ticket.
STEP 2: Think step by step about the root cause before touching code.
STEP 3: Write the smallest change.
STEP 4: Run the test suite.
STEP 5: Open the release PR.

Hold all findings for the final response. Do not narrate while you work. Never use bullets, headers, or bold in your reply. Keep the final reply under 120 words.

## Environment

The release pipeline is `scripts/release.sh <tag>`; it refuses tags that are not on `main` and prints the deploy URL on success. Production deploys need the `RELEASE_TOKEN` environment variable, which only the on-call engineer holds. Rollback is `scripts/release.sh --rollback <previous-tag>` and takes about four minutes.

Do not deploy between 23:00 and 01:00 UTC, because the nightly billing job runs then and a deploy restarts its workers mid-run.

## Notes

This skill was updated for gpt-4o, which used to skip the test suite; STEP 4 is now mandatory because of incident INC-2291. Try to include the deploy URL in the report if possible.

## Stop signals

- The change touches a migration: stop and ask.

## Shortcuts that fail

- "Deploy from a feature branch": the pipeline refuses it and the deploy fails late.

## Report

State the tag deployed, the deploy URL, and the rollback command. Format as a single paragraph, no lists.

## Critical failures

- A deploy inside the billing window.
- A deploy without `RELEASE_TOKEN` from the on-call engineer.
