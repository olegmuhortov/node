import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate, authorize, authorizeSelfOrAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get(
  '/:id',
  authenticate,
  authorizeSelfOrAdmin,
  UserController.getUserById
);

router.get(
  '/',
  authenticate,
  authorize('admin'),
  UserController.getAllUsers
);

router.patch(
  '/:id/status',
  authenticate,
  authorizeSelfOrAdmin,
  UserController.updateUserStatus
);

router.get(
  '/profile/me',
  authenticate,
  UserController.getProfile
);

export default router;
