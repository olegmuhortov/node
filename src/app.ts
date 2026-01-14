import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { requestLogger, stream } from './utils/logger';
import logger from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('combined', { stream }));
app.use(requestLogger);

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected' 
  });
});

app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: 'Путь не найден',
    path: req.url 
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Неизвестная ошибка', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  
  const statusCode = err.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Внутренняя ошибка сервера' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

process.on('SIGTERM', () => {
  logger.info('Сервер закрыт(SIGTERM)');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Сервер закрыт(SIGINT)');
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`Порт сервера: ${PORT}`);
  logger.info(`Среда: ${process.env.NODE_ENV}`);
});

export default app;
