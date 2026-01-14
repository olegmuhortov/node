import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, birthDate, email, password } = req.body;
      
      const result = await AuthService.register({
        fullName,
        birthDate: new Date(birthDate),
        email,
        password,
      });
      
      res.status(201).json({
        message: 'Пользователь зарегистрирован',
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      const result = await AuthService.login({ email, password });
      
      res.json({
        message: 'Успешная авторизация',
        ...result,
      });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  static async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      
      await AuthService.changePassword(
        req.user._id.toString(),
        currentPassword,
        newPassword
      );
      
      res.json({ message: 'Пароль изменён' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
