require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

const rateLimit = require('express-rate-limit');

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    // Agrega tu dominio de producción aquí cuando lo tengas
    // 'https://techdrops.bo'
  ],
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// Límite general: 100 peticiones cada 15 minutos por IP
const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas peticiones. Intentá de nuevo en unos minutos.' },
});

// Límite estricto para reservas: máximo 5 intentos cada 15 minutos por IP
const limiterReservas = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Demasiados intentos de reserva. Esperá unos minutos e intentá de nuevo.' },
});

app.use('/api', limiterGeneral);
app.use('/api/reservar', limiterReservas);

// ─── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api', reservaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// ─── Error Handler global ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error no manejado:', err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// ─── Inicio ────────────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`🚀 NovaTech API corriendo en http://localhost:${PORT}`);
});

// ─── Graceful shutdown ─────────────────────────────────────────────────────────
const { prisma } = require('./controllers/reservaController');

async function shutdown() {
  console.log('⏳ Cerrando servidor...');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Servidor cerrado correctamente.');
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown); 