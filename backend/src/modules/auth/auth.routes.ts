import { Router } from 'express';
import { loginController, meController, refreshController, registerController } from './auth.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/refresh', refreshController);
router.get('/me', authMiddleware, meController);

export default router;
