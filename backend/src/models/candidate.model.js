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

export class CandidateModel {
    // Crear un nuevo candidato
    async create(candidateData) {
        const { nombre_candidato, propuesta, foto, id_tarjeton_fk, id_usuario_fk } = candidateData;

        try {
            const [result] = await pool.execute(
                'INSERT INTO candidatos (nombre_candidato, propuesta, foto, id_tarjeton_fk, id_usuario_fk) VALUES (?, ?, ?, ?, ?)',
                [nombre_candidato, propuesta, foto, id_tarjeton_fk, id_usuario_fk]
            );
            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear candidato: ' + error.message);
        }
    }

    // Obtener todos los candidatos
    async findAll() {
        try {
            const [rows] = await pool.execute(`
                SELECT c.*, t.anio, t.estado as estado_tarjeton, u.nombre_usuario 
                FROM candidatos c
                JOIN tarjetones t ON c.id_tarjeton_fk = t.id_tarjeton
                JOIN usuarios u ON c.id_usuario_fk = u.id_usuario
            `);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener candidatos: ' + error.message);
        }
    }

    // Obtener candidatos por tarjetón
    async findByTarjeton(id_tarjeton) {
        try {
            const [rows] = await pool.execute(
                `SELECT c.*, t.anio, t.estado as estado_tarjeton, u.nombre_usuario 
                 FROM candidatos c
                 JOIN tarjetones t ON c.id_tarjeton_fk = t.id_tarjeton
                 JOIN usuarios u ON c.id_usuario_fk = u.id_usuario
                 WHERE c.id_tarjeton_fk = ?`,
                [id_tarjeton]
            );
            return rows;
        } catch (error) {
            throw new Error('Error al obtener candidatos del tarjetón: ' + error.message);
        }
    }

    // Obtener un candidato por ID
    async findById(id) {
        try {
            const [rows] = await pool.execute(
                `SELECT c.*, t.anio, t.estado as estado_tarjeton, u.nombre_usuario 
                 FROM candidatos c
                 JOIN tarjetones t ON c.id_tarjeton_fk = t.id_tarjeton
                 JOIN usuarios u ON c.id_usuario_fk = u.id_usuario
                 WHERE c.id_candidato = ?`,
                [id]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener candidato: ' + error.message);
        }
    }

    // Actualizar candidato
    async update(id, candidateData) {
        const { nombre_candidato, propuesta, foto } = candidateData;
        
        try {
            const [result] = await pool.execute(
                'UPDATE candidatos SET nombre_candidato = ?, propuesta = ?, foto = ? WHERE id_candidato = ?',
                [nombre_candidato, propuesta, foto, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al actualizar candidato: ' + error.message);
        }
    }

    // Eliminar candidato
    async delete(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM candidatos WHERE id_candidato = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al eliminar candidato: ' + error.message);
        }
    }
}
