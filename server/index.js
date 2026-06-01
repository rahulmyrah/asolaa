import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import appStoreRoutes from './routes/appStore.js';
import playStoreRoutes from './routes/playStore.js';
import researchRoutes from './routes/research.js';
import aiRoutes from './routes/ai.js';
import seoRoutes from './routes/seo.js';
import publishingRoutes from './routes/publishing.js';
import backlinkRoutes from './routes/backlinks.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, '..', 'dist');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appstore', appStoreRoutes);
app.use('/api/playstore', playStoreRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/publishing', publishingRoutes);
app.use('/api/backlinks', backlinkRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the Vite production build from the same Render service.
app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 ASOLAA API Server running on port ${PORT}`);
});

export default app;
