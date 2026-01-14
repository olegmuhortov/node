const mongoose = require('mongoose');
require('dotenv').config();

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Подключение к MongoDB');

    const User = require('../src/models/user.model').User;
    
    const adminExists = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminExists) {
      await User.create({
        fullName: 'System Administrator',
        birthDate: new Date('1990-01-01'),
        email: 'admin@example.com',
        password: 'Admin123!',
        role: 'admin',
        status: 'active',
      });
      console.log('Default admin user created');
    }

    console.log('Успешная инициализация');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка инициализации:', error);
    process.exit(1);
  }
};

initDatabase();
