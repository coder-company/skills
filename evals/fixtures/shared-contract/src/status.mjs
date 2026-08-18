export function formatStatus(status) {
  return status;
}

export function buildApiPayload(status) {
  return { status: formatStatus(status) };
}

export function renderCliStatus(status) {
  return formatStatus(status);
}
