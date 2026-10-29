import express from 'express';
import { upsertMetric, getMetricsByContent } from '../controllers/metricController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route untuk mencatat metrik konten
router.post('/:id/metrics', verifyToken, upsertMetric);

// Route untuk melihat riwayat metrik konten
router.get('/:id/metrics', verifyToken, getMetricsByContent);

export default router;