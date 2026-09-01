import assert from "node:assert/strict";
import test from "node:test";
import { renderSaveButton } from "../src/save-button.mjs";

test("the save button carries its label", () => {
  const button = renderSaveButton({ onSave: () => {} });
  assert.equal(button.label, "Save");
});
