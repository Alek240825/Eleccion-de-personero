import express from 'express';
import { TarjetonController } from '../controllers/tarjeton.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware.verifyToken);

// Rutas públicas (requieren autenticación pero no rol de admin)
router.get('/', TarjetonController.getAllTarjetones);
router.get('/active', TarjetonController.getActiveTarjeton);
router.get('/:id', TarjetonController.getTarjetonById);
router.get('/:id/results', TarjetonController.getTarjetonResults);

// Rutas que requieren rol de administrador
router.post('/', authMiddleware.isAdmin, TarjetonController.create);
router.put('/:id/status', authMiddleware.isAdmin, TarjetonController.updateTarjetonStatus);

export default router;
