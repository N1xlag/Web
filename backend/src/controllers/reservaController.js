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

  // Validar que nombre no sea demasiado corto ni largo
  if (nombre.trim().length < 2 || nombre.trim().length > 100) {
    return res.status(400).json({ error: 'El nombre debe tener entre 2 y 100 caracteres.' });
  }

  // Validar que productoId sea un número entero válido
  const productoIdNum = parseInt(productoId, 10);
  if (isNaN(productoIdNum) || productoIdNum <= 0) {
    return res.status(400).json({ error: 'productoId inválido.' });
  }

  const telefonoLimpio = telefono.replace(/\D/g, '');
  if (telefonoLimpio.length < 7) {
    return res.status(400).json({ error: 'Número de teléfono inválido.' });
  }

try {
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Verificar producto y stock DENTRO de la transacción
      const producto = await tx.producto.findUnique({
        where: { id: productoIdNum },
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
        throw { status: 404, mensaje: 'Producto no encontrado.' };
      }

      const stockDisponible = producto.stock - producto._count.reservas;
      if (stockDisponible <= 0) {
        throw { status: 409, mensaje: 'Lo sentimos, este producto ya no tiene unidades disponibles.' };
      }

      // 2. Upsert del cliente
       const cliente = await tx.cliente.upsert({
        where: { telefono: telefonoLimpio },
        update: { nombre },
        create: { nombre, telefono: telefonoLimpio },
      });

      // 3. Verificar que no tenga ya una reserva activa para este producto
      const reservaExistente = await tx.reserva.findFirst({
        where: {
          clienteId: cliente.id,
          productoId: producto.id,
          estado: { in: ['PENDIENTE', 'PAGADO'] },
        },
      });

      if (reservaExistente) {
        throw { status: 409, mensaje: 'Ya tenés una reserva activa para este producto.' };
      }

      // 4. Crear la reserva
      const reserva = await tx.reserva.create({
        data: {
          clienteId: cliente.id,
          productoId: producto.id,
          estado: 'PENDIENTE',
        },
      });

      return { producto, cliente, reserva };
    });

    // 4. Construir el mensaje de WhatsApp (fuera de la transacción)
    const { producto, cliente, reserva } = resultado;
    const wspNumber = process.env.WSP_ADMIN_NUMBER;
    if (!wspNumber) {
      console.error('❌ WSP_ADMIN_NUMBER no está configurado en .env');
      return res.status(500).json({ error: 'Error de configuración del servidor.' });
    }
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
      wspUrl,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ error: error.mensaje });
    }
    console.error('❌ Error en crearReserva:', error.message);
    res.status(500).json({ error: 'No se pudo procesar tu reserva. Intenta de nuevo.' });
  }
};

module.exports = { crearReserva, obtenerProductos, prisma };