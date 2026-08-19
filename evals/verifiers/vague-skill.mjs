#!/usr/bin/env node

import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const workspace = process.argv[2];
const skillPath = join(workspace, "skills", "safe-migrations", "SKILL.md");
const casesPath = join(workspace, "evals", "cases.json");
const skill = await readFile(skillPath, "utf8");
const cases = JSON.parse(await readFile(casesPath, "utf8"));
const failures = [];

for (const phrase of [
  "transaction",
  "lock",
  "rollback",
  "backup",
  "dry run",
]) {
  if (!skill.toLowerCase().includes(phrase)) failures.push(`missing ${phrase}`);
}

for (const phrase of [
  "powerful",
  "comprehensive",
  "robust",
  "seamless",
  "elite",
  "best practices",
  "high-quality",
]) {
  if (skill.toLowerCase().includes(phrase)) failures.push(`vague claim remains: ${phrase}`);
}

const unsupportedReadinessClaims = skill
  .split("\n")
  .filter((line) => /production-ready/i.test(line))
  .filter((line) => !/(do not|never|not|avoid|reject|remove|without)\b.*production-ready/i.test(line));
if (unsupportedReadinessClaims.length) failures.push("unsupported production-ready claim remains");

if (skill.includes("\u2014")) failures.push("em dash remains");
if (!/description:.*Use when/i.test(skill)) failures.push("description lacks a use condition");
if (!/(do not|never) (execute|run|apply)/i.test(skill)) failures.push("missing execution boundary");
if (!skill.toLowerCase().includes("credentials")) failures.push("missing credential boundary");

if (!Array.isArray(cases) || cases.length < 4) failures.push("fewer than four trigger cases");
const positives = cases.filter((item) => item?.should_trigger === true);
const negatives = cases.filter((item) => item?.should_trigger === false);
if (positives.length < 2) failures.push("fewer than two positive trigger cases");
if (negatives.length < 2) failures.push("fewer than two negative trigger cases");
if (cases.some((item) => typeof item?.prompt !== "string" || !item.prompt.trim())) failures.push("case missing prompt");

const skillEntries = await readdir(join(workspace, "skills", "safe-migrations"));
const unexpected = skillEntries.filter((entry) => !new Set(["SKILL.md"]).has(entry));
if (unexpected.length) failures.push(`unnecessary skill files: ${unexpected.join(", ")}`);

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS revised skill has concrete gates, boundaries, trigger cases, and no extra machinery");
