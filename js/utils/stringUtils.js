export function isValidInput(input) {
  return /^[a-z0-9_-]+$/.test(input);
}

export function toCamelCase(str) {
  return String(str)
    .replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
    .replace(/^(.)/, (_, c) => c.toLowerCase());
}