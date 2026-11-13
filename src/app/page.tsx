import type { Metadata } from 'next';

import { Countdown } from '@/components/countdown';
import { CuponForm } from '@/components/cupon-form';
import { EscenaVerano, IconoPack } from '@/components/ilustraciones';
import { MisCupones } from '@/components/mis-cupones';
import { PACKS, PROMO_VENCE, formatPrecio } from '@/lib/packs';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Verano sin Pulgas',
  description: site.description,
};

const boton =
  'inline-flex min-h-14 items-center justify-center rounded-full px-8 py-4 text-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-deep/30';

const icono = 'size-6';

const confianza = [
  {
    titulo: 'Baño medicado y pipeta',
    texto: 'Para perros, según su peso. Gatos: pipeta y control de piel.',
    svg: <path d="M12 3C8 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2-6-6-11z" />,
  },
  {
    titulo: 'Lunes a sábados',
    texto: '09:00 a 13:00 y 16:00 a 20:00. Domingos cerrado.',
    svg: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  },
  {
    titulo: 'Cupón con código único',
    texto: 'Cada cupón tiene su código propio, tipo CI-XXXX-XXXX.',
    svg: <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8zM14 6v12" />,
  },
  {
    titulo: 'Sin cuentas ni vueltas',
    texto: 'Tus cupones quedan guardados en este dispositivo.',
    svg: (
      <>
        <rect height="11" rx="2" width="14" x="5" y="10" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      </>
    ),
  },
];

const pasos = [
  'Contanos quién sos y cómo se llama tu mascota.',
  'Elegí perro o gato; si es perro, poné su peso. El pack se asigna solo.',
  'Te llevás un cupón con código. Guardalo o imprimilo.',
];

export default function Home() {
  return (
    <main>
      <p className="bg-accent px-4 py-2 text-center text-sm font-medium text-ink">
        Servicios y precios de prueba: forman parte de una prueba de funcionamiento del formulario.
      </p>

      {/* Hero dividido */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-24 pt-10 sm:px-6 sm:pb-28 sm:pt-16 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <div>
            <p className="inline-block -rotate-2 rounded-full bg-brand-deep px-4 py-1.5 text-sm font-semibold text-white">
              Promo de verano · hasta el {PROMO_VENCE}
            </p>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
              Verano sin <span className="text-brand-deep">Pulgas</span>
            </h1>
            <p className="mt-5 max-w-prose text-lg leading-8 text-ink/85">
              Que este verano las únicas que se rasquen sean las ganas de ir a la plaza. En Cola Inquieta le
              armamos a tu perro o gato el pack justo: cargás sus datos, el formulario elige el pack y te
              llevás un cupón con código.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className={`${boton} bg-tangerine text-ink hover:bg-accent`} href="#cupon">
                Quiero mi cupón
              </a>
              <a className={`${boton} bg-white text-ink ring-2 ring-ink/15 hover:bg-accent/40`} href="#packs">
                Ver los packs
              </a>
            </div>
            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t-2 border-dashed border-ink/20 pt-6">
              <div className="min-w-0">
                <dt className="text-sm text-ink/75">Desde</dt>
                <dd className="font-display text-2xl font-bold sm:text-3xl">{formatPrecio(19000)}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm text-ink/75">Packs</dt>
                <dd className="font-display text-2xl font-bold sm:text-3xl">4 según peso</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-sm text-ink/75">Último día</dt>
                <dd className="font-display text-2xl font-bold sm:text-3xl">28/02/27</dd>
              </div>
            </dl>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <EscenaVerano className="w-full" />
            <p className="absolute bottom-2 left-0 max-w-[11rem] -rotate-6 rounded-3xl bg-accent px-4 py-3 text-center font-display text-lg font-bold leading-tight text-ink shadow-lg motion-safe:animate-bob sm:-left-2">
              ¡Chau, pulgas!
            </p>
          </div>
        </div>
      </section>

      {/* Cuenta regresiva, montada sobre el hero */}
      <div className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:-mt-20 sm:px-6">
        <Countdown />
      </div>

      {/* Franja de confianza */}
      <section className="py-12 sm:py-16">
        <ul className="mx-auto grid max-w-6xl gap-x-8 gap-y-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {confianza.map((c) => (
            <li className="flex min-w-0 gap-4" key={c.titulo}>
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/15 text-brand-deep">
                <svg
                  aria-hidden
                  className={icono}
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  viewBox="0 0 24 24"
                >
                  {c.svg}
                </svg>
              </span>
              <div className="min-w-0">
                <p className="font-display text-lg font-bold leading-tight">{c.titulo}</p>
                <p className="mt-1 text-sm leading-6 text-ink/80">{c.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Packs */}
      <section className="bg-white py-16 sm:py-24" id="packs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-prose">
            <h2 className="font-display text-3xl font-bold sm:text-5xl">Un pack para cada cola</h2>
            <p className="mt-4 text-lg leading-8 text-ink/85">
              El pack depende de la especie y, en los perros, del peso. No tenés que elegirlo: el formulario lo
              asigna solo.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PACKS.map((p) => (
              <li
                className="flex min-w-0 flex-col rounded-[2rem] bg-cream p-6 ring-1 ring-ink/10 transition hover:-translate-y-1"
                key={p.id}
              >
                <IconoPack className="size-24" pack={p.id} />
                <h3 className="mt-5 font-display text-3xl font-bold">{p.nombre}</h3>
                <p className="mt-1 text-sm font-medium text-brand-deep">{p.rango}</p>
                <p className="mt-4 leading-7 text-ink/85">{p.servicios}</p>
                <div className="mt-auto flex items-end justify-between gap-3 pt-6">
                  <p className="font-display text-4xl font-bold tabular-nums">{formatPrecio(p.precio)}</p>
                  <p className="rounded-full bg-accent px-3 py-1 text-sm font-semibold">{p.minutos} min</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Formulario */}
      <section className="bg-brand/10 py-16 sm:py-24" id="cupon">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-5xl">Pedí tu cupón</h2>
            <ol className="mt-8 grid gap-4">
              {pasos.map((t, i) => (
                <li className="flex min-w-0 items-start gap-4" key={t}>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink font-display text-lg font-bold text-accent">
                    {i + 1}
                  </span>
                  <p className="pt-1.5 leading-7">{t}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-[2rem] bg-white p-6 ring-1 ring-ink/10">
              <h3 className="font-display text-2xl font-bold">Horarios de atención</h3>
              <dl className="mt-4 grid gap-3">
                <div className="flex flex-wrap justify-between gap-x-4">
                  <dt className="font-medium">Lunes a sábados</dt>
                  <dd className="text-ink/85">09:00 a 13:00 y 16:00 a 20:00</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-x-4 border-t border-ink/10 pt-3">
                  <dt className="font-medium">Domingos</dt>
                  <dd className="text-ink/85">Cerrado</dd>
                </div>
              </dl>
              <p className="mt-5 inline-block -rotate-1 rounded-2xl bg-accent px-4 py-2 font-semibold">
                «Capacidad de prueba: 6 baños por día»
              </p>
              <p className="mt-4 text-sm leading-6 text-ink/80">
                Dato informativo: no limita los cupones que se pueden sacar. Además, el cupón no reserva turno.
              </p>
            </div>
          </div>
          <CuponForm />
        </div>
      </section>

      <MisCupones />

      {/* Cierre */}
      <section className="bg-brand-deep py-16 text-white sm:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">Que las pulgas se queden sin vacaciones</h2>
            <p className="mt-3 text-lg leading-8 text-white/90">
              Tenés tiempo hasta el {PROMO_VENCE} inclusive. Sacá el cupón en un minuto.
            </p>
          </div>
          <a className={`${boton} shrink-0 bg-accent text-ink hover:bg-tangerine`} href="#cupon">
            Quiero mi cupón
          </a>
        </div>
        <p className="mx-auto mt-10 max-w-6xl px-4 text-sm leading-6 text-white/85 sm:px-6">
          Servicios y precios son parte de una prueba de funcionamiento del formulario. No son recomendaciones
          veterinarias.
        </p>
      </section>
    </main>
  );
}
