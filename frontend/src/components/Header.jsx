import { useState, useEffect } from 'react';

const FECHA_LLEGADA = new Date('2026-06-20T00:00:00-04:00');

function useCountdown(target) {
  const calc = () => {
    const d = Math.max(0, target - Date.now());
    return {
      dias:     Math.floor(d / 86400000),
      horas:    Math.floor((d % 86400000) / 3600000),
      minutos:  Math.floor((d % 3600000) / 60000),
      segundos: Math.floor((d % 60000) / 1000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function Unit({ n, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-2xl font-medium tabular-nums leading-none tracking-tight">
        {String(n).padStart(2, '0')}
      </span>
      <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ink-3 mt-0.5">
        {label}
      </span>
    </div>
  );
}

const NAV = [
  { label: 'Drop Actual', href: '#drop' },
  { label: 'A Pedido',    href: '#pedido' },
  { label: 'Equipo',      href: '#equipo' },
  { label: 'Contacto',    href: `https://wa.me/${import.meta.env.VITE_WSP_ADMIN || '59175467473'}` },
];

export default function Header() {
  const { dias, horas, minutos, segundos } = useCountdown(FECHA_LLEGADA);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-paper sticky top-0 z-30">
      {/* Barra principal */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="w-6 h-6 border border-ink flex items-center justify-center relative">
              <div className="w-2.5 h-2.5 border border-ink absolute" />
            </div>
            <div>
              <span className="font-display text-xl font-medium tracking-widest uppercase">
                pasocero
              </span>
              <span className="font-body text-[9px] tracking-[0.25em] text-ink-3 uppercase block leading-none mt-0.5">
                Bolivia · Importación Directa
              </span>
            </div>
          </a>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="font-body text-[11px] tracking-[0.12em] uppercase text-ink-2 hover:text-ink transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#drop"
              className="font-body text-[11px] tracking-[0.12em] uppercase border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
            >
              Reservar ahora
            </a>
          </nav>

          {/* Hamburger mobile */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú"
          >
            <span className={`block w-5 h-px bg-ink transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-px bg-ink transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-px bg-ink transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Menú mobile */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-paper px-6 py-4 flex flex-col gap-4">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="font-body text-[11px] tracking-[0.12em] uppercase text-ink-2"
              >
                {item.label}
              </a>
            ))}
            <a href="#drop" onClick={() => setMenuOpen(false)} className="btn-black text-center">
              Reservar ahora
            </a>
          </div>
        )}
      </div>

      {/* Barra del countdown — solo visible si el lote no llegó */}
      {dias + horas + minutos + segundos > 0 && (
        <div className="border-b border-border bg-white/70 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
            <span className="label-xs">Próximo lote llega en</span>
            <div className="flex items-center gap-4">
              <Unit n={dias} label="Días" />
              <span className="font-body text-ink-3 text-lg mb-3">·</span>
              <Unit n={horas} label="Horas" />
              <span className="font-body text-ink-3 text-lg mb-3">·</span>
              <Unit n={minutos} label="Min" />
              <span className="font-body text-ink-3 text-lg mb-3">·</span>
              <Unit n={segundos} label="Seg" />
            </div>
            <span className="label-xs hidden sm:block">China → Bolivia</span>
          </div>
        </div>
      )}
    </header>
  );
}