'use client';

import { useEffect, useRef, useState } from 'react';

import { BotonImprimir, CuponCard } from '@/components/cupon-card';
import { IconoTicket } from '@/components/ilustraciones';
import { EVENTO_CUPONES, type Cupon, leerCupones, sembrarEjemplos } from '@/lib/cupones';
import { formatPrecio } from '@/lib/packs';

const fechaCorta = (iso: string) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeZone: 'America/Argentina/Buenos_Aires' }).format(d);
};

export function MisCupones() {
  const [lista, setLista] = useState<Cupon[] | null>(null);
  const [abierto, setAbierto] = useState<Cupon | null>(null);
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const cargar = () => setLista(leerCupones());
    sembrarEjemplos();
    cargar();
    window.addEventListener(EVENTO_CUPONES, cargar);
    window.addEventListener('storage', cargar);
    return () => {
      window.removeEventListener(EVENTO_CUPONES, cargar);
      window.removeEventListener('storage', cargar);
    };
  }, []);

  useEffect(() => {
    if (!abierto) return;
    cerrarRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [abierto]);

  return (
    <section className="py-16 sm:py-24" id="tus-cupones">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-prose">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Tus cupones</h2>
          <p className="mt-3 leading-7 text-ink/80">
            Los cupones que sacaste desde este dispositivo. Se guardan solo acá, en este navegador: no hay
            cuenta ni usuario. Tocá uno para verlo completo.
          </p>
        </div>

        {lista === null ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div className="h-32 animate-pulse rounded-3xl bg-ink/10" key={i} />
            ))}
          </div>
        ) : lista.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-4 rounded-[2rem] border-2 border-dashed border-ink/20 bg-white px-6 py-10 text-center sm:flex-row sm:text-left">
            <IconoTicket className="w-28 shrink-0 motion-safe:animate-bob" />
            <div>
              <p className="font-display text-xl font-bold">Todavía no sacaste ningún cupón</p>
              <p className="mt-1 leading-7 text-ink/80">
                Completá el formulario de arriba y tu primer cupón aparece acá.
              </p>
            </div>
          </div>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((c) => (
              <li className="min-w-0" key={c.codigo}>
                <button
                  className="block h-full w-full min-w-0 rounded-3xl bg-white p-5 text-left ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:ring-brand-deep/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-deep/30"
                  onClick={() => setAbierto(c)}
                  type="button"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0 break-all font-display text-xl font-bold tracking-wider">{c.codigo}</span>
                    <span className="shrink-0 rounded-full bg-accent px-3 py-1 text-xs font-bold">{c.estado}</span>
                  </span>
                  <span className="mt-3 block break-words font-medium">
                    {c.mascota} · {c.pack}
                  </span>
                  <span className="mt-1 block text-sm text-ink/70">
                    {typeof c.precio === 'number' ? formatPrecio(c.precio) : ''} · {fechaCorta(c.fecha)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {abierto ? (
        <div
          aria-label={`Cupón ${abierto.codigo}`}
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-ink/70 px-4 py-6 backdrop-blur-sm print:static print:bg-transparent print:p-0"
          onClick={(e) => e.target === e.currentTarget && setAbierto(null)}
          role="dialog"
        >
          <div className="mx-auto grid max-w-xl gap-4">
            <CuponCard cupon={abierto} />
            <div className="flex flex-wrap gap-3 print:hidden">
              <BotonImprimir />
              <button
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-ink transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent"
                onClick={() => setAbierto(null)}
                ref={cerrarRef}
                type="button"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
