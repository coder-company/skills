export function parseSlug(value) {
  return value.trim().replace(/^\/+|\/+$/g, "");
}
