import { STORAGE_KEY, type Pack, type Tipo } from '@/lib/packs';

// Registro guardado en localStorage. A propósito no tiene campo de peso.
export type Cupon = {
  codigo: string;
  nombre: string;
  correo?: string;
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

const FLAG_DEMO = 'kod_vet_demo';

/** Normaliza para comparar: sin mayúsculas, espacios ni tildes. */
export const clave = (s: string) =>
  s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');

/** ¿Ya hay un cupón con este correo y esta mascota? */
export function existeCupon(correo: string, mascota: string): boolean {
  const c = clave(correo);
  const m = clave(mascota);
  return leerCrudo().some((x) => {
    const o = x as Record<string, unknown>;
    return !!o && typeof o.correo === 'string' && clave(o.correo) === c && typeof o.mascota === 'string' && clave(o.mascota) === m;
  });
}

/** Primera visita: carga tres cupones de ejemplo, una sola vez. */
export function sembrarEjemplos() {
  try {
    if (window.localStorage.getItem(FLAG_DEMO)) return;
    window.localStorage.setItem(FLAG_DEMO, '1');
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const base = { estado: 'Sin usar' as const };
    const ejemplos: Cupon[] = [
      { ...base, codigo: 'CI-K7M2-9QXA', nombre: 'Lucía Fernández', correo: 'lucia.fernandez@ejemplo.com.ar', mascota: 'Tobi', tipo: 'perro', pack: 'Mediano', precio: 31000, fecha: '2026-11-04T14:20:00-03:00' },
      { ...base, codigo: 'CI-P4TZ-H8NW', nombre: 'Martín Gómez', correo: 'martin.gomez@ejemplo.com.ar', mascota: 'Mishi', tipo: 'gato', pack: 'Felino', precio: 19000, fecha: '2026-11-08T10:05:00-03:00' },
      { ...base, codigo: 'CI-R3VD-5LCE', nombre: 'Camila Rossi', correo: 'camila.rossi@ejemplo.com.ar', mascota: 'Bruno', tipo: 'perro', pack: 'Grande', precio: 39000, fecha: '2026-11-11T18:40:00-03:00' },
    ];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ejemplos));
  } catch {
    /* sin almacenamiento: no hay ejemplos */
  }
}
