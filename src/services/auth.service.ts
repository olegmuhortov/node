import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { IUser, ILoginRequest, IAuthResponse, IRegisterRequest, JwtPayload } from '../types';
import { UserService } from './user.service';

export class AuthService {
  static async register(userData: IRegisterRequest): Promise<IAuthResponse> {

    const existingUser = await UserService.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Данный пользователь уже зарегистрирован');
    }

    const user = await UserService.createUser(userData);
    
    const token = this.generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  static async login(loginData: ILoginRequest): Promise<IAuthResponse> {
    const { email, password } = loginData;

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Неверные учетные данные');
    }

    if (user.status !== 'active') {
      throw new Error('Аккаунт пользователя неактивен');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error('Неверные учетные данные');
    }
    
    const token = this.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: user.toObject() as any,
      token,
    };
  }

  static generateToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw new Error('Неправильный пароль');
    }

    user.password = newPassword;
    await user.save();
  }
}
