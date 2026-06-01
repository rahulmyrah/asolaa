import express from 'express';
import {
    dataForSeoStatus,
    getBacklinkSummary,
    getKeywordSuggestions,
    getSerpCompetitors,
} from '../services/dataForSeo.js';
import {
    analyzePage,
    buildPrioritizedFixes,
    fallbackKeywords,
    fetchPageSnapshot,
    normalizeUrl,
} from '../services/seoAnalyzer.js';
import { aiStatus, generateContentBrief, generateStrategy } from '../services/seoGenerator.js';
import { getProductProfile, mergeProfileCompetitors } from '../services/productProfiles.js';
import {
    getSeoAudit,
    listSeoAudits,
    neonStatus,
    saveContentBrief,
    saveSeoAudit,
    saveSeoStrategy,
} from '../services/neonDb.js';

const router = express.Router();
const auditStore = new Map();

const makeAuditId = () => `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

router.get('/status', (req, res) => {
    res.json({
        success: true,
        dataForSeo: dataForSeoStatus(),
        ai: aiStatus(),
        neon: neonStatus(),
    });
});

router.get('/audits', async (req, res) => {
    const audits = await listSeoAudits(20);
    res.json({
        success: true,
        persisted: neonStatus().configured,
        data: audits,
    });
});

router.post('/audit', async (req, res) => {
    try {
        const {
            url: rawUrl,
            niche = '',
            country = 'us',
            language = 'en',
            targetAudience = '',
        } = req.body;

        const url = normalizeUrl(rawUrl);
        const snapshot = await fetchPageSnapshot(url.href);
        const analysis = analyzePage({ url, html: snapshot.html, niche, targetAudience });
        const profile = getProductProfile(analysis.domain);
        const seedKeyword = profile?.seedKeyword || niche || analysis.h1 || analysis.title || analysis.domain;

        const [keywordResult, serpResult, backlinkResult] = await Promise.all([
            getKeywordSuggestions({ keyword: seedKeyword, country, language, limit: 50 }),
            getSerpCompetitors({ keyword: seedKeyword, country, language, depth: 10 }),
            getBacklinkSummary({ target: analysis.domain }),
        ]);

        const profileKeywords = profile?.keywordOpportunities?.map((keyword) => ({
            keyword,
            searchVolume: 0,
            cpc: 0,
            competition: 0,
            difficulty: null,
            intent: 'profile',
            source: 'profile',
        })) || [];
        const liveKeywords = keywordResult.items.length ? keywordResult.items : fallbackKeywords(seedKeyword);
        const keywordSeen = new Set();
        const keywords = [...profileKeywords, ...liveKeywords].filter((item) => {
            if (!item.keyword || keywordSeen.has(item.keyword.toLowerCase())) return false;
            keywordSeen.add(item.keyword.toLowerCase());
            return true;
        });
        const serpCompetitors = serpResult.items.length
            ? serpResult.items
            : [
                { title: `Top result for ${seedKeyword}`, domain: 'example.com', url: 'https://example.com', rank: 1 },
                { title: `${seedKeyword} guide`, domain: 'example.org', url: 'https://example.org', rank: 2 },
            ];
        const competitors = mergeProfileCompetitors(serpCompetitors, profile);
        const backlinkSummary = backlinkResult.summary;
        const fixes = buildPrioritizedFixes(analysis, backlinkSummary);

        const audit = {
            id: makeAuditId(),
            createdAt: new Date().toISOString(),
            input: { url: url.href, niche, country, language, targetAudience },
            page: {
                fetched: snapshot.ok,
                status: snapshot.status,
                finalUrl: snapshot.finalUrl,
                error: snapshot.error || null,
            },
            ...analysis,
            productProfile: profile,
            keywords,
            competitors,
            backlinkProfile: backlinkSummary || {
                backlinks: 0,
                referring_domains: 0,
                referring_pages: 0,
                broken_backlinks: 0,
            },
            fixes,
            dataSources: {
                dataForSeo: {
                    configured: dataForSeoStatus().configured,
                    keywords: keywordResult.status,
                    keywordsMessage: keywordResult.message || null,
                    serp: serpResult.status,
                    serpMessage: serpResult.message || null,
                    backlinks: backlinkResult.status,
                    backlinksMessage: backlinkResult.message || null,
                },
                ai: aiStatus(),
            },
            raw: {
                keywordTask: keywordResult.data?.tasks?.[0]?.id || null,
                serpTask: serpResult.data?.tasks?.[0]?.id || null,
                backlinkTask: backlinkResult.data?.tasks?.[0]?.id || null,
            },
        };

        auditStore.set(audit.id, audit);
        const persisted = await saveSeoAudit(audit);
        res.json({
            success: true,
            persisted: Boolean(persisted),
            data: audit,
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

router.post('/strategy', async (req, res) => {
    try {
        const { auditId, seedKeywords = [], competitors = [], goal } = req.body;
        const audit = auditStore.get(auditId) || await getSeoAudit(auditId) || null;

        if (!audit && seedKeywords.length === 0) {
            return res.status(400).json({ success: false, error: 'Provide a valid auditId or seedKeywords.' });
        }

        const strategy = await generateStrategy({
            audit,
            seedKeywords,
            competitors: competitors.length ? competitors : audit?.competitors || [],
            goal,
        });

        res.json({
            success: true,
            source: strategy.source,
            persisted: Boolean(await saveSeoStrategy({
                auditId: auditId || null,
                source: strategy.source,
                strategy: strategy.data,
            })),
            data: {
                auditId: auditId || null,
                createdAt: new Date().toISOString(),
                ...strategy.data,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.post('/content/brief', async (req, res) => {
    try {
        const { auditId, keyword, funnelStage, targetUrl, competitors = [] } = req.body;
        if (!keyword) {
            return res.status(400).json({ success: false, error: 'keyword is required.' });
        }

        const brief = await generateContentBrief({ keyword, funnelStage, targetUrl, competitors });
        res.json({
            success: true,
            source: brief.source,
            persisted: Boolean(await saveContentBrief({
                auditId: auditId || null,
                keyword,
                funnelStage,
                source: brief.source,
                brief: brief.data,
            })),
            data: {
                createdAt: new Date().toISOString(),
                ...brief.data,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
