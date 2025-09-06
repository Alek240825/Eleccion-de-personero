import { CandidateModel } from '../models/candidate.model.js';

const candidateModel = new CandidateModel();

export const CandidateController = {
    // Crear nuevo candidato
    async create(req, res) {
        try {
            const candidateData = req.body;
            
            // Validar que el tarjetón exista y esté activo
            // TODO: Agregar validación del tarjetón

            const candidateId = await candidateModel.create(candidateData);
            
            res.status(201).json({
                message: 'Candidato registrado exitosamente',
                candidateId
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al registrar candidato',
                error: error.message
            });
        }
    },

    // Obtener todos los candidatos
    async getAllCandidates(req, res) {
        try {
            const candidates = await candidateModel.findAll();
            res.json(candidates);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener candidatos',
                error: error.message
            });
        }
    },

    // Obtener candidatos por tarjetón
    async getCandidatesByTarjeton(req, res) {
        try {
            const { id_tarjeton } = req.params;
            const candidates = await candidateModel.findByTarjeton(id_tarjeton);
            res.json(candidates);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener candidatos del tarjetón',
                error: error.message
            });
        }
    },

    // Obtener un candidato por ID
    async getCandidateById(req, res) {
        try {
            const candidate = await candidateModel.findById(req.params.id);
            if (!candidate) {
                return res.status(404).json({
                    message: 'Candidato no encontrado'
                });
            }
            res.json(candidate);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener candidato',
                error: error.message
            });
        }
    },

    // Actualizar candidato
    async updateCandidate(req, res) {
        try {
            const updated = await candidateModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({
                    message: 'Candidato no encontrado'
                });
            }
            res.json({
                message: 'Candidato actualizado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar candidato',
                error: error.message
            });
        }
    },

    // Eliminar candidato
    async deleteCandidate(req, res) {
        try {
            const deleted = await candidateModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({
                    message: 'Candidato no encontrado'
                });
            }
            res.json({
                message: 'Candidato eliminado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al eliminar candidato',
                error: error.message
            });
        }
    }
};
