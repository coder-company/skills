export function normalizeStatus(value) {
  return value.trim().toUpperCase();
}

function oldInternalLabel(value) {
  return `[${value}]`;
}

export function renderStatus(value) {
  return value.trim();
}
