import express from 'express';
import { 
    getContents, 
    createContent, 
    getContentById, 
    updateContent, 
    deleteContent 
} from '../controllers/contentController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getContents);
router.post('/', verifyToken, createContent);
router.get('/:id', verifyToken, getContentById);
router.put('/:id', verifyToken, updateContent);   // Untuk update penuh / transisi status
router.patch('/:id', verifyToken, updateContent); // Untuk update sebagian
router.delete('/:id', verifyToken, deleteContent);

export default router;