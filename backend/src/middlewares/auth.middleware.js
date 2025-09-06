import jwt from 'jsonwebtoken';

export const authMiddleware = {
    // Verificar token de autenticación
    verifyToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ 
                message: 'No se proporcionó token de autenticación' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ 
                message: 'Token inválido' 
            });
        }
    },

    // Verificar rol de administrador
    isAdmin(req, res, next) {
        if (req.user.rol !== 'Administrador') {
            return res.status(403).json({ 
                message: 'Acceso denegado. Se requiere rol de administrador' 
            });
        }
        next();
    }
};
