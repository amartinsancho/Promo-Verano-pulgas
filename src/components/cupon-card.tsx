'use client';

import type { ReactNode } from 'react';

import type { Cupon } from '@/lib/cupones';
import { formatearFecha } from '@/lib/cupones';
import { PACKS, PROMO_VENCE, formatPrecio } from '@/lib/packs';

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
          Este cupón no reserva turno ni es una recomendación veterinaria.
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

function mensajeWhatsApp(cupon: Cupon): string {
  const servicios = PACKS.find((p) => p.nombre === cupon.pack)?.servicios;
  return [
    '🐾 *Verano sin Pulgas · Veterinaria Cola Inquieta*',
    '',
    `Cupón: Pack ${cupon.pack}${servicios ? ` (${servicios})` : ''}`,
    `Código: *${cupon.codigo}*`,
    `Para: ${cupon.mascota}`,
    `Precio promo: ${formatPrecio(cupon.precio)}`,
    `Válido hasta el ${PROMO_VENCE} (inclusive)`,
    '',
    '¡Sacá el tuyo y cuidá a tu mascota este verano!',
  ].join('\n');
}

export function BotonWhatsApp({ cupon }: { cupon: Cupon }) {
  return (
    <a
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1FA855] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#178a45] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-deep/30 print:hidden"
      href={`https://wa.me/?text=${encodeURIComponent(mensajeWhatsApp(cupon))}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.9L2 22l5.25-1.38A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 1 1 6.97 3.85Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.54.06a6.7 6.7 0 0 1-3.3-2.88c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.42-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.47c-.16 0-.43.06-.65.3-.23.25-.86.84-.86 2.05s.88 2.38 1 2.55c.12.16 1.73 2.64 4.2 3.7.59.26 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.1-.23-.16-.48-.29Z" />
      </svg>
      Compartir por WhatsApp
    </a>
  );
}
