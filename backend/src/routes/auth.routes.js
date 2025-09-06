import express from 'express';
import { UserController } from '../controllers/user.controller.js';

const router = express.Router();

// Rutas de autenticación
router.post('/register', UserController.register);
router.post('/login', UserController.login);

export default router;
