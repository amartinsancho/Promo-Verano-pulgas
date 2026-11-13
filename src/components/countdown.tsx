'use client';

import { useEffect, useState } from 'react';

import { PROMO_FIN_MS, PROMO_VENCE, promoCerrada } from '@/lib/packs';

/** Hora actual en ms, o null hasta que el navegador hidrata (así servidor y cliente coinciden). */
export function useNow(intervaloMs = 1000): number | null {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), intervaloMs);
    return () => window.clearInterval(id);
  }, [intervaloMs]);
  return now;
}

const dos = (n: number) => String(n).padStart(2, '0');

function Unidad({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-cream/10 px-1 py-3 text-center ring-1 ring-cream/15 sm:px-4">
      <p className="font-display text-3xl font-bold leading-none tabular-nums text-accent sm:text-5xl">{valor}</p>
      <p className="mt-1.5 text-xs font-medium text-cream/80 sm:text-sm">{etiqueta}</p>
    </div>
  );
}

export function Countdown() {
  const now = useNow(1000);
  const cerrada = now !== null && promoCerrada(now);
  const resto = now === null ? null : Math.max(0, PROMO_FIN_MS - now);
  const d = resto === null ? '--' : String(Math.floor(resto / 86_400_000));
  const h = resto === null ? '--' : dos(Math.floor(resto / 3_600_000) % 24);
  const m = resto === null ? '--' : dos(Math.floor(resto / 60_000) % 60);
  const s = resto === null ? '--' : dos(Math.floor(resto / 1000) % 60);

  return (
    <div className="grid gap-6 rounded-[2rem] bg-ink p-6 text-cream shadow-xl shadow-ink/20 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
      <div>
        <p className="font-display text-2xl font-bold sm:text-3xl">
          {cerrada ? 'La promo terminó' : 'Se acaba el verano, se acaba la promo'}
        </p>
        <p className="mt-2 leading-7 text-cream/85">
          {cerrada ? (
            <>Verano sin Pulgas cerró el {PROMO_VENCE} a las 23:59 hs (Argentina).</>
          ) : (
            <>
              Vence el <strong className="text-accent">{PROMO_VENCE}</strong>, inclusive: la promo corre hasta
              las 23:59:59 hs de ese día (hora de Argentina).
            </>
          )}
        </p>
      </div>
      {cerrada ? (
        <div className="rounded-2xl bg-cream/10 px-5 py-6 text-center font-display text-2xl font-bold text-accent ring-1 ring-cream/15">
          Promo finalizada
        </div>
      ) : (
        <div aria-label="Tiempo que falta para que termine la promo" className="grid grid-cols-4 gap-2 sm:gap-3" role="timer">
          <Unidad etiqueta="días" valor={d} />
          <Unidad etiqueta="horas" valor={h} />
          <Unidad etiqueta="min" valor={m} />
          <Unidad etiqueta="seg" valor={s} />
        </div>
      )}
    </div>
  );
}
