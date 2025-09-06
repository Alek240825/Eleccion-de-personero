import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

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

export class UserModel {
    // Crear un nuevo usuario
    async create(userData) {
        const { nombre_usuario, tipo_documento, numero_documento, correo, contraseña, rol = 'Usuario' } = userData;
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        try {
            const [result] = await pool.execute(
                'INSERT INTO usuarios (nombre_usuario, tipo_documento, numero_documento, correo, contraseña, rol) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre_usuario, tipo_documento, numero_documento, correo, hashedPassword, rol]
            );
            return result.insertId;
        } catch (error) {
            throw new Error('Error al crear usuario: ' + error.message);
        }
    }

    // Buscar usuario por correo
    async findByEmail(correo) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM usuarios WHERE correo = ?',
                [correo]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }

    // Buscar usuario por ID
    async findById(id) {
        try {
            const [rows] = await pool.execute(
                'SELECT * FROM usuarios WHERE id_usuario = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }

    // Obtener todos los usuarios
    async findAll() {
        try {
            const [rows] = await pool.execute(
                'SELECT id_usuario, nombre_usuario, tipo_documento, numero_documento, correo, rol, estado, fecha_registro FROM usuarios'
            );
            return rows;
        } catch (error) {
            throw new Error('Error al obtener usuarios: ' + error.message);
        }
    }

    // Actualizar usuario
    async update(id, userData) {
        const { nombre_usuario, tipo_documento, numero_documento, correo, estado, rol } = userData;
        
        try {
            const [result] = await pool.execute(
                'UPDATE usuarios SET nombre_usuario = ?, tipo_documento = ?, numero_documento = ?, correo = ?, estado = ?, rol = ? WHERE id_usuario = ?',
                [nombre_usuario, tipo_documento, numero_documento, correo, estado, rol, id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al actualizar usuario: ' + error.message);
        }
    }

    // Eliminar usuario
    async delete(id) {
        try {
            const [result] = await pool.execute(
                'DELETE FROM usuarios WHERE id_usuario = ?',
                [id]
            );
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al eliminar usuario: ' + error.message);
        }
    }

    // Verificar contraseña
    async verifyPassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}
