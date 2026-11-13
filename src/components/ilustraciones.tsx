// Ilustraciones propias, formas simples. Server-safe (sin hooks).

const S = 'stroke-ink';

/** Cara de perro centrada en (0,0), radio 26. */
export function CaraPerro() {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="-25" cy="-2" rx="10" ry="20" transform="rotate(18 -25 -2)" className={`fill-tangerine ${S}`} strokeWidth="3" />
      <ellipse cx="25" cy="-2" rx="10" ry="20" transform="rotate(-18 25 -2)" className={`fill-tangerine ${S}`} strokeWidth="3" />
      <circle r="26" className={`fill-white ${S}`} strokeWidth="3" />
      <ellipse cx="0" cy="10" rx="13" ry="9.500" className="fill-cream" />
      <circle cx="-9.500" cy="-5" r="3" className="fill-ink" />
      <circle cx="9.500" cy="-5" r="3" className="fill-ink" />
      <ellipse cx="0" cy="4.500" rx="5.500" ry="3.800" className="fill-ink" />
      <path d="M0 8V12M-6 12Q0 18 6 12" className={`fill-none ${S}`} strokeWidth="2.500" />
      <path d="M-2.500 15.500Q0 24 2.500 15.500Z" className="fill-tangerine" />
    </g>
  );
}

/** Cara de gato centrada en (0,0), radio 24. */
export function CaraGato({ relleno = 'fill-accent' }: { relleno?: string }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      <path d="M-22 -8L-19 -35L-4 -22Z" className={`${relleno} ${S}`} strokeWidth="3" />
      <path d="M22 -8L19 -35L4 -22Z" className={`${relleno} ${S}`} strokeWidth="3" />
      <circle r="25" className={`${relleno} ${S}`} strokeWidth="3" />
      <ellipse cx="-9" cy="-3" rx="3" ry="4" className="fill-ink" />
      <ellipse cx="9" cy="-3" rx="3" ry="4" className="fill-ink" />
      <path d="M-3 5H3L0 9Z" className="fill-tangerine" />
      <path d="M0 9Q-4 14 -8 11M0 9Q4 14 8 11" className={`fill-none ${S}`} strokeWidth="2.500" />
      <path d="M-30 4L-15 6M-30 11L-15 9M30 4L15 6M30 11L15 9" className={`fill-none ${S}`} strokeWidth="2" />
    </g>
  );
}

/** Icono de pack: cara a escala (los perros crecen con el peso) sobre un círculo de color. */
export function IconoPack({ pack, className = '' }: { pack: 'liviano' | 'mediano' | 'grande' | 'felino'; className?: string }) {
  const esc = { liviano: 0.62, mediano: 0.82, grande: 1.02, felino: 0.95 }[pack];
  const fondo = {
    liviano: 'fill-brand/25',
    mediano: 'fill-accent/60',
    grande: 'fill-tangerine/35',
    felino: 'fill-brand/25',
  }[pack];
  return (
    <svg aria-hidden className={className} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" className={fondo} />
      <g transform={`translate(50 ${pack === 'felino' ? 55 : 56}) scale(${esc})`}>
        {pack === 'felino' ? <CaraGato /> : <CaraPerro />}
      </g>
    </svg>
  );
}

/** Escena del hero: perro, gato, sol y una pulga que se va de vacaciones. */
export function EscenaVerano({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 400 400">
      <path
        d="M58 200C40 112 130 38 222 48C322 60 372 142 350 240C335 322 262 372 180 362C98 352 74 290 58 200Z"
        className="fill-brand"
      />
      <path d="M92 130C110 90 160 70 200 74" className="fill-none stroke-white/35" strokeLinecap="round" strokeWidth="6" />
      {/* sol */}
      <g transform="translate(306 96)">
        <g className="origin-center motion-safe:animate-sun" style={{ transformBox: 'fill-box' }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              className="stroke-accent"
              key={i}
              strokeLinecap="round"
              strokeWidth="7"
              transform={`rotate(${i * 36})`}
              x1="0"
              x2="0"
              y1="-48"
              y2="-62"
            />
          ))}
        </g>
        <circle r="36" className="fill-accent stroke-ink" strokeWidth="3" />
        <path d="M-14 4Q0 16 14 4" className="fill-none stroke-ink" strokeLinecap="round" strokeWidth="3" />
        <circle cx="-12" cy="-8" r="3" className="fill-ink" />
        <circle cx="12" cy="-8" r="3" className="fill-ink" />
      </g>
      {/* suelo */}
      <ellipse cx="200" cy="352" rx="150" ry="14" className="fill-ink/15" />
      {/* perro */}
      <g strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(92 292)">
          <path
            d="M0 0C-26 -6 -30 -42 -18 -58"
            className="fill-none stroke-ink motion-safe:animate-wag"
            strokeWidth="9"
            style={{ transformBox: 'fill-box', transformOrigin: '100% 100%' }}
          />
        </g>
        <rect x="96" y="238" width="104" height="104" rx="44" className="fill-white stroke-ink" strokeWidth="3" />
        <rect x="112" y="318" width="28" height="30" rx="13" className="fill-white stroke-ink" strokeWidth="3" />
        <rect x="156" y="318" width="28" height="30" rx="13" className="fill-white stroke-ink" strokeWidth="3" />
        <circle cx="148" cy="282" r="9" className="fill-accent" />
        <g transform="translate(148 214) scale(1.7)">
          <CaraPerro />
        </g>
      </g>
      {/* gato */}
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M322 328C362 330 372 290 352 276" className="fill-none stroke-ink" strokeWidth="9" />
        <path d="M322 328C362 330 372 290 352 276" className="fill-none stroke-tangerine" strokeWidth="4" />
        <ellipse cx="282" cy="316" rx="42" ry="34" className="fill-tangerine stroke-ink" strokeWidth="3" />
        <g transform="translate(282 266) scale(1.55)">
          <CaraGato relleno="fill-cream" />
        </g>
      </g>
      {/* pulga con valija */}
      <g className="motion-safe:animate-bob">
        <g transform="translate(206 120)">
          <path d="M-8 6L-14 14M8 6L14 14M-4 8L-6 17M4 8L6 17" className="fill-none stroke-ink" strokeLinecap="round" strokeWidth="2.500" />
          <ellipse rx="9" ry="10" className="fill-ink" />
          <path d="M-9 -3H9" className="stroke-cream" strokeWidth="3" />
          <circle cx="-3" cy="-6" r="1.500" className="fill-cream" />
          <rect x="11" y="9" width="15" height="11" rx="3" className="fill-tangerine stroke-ink" strokeWidth="2" />
          <path d="M15 9V6H22V9" className="fill-none stroke-ink" strokeWidth="2" />
        </g>
      </g>
      <path d="M232 128Q262 120 280 150" className="fill-none stroke-white/60" strokeDasharray="2 9" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

export function IconoTicket({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 120 90">
      <rect x="8" y="14" width="104" height="62" rx="14" className="fill-accent stroke-ink" strokeWidth="3" />
      <path d="M82 18V72" className="stroke-ink" strokeDasharray="4 6" strokeLinecap="round" strokeWidth="3" />
      <circle cx="82" cy="14" r="7" className="fill-cream stroke-ink" strokeWidth="3" />
      <circle cx="82" cy="76" r="7" className="fill-cream stroke-ink" strokeWidth="3" />
      <path d="M22 36H66M22 48H58M22 60H48" className="stroke-ink" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}
