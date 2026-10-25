import express from 'express';
import { getContents, createContent, getContentById } from '../controllers/contentController.js'
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getContents);
router.post('/', verifyToken, createContent);
router.get('/:id', verifyToken, getContentById); // 👈 Pastikan rute ini ada!

export default router;