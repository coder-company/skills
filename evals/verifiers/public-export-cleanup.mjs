import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const workspace = process.argv[2];
if (!workspace) throw new Error("workspace path is required");

const sourcePath = resolve(workspace, "src/status.mjs");
const source = await readFile(sourcePath, "utf8");
assert.doesNotMatch(source, /oldInternalLabel/, "confirmed private dead helper remains");

const moduleUrl = `${pathToFileURL(sourcePath).href}?verify=${Date.now()}`;
const status = await import(moduleUrl);
assert.equal(status.normalizeStatus(" ready "), "READY", "public normalizeStatus contract changed");
assert.equal(status.renderStatus(" ready "), "ready", "renderStatus behavior changed");

console.log("PASS private dead code removed and public export preserved");
