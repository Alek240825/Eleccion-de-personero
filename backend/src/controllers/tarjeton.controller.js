import { TarjetonModel } from '../models/tarjeton.model.js';

const tarjetonModel = new TarjetonModel();

export const TarjetonController = {
    // Crear nuevo tarjetón
    async create(req, res) {
        try {
            const tarjetonData = req.body;
            
            const tarjetonId = await tarjetonModel.create(tarjetonData);
            
            res.status(201).json({
                message: 'Tarjetón creado exitosamente',
                tarjetonId
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear tarjetón',
                error: error.message
            });
        }
    },

    // Obtener todos los tarjetones
    async getAllTarjetones(req, res) {
        try {
            const tarjetones = await tarjetonModel.findAll();
            res.json(tarjetones);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener tarjetones',
                error: error.message
            });
        }
    },

    // Obtener tarjetón por ID
    async getTarjetonById(req, res) {
        try {
            const tarjeton = await tarjetonModel.findById(req.params.id);
            if (!tarjeton) {
                return res.status(404).json({
                    message: 'Tarjetón no encontrado'
                });
            }
            res.json(tarjeton);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener tarjetón',
                error: error.message
            });
        }
    },

    // Obtener tarjetón activo
    async getActiveTarjeton(req, res) {
        try {
            const tarjeton = await tarjetonModel.findActive();
            if (!tarjeton) {
                return res.status(404).json({
                    message: 'No hay tarjetón activo'
                });
            }
            res.json(tarjeton);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener tarjetón activo',
                error: error.message
            });
        }
    },

    // Actualizar estado del tarjetón
    async updateTarjetonStatus(req, res) {
        try {
            const { estado } = req.body;
            if (!['En Curso', 'Finalizado'].includes(estado)) {
                return res.status(400).json({
                    message: 'Estado no válido'
                });
            }

            const updated = await tarjetonModel.updateStatus(req.params.id, estado);
            if (!updated) {
                return res.status(404).json({
                    message: 'Tarjetón no encontrado'
                });
            }

            res.json({
                message: 'Estado del tarjetón actualizado exitosamente'
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar estado del tarjetón',
                error: error.message
            });
        }
    },

    // Obtener resultados de un tarjetón
    async getTarjetonResults(req, res) {
        try {
            const results = await tarjetonModel.getResults(req.params.id);
            res.json(results);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener resultados',
                error: error.message
            });
        }
    }
};
