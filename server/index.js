import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import appStoreRoutes from './routes/appStore.js';
import playStoreRoutes from './routes/playStore.js';
import researchRoutes from './routes/research.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appstore', appStoreRoutes);
app.use('/api/playstore', playStoreRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`🚀 ASOLAA API Server running on port ${PORT}`);
});

export default app;
