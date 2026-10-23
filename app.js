import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import contentRoutes from './routes/contentRoutes.js'

const app = express();

app.use(cors());
app.use(express.json());

// Daftarkan Routes Auth & Channels[cite: 11]
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/', channelRoutes);
app.use('/api/v1/', contentRoutes);

export default app;