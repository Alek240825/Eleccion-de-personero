import express from 'express';
import { CandidateController } from '../controllers/candidate.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware.verifyToken);

// Rutas públicas (requieren autenticación pero no rol de admin)
router.get('/', CandidateController.getAllCandidates);
router.get('/tarjeton/:id_tarjeton', CandidateController.getCandidatesByTarjeton);
router.get('/:id', CandidateController.getCandidateById);

// Rutas que requieren rol de administrador
router.post('/', authMiddleware.isAdmin, CandidateController.create);
router.put('/:id', authMiddleware.isAdmin, CandidateController.updateCandidate);
router.delete('/:id', authMiddleware.isAdmin, CandidateController.deleteCandidate);

export default router;
