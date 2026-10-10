// Espaços nas pontas e caracteres de formatação invisíveis (categoria Unicode Cf:
// U+200B..U+200F, U+2060, U+FEFF, U+00AD...) não distinguem uma chave: o provedor
// reenvia a mesma chave com esse ruído.
export function normalizeKey(key: string): string {
  return key.replace(/\p{Cf}/gu, "").trim().toLowerCase();
}
