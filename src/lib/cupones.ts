import { STORAGE_KEY, type Pack, type Tipo } from '@/lib/packs';

// Registro guardado en localStorage. A propósito no tiene campo de peso.
export type Cupon = {
  codigo: string;
  nombre: string;
  mascota: string;
  tipo: Tipo;
  pack: Pack['nombre'];
  precio: number;
  fecha: string;
  estado: 'Sin usar';
};

export const EVENTO_CUPONES = 'cupones:cambio';

/** El array completo tal como está guardado; [] si falta, no se puede leer o está corrupto. */
export function leerCrudo(): unknown[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Solo los registros que se pueden mostrar, del más nuevo al más viejo. */
export function leerCupones(): Cupon[] {
  const validos = leerCrudo().filter((c): c is Cupon => {
    if (!c || typeof c !== 'object') return false;
    const o = c as Record<string, unknown>;
    return typeof o.codigo === 'string' && typeof o.nombre === 'string' && typeof o.mascota === 'string';
  });
  return validos.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
}

/** Lee lo existente, agrega el nuevo al final y guarda. Devuelve false si el navegador no deja guardar. */
export function agregarCupon(cupon: Cupon): boolean {
  try {
    const lista = leerCrudo();
    lista.push(cupon);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
    window.dispatchEvent(new Event(EVENTO_CUPONES));
    return true;
  } catch {
    return false;
  }
}

export function codigosExistentes(): string[] {
  return leerCrudo().flatMap((c) =>
    c && typeof c === 'object' && typeof (c as { codigo?: unknown }).codigo === 'string'
      ? [(c as { codigo: string }).codigo]
      : [],
  );
}

const zona = 'America/Argentina/Buenos_Aires';

export function formatearFecha(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return (
    new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: zona }).format(d) +
    ', ' +
    new Intl.DateTimeFormat('es-AR', { timeStyle: 'short', timeZone: zona }).format(d) +
    ' hs'
  );
}
