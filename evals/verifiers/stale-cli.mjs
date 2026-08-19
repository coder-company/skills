#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const workspace = process.argv[2];
const failures = [];
const run = (command, args) => spawnSync(command, args, { cwd: workspace, encoding: "utf8" });

const tests = run("npm", ["test"]);
if (tests.status !== 0) failures.push("source regression test fails");

const distPath = join(workspace, "dist", "format.mjs");
const delivered = await readFile(distPath, "utf8");
const build = run("npm", ["run", "build"]);
if (build.status !== 0) failures.push("build fails");
const rebuilt = await readFile(distPath, "utf8");
if (delivered !== rebuilt) failures.push("delivered dist output was stale relative to source");

const smoke = run("npm", ["run", "smoke"]);
if (smoke.status !== 0) failures.push("CLI smoke test fails");
if (!smoke.stdout.includes("In progress")) failures.push("CLI does not expose the corrected label");

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS source test, reproducible build, and CLI boundary expose the corrected behavior");
