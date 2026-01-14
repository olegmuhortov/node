import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/user_service');
    console.log('Успешное подключение');
  } catch (error) {
    console.error('Ошибка подключения:', error);
    process.exit(1);
  }
};
