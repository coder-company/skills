export function parseToken(value) {
  return { subject: value.split(":")[1] };
}
