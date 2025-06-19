import express from 'express';
import { getAllBooks, addBook, getBookById, deleteBook, updateBook } from '../controllers/book.controller.js';
import { authenticate, authorizeAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllBooks);
router.post('/', authenticate, authorizeAdmin, addBook);
router.get('/:id', getBookById);
router.delete('/:id', authenticate, authorizeAdmin, deleteBook);
router.patch('/:id', authenticate, authorizeAdmin, updateBook);

export default router;
