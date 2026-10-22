import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import channelRoutes from './routes/channelRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Daftarkan Routes Auth & Channels[cite: 11]
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', channelRoutes);

export default app;