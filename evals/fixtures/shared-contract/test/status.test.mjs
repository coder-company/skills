import assert from "node:assert/strict";
import test from "node:test";
import { buildApiPayload, renderCliStatus } from "../src/status.mjs";

test("the API preserves the serialized enum", () => {
  assert.deepEqual(buildApiPayload("IN_PROGRESS"), { status: "IN_PROGRESS" });
});

test("the CLI presents a readable label", () => {
  assert.equal(renderCliStatus("IN_PROGRESS"), "In progress");
});
