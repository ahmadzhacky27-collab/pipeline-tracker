import express from 'express';
import { submitReview, processReview } from '../controllers/reviewController.js';
import { verifyToken } from '../middlewares/authMiddleware.js'; // Sesuaikan path jika berbeda

const router = express.Router();

router.post('/:id/submit', verifyToken, submitReview);
router.post('/:id/process', verifyToken, processReview);

export default router;