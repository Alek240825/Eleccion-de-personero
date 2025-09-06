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

export class TarjetonModel {
    // Crear un nuevo tarjetón
    async create(tarjetonData) {
        const { anio } = tarjetonData;

        try {
            // Verificar si ya existe un tarjetón para ese año
            const [existing] = await pool.execute(
                'SELECT * FROM tarjetones WHERE anio = ?',
                [anio]
            );

            if (existing.length > 0) {
                throw new Error('Ya existe un tarjetón para este año');
            }

            const [result] = await pool.execute(
                'INSERT INTO tarjetones (anio) VALUES (?)',
                [anio]
            );
            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear tarjetón: ' + error.message);
        }
    }

    // Obtener todos los tarjetones
    async findAll() {
        try {
            const [rows] = await pool.execute(`
                SELECT t.*, 
                       COUNT(c.id_candidato) as numero_candidatos,
                       COUNT(DISTINCT v.id_voto) as numero_votos
                FROM tarjetones t
                LEFT JOIN candidatos c ON t.id_tarjeton = c.id_tarjeton_fk
                LEFT JOIN votos v ON t.id_tarjeton = v.id_tarjeton_fk
                GROUP BY t.id_tarjeton
                ORDER BY t.anio DESC
            `);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener tarjetones: ' + error.message);
        }
    }

    // Obtener tarjetón por ID
    async findById(id) {
        try {
            const [rows] = await pool.execute(`
                SELECT t.*, 
                       COUNT(c.id_candidato) as numero_candidatos,
                       COUNT(DISTINCT v.id_voto) as numero_votos
                FROM tarjetones t
                LEFT JOIN candidatos c ON t.id_tarjeton = c.id_tarjeton_fk
                LEFT JOIN votos v ON t.id_tarjeton = v.id_tarjeton_fk
                WHERE t.id_tarjeton = ?
                GROUP BY t.id_tarjeton
            `, [id]);
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener tarjetón: ' + error.message);
        }
    }

    // Obtener tarjetón activo
    async findActive() {
        try {
            const [rows] = await pool.execute(`
                SELECT t.*, 
                       COUNT(c.id_candidato) as numero_candidatos,
                       COUNT(DISTINCT v.id_voto) as numero_votos
                FROM tarjetones t
                LEFT JOIN candidatos c ON t.id_tarjeton = c.id_tarjeton_fk
                LEFT JOIN votos v ON t.id_tarjeton = v.id_tarjeton_fk
                WHERE t.estado = 'En Curso'
                GROUP BY t.id_tarjeton
            `);
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener tarjetón activo: ' + error.message);
        }
    }

    // Actualizar estado del tarjetón
    async updateStatus(id, estado) {
        try {
            if (estado === 'En Curso') {
                // Si se va a activar un tarjetón, primero finalizar cualquier otro activo
                await pool.execute(
                    "UPDATE tarjetones SET estado = 'Finalizado' WHERE estado = 'En Curso'"
                );
            }

            const [result] = await pool.execute(
                'UPDATE tarjetones SET estado = ? WHERE id_tarjeton = ?',
                [estado, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al actualizar estado del tarjetón: ' + error.message);
        }
    }

    // Obtener resultados de un tarjetón
    async getResults(id_tarjeton) {
        try {
            const [rows] = await pool.execute(`
                SELECT 
                    c.id_candidato,
                    c.nombre_candidato,
                    COUNT(v.id_voto) as total_votos,
                    (COUNT(v.id_voto) * 100.0 / (
                        SELECT COUNT(*) 
                        FROM votos 
                        WHERE id_tarjeton_fk = ?
                    )) as porcentaje
                FROM candidatos c
                LEFT JOIN votos v ON c.id_candidato = v.id_candidato_fk
                WHERE c.id_tarjeton_fk = ?
                GROUP BY c.id_candidato, c.nombre_candidato
                ORDER BY total_votos DESC
            `, [id_tarjeton, id_tarjeton]);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener resultados: ' + error.message);
        }
    }
}
