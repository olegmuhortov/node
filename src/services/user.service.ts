import { User } from '../models/user.model';
import { IUser, IUserResponse, UserStatus } from '../types';

export class UserService {
  static async createUser(userData: Partial<IUser>): Promise<IUserResponse> {
    const user = await User.create(userData);
    return user.toObject() as IUserResponse;
  }

  static async getUserById(id: string): Promise<IUserResponse | null> {
    const user = await User.findById(id);
    return user ? (user.toObject() as IUserResponse) : null;
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  static async getAllUsers(
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: IUserResponse[]; total: number; page: number; pages: number }> {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit),
      User.countDocuments(),
    ]);

    return {
      users: users.map(user => user.toObject() as IUserResponse),
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  static async updateUserStatus(
    id: string,
    status: UserStatus
  ): Promise<IUserResponse | null> {
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    return user ? (user.toObject() as IUserResponse) : null;
  }

  static async updateUser(
    id: string,
    updateData: Partial<IUser>
  ): Promise<IUserResponse | null> {
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    return user ? (user.toObject() as IUserResponse) : null;
  }
}
