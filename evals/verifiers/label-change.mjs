import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const workspace = process.argv[2];
if (!workspace) throw new Error("workspace path is required");

const saveUrl = `${pathToFileURL(resolve(workspace, "src/save-button.mjs")).href}?verify=${Date.now()}`;
const { renderSaveButton } = await import(saveUrl);
assert.equal(renderSaveButton({ onSave: () => {} }).label, "Save draft", "save button label not changed");

const cancel = await readFile(resolve(workspace, "src/cancel-button.mjs"), "utf8");
assert.equal(cancel, `export function renderCancelButton({ onCancel }) {\n  return { tag: "button", label: "Cancel", onClick: onCancel };\n}\n`, "unrelated cancel button changed");

const tests = spawnSync("node", ["--test"], { cwd: workspace, encoding: "utf8" });
assert.equal(tests.status, 0, `tests fail after the change:\n${tests.stdout}\n${tests.stderr}`);

console.log("PASS label changed, tests green, cancel button untouched");
