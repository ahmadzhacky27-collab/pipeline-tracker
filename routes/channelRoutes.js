import express from 'express';
import { createChannel, getChannels } from '../controllers/channelController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/channels', verifyToken, createChannel);
router.get('/channels', verifyToken, getChannels);

export default router;