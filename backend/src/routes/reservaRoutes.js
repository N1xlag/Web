const express = require('express');
const router = express.Router();
const { crearReserva, obtenerProductos } = require('../controllers/reservaController');

// GET  /api/productos  → Devuelve los 3 productos con su stock disponible
router.get('/productos', obtenerProductos);

// POST /api/reservar   → Crea cliente (si no existe) + crea reserva
router.post('/reservar', crearReserva);

module.exports = router;