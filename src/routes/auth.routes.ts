import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../utils/validators';
import { validateRequest } from '../middlewares/validation.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post(
  '/register',
  registerValidation,
  validateRequest,
  AuthController.register
);

router.post(
  '/login',
  loginValidation,
  validateRequest,
  AuthController.login
);

router.post(
  '/change-password',
  authenticate,
  AuthController.changePassword
);

export default router;
