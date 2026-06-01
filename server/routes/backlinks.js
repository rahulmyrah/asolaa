import express from 'express';
import { listBacklinkOutreachItems, neonStatus, saveBacklinkOutreachItems } from '../services/neonDb.js';

const router = express.Router();
const outreachStore = [];

router.post('/outreach', async (req, res) => {
    const { prospects = [], campaignName = 'Backlink Outreach', offer = 'expert contribution or useful resource' } = req.body;

    if (!Array.isArray(prospects) || prospects.length === 0) {
        return res.status(400).json({ success: false, error: 'prospects must be a non-empty array.' });
    }

    const drafts = prospects.map((prospect) => {
        const domain = prospect.domain || prospect.url || prospect.prospect || 'target site';
        const title = prospect.title || domain;
        const record = {
            id: `outreach_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            campaignName,
            prospect: domain,
            title,
            priority: prospect.priority || 'medium',
            status: 'needs_review',
            subject: `Resource idea for ${title}`,
            body: `Hi,\n\nI found ${domain} while researching relevant resources for this topic. We can contribute ${offer} that would be useful for your readers and naturally support the page.\n\nWould you be open to reviewing a short draft or resource suggestion?\n\nBest,\nASOLAA SEO Team`,
            requiresHumanApproval: true,
            createdAt: new Date().toISOString(),
        };
        outreachStore.push(record);
        return record;
    });

    const saved = await saveBacklinkOutreachItems(drafts);
    res.json({
        success: true,
        persisted: saved.length > 0,
        persistence: neonStatus(),
        data: drafts,
    });
});

router.get('/outreach', async (req, res) => {
    const persistedItems = await listBacklinkOutreachItems(100);
    res.json({
        success: true,
        persisted: neonStatus().configured,
        data: neonStatus().configured ? persistedItems : outreachStore.slice(-100).reverse(),
    });
});

export default router;
