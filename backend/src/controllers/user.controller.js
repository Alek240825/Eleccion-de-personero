import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user.model.js';

const userModel = new UserModel();

export const UserController = {
    // Registro de usuario
    async register(req, res) {
        try {
            const userData = req.body;
            
            // Verificar si el correo ya existe
            const existingUser = await userModel.findByEmail(userData.correo);
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'El correo ya está registrado' 
                });
            }

            // Crear el usuario
            const userId = await userModel.create(userData);
            
            res.status(201).json({ 
                message: 'Usuario registrado exitosamente',
                userId 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al registrar usuario',
                error: error.message 
            });
        }
    },

    // Login de usuario
    async login(req, res) {
        try {
            const { correo, contraseña } = req.body;

            // Buscar usuario por correo
            const user = await userModel.findByEmail(correo);
            if (!user) {
                return res.status(401).json({ 
                    message: 'Credenciales inválidas' 
                });
            }

            // Verificar contraseña
            const isValid = await userModel.verifyPassword(contraseña, user.contraseña);
            if (!isValid) {
                return res.status(401).json({ 
                    message: 'Credenciales inválidas' 
                });
            }

            // Generar token
            const token = jwt.sign(
                { id: user.id_usuario, rol: user.rol },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({ 
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id_usuario,
                    nombre: user.nombre_usuario,
                    correo: user.correo,
                    rol: user.rol
                }
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al iniciar sesión',
                error: error.message 
            });
        }
    },

    // Obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            const users = await userModel.findAll();
            res.json(users);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener usuarios',
                error: error.message 
            });
        }
    },

    // Obtener un usuario por ID
    async getUserById(req, res) {
        try {
            const user = await userModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ 
                    message: 'Usuario no encontrado' 
                });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener usuario',
                error: error.message 
            });
        }
    },

    // Actualizar usuario
    async updateUser(req, res) {
        try {
            const updated = await userModel.update(req.params.id, req.body);
            if (!updated) {
                return res.status(404).json({ 
                    message: 'Usuario no encontrado' 
                });
            }
            res.json({ 
                message: 'Usuario actualizado exitosamente' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al actualizar usuario',
                error: error.message 
            });
        }
    },

    // Eliminar usuario
    async deleteUser(req, res) {
        try {
            const deleted = await userModel.delete(req.params.id);
            if (!deleted) {
                return res.status(404).json({ 
                    message: 'Usuario no encontrado' 
                });
            }
            res.json({ 
                message: 'Usuario eliminado exitosamente' 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al eliminar usuario',
                error: error.message 
            });
        }
    }
};
