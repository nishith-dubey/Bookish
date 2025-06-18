import express from 'express';
import { getAllBooks, addBook, getBookById } from '../controllers/book.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllBooks);
router.post('/', authenticate, authorizeAdmin, addBook);
router.get('/:id', getBookById);

export default router;
