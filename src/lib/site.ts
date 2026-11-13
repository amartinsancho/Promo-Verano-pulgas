// El nombre y los links del encabezado, en un solo lugar.
export const site = {
  name: 'Veterinaria Cola Inquieta',
  description:
    'Verano sin Pulgas: sacá tu cupón con el pack justo para tu perro o gato. Promo válida hasta el 28/02/2027.',
  logo: '',
  accounts: false,
  verifyEmail: false,
  staffOnly: false,
  captcha: true,
  paidCallsPerVisitorPerMinute: 20,
  admins: [] as string[],
  nav: [
    { href: '#packs', label: 'Packs' },
    { href: '#cupon', label: 'Pedí tu cupón' },
    { href: '#tus-cupones', label: 'Tus cupones' },
  ] as { href: string; label: string }[],
  appNav: [] as { href: string; label: string }[],
};

export const hasShell = () => site.accounts || site.nav.length > 0;
