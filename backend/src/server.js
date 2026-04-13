require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reservaRoutes = require('./routes/reservaRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173', // Dev (Vite)
    'http://localhost:3000',
    // Agrega tu dominio de producción aquí cuando lo tengas
    // 'https://techdrops.bo'
  ],
  methods: ['GET', 'POST'],
}));
app.use(express.json());

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
app.listen(PORT, () => {
  console.log(`🚀 TechDrops API corriendo en http://localhost:${PORT}`);
});