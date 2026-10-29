import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import channelRoutes from './routes/channelRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import checklistRoutes from './routes/checklistRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import metricRoutes from './routes/metricRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/channels', channelRoutes);
app.use('/api/v1/contents', contentRoutes);
app.use('/api/v1', checklistRoutes);
app.use('/api/v1/contents', reviewRoutes);
app.use('/api/v1/contents', metricRoutes);

export default app;