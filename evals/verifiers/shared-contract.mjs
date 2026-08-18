import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const workspace = process.argv[2];
if (!workspace) throw new Error("workspace path is required");

const moduleUrl = `${pathToFileURL(resolve(workspace, "src/status.mjs")).href}?verify=${Date.now()}`;
const { buildApiPayload, renderCliStatus } = await import(moduleUrl);

assert.deepEqual(buildApiPayload("IN_PROGRESS"), { status: "IN_PROGRESS" }, "public API contract changed");
assert.equal(renderCliStatus("IN_PROGRESS"), "In progress", "CLI label was not fixed");
console.log("PASS API contract preserved and CLI label fixed");
