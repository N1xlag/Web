import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function ReservaModal({ producto, onClose }) {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [wspUrl, setWspUrl] = useState('');

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado('loading');
    setErrorMsg('');
    try {
      const res = await fetch(`${API_BASE}/reservar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          productoId: producto.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al procesar la reserva');

      // Guardamos la URL y mostramos pantalla de éxito
      // (no abrimos automáticamente — los navegadores lo bloquean)
      setWspUrl(data.wspUrl);
      setEstado('success');
    } catch (err) {
      setEstado('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(247,245,240,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-paper border border-border shadow-sm">

        {/* Cabecera */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <span className="label-xs block mb-1">Confirmar reserva</span>
            <h2 className="font-display text-2xl font-medium tracking-tight">
              {producto.nombre}
            </h2>
            <p className="font-body text-sm text-ink-2 mt-1">
              Anticipo:{' '}
              <strong className="text-ink font-medium">{producto.anticipo} Bs</strong>
              {' '}· Precio final: {producto.precio} Bs
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-ink-3 hover:text-ink transition-colors ml-4 mt-1"
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Pantalla de éxito ── */}
        {estado === 'success' ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-12 h-12 border border-border flex items-center justify-center mx-auto">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-display text-xl font-medium tracking-tight mb-1">
                ¡Reserva confirmada!
              </p>
              <p className="font-body text-sm text-ink-2 leading-relaxed">
                Tu lugar está reservado. Ahora coordiná el anticipo de{' '}
                <strong className="text-ink">{producto.anticipo} Bs</strong> por WhatsApp
                con el administrador.
              </p>
            </div>
            <a
              href={wspUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-black w-full flex items-center justify-center gap-3"
            >
              Ir a WhatsApp
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <button
              onClick={onClose}
              className="font-body text-xs text-ink-3 hover:text-ink transition-colors"
            >
              Cerrar
            </button>
          </div>

        ) : (

          /* ── Formulario normal ── */
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="label-xs block">Tu nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Ana Rodríguez"
                required
                minLength={2}
                className="w-full bg-white border border-border font-body text-sm px-4 py-3 focus:outline-none focus:border-ink transition-colors placeholder:text-ink-3"
              />
            </div>

            <div className="space-y-1.5">
              <label className="label-xs block">Tu WhatsApp</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 76543210"
                required
                minLength={7}
                className="w-full bg-white border border-border font-body text-sm px-4 py-3 focus:outline-none focus:border-ink transition-colors placeholder:text-ink-3"
              />
            </div>

            {estado === 'error' && (
              <div className="flex items-start gap-2 border border-danger/30 bg-danger/5 px-4 py-3 text-danger">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4M12 16h.01" strokeLinecap="round"/>
                </svg>
                <p className="font-body text-xs leading-relaxed">{errorMsg}</p>
              </div>
            )}

            <p className="font-body text-xs text-ink-3 leading-relaxed pt-2 border-t border-border">
              Al confirmar se abrirá WhatsApp con el administrador. El anticipo de{' '}
              <strong className="text-ink-2">{producto.anticipo} Bs</strong> se coordina directamente por ese medio.
            </p>

            <button
              type="submit"
              disabled={estado === 'loading'}
              className="btn-black w-full flex items-center justify-center gap-3"
            >
              {estado === 'loading' ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  Confirmar reserva
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
