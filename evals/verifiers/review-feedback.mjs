#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const workspace = process.argv[2];
const failures = [];
const orders = await readFile(join(workspace, "src", "orders.mjs"), "utf8");
const expectedOrders = "export function listOrders(database) {\n  return database.orders.findMany({ include: { user: true } });\n}\n";
if (orders !== expectedOrders) failures.push("orders query changed despite the N+1 claim being disproved");

const tests = spawnSync("npm", ["test"], { cwd: workspace, encoding: "utf8" });
if (tests.status !== 0) failures.push(`review regression tests failed: ${tests.stderr.trim()}`);

const request = await readFile(join(workspace, "src", "request.mjs"), "utf8");
if (!/finally\s*\{/.test(request)) failures.push("request path does not close the connection in a finally block");

if (failures.length) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("PASS confirmed leak is fixed, disproved N+1 code is unchanged, and regression tests pass");
