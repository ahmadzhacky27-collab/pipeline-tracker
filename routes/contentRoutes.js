import express from 'express';
import { getContents, createContent } from '../controllers/contentController.js';
// Impor middleware autentikasi jika ada (misal: verifyToken)

const router = express.Router();

router.get('/contents', getContents);
router.post('/contents', createContent);

export default router;