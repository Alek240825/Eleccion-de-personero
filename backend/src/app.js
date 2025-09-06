import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import voteRoutes from './routes/vote.routes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/votes', voteRoutes);

// Manejo de errores básico
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
