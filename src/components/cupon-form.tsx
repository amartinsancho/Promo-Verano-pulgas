'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';

import { BotonImprimir, CuponCard } from '@/components/cupon-card';
import { useNow } from '@/components/countdown';
import { type Cupon, agregarCupon, existeCupon, reservarCodigo } from '@/lib/cupones';
import { PROMO_VENCE, type Tipo, asignarPack, formatPrecio, parsePeso, promoCerrada } from '@/lib/packs';

type Errores = Partial<Record<'nombre' | 'correo' | 'mascota' | 'tipo' | 'peso' | 'guardar', string>>;

const campo =
  'w-full min-w-0 rounded-2xl border-2 border-ink/20 bg-white px-4 py-3.5 text-base text-ink placeholder:text-ink/50 transition-colors focus:border-brand-deep focus:outline-none focus-visible:ring-4 focus-visible:ring-brand/25 aria-[invalid=true]:border-red-700';
const errorCls = 'mt-1.5 text-sm font-medium text-red-700';

function CarasTipo({ tipo }: { tipo: Tipo }) {
  return tipo === 'perro' ? (
    <svg aria-hidden className="size-9" viewBox="0 0 40 40">
      <ellipse cx="7" cy="17" rx="5" ry="10" transform="rotate(15 7 17)" className="fill-tangerine stroke-ink" strokeWidth="2" />
      <ellipse cx="33" cy="17" rx="5" ry="10" transform="rotate(-15 33 17)" className="fill-tangerine stroke-ink" strokeWidth="2" />
      <circle cx="20" cy="21" r="13" className="fill-white stroke-ink" strokeWidth="2" />
      <circle cx="15" cy="18" r="1.800" className="fill-ink" />
      <circle cx="25" cy="18" r="1.800" className="fill-ink" />
      <ellipse cx="20" cy="24" rx="3.500" ry="2.500" className="fill-ink" />
    </svg>
  ) : (
    <svg aria-hidden className="size-9" viewBox="0 0 40 40">
      <path d="M7 18L8 4L17 11ZM33 18L32 4L23 11Z" className="fill-accent stroke-ink" strokeLinejoin="round" strokeWidth="2" />
      <circle cx="20" cy="22" r="13" className="fill-accent stroke-ink" strokeWidth="2" />
      <ellipse cx="15" cy="20" rx="1.800" ry="2.300" className="fill-ink" />
      <ellipse cx="25" cy="20" rx="1.800" ry="2.300" className="fill-ink" />
      <path d="M18 25H22L20 27.500Z" className="fill-tangerine" />
    </svg>
  );
}

export function CuponForm() {
  const now = useNow(1000);
  const cerrada = now !== null && promoCerrada(now);

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mascota, setMascota] = useState('');
  const [tipo, setTipo] = useState<Tipo | ''>('');
  const [peso, setPeso] = useState('');
  const [errores, setErrores] = useState<Errores>({});
  const [cupon, setCupon] = useState<Cupon | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const pack = asignarPack(tipo, peso);

  useEffect(() => {
    if (cupon) topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [cupon]);

  function elegirTipo(t: Tipo) {
    setTipo(t);
    // El peso del gato no se guarda ni queda oculto: se limpia el estado al elegir gato.
    if (t === 'gato') setPeso('');
    setErrores((e) => ({ ...e, tipo: undefined, peso: undefined }));
  }

  function enviar(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    if (promoCerrada(Date.now())) return;
    const e: Errores = {};
    const n = nombre.trim().replace(/\s+/g, ' ');
    const m = mascota.trim().replace(/\s+/g, ' ');
    if (n.length < 2) e.nombre = 'Escribí tu nombre y apellido.';
    const c = correo.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) e.correo = 'Escribí un correo válido, por ejemplo nombre@correo.com.';
    if (m.length < 1) e.mascota = 'Contanos cómo se llama tu mascota.';
    if (!tipo) e.tipo = 'Elegí si es perro o gato.';
    if (tipo === 'perro' && parsePeso(peso) === null) {
      e.peso = 'Poné el peso en kilos, con un número mayor a 0 (por ejemplo 12 o 10,5).';
    }
    if (!e.correo && m && existeCupon(c, m)) e.guardar = `Ya hay un cupón para ${m} con ese correo. Lo encontrás abajo, en "Tus cupones".`;
    const asignado = asignarPack(tipo, peso);
    if (!asignado || Object.keys(e).length) {
      setErrores(e);
      return;
    }
    const nuevo: Cupon = {
      codigo: reservarCodigo(),
      nombre: n,
      correo: c,
      mascota: m,
      tipo: asignado.especie,
      pack: asignado.nombre,
      precio: asignado.precio,
      fecha: new Date().toISOString(),
      estado: 'Sin usar',
    };
    if (!agregarCupon(nuevo)) {
      setErrores({ guardar: 'Tu navegador no nos dejó guardar el cupón en este dispositivo. Probá de nuevo.' });
      return;
    }
    setErrores({});
    setCupon(nuevo);
  }

  function otro() {
    setCupon(null);
    setNombre('');
    setCorreo('');
    setMascota('');
    setTipo('');
    setPeso('');
    setErrores({});
  }

  let cuerpo;
  if (now === null) {
    cuerpo = <div className="h-96 animate-pulse rounded-[2rem] bg-ink/10" />;
  } else if (cerrada) {
    cuerpo = (
      <div className="rounded-[2rem] bg-white p-6 text-center shadow-xl shadow-ink/10 ring-1 ring-ink/10 sm:p-10">
        <p className="font-display text-3xl font-bold sm:text-4xl">La promo terminó</p>
        <p className="mx-auto mt-3 max-w-md leading-7 text-ink/80">
          Verano sin Pulgas cerró el {PROMO_VENCE}. Ya no se pueden sacar cupones nuevos. Los que ya
          guardaste siguen abajo, en &quot;Tus cupones&quot;.
        </p>
        <a
          className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-accent px-6 py-3 font-semibold text-ink transition-colors hover:bg-tangerine focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-deep/30"
          href="#tus-cupones"
        >
          Ver mis cupones
        </a>
      </div>
    );
  } else if (cupon) {
    cuerpo = (
      <div className="grid gap-5 motion-safe:animate-pop">
        <div>
          <p className="font-display text-3xl font-bold sm:text-4xl">¡Listo, {cupon.nombre.split(' ')[0]}! Ya tenés tu cupón</p>
          <p className="mt-2 leading-7 text-ink/80">
            Guardamos el código en este dispositivo: lo encontrás siempre en &quot;Tus cupones&quot;. Recordá
            que el cupón no reserva turno.
          </p>
        </div>
        <CuponCard cupon={cupon} />
        <div className="flex flex-wrap gap-3 print:hidden">
          <BotonImprimir />
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-ink px-6 py-3 font-semibold text-cream transition-colors hover:bg-brand-deep focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-deep/30"
            onClick={otro}
            type="button"
          >
            Pedir otro cupón
          </button>
        </div>
      </div>
    );
  } else {
    const pesoTexto = peso.trim() !== '';
    cuerpo = (
      <form
        className="grid gap-5 rounded-[2rem] bg-white p-5 shadow-xl shadow-ink/10 ring-1 ring-ink/10 sm:p-8"
        noValidate
        onSubmit={enviar}
      >
        <div>
          <label className="text-sm font-medium" htmlFor="nombre">
            Nombre y apellido
          </label>
          <input
            aria-describedby={errores.nombre ? 'err-nombre' : undefined}
            aria-invalid={!!errores.nombre}
            autoComplete="name"
            className={`${campo} mt-1.5`}
            id="nombre"
            maxLength={80}
            name="nombre"
            onChange={(e) => {
              setNombre(e.target.value);
              setErrores((x) => ({ ...x, nombre: undefined }));
            }}
            placeholder="Ej.: Lucía Fernández"
            required
            type="text"
            value={nombre}
          />
          {errores.nombre ? (
            <p className={errorCls} id="err-nombre">
              {errores.nombre}
            </p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="correo">
            Correo electrónico
          </label>
          <input
            aria-describedby={errores.correo ? 'err-correo' : undefined}
            aria-invalid={!!errores.correo}
            autoComplete="email"
            className={`${campo} mt-1.5`}
            id="correo"
            inputMode="email"
            maxLength={120}
            name="correo"
            onChange={(e) => {
              setCorreo(e.target.value);
              setErrores((x) => ({ ...x, correo: undefined, guardar: undefined }));
            }}
            placeholder="Ej.: lucia@correo.com"
            required
            type="email"
            value={correo}
          />
          {errores.correo ? (
            <p className={errorCls} id="err-correo">
              {errores.correo}
            </p>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="mascota">
            Nombre de tu mascota
          </label>
          <input
            aria-describedby={errores.mascota ? 'err-mascota' : undefined}
            aria-invalid={!!errores.mascota}
            autoComplete="off"
            className={`${campo} mt-1.5`}
            id="mascota"
            maxLength={40}
            name="mascota"
            onChange={(e) => {
              setMascota(e.target.value);
              setErrores((x) => ({ ...x, mascota: undefined }));
            }}
            placeholder="Ej.: Tobi"
            required
            type="text"
            value={mascota}
          />
          {errores.mascota ? (
            <p className={errorCls} id="err-mascota">
              {errores.mascota}
            </p>
          ) : null}
        </div>

        <fieldset aria-describedby={errores.tipo ? 'err-tipo' : undefined}>
          <legend className="text-sm font-medium">¿Es perro o gato?</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            {(['perro', 'gato'] as const).map((t) => (
              <label className="block min-w-0" key={t}>
                <input
                  checked={tipo === t}
                  className="peer sr-only"
                  name="tipo"
                  onChange={() => elegirTipo(t)}
                  required
                  type="radio"
                  value={t}
                />
                <span className="flex min-h-16 cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-ink/20 bg-white px-3 py-3 font-display text-xl font-bold transition-colors hover:border-brand-deep peer-checked:border-ink peer-checked:bg-accent peer-focus-visible:ring-4 peer-focus-visible:ring-brand-deep/30">
                  <CarasTipo tipo={t} />
                  {t === 'perro' ? 'Perro' : 'Gato'}
                </span>
              </label>
            ))}
          </div>
          {errores.tipo ? (
            <p className={errorCls} id="err-tipo">
              {errores.tipo}
            </p>
          ) : null}
        </fieldset>

        {tipo === 'perro' ? (
          <div className="motion-safe:animate-pop">
            <label className="text-sm font-medium" htmlFor="peso">
              Peso de tu perro (en kg)
            </label>
            <input
              aria-describedby={errores.peso ? 'err-peso' : 'ayuda-peso'}
              aria-invalid={!!errores.peso}
              autoComplete="off"
              className={`${campo} mt-1.5`}
              id="peso"
              inputMode="decimal"
              maxLength={7}
              name="peso"
              onChange={(e) => {
                setPeso(e.target.value);
                setErrores((x) => ({ ...x, peso: undefined }));
              }}
              placeholder="Ej.: 12 o 10,5"
              required
              type="text"
              value={peso}
            />
            {errores.peso ? (
              <p className={errorCls} id="err-peso">
                {errores.peso}
              </p>
            ) : (
              <p className="mt-1.5 text-sm text-ink/70" id="ayuda-peso">
                Podés usar coma o punto para los decimales.
              </p>
            )}
          </div>
        ) : null}

        <div
          aria-live="polite"
          className={`rounded-3xl p-5 transition-colors ${pack ? 'bg-brand-deep text-white' : 'bg-cream text-ink'}`}
        >
          <p className={`text-sm font-medium ${pack ? 'text-white/85' : 'text-ink/70'}`}>Pack asignado</p>
          {pack ? (
            <div className="mt-1 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
              <div className="min-w-0">
                <p className="font-display text-3xl font-bold leading-tight">{pack.nombre}</p>
                <p className="text-sm text-white/90">
                  {pack.servicios} · {pack.minutos} min
                </p>
              </div>
              <p className="font-display text-4xl font-bold tabular-nums text-accent">{formatPrecio(pack.precio)}</p>
            </div>
          ) : (
            <p className="mt-1 leading-7">
              {tipo === 'perro'
                ? pesoTexto
                  ? 'Con ese peso todavía no podemos asignar un pack: tiene que ser un número mayor a 0.'
                  : 'Poné el peso de tu perro y te mostramos el pack y el precio.'
                : 'Elegí perro o gato y te mostramos el pack y el precio.'}
            </p>
          )}
        </div>

        {errores.guardar ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800" role="alert">
            {errores.guardar}
          </p>
        ) : null}

        <button
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-tangerine px-8 py-4 text-lg font-bold text-ink transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-deep/30"
          type="submit"
        >
          Generar mi cupón
        </button>
        <p className="text-sm leading-6 text-ink/70">
          Tus datos quedan guardados solo en este dispositivo. El cupón no reserva turno.
        </p>
      </form>
    );
  }

  return <div ref={topRef} className="scroll-mt-24">{cuerpo}</div>;
}
