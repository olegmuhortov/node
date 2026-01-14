import { body } from 'express-validator';

export const registerValidation = [
  body('fullName')
    .notEmpty().withMessage('Введите ваше полное имя')
    .isLength({ min: 4, max: 100 }).withMessage('Длина имени минимум 4 символа'),
  
  body('birthDate')
    .notEmpty().withMessage('Введите вашу дату рождения')
    .isISO8601().withMessage('Неверный формат при вводе даты'),
  
  body('email')
    .notEmpty().withMessage('Введите ваш мейл')
    .isEmail().withMessage('Неверный формат при вводе мейла')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Введите пароль')
    .isLength({ min: 6 }).withMessage('Пароль должен состоять минимум из 6 символов'),
];

export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Введите ваш мейл')
    .isEmail().withMessage('Неверный формат при вводе мейла')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Введите пароль'),
];
