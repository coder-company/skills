import assert from "node:assert/strict";
import test from "node:test";
import { renderStatus } from "../src/status.mjs";

test("renders a trimmed status", () => {
  assert.equal(renderStatus(" ready "), "ready");
});
