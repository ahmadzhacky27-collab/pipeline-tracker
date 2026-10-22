import express from 'express';
import { createChannel, getChannels } from '../controllers/channelController.js';

const router = express.Router();

router.post('/channels', createChannel);
router.get('/channels', getChannels);

export default router;