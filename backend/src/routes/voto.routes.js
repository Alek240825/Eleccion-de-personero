import express from 'express';
import { VotoController } from '../controllers/voto.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware.verifyToken);

// Rutas para todos los usuarios autenticados
router.post('/registrar', VotoController.registrarVoto);
router.get('/verificar/:id_tarjeton', VotoController.verificarVoto);

// Rutas que requieren rol de administrador
router.get('/estadisticas/:id_tarjeton', authMiddleware.isAdmin, VotoController.obtenerEstadisticas);
router.get('/votantes/:id_tarjeton', authMiddleware.isAdmin, VotoController.obtenerVotantes);

export default router;
