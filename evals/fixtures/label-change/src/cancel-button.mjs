export function renderCancelButton({ onCancel }) {
  return { tag: "button", label: "Cancel", onClick: onCancel };
}
