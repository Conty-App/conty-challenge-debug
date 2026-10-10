export function normalizeKey(key: string): string {
  return key.normalize("NFKC").replace(/[\s\p{Cf}]/gu, "").toLowerCase();
}
