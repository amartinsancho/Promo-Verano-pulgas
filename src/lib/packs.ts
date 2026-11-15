// Reglas de la promo "Verano sin Pulgas": funciones puras (sin DOM) para poder testearlas.

export type Tipo = 'perro' | 'gato';

export type Pack = {
  id: 'liviano' | 'mediano' | 'grande' | 'felino';
  nombre: 'Liviano' | 'Mediano' | 'Grande' | 'Felino';
  especie: Tipo;
  rango: string;
  servicios: string;
  precio: number;
  minutos: number;
};

export const PACKS: readonly Pack[] = [
  {
    id: 'liviano',
    nombre: 'Liviano',
    especie: 'perro',
    rango: 'Perros de hasta 10 kg (inclusive)',
    servicios: 'Baño medicado y pipeta',
    precio: 24000,
    minutos: 40,
  },
  {
    id: 'mediano',
    nombre: 'Mediano',
    especie: 'perro',
    rango: 'Perros de más de 10 kg y hasta 25 kg (inclusive)',
    servicios: 'Baño medicado y pipeta',
    precio: 31000,
    minutos: 50,
  },
  {
    id: 'grande',
    nombre: 'Grande',
    especie: 'perro',
    rango: 'Perros de más de 25 kg',
    servicios: 'Baño medicado y pipeta',
    precio: 39000,
    minutos: 60,
  },
  {
    id: 'felino',
    nombre: 'Felino',
    especie: 'gato',
    rango: 'Gatos, de cualquier peso',
    servicios: 'Pipeta y control de piel',
    precio: 19000,
    minutos: 20,
  },
];

export const STORAGE_KEY = 'kod_vet_cupones';

/** Fin de la promo: 28/02/2027 inclusive, hora Argentina (UTC-3). */
export const PROMO_FIN_ISO = '2027-03-01T00:00:00-03:00';
export const PROMO_FIN_MS = Date.parse(PROMO_FIN_ISO);
export const PROMO_VENCE = '28/02/2027';

export const promoCerrada = (ahoraMs: number) => ahoraMs >= PROMO_FIN_MS;

/** "10", "10,1", "10.1" -> número > 0; cualquier otra cosa -> null. */
export function parsePeso(valor: unknown): number | null {
  let n: number;
  if (typeof valor === 'number') n = valor;
  else if (typeof valor === 'string') {
    const t = valor.trim().replace(',', '.');
    if (!/^(\d+(\.\d+)?|\.\d+)$/.test(t)) return null;
    n = Number(t);
  } else return null;
  return Number.isFinite(n) && n > 0 ? n : null;
}

/**
 * Pack que corresponde a la mascota. Gato: Felino (el peso se ignora). Perro: <=10 Liviano,
 * >10 y <=25 Mediano, >25 Grande. Devuelve null si el tipo no es válido o el peso del perro
 * falta o no es un número mayor a 0.
 */
export function asignarPack(tipo: string | null | undefined, pesoKg?: number | string | null): Pack | null {
  const por = (id: Pack['id']) => PACKS.find((p) => p.id === id) ?? null;
  if (tipo === 'gato') return por('felino');
  if (tipo !== 'perro') return null;
  const peso = parsePeso(pesoKg);
  if (peso === null) return null;
  if (peso <= 10) return por('liviano');
  if (peso <= 25) return por('mediano');
  return por('grande');
}

export const formatPrecio = (n: number) => '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const CONTADOR_KEY = 'kod_vet_contador';

const RE_VER = /^VER-(\d{4,})$/;

/** Código VER-0001, VER-0002… el siguiente al mayor entre `ultimo` y los códigos `existentes` (los viejos CI-… se respetan). */
export function generarCodigo(existentes: Iterable<string>, ultimo = 0): string {
  const usados = new Set(existentes);
  let n = Math.max(0, Math.floor(ultimo) || 0);
  for (const c of usados) {
    const m = RE_VER.exec(c);
    if (m) n = Math.max(n, Number(m[1]));
  }
  let codigo: string;
  do codigo = `VER-${String(++n).padStart(4, '0')}`;
  while (usados.has(codigo));
  return codigo;
}
