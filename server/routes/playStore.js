import express from 'express';
import gplay from 'google-play-scraper';

const router = express.Router();

// Search apps in Google Play Store
router.get('/search', async (req, res) => {
    try {
        const { term, country = 'us', lang = 'en', num = 50 } = req.query;

        if (!term) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        const results = await gplay.search({
            term,
            country,
            lang,
            num: parseInt(num),
        });

        res.json({
            success: true,
            count: results.length,
            data: results.map(app => ({
                appId: app.appId,
                title: app.title,
                icon: app.icon,
                developer: app.developer,
                score: app.score,
                ratings: app.ratings,
                price: app.price,
                free: app.free,
                summary: app.summary,
                url: app.url,
                installs: app.installs,
            })),
        });
    } catch (error) {
        console.error('Play Store search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get app details by ID
router.get('/app/:appId', async (req, res) => {
    try {
        const { appId } = req.params;
        const { country = 'us', lang = 'en' } = req.query;

        const appDetails = await gplay.app({
            appId,
            country,
            lang,
        });

        res.json({
            success: true,
            data: {
                appId: appDetails.appId,
                title: appDetails.title,
                icon: appDetails.icon,
                developer: appDetails.developer,
                developerId: appDetails.developerId,
                score: appDetails.score,
                ratings: appDetails.ratings,
                reviews: appDetails.reviews,
                histogram: appDetails.histogram,
                price: appDetails.price,
                free: appDetails.free,
                currency: appDetails.currency,
                description: appDetails.description,
                descriptionHTML: appDetails.descriptionHTML,
                summary: appDetails.summary,
                installs: appDetails.installs,
                minInstalls: appDetails.minInstalls,
                maxInstalls: appDetails.maxInstalls,
                genre: appDetails.genre,
                genreId: appDetails.genreId,
                categories: appDetails.categories,
                contentRating: appDetails.contentRating,
                screenshots: appDetails.screenshots,
                video: appDetails.video,
                videoImage: appDetails.videoImage,
                released: appDetails.released,
                updated: appDetails.updated,
                version: appDetails.version,
                recentChanges: appDetails.recentChanges,
                url: appDetails.url,
            },
        });
    } catch (error) {
        console.error('Play Store app details error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get app reviews
router.get('/app/:appId/reviews', async (req, res) => {
    try {
        const { appId } = req.params;
        const { country = 'us', lang = 'en', num = 100, sort = 'newest' } = req.query;

        const sortMap = {
            newest: gplay.sort.NEWEST,
            rating: gplay.sort.RATING,
            helpfulness: gplay.sort.HELPFULNESS,
        };

        const reviews = await gplay.reviews({
            appId,
            country,
            lang,
            num: parseInt(num),
            sort: sortMap[sort] || gplay.sort.NEWEST,
        });

        res.json({
            success: true,
            count: reviews.data.length,
            data: reviews.data.map(review => ({
                id: review.id,
                userName: review.userName,
                score: review.score,
                title: review.title,
                text: review.text,
                thumbsUp: review.thumbsUp,
                version: review.version,
                date: review.date,
                replyDate: review.replyDate,
                replyText: review.replyText,
            })),
        });
    } catch (error) {
        console.error('Play Store reviews error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get similar apps
router.get('/app/:appId/similar', async (req, res) => {
    try {
        const { appId } = req.params;
        const { country = 'us', lang = 'en' } = req.query;

        const similar = await gplay.similar({
            appId,
            country,
            lang,
        });

        res.json({
            success: true,
            count: similar.length,
            data: similar.map(app => ({
                appId: app.appId,
                title: app.title,
                icon: app.icon,
                developer: app.developer,
                score: app.score,
                price: app.price,
                free: app.free,
            })),
        });
    } catch (error) {
        console.error('Play Store similar apps error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get app permissions
router.get('/app/:appId/permissions', async (req, res) => {
    try {
        const { appId } = req.params;
        const { lang = 'en' } = req.query;

        const permissions = await gplay.permissions({
            appId,
            lang,
        });

        res.json({
            success: true,
            data: permissions,
        });
    } catch (error) {
        console.error('Play Store permissions error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search suggestions
router.get('/suggest', async (req, res) => {
    try {
        const { term, country = 'us', lang = 'en' } = req.query;

        if (!term) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        const suggestions = await gplay.suggest({
            term,
            country,
            lang,
        });

        res.json({
            success: true,
            data: suggestions,
        });
    } catch (error) {
        console.error('Play Store suggestions error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
