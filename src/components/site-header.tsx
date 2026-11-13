import Link from 'next/link';

import { hasShell, site } from '@/lib/site';

const link =
  'rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep/50';

function Huella({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} fill="currentColor" viewBox="0 0 24 24">
      <ellipse cx="6" cy="10" rx="2.2" ry="2.8" />
      <ellipse cx="10.2" cy="5.8" rx="2.2" ry="2.8" />
      <ellipse cx="15.2" cy="5.8" rx="2.2" ry="2.8" />
      <ellipse cx="19" cy="10" rx="2.2" ry="2.8" />
      <path d="M12.5 11c3 0 6 3.2 6 6 0 2-1.6 3-3.4 3-1.2 0-1.9-.5-2.6-.5s-1.4.5-2.6.5c-1.800 0-3.400-1-3.400-3 0-2.800 3-6 6-6z" />
    </svg>
  );
}

export function SiteHeader() {
  if (!hasShell()) return null;
  const items = site.nav.map((l) => (
    <a className={link} href={l.href} key={l.href}>
      {l.label}
    </a>
  ));
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          className="flex min-w-0 items-center gap-2.5 rounded-full font-display text-lg font-bold leading-none tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep/50 sm:text-xl"
          href="/"
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-ink">
            <Huella className="size-5" />
          </span>
          <span className="truncate">{site.name}</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {items}
          <a
            className="ml-2 rounded-full bg-tangerine px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-deep/50"
            href="#cupon"
          >
            Quiero mi cupón
          </a>
        </nav>
        <details className="relative md:hidden">
          <summary
            aria-label="Menú"
            className="grid size-11 cursor-pointer list-none place-items-center rounded-full bg-white text-ink ring-1 ring-ink/10 [&::-webkit-details-marker]:hidden"
          >
            <svg aria-hidden className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </summary>
          <nav className="absolute right-0 mt-2 grid w-60 gap-1 rounded-3xl border border-ink/10 bg-white p-2 shadow-lg">
            {items}
            <a
              className="rounded-full bg-tangerine px-4 py-3 text-center text-sm font-semibold text-ink"
              href="#cupon"
            >
              Quiero mi cupón
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
