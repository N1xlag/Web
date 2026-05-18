import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ReservaModal from './components/ReservaModal';
import WspButton from './components/WspButton';

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const WSP_ADMIN = import.meta.env.VITE_WSP_ADMIN || '59175467473';

const FALLBACK = [
  { id: 1, nombre: 'Smart Glasses HD',                  slug: 'smart-glasses-hd',          precio: 'X', anticipo: 50, stockDisponible: 'X', stockTotal: 'X' },
  { id: 2, nombre: 'Powerbank Térmico',                  slug: 'powerbank-termico',          precio: 'X', anticipo: 50, stockDisponible: 'X', stockTotal: 'X' },
  { id: 3, nombre: 'Kit Premium Primeros Auxilios Auto', slug: 'kit-primeros-auxilios-auto', precio: 'X', anticipo: 50, stockDisponible: 'X', stockTotal: 'X' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HERO — Identidad de marca
───────────────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Texto */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-6 bg-ink-3" />
            <span className="label-xs">Importación directa · China → Bolivia</span>
          </div>

          <h1 className="font-display text-[58px] md:text-[76px] font-medium leading-none tracking-tight mb-6">
            Tu puerta<br />
            directa a<br />
            <em className="font-light italic text-ink-3">China.</em>
          </h1>

          <p className="font-body text-base text-ink-2 leading-relaxed max-w-sm mb-10">
            Traemos productos seleccionados en lotes exclusivos y gestionamos
            pedidos personalizados. Sin intermediarios, sin precios inflados.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a href="#drop" className="btn-black rounded-lg">Ver drop actual</a>
            <a href="#pedido" className="font-body text-[11px] tracking-[0.12em] uppercase text-ink-2 hover:text-ink transition-colors flex items-center gap-2">
              Pedido a medida <span>→</span>
            </a>
          </div>
        </div>

        {/* Números de impacto */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { n: '100%',    label: 'Importación directa',      sub: 'Sin intermediarios locales' },
            { n: '10+',     label: 'Categorías disponibles',    sub: 'Electrónica, hogar, auto y más' },
            { n: 'A pedido',label: 'Cualquier producto',         sub: 'Si existe en China, lo traemos' },
            { n: '48h',     label: 'Tiempo de cotización',       sub: 'Respuesta rápida garantizada' },
          ].map((s) => (
            <div key={s.n} className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-2 transition-transform hover:-translate-y-1 duration-300">
              <span className="font-display text-4xl font-medium tracking-tight">{s.n}</span>
              <span className="font-body text-sm font-medium text-ink">{s.label}</span>
              <span className="font-body text-xs text-ink-3">{s.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICIOS — Qué ofrecemos
───────────────────────────────────────────────────────────────────────────── */
function Servicios() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="rule-label mb-12">Nuestros servicios</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Servicio 1: Drops */}
          <div className="bg-white rounded-3xl shadow-sm p-10 flex flex-col gap-5">
            <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 3H8L6 7h12l-2-4z"/>
              </svg>
            </div>
            <div>
              <span className="label-xs block mb-3">01 — Lotes seleccionados</span>
              <h3 className="font-display text-2xl font-medium tracking-tight mb-4">Drops periódicos</h3>
              <p className="font-body text-sm text-ink-2 leading-relaxed">
                Cada temporada importamos un lote fijo de productos seleccionados
                a precios accesibles. Reservá con un anticipo mínimo de <strong className="text-ink">50 Bs</strong> y
                pagás el resto cuando llegue.
              </p>
            </div>
            <div className="mt-auto pt-6 flex items-center justify-between">
              <span className="label-xs">Anticipo desde 50 Bs</span>
              <a href="#drop" className="font-body text-[11px] tracking-[0.12em] uppercase text-ink hover:underline flex items-center gap-1">
                Ver catálogo <span>→</span>
              </a>
            </div>
          </div>

          {/* Servicio 2: Pedido a medida */}
          <div className="bg-ink rounded-3xl shadow-sm p-10 flex flex-col gap-5">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
              </svg>
            </div>
            <div>
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/40 block mb-3">02 — Importación personalizada</span>
              <h3 className="font-display text-2xl font-medium tracking-tight mb-4 text-paper">Pedido a medida</h3>
              <p className="font-body text-sm text-white/60 leading-relaxed">
                ¿Querés algo que no está en el drop? Lo cotizamos y traemos directamente.
                Desde electrónica hasta maquinaria, muebles o textiles. Si existe en China,
                lo conseguimos. El costo varía según producto y volumen.
              </p>
            </div>
            <div className="mt-auto pt-6 flex items-center justify-between">
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-white/40">Cotización gratuita en 48h</span>
              <a href="#pedido" className="font-body text-[11px] tracking-[0.12em] uppercase text-paper hover:underline flex items-center gap-1">
                Saber más <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DROP ACTUAL — Catálogo de preventa
───────────────────────────────────────────────────────────────────────────── */
function DropActual({ productos, cargando, onReservar }) {
  return (
    <section id="drop">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="label-xs block mb-3">Drop 001 · Lote actual</span>
            <h2 className="font-display text-4xl font-medium tracking-tight">
              3 productos seleccionados.
            </h2>
          </div>
          <span className="label-xs hidden md:block">Anticipo único · 50 Bs por unidad</span>
        </div>

        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {productos.map((p) => (
              <ProductCard key={p.id} producto={p} onReservar={onReservar} />
            ))}
          </div>
        )}

        <p className="font-body text-xs text-ink-3 text-center mt-10">
          Los drops se renuevan cada temporada. Seguinos en redes para enterarte primero.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CATEGORÍAS — Qué tipos de productos manejamos
───────────────────────────────────────────────────────────────────────────── */
const CATEGORIAS = [
  {
    nombre: 'Electrónica & Gadgets',
    desc: 'Auriculares, smartwatches, cámaras, drones y accesorios tech.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    nombre: 'Hogar & Electrodomésticos',
    desc: 'Aspiradoras robot, purificadores, cocinas portátiles y más.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    nombre: 'Automotriz & Herramientas',
    desc: 'Accesorios para auto, kits de herramientas, cargadores y luces.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M12 2v2M12 20v2M2 12h2M20 12h2"/>
      </svg>
    ),
  },
  {
    nombre: 'Deporte & Outdoor',
    desc: 'Equipamiento deportivo, camping, movilidad eléctrica.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
  },
  {
    nombre: 'Moda & Accesorios',
    desc: 'Ropa técnica, mochilas, calzado y artículos de temporada.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
  {
    nombre: 'Industria & Maquinaria',
    desc: 'Equipos para negocios, manufactura y proyectos a escala.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
      </svg>
    ),
  },
];

function Categorias() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="rule-label mb-6">Categorías que manejamos</div>
        <p className="font-body text-sm text-ink-2 text-center mb-12 max-w-xl mx-auto">
          No nos limitamos a gadgets. Si existe en el mercado chino, podemos cotizarlo y traerlo.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {CATEGORIAS.map((cat) => (
            <div
              key={cat.nombre}
              className="bg-white rounded-2xl p-8 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-ink-2 mb-2">{cat.icon}</div>
              <h4 className="font-display text-lg font-medium tracking-tight leading-tight">{cat.nombre}</h4>
              <p className="font-body text-xs text-ink-3 leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PEDIDO A MEDIDA
───────────────────────────────────────────────────────────────────────────── */
function PedidoAMedida() {
  const wspMsg = encodeURIComponent(
    'Hola Importex! Quiero cotizar un pedido a medida. El producto que busco es: [describír acá]'
  );
  const wspUrl = `https://wa.me/${WSP_ADMIN}?text=${wspMsg}`;

  const pasos = [
    {
      n: '01',
      titulo: 'Nos contactás',
      desc: 'Escribinos por WhatsApp con el producto que buscás — marca, modelo, especificaciones o simplemente una descripción.',
    },
    {
      n: '02',
      titulo: 'Te cotizamos',
      desc: 'En menos de 48 horas te enviamos el precio final incluyendo el producto, el flete desde China y los costos de importación.',
    },
    {
      n: '03',
      titulo: 'Confirmás con anticipo',
      desc: 'Si aceptás, coordinamos un anticipo para iniciar la gestión. El porcentaje varía según el valor del pedido.',
    },
    {
      n: '04',
      titulo: 'Recibís tu pedido',
      desc: 'El tiempo de entrega es según el producto. Te mantenemos informado en todo momento.',
    },
  ];

  return (
    <section id="pedido" className="bg-white py-16 my-12 rounded-3xl mx-6 md:mx-auto max-w-6xl shadow-sm">
      <div className="px-6 md:px-12">
        {/* Encabezado sin la tabla */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="label-xs block mb-4">Importación personalizada</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight leading-none mb-6">
            ¿Querés algo <em className="font-light italic text-ink-3">específico?</em>
          </h2>
          <p className="font-body text-sm text-ink-2 leading-relaxed mb-10 max-w-xl mx-auto">
            Más allá de los drops, gestionamos pedidos completamente personalizados.
            Desde un electrodoméstico puntual hasta un contenedor completo para tu negocio.
            El costo es mayor al de los lotes, pero la flexibilidad es total.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 mb-10 text-left">
            {[
              'Cualquier producto de China',
              'Pedidos para reventa',
              'Gestión 100% completa',
              'Cotización en 48 horas',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-ink/5 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="font-body text-sm text-ink-2">{item}</span>
              </div>
            ))}
          </div>

          <a
            href={wspUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-black rounded-lg inline-flex items-center gap-3"
          >
            Cotizar mi pedido
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Pasos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {pasos.map((p) => (
            <div key={p.n} className="bg-paper rounded-2xl p-8 space-y-4">
              <span className="font-display text-4xl font-light text-ink-3">{p.n}</span>
              <h3 className="font-display text-lg font-medium leading-tight">{p.titulo}</h3>
              <p className="font-body text-xs text-ink-2 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EQUIPO
───────────────────────────────────────────────────────────────────────────── */
const EQUIPO = [
  {
    nombre: 'Tu Nombre', // Rellenar
    rol: 'Fundador & Importador',
    bio: 'Supervisa las operaciones generales y asegura las alianzas clave en origen.', // Rellenar
    iniciales: 'CEO',
  },
  {
    nombre: 'Nombre 2',
    rol: 'Logística & Seguimiento',
    bio: 'Responsable del seguimiento de cada pedido desde origen hasta entrega. Coordinación con proveedores.',
    iniciales: 'LS',
  },
  {
    nombre: 'Nombre 3',
    rol: 'Atención al Cliente',
    bio: 'Punto de contacto principal con los clientes. Gestiona reservas y resuelve consultas.',
    iniciales: 'AC',
  },
];

function Equipo() {
  return (
    <section id="equipo">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="rule-label mb-6">El equipo</div>
        <p className="font-body text-sm text-ink-2 text-center mb-12 max-w-lg mx-auto">
          Somos un equipo pequeño y especializado. Cada pedido lo gestionamos
          personalmente — no somos un marketplace, somos tus gestores.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {EQUIPO.map((m) => (
            <div key={m.nombre} className="bg-white rounded-2xl shadow-sm p-8 flex flex-col gap-4">
              <div className="w-14 h-14 rounded-full bg-ink/5 flex items-center justify-center mb-2">
                <span className="font-display text-lg font-medium text-ink">{m.iniciales}</span>
              </div>
              <div>
                <h4 className="font-display text-xl font-medium tracking-tight mb-1">{m.nombre}</h4>
                <span className="label-xs">{m.rol}</span>
              </div>
              <p className="font-body text-sm text-ink-2 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-sm p-10 text-center">
          <p className="font-display text-2xl font-medium mb-3">
            Transparencia total, siempre.
          </p>
          <p className="font-body text-sm text-ink-2 max-w-xl mx-auto leading-relaxed">
            Podés seguir el estado de tu pedido en todo momento. Si hay algún inconveniente
            con tu producto o el envío, <em>devolvemos el anticipo sin preguntas.</em>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CÓMO FUNCIONA (drops)
───────────────────────────────────────────────────────────────────────────── */
function ComoFunciona() {
  const pasos = [
    { n: '01', titulo: 'Elige tu producto', desc: 'Explorá el drop actual y elegí el ítem que querés reservar.' },
    { n: '02', titulo: 'Reservá con 50 Bs',  desc: 'Llená el formulario con tu nombre y WhatsApp. Solo dos campos.' },
    { n: '03', titulo: 'Pagá el anticipo',   desc: 'Te redirigimos a WhatsApp para coordinar el QR del anticipo con el administrador.' },
    { n: '04', titulo: 'Recibís tu pedido',  desc: 'Cuando el lote llega a Bolivia, te contactamos para coordinar la entrega.' },
  ];
  return (
    <section id="como-funciona">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="rule-label mb-12">Cómo funciona el drop</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {pasos.map((p) => (
            <div key={p.n} className="bg-white rounded-2xl shadow-sm p-8 space-y-4">
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

/* ─────────────────────────────────────────────────────────────────────────────
   GARANTÍA
───────────────────────────────────────────────────────────────────────────── */
function Garantia() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="max-w-lg">
          <span className="label-xs block mb-4">¿Por qué confiar en Importex?</span>
          <p className="font-display text-3xl font-medium leading-snug">
            Operamos con total transparencia. Si hay algún inconveniente,{' '}
            <em className="font-light italic text-ink-3">devolvemos el anticipo sin preguntas.</em>
          </p>
        </div>
        <div className="flex flex-wrap gap-10 shrink-0 justify-center">
          {['Envío departamental', 'Garantía incluida', 'Pago seguro'].map((item) => (
            <div key={item} className="text-center">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
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

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────────── */
function Footer() {
  const REDES = [
    { label: 'Instagram', href: 'https://www.instagram.com/', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg> },
    { label: 'Facebook',  href: 'https://www.facebook.com/',  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
    { label: 'TikTok',    href: 'https://www.tiktok.com/',    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg> },
  ];

  return (
    <footer className="mt-10 bg-white border-t border-border/50">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Marca */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-ink flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-paper" />
            </div>
            <span className="font-display text-lg font-medium tracking-widest uppercase">Importex</span>
          </div>
          <p className="font-body text-xs text-ink-3 leading-relaxed max-w-xs">
            Importación directa desde China a Bolivia. Drops periódicos y pedidos personalizados.
          </p>
        </div>

        {/* Links */}
        <div>
          <span className="label-xs block mb-5">Navegación</span>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Drop actual', href: '#drop' },
              { label: 'Pedido a medida', href: '#pedido' },
              { label: 'Equipo', href: '#equipo' },
              { label: 'Cómo funciona', href: '#como-funciona' },
            ].map((l) => (
              <a key={l.label} href={l.href} className="font-body text-sm text-ink-2 hover:text-ink transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        </div>

        {/* Redes */}
        <div>
          <span className="label-xs block mb-5">Seguinos</span>
          <div className="flex gap-3 mb-6">
            {REDES.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={r.label}
                className="w-10 h-10 rounded-full bg-paper flex items-center justify-center text-ink-2 hover:bg-ink hover:text-paper transition-colors"
              >
                {r.icon}
              </a>
            ))}
          </div>
          <a
            href={`https://wa.me/${WSP_ADMIN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm text-ink-2 hover:text-ink transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.4 12.4 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
            </svg>
            WhatsApp directo
          </a>
        </div>
      </div>

      <div className="border-t border-border/30">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-body text-xs text-ink-3">
            © {new Date().getFullYear()} Importex Bolivia — Todos los derechos reservados
          </span>
          <span className="font-body text-xs text-ink-3">Cochabamba, Bolivia</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   APP PRINCIPAL
───────────────────────────────────────────────────────────────────────────── */
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
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <main>
        <Hero />
        <Servicios />
        <DropActual productos={productos} cargando={cargando} onReservar={setSeleccionado} />
        <ComoFunciona />
        <Categorias />
        <PedidoAMedida />
        <Equipo />
        <Garantia />
      </main>

      <Footer />

      {seleccionado && <ReservaModal producto={seleccionado} onClose={handleClose} />}
      <WspButton />
    </div>
  );
}