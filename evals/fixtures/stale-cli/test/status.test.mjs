import assert from "node:assert/strict";
import test from "node:test";
import { formatStatus } from "../src/format.mjs";

test("formats status for people", () => {
  assert.equal(formatStatus("in_progress"), "In progress");
});
