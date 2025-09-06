import { VotoModel } from '../models/voto.model.js';

const votoModel = new VotoModel();

export const VotoController = {
    // Registrar un nuevo voto
    async registrarVoto(req, res) {
        try {
            const { id_tarjeton_fk, id_candidato_fk } = req.body;
            const id_usuario_fk = req.user.id; // Obtenido del token JWT

            // Verificar voto existente
            const votoExistente = await votoModel.checkUserVote(id_usuario_fk, id_tarjeton_fk);
            if (votoExistente) {
                return res.status(400).json({
                    message: 'Ya has votado en este tarjetón',
                    voto: votoExistente
                });
            }

            // Registrar el voto
            const votoId = await votoModel.create({
                id_tarjeton_fk,
                id_usuario_fk,
                id_candidato_fk
            });

            res.status(201).json({
                message: 'Voto registrado exitosamente',
                votoId
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al registrar voto',
                error: error.message
            });
        }
    },

    // Verificar si un usuario ya votó
    async verificarVoto(req, res) {
        try {
            const id_usuario = req.user.id;
            const { id_tarjeton } = req.params;

            const voto = await votoModel.checkUserVote(id_usuario, id_tarjeton);
            
            res.json({
                yaVoto: !!voto,
                voto: voto
            });
        } catch (error) {
            res.status(500).json({
                message: 'Error al verificar voto',
                error: error.message
            });
        }
    },

    // Obtener estadísticas de votación (solo admin)
    async obtenerEstadisticas(req, res) {
        try {
            const { id_tarjeton } = req.params;
            const stats = await votoModel.getVotingStats(id_tarjeton);
            
            res.json(stats);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener estadísticas',
                error: error.message
            });
        }
    },

    // Obtener lista de votantes (solo admin)
    async obtenerVotantes(req, res) {
        try {
            const { id_tarjeton } = req.params;
            const votantes = await votoModel.getVotersList(id_tarjeton);
            
            res.json(votantes);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener lista de votantes',
                error: error.message
            });
        }
    }
};
