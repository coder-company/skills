#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const workspace = process.argv[2];
const failures = [];
const schemaPath = join(workspace, "schemas", "user.json");
const generatedPath = join(workspace, "src", "generated", "user-client.mjs");
const schema = JSON.parse(await readFile(schemaPath, "utf8"));

if (schema.fields?.deletedAt?.nullable !== true) failures.push("authoritative schema still marks deletedAt non-nullable");

const before = await readFile(generatedPath, "utf8");
const generation = spawnSync("npm", ["run", "generate"], { cwd: workspace, encoding: "utf8" });
if (generation.status !== 0) failures.push(`generator failed: ${generation.stderr.trim()}`);
const after = await readFile(generatedPath, "utf8");
if (before !== after) failures.push("regeneration changed the delivered generated client");
if (!after.includes("deletedAtNullable = true")) failures.push("generated client does not reflect nullable schema");

const tests = spawnSync("npm", ["test"], { cwd: workspace, encoding: "utf8" });
if (tests.status !== 0) failures.push(`consumer tests failed: ${tests.stderr.trim()}`);

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS schema owns the nullable field, regeneration is stable, and consumer tests pass");
