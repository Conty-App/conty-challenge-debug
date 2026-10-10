export function normalizeKey(key: string): string {
  return key.replace(/[-]/g, "").trim().toLowerCase();
}
