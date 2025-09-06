import express from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware.verifyToken);

// Rutas que requieren rol de administrador
router.get('/', authMiddleware.isAdmin, UserController.getAllUsers);
router.get('/:id', authMiddleware.isAdmin, UserController.getUserById);
router.put('/:id', authMiddleware.isAdmin, UserController.updateUser);
router.delete('/:id', authMiddleware.isAdmin, UserController.deleteUser);

export default router;
