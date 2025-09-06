import mysql from 'mysql2/promise';

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export class VotoModel {
    // Registrar un nuevo voto
    async create(votoData) {
        const { id_tarjeton_fk, id_usuario_fk, id_candidato_fk } = votoData;

        try {
            // Verificar si el tarjetón está activo
            const [tarjeton] = await pool.execute(
                "SELECT estado FROM tarjetones WHERE id_tarjeton = ?",
                [id_tarjeton_fk]
            );

            if (!tarjeton.length || tarjeton[0].estado !== 'En Curso') {
                throw new Error('El tarjetón no está activo para votación');
            }

            // Verificar si el usuario ya votó en este tarjetón
            const [existingVote] = await pool.execute(
                'SELECT id_voto FROM votos WHERE id_usuario_fk = ? AND id_tarjeton_fk = ?',
                [id_usuario_fk, id_tarjeton_fk]
            );

            if (existingVote.length > 0) {
                throw new Error('El usuario ya ha votado en este tarjetón');
            }

            // Registrar el voto
            const [result] = await pool.execute(
                'INSERT INTO votos (id_tarjeton_fk, id_usuario_fk, id_candidato_fk) VALUES (?, ?, ?)',
                [id_tarjeton_fk, id_usuario_fk, id_candidato_fk]
            );

            return result.insertId;
        } catch (error) {
            throw new Error('Error al registrar voto: ' + error.message);
        }
    }

    // Verificar si un usuario ya votó en un tarjetón específico
    async checkUserVote(id_usuario, id_tarjeton) {
        try {
            const [rows] = await pool.execute(`
                SELECT v.*, c.nombre_candidato 
                FROM votos v
                JOIN candidatos c ON v.id_candidato_fk = c.id_candidato
                WHERE v.id_usuario_fk = ? AND v.id_tarjeton_fk = ?
            `, [id_usuario, id_tarjeton]);
            
            return rows[0];
        } catch (error) {
            throw new Error('Error al verificar voto: ' + error.message);
        }
    }

    // Obtener estadísticas de votación para un tarjetón
    async getVotingStats(id_tarjeton) {
        try {
            const [totalVotos] = await pool.execute(
                'SELECT COUNT(*) as total FROM votos WHERE id_tarjeton_fk = ?',
                [id_tarjeton]
            );

            const [estadisticasPorCandidato] = await pool.execute(`
                SELECT 
                    c.id_candidato,
                    c.nombre_candidato,
                    COUNT(v.id_voto) as votos,
                    (COUNT(v.id_voto) * 100.0 / ?) as porcentaje
                FROM candidatos c
                LEFT JOIN votos v ON c.id_candidato = v.id_candidato_fk
                WHERE c.id_tarjeton_fk = ?
                GROUP BY c.id_candidato, c.nombre_candidato
                ORDER BY votos DESC
            `, [totalVotos[0].total, id_tarjeton]);

            return {
                total_votos: totalVotos[0].total,
                resultados_por_candidato: estadisticasPorCandidato
            };
        } catch (error) {
            throw new Error('Error al obtener estadísticas: ' + error.message);
        }
    }

    // Obtener listado de votantes por tarjetón
    async getVotersList(id_tarjeton) {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    u.id_usuario,
                    u.nombre_usuario,
                    u.tipo_documento,
                    u.numero_documento,
                    v.fecha_voto,
                    c.nombre_candidato
                FROM votos v
                JOIN usuarios u ON v.id_usuario_fk = u.id_usuario
                JOIN candidatos c ON v.id_candidato_fk = c.id_candidato
                WHERE v.id_tarjeton_fk = ?
                ORDER BY v.fecha_voto DESC
            `, [id_tarjeton]);
            
            return rows;
        } catch (error) {
            throw new Error('Error al obtener lista de votantes: ' + error.message);
        }
    }
}
