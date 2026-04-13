const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── GET /api/productos ────────────────────────────────────────────────────────
// Devuelve los productos con stock calculado (total - reservas activas)
const obtenerProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        _count: {
          select: {
            reservas: {
              where: {
                estado: { in: ['PENDIENTE', 'PAGADO'] },
              },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    const productosConStockReal = productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      slug: p.slug,
      precio: p.precio,
      anticipo: p.anticipo,
      stockTotal: p.stock,
      reservasActivas: p._count.reservas,
      stockDisponible: Math.max(0, p.stock - p._count.reservas),
    }));

    res.json({ productos: productosConStockReal });
  } catch (error) {
    console.error('❌ Error en obtenerProductos:', error.message);
    res.status(500).json({ error: 'No se pudieron obtener los productos' });
  }
};

// ─── POST /api/reservar ────────────────────────────────────────────────────────
// Body: { nombre: string, telefono: string, productoId: number }
const crearReserva = async (req, res) => {
  const { nombre, telefono, productoId } = req.body;

  // Validaciones básicas
  if (!nombre || !telefono || !productoId) {
    return res.status(400).json({
      error: 'Faltan datos requeridos: nombre, telefono y productoId son obligatorios.',
    });
  }

  const telefonoLimpio = telefono.replace(/\D/g, ''); // Solo números
  if (telefonoLimpio.length < 7) {
    return res.status(400).json({ error: 'Número de teléfono inválido.' });
  }

  try {
    // 1. Verificar que el producto existe y tiene stock
    const producto = await prisma.producto.findUnique({
      where: { id: Number(productoId) },
      include: {
        _count: {
          select: {
            reservas: {
              where: { estado: { in: ['PENDIENTE', 'PAGADO'] } },
            },
          },
        },
      },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    const stockDisponible = producto.stock - producto._count.reservas;
    if (stockDisponible <= 0) {
      return res.status(409).json({
        error: 'Lo sentimos, este producto ya no tiene unidades disponibles.',
      });
    }

    // 2. Upsert del cliente (buscar por teléfono, crear si no existe)
    const cliente = await prisma.cliente.upsert({
      where: { telefono: telefonoLimpio },
      update: { nombre }, // Actualiza el nombre si ya existía
      create: { nombre, telefono: telefonoLimpio },
    });

    // 3. Crear la reserva
    const reserva = await prisma.reserva.create({
      data: {
        clienteId: cliente.id,
        productoId: producto.id,
        estado: 'PENDIENTE',
      },
    });

    // 4. Construir el mensaje de WhatsApp pre-llenado
    const wspNumber = process.env.WSP_ADMIN_NUMBER || '59170000000';
    const mensaje = encodeURIComponent(
      `Hola, acabo de reservar *${producto.nombre}* a nombre de *${cliente.nombre}*. ¿A qué QR transfiero el anticipo de ${producto.anticipo} Bs?`
    );
    const wspUrl = `https://wa.me/${wspNumber}?text=${mensaje}`;

    res.status(201).json({
      ok: true,
      mensaje: 'Reserva creada exitosamente',
      reservaId: reserva.id,
      producto: producto.nombre,
      anticipo: producto.anticipo,
      wspUrl, // El frontend usa esto para redirigir
    });
  } catch (error) {
    console.error('❌ Error en crearReserva:', error.message);
    res.status(500).json({ error: 'No se pudo procesar tu reserva. Intenta de nuevo.' });
  }
};

module.exports = { crearReserva, obtenerProductos };