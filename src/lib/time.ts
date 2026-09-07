/** Centralized clock — replaceable in tests. */
export function now(): number {
  return Date.now();
}
