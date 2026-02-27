import express from 'express';
import { register, login, logout, getSession } from '../controllers/authController';
import { validate, validateBody } from '../middleware/validate';
import { registerSchema, loginSchema } from '../utils/validationSchemas';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', protect, logout);
router.get('/session', protect, getSession);

export default router;
