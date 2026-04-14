const ICONOS = {
  'smart-glasses-hd': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" className="w-12 h-12 text-ink">
      <path d="M2 9h3l2 6h2l2-6h2l2 6h2l2-6h3" strokeLinecap="round"/>
      <circle cx="7" cy="15" r="3"/>
      <circle cx="17" cy="15" r="3"/>
    </svg>
  ),
  'powerbank-termico': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" className="w-12 h-12 text-ink">
      <rect x="2" y="7" width="18" height="10" rx="1.5"/>
      <path d="M20 11h2v2h-2z" fill="currentColor" stroke="none"/>
      <path d="M7 12c.6-2 2.2-3 3.5-2.5M14 12h-3" strokeLinecap="round"/>
    </svg>
  ),
  'kit-primeros-auxilios-auto': (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.9" className="w-12 h-12 text-ink">
      <rect x="3" y="6" width="18" height="14" rx="1.5"/>
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/>
      <path d="M12 11v4M10 13h4" strokeLinecap="round"/>
    </svg>
  ),
};

const DESCRIPCIONES = {
  'smart-glasses-hd':
    'Cámara de 8MP para fotos y video desde tu perspectiva. Incluye traducción IA en tiempo real, música y llamadas Bluetooth. Tu asistente 100% manos libres.',
  'powerbank-termico':
    'Calentador de manos de doble cara y batería externa 2 en 1. Calentamiento rápido para combatir el frío mientras recargas tu celular en cualquier lugar.',
  'kit-primeros-auxilios-auto':
    '',
};

const NUMEROS = {
  'smart-glasses-hd':          '001',
  'powerbank-termico':         '002',
  'kit-primeros-auxilios-auto':'003',
};

const ETIQUETAS = {
  'smart-glasses-hd':          'Gadget',
  'powerbank-termico':         'Invierno',
  'kit-primeros-auxilios-auto':'Seguridad',
};

function StockBar({ disponible, total }) {
  const pct = total > 0 ? (disponible / total) * 100 : 0;
  const baja = pct <= 40;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ink-3">
          Disponibilidad
        </span>
        <span className={`font-body text-[10px] font-medium ${baja ? 'text-danger' : 'text-ink'}`}>
          {disponible} / {total}
        </span>
      </div>
      <div className="h-px bg-border">
        <div
          className={`h-px transition-all duration-700 ${baja ? 'bg-danger' : 'bg-ink'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function ProductCard({ producto, onReservar }) {
  const { nombre, slug, precio, anticipo, stockDisponible, stockTotal } = producto;
  const sinStock = stockDisponible === 0;
  const pocoStock = !sinStock && stockDisponible <= 3;

  return (
    <article className="bg-paper border-r border-b border-border flex flex-col hover:bg-white transition-colors duration-200">
      {/* Zona del ícono */}
      <div className="h-36 flex items-center justify-center border-b border-border">
        {ICONOS[slug]}
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-7 gap-5">
        {/* Número + nombre */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ink-3">
              {NUMEROS[slug]} — {ETIQUETAS[slug]}
            </span>
            {pocoStock && (
              <span className="badge-urgency">
                <span className="w-1.5 h-1.5 rounded-full bg-danger inline-block" />
                Solo {stockDisponible}
              </span>
            )}
          </div>
          <h3 className="font-display text-2xl font-medium tracking-tight leading-tight">
            {nombre}
          </h3>
        </div>

        {/* Descripción */}
        <p className="font-body text-sm text-ink-2 leading-relaxed flex-1">
          {DESCRIPCIONES[slug]}
        </p>

        {/* Barra de stock */}
        <StockBar disponible={stockDisponible} total={stockTotal} />

        {/* Precios */}
        <div className="flex items-end justify-between pt-4 border-t border-border">
          <div>
            <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ink-3 block mb-1">
              Precio final
            </span>
            <span className="font-display text-3xl font-medium tracking-tight">
              {precio}
            </span>
            <span className="font-body text-sm text-ink-3 ml-1">Bs</span>
          </div>
          <div className="text-right">
            <span className="font-body text-[9px] tracking-[0.2em] uppercase text-ink-3 block mb-1">
              Solo anticipo
            </span>
            <span className="font-display text-xl font-medium">{anticipo} Bs</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onReservar(producto)}
          disabled={sinStock}
          className="btn-black w-full"
        >
          {sinStock ? 'Sin disponibilidad' : 'Reservar unidad'}
        </button>
      </div>
    </article>
  );
}