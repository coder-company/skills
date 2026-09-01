import assert from "node:assert/strict";
import test from "node:test";
import { renderCancelButton } from "../src/cancel-button.mjs";

test("the cancel button carries its label", () => {
  const button = renderCancelButton({ onCancel: () => {} });
  assert.equal(button.label, "Cancel");
});
