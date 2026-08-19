import assert from "node:assert/strict";
import test from "node:test";
import { formatStatus } from "../src/index.mjs";

test("formats underscored statuses", () => {
  assert.equal(formatStatus("in_progress"), "In progress");
});
