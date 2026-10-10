// Espaços nas pontas e caracteres de largura zero (U+200B..U+200D, U+2060,
// U+FEFF) não distinguem uma chave: o provedor reenvia a mesma chave com esse ruído.
export function normalizeKey(key: string): string {
  return key.replace(/[​-‍⁠﻿]/g, "").trim().toLowerCase();
}
