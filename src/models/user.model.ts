import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole, UserStatus } from '../types';

const userSchema = new Schema<IUser>({
  fullName: {
    type: String,
    required: [true, 'Введите ваше полное имя'],
    trim: true,
  },
  birthDate: {
    type: Date,
    required: [true, 'Введите вашу дату рождения'],
  },
  email: {
    type: String,
    required: [true, 'Введиите ваш мейл'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Введите мейл в правильном формате'],
  },
  password: {
    type: String,
    required: [true, 'Введите пароль'],
    minlength: [6, 'Пароль должен состоять из минимум 6 символов'],
    select: false,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
  transform: (_, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export const User = model<IUser>('User', userSchema);
