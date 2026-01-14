import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UserStatus } from '../types';

export class UserController {
  static async getUserById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      
      if (!user) {
        res.status(404).json({ error: 'Пользователь не найден' });
        return;
      }
      
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await UserService.getAllUsers(page, limit);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUserStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!['active', 'inactive'].includes(status)) {
        res.status(400).json({ error: 'Недопустимое значение статуса' });
        return;
      }
      
      const user = await UserService.updateUserStatus(id, status as UserStatus);
      
      if (!user) {
        res.status(404).json({ error: 'Пользователь не найден' });
        return;
      }
      
      res.json({ 
        message: `User status updated to ${status}`,
        user 
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserById(req.user._id.toString());
      res.json({ user });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
