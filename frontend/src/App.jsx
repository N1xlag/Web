import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ReservaModal from './components/ReservaModal';
import WspButton from './components/WspButton';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const FALLBACK = [
  { id: 1, nombre: 'Smart Glasses HD', slug: 'smart-glasses-hd', precio: 'X', anticipo: 50, stockDisponible: 'X', stockTotal: 'X' },
  { id: 2, nombre: 'Powerbank Térmico', slug: 'powerbank-termico', precio: 'X', anticipo: 50, stockDisponible: 'X', stockTotal: 'X' },
  { id: 3, nombre: 'Kit Premium Primeros Auxilios Auto', slug: 'kit-primeros-auxilios-auto', precio: 'X', anticipo: 50, stockDisponible: 'X', stockTotal: 'X' },
];

/* ─── Hero ──────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-b border-border">
      {/* Left */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px w-6 bg-ink-3" />
          <span className="label-xs">Preventa exclusiva 2025</span>
        </div>

        <h1 className="font-display text-[64px] md:text-[80px] font-medium leading-none tracking-tight mb-6">
          Tecnología<br />
          <em className="font-light italic text-ink-3">sin</em><br />
          intermediarios.
        </h1>

        <p className="font-body text-base text-ink-2 leading-relaxed max-w-sm mb-10">
          Importamos directo desde China. Solo{' '}
          <strong className="text-ink font-medium">50 Bs de anticipo</strong>{' '}
          para asegurar tu unidad. El resto lo pagas cuando llegue.
        </p>

        <div className="flex items-center gap-6">
          <a href="#productos" className="btn-black">
            Ver catálogo
          </a>
          <a href="#como-funciona" className="font-body text-[11px] tracking-[0.12em] uppercase text-ink-2 hover:text-ink transition-colors flex items-center gap-2">
            ¿Cómo funciona? <span>→</span>
          </a>
        </div>
      </div>

      {/* Right — mini-grilla de productos */}
      <div className="relative">
        {/* Badge flotante */}
        {/* 1. Aumentamos el z-index (z-50) para asegurar que esté por encima de todo */}
        {/* 2. Aseguramos un color de fondo sólido (puedes cambiar bg-[#F9F8F5] por tu variable bg-paper si es completamente opaca) */}
        <div className="absolute -top-11 -right-5 z-50 bg-[#F9F8F5] border border-border px-4 py-2.5 shadow-sm">
          <span className="label-xs block mb-0.5 text-ink-3">Solo anticipo</span>
          <span className="font-display text-2xl font-medium">50 Bs</span>
      </div>

        <div className="border border-border grid grid-cols-2 gap-px bg-border">
          {[
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8"><path d="M2 9h3l2 6h2l2-6h2l2 6h2l2-6h3" strokeLinecap="round" /><circle cx="7" cy="15" r="3" /><circle cx="17" cy="15" r="3" /></svg>, nombre: 'Smart Glasses', precio: 'X Bs' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8"><rect x="2" y="7" width="18" height="10" rx="1.5" /><path d="M20 11h2v2h-2z" fill="currentColor" stroke="none" /></svg>, nombre: 'Powerbank', precio: 'X Bs' },
          ].map((p) => (
            <div key={p.nombre} className="bg-white p-6 flex flex-col items-center gap-3 text-center">
              {p.icon}
              <span className="font-body text-[10px] tracking-[0.15em] uppercase text-ink-3">{p.nombre}</span>
              <span className="font-display text-lg font-medium">{p.precio}</span>
            </div>
          ))}

          <div className="bg-white p-5 col-span-2 flex items-center gap-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-7 h-7 flex-shrink-0">
              <rect x="3" y="6" width="18" height="14" rx="1.5" />
              <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
              <path d="M12 11v4M10 13h4" strokeLinecap="round" />
            </svg>
            <div className="flex-1">
              <span className="font-body text-[10px] tracking-[0.15em] uppercase text-ink-3 block">Kit Primeros Auxilios</span>
              <span className="font-display text-lg font-medium">X Bs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Cómo funciona ─────────────────────────────────────────────────── */
function ComoFunciona() {
  const pasos = [
    { n: '01', titulo: 'Elige tu producto', desc: 'Selecciona uno de los 3 ítems del catálogo de preventa.' },
    { n: '02', titulo: 'Reserva con 50 Bs', desc: 'Llena el formulario con tu nombre y WhatsApp. Solo dos campos.' },
    { n: '03', titulo: 'Paga el anticipo', desc: 'Se abre un botón para ir a WhatsApp. Coordinás el QR del anticipo directamente con el administrador.' },
    { n: '04', titulo: 'Recibe tu pedido', desc: 'Cuando el lote llega a Bolivia, te contactamos para la entrega.' },
  ];

  return (
    <section id="como-funciona" className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="rule-label mb-12">Proceso de compra</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border border border-border">
          {pasos.map((p) => (
            <div key={p.n} className="bg-paper p-6 space-y-3">
              <span className="font-display text-4xl font-light text-ink-3">{p.n}</span>
              <h3 className="font-display text-lg font-medium leading-tight">{p.titulo}</h3>
              <p className="font-body text-sm text-ink-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Garantía ──────────────────────────────────────────────────────── */
function Garantia() {
  return (
    <section className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-lg">
          <span className="label-xs block mb-3">¿Por qué confiar en NovaTech?</span>
          <p className="font-display text-2xl font-medium leading-snug">
            Operamos con total transparencia. Si hay algún inconveniente con tu producto,{' '}
            <em className="font-light italic text-ink-3">devolvemos el anticipo sin preguntas.</em>
          </p>
        </div>
        <div className="flex gap-8 shrink-0">
          {['Envío departamental', 'Garantía incluida', 'Pago seguro'].map((item) => (
            <div key={item} className="text-center">
              <div className="w-10 h-10 border border-border flex items-center justify-center mx-auto mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="label-xs">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between border-t border-border">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border border-border flex items-center justify-center">
          <div className="w-2 h-2 border border-ink-3" />
        </div>
        <span className="font-body text-xs text-ink-3">
          © {new Date().getFullYear()} NovaTech Bolivia
        </span>
      </div>
      {/* Redes sociales */}
      <div className="flex gap-3">
        {[
          {
            url: "https://www.instagram.com/",
            icon: <svg key="ig" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
          },
          {
            url: "https://www.facebook.com/",
            icon: <svg key="fb" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
          },
          {
            url: "https://www.tiktok.com/",
            icon: <svg key="tt" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
          }
        ].map((redSocial, i) => (
          <a
            key={i}
            href={redSocial.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 border border-border flex items-center justify-center text-ink-3 hover:border-ink hover:text-ink transition-colors cursor-pointer"
          >
            {redSocial.icon}
          </a>
        ))}
      </div>
    </footer>
  );
}

/* ─── App principal ─────────────────────────────────────────────────── */
export default function App() {
  const [productos, setProductos] = useState(FALLBACK);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);

  const handleClose = useCallback(() => setSeleccionado(null), []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/productos`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.productos?.length) setProductos(data.productos);
      } catch {
        console.warn('API no disponible. Mostrando datos de ejemplo.');
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Header />

      <main>
        <Hero />

        {/* Catálogo */}
        <section id="productos" className="border-b border-border">
          <div className="max-w-6xl mx-auto px-6 py-16">
            {/* Encabezado de sección */}
            <div className="flex items-end justify-between mb-10 pb-6 border-b border-border">
              <div>
                <span className="label-xs block mb-2">Catálogo · Lote 001</span>
                <h2 className="font-display text-4xl font-medium tracking-tight">
                  3 productos seleccionados.
                </h2>
              </div>
              <span className="label-xs hidden md:block">Anticipo único · 50 Bs por unidad</span>
            </div>

            {/* Grid de productos */}
            {cargando ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-paper h-96 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border-t border-l border-border">
                {productos.map((p) => (
                  <ProductCard key={p.id} producto={p} onReservar={setSeleccionado} />
                ))}
              </div>
            )}
          </div>
        </section>

        <ComoFunciona />
        <Garantia />
      </main>

      <Footer />

      {seleccionado && (
        <ReservaModal producto={seleccionado} onClose={handleClose} />
      )}


      <WspButton />
    </div>
  );
}