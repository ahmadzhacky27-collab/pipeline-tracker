import express from 'express';
import { 
    addChecklist, 
    toggleChecklist, 
    deleteChecklist 
} from '../controllers/checklistController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/contents/:id/checklists', verifyToken, addChecklist);
router.patch('/checklists/:id/toggle', verifyToken, toggleChecklist);
router.delete('/checklists/:id', verifyToken, deleteChecklist);

export default router;