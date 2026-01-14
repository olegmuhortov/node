import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { JwtPayload } from '../types';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Авторизация')?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ error: 'Требуется аутентификация' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: 'Пользователь не существует' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Токен недействителен' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Требуется аутентификация' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'У вас недостаточно прав' });
      return;
    }

    next();
  };
};

export const authorizeSelfOrAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Требуется аутентификация' });
    return;
  }

  const requestedUserId = req.params.id;
  const isAdmin = req.user.role === 'admin';
  const isSelf = req.user._id.toString() === requestedUserId;

  if (!isAdmin && !isSelf) {
    res.status(403).json({ error: 'Вы можете получить доступ только к своим собственным данным' });
    return;
  }

  next();
};
