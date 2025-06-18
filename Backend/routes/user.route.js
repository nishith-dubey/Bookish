import express from 'express';
import { registerUser, getUserById, loginUser, updateUser } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/:id', getUserById);   
router.put('/:id', authenticate, updateUser);
router.post('/register', registerUser);
router.post('/login', loginUser)

export default router;
