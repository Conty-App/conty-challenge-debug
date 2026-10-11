// Remove caracteres invisíveis (categoria Cf, ex.: zero-width space) e espaços
// nas pontas, para que um retry com a "mesma" chave caia na mesma entrada.
export function normalizeKey(key: string): string {
  return key.normalize("NFKC").replace(/\p{Cf}/gu, "").trim().toLowerCase();
}