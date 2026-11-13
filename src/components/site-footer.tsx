import { hasShell, site } from '@/lib/site';

export function SiteFooter() {
  if (!hasShell()) return null;
  return (
    <footer className="bg-ink py-12 text-sm text-cream/80 print:hidden">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold text-cream">{site.name}</p>
          <p className="mt-2 leading-6">Verano sin Pulgas. Promo válida hasta el 28/02/2027 inclusive.</p>
        </div>
        <div>
          <p className="font-semibold text-cream">Horarios</p>
          <p className="mt-2 leading-6">
            Lunes a sábados, de 09:00 a 13:00 y de 16:00 a 20:00.
            <br />
            Domingos cerrado.
          </p>
        </div>
        <div>
          <p className="font-semibold text-cream">Letra chica</p>
          <p className="mt-2 leading-6">
            Los servicios y los precios son parte de una prueba de funcionamiento del formulario. No son
            recomendaciones veterinarias. El cupón no reserva turno.
          </p>
        </div>
      </div>
    </footer>
  );
}
