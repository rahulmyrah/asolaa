import express from 'express';
import { listPublishingQueueItems, neonStatus, savePublishingQueueItems } from '../services/neonDb.js';

const router = express.Router();
const publishingQueue = [];

const APPROVED_PLATFORMS = new Set(['wordpress', 'medium', 'linkedin', 'x', 'facebook', 'instagram']);

router.post('/queue', async (req, res) => {
    const { items = [], campaignName = 'SEO Content Campaign' } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, error: 'items must be a non-empty array.' });
    }

    const queued = items.map((item) => {
        const platform = String(item.platform || item.channel || 'draft').toLowerCase();
        const approved = APPROVED_PLATFORMS.has(platform);
        const record = {
            id: `pub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            campaignName,
            platform,
            title: item.title || item.keyword || 'Untitled draft',
            content: item.content || item.post || '',
            status: approved ? 'queued_for_approval' : 'draft_export_only',
            requiresHumanApproval: true,
            note: approved
                ? 'Connected-account posting requires OAuth/API setup and final approval.'
                : 'Unsupported platform saved as a draft. No third-party submission was attempted.',
            createdAt: new Date().toISOString(),
        };
        publishingQueue.push(record);
        return record;
    });

    const saved = await savePublishingQueueItems(queued);
    res.json({
        success: true,
        persisted: saved.length > 0,
        persistence: neonStatus(),
        data: queued,
    });
});

router.get('/queue', async (req, res) => {
    const persistedItems = await listPublishingQueueItems(100);
    res.json({
        success: true,
        persisted: neonStatus().configured,
        data: neonStatus().configured ? persistedItems : publishingQueue.slice(-100).reverse(),
    });
});

export default router;
