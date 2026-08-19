export function formatStatus(status) {
  const words = status.replaceAll("_", " ");
  return words[0].toUpperCase() + words.slice(1);
}
