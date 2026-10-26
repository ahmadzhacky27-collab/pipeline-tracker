import express from 'express';
import { createChannel, getChannels } from '../controllers/channelController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createChannel);
router.get('/', verifyToken, getChannels);

export default router;