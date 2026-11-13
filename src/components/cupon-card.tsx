'use client';

import type { ReactNode } from 'react';

import type { Cupon } from '@/lib/cupones';
import { formatearFecha } from '@/lib/cupones';
import { PROMO_VENCE, formatPrecio } from '@/lib/packs';

function Fila({ etiqueta, children }: { etiqueta: string; children: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-0.5 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="text-sm text-ink/70">{etiqueta}</dt>
      <dd className="min-w-0 break-words font-medium">{children}</dd>
    </div>
  );
}

/** El cupón, presentable. Solo lectura: el estado se muestra, nunca se cambia. */
export function CuponCard({ cupon }: { cupon: Cupon }) {
  return (
    <article
      className="overflow-hidden rounded-[2rem] bg-white text-ink shadow-xl shadow-ink/10 ring-1 ring-ink/10"
      data-print-cupon
    >
      <header className="relative bg-brand-deep px-5 py-5 text-white sm:px-8">
        <p className="text-sm font-medium text-white/85">Veterinaria Cola Inquieta · Verano sin Pulgas</p>
        <p className="mt-1 font-display text-xl font-bold">Cupón de promo</p>
        <span className="absolute right-4 top-4 -rotate-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink sm:right-8">
          {cupon.estado}
        </span>
      </header>
      <div className="px-5 py-6 sm:px-8">
        <p className="text-sm text-ink/70">Tu código</p>
        <p className="mt-1 break-all rounded-2xl border-2 border-dashed border-brand-deep/50 bg-accent/30 px-4 py-4 text-center font-display text-3xl font-bold tracking-[0.12em] sm:text-5xl">
          {cupon.codigo}
        </p>
        <dl className="mt-6 grid gap-3 border-t-2 border-dashed border-ink/15 pt-6">
          <Fila etiqueta="Persona">{cupon.nombre}</Fila>
          <Fila etiqueta="Mascota">
            {cupon.mascota} ({cupon.tipo})
          </Fila>
          <Fila etiqueta="Pack">{cupon.pack}</Fila>
          <Fila etiqueta="Precio">
            <span className="font-display text-xl font-bold">{formatPrecio(cupon.precio)}</span>
          </Fila>
          <Fila etiqueta="Vence">{PROMO_VENCE} (inclusive)</Fila>
          <Fila etiqueta="Estado">{cupon.estado}</Fila>
          <Fila etiqueta="Generado">{formatearFecha(cupon.fecha)}</Fila>
        </dl>
        <p className="mt-6 rounded-2xl bg-cream px-4 py-3 text-sm leading-6 text-ink/80">
          Este cupón no reserva turno. Servicios y precios son parte de una prueba de funcionamiento del
          formulario y no son recomendaciones veterinarias.
        </p>
      </div>
    </article>
  );
}

export function BotonImprimir() {
  return (
    <button
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 py-3 font-semibold text-ink transition-colors hover:bg-tangerine focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-deep/30 print:hidden"
      onClick={() => window.print()}
      type="button"
    >
      Imprimir / guardar
    </button>
  );
}
