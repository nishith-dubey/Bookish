import express from 'express';
import { getReviews, createReview } from '../controllers/review.controller.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getReviews); 
router.post('/', authenticate,createReview);

export default router;
