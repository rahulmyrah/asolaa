import express from 'express';
import store from 'app-store-scraper';

const router = express.Router();

// Search apps in iOS App Store
router.get('/search', async (req, res) => {
    try {
        const { term, country = 'us', num = 50 } = req.query;

        if (!term) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        const results = await store.search({
            term,
            country,
            num: parseInt(num),
        });

        res.json({
            success: true,
            count: results.length,
            data: results.map(app => ({
                id: app.id,
                appId: app.appId,
                title: app.title,
                icon: app.icon,
                developer: app.developer,
                score: app.score,
                ratings: app.ratings,
                price: app.price,
                free: app.free,
                description: app.description,
                url: app.url,
            })),
        });
    } catch (error) {
        console.error('App Store search error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get app details by ID
router.get('/app/:appId', async (req, res) => {
    try {
        const { appId } = req.params;
        const { country = 'us' } = req.query;

        const appDetails = await store.app({
            appId,
            country,
        });

        res.json({
            success: true,
            data: {
                id: appDetails.id,
                appId: appDetails.appId,
                title: appDetails.title,
                icon: appDetails.icon,
                developer: appDetails.developer,
                developerId: appDetails.developerId,
                score: appDetails.score,
                ratings: appDetails.ratings,
                reviews: appDetails.reviews,
                price: appDetails.price,
                free: appDetails.free,
                currency: appDetails.currency,
                description: appDetails.description,
                releaseNotes: appDetails.releaseNotes,
                version: appDetails.version,
                size: appDetails.size,
                genres: appDetails.genres,
                genreIds: appDetails.genreIds,
                primaryGenre: appDetails.primaryGenre,
                primaryGenreId: appDetails.primaryGenreId,
                contentRating: appDetails.contentRating,
                languages: appDetails.languages,
                screenshots: appDetails.screenshots,
                ipadScreenshots: appDetails.ipadScreenshots,
                supportedDevices: appDetails.supportedDevices,
                released: appDetails.released,
                updated: appDetails.updated,
                url: appDetails.url,
            },
        });
    } catch (error) {
        console.error('App Store app details error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get app reviews
router.get('/app/:appId/reviews', async (req, res) => {
    try {
        const { appId } = req.params;
        const { country = 'us', page = 1, sort = 'recent' } = req.query;

        const sortMap = {
            recent: store.sort.RECENT,
            helpful: store.sort.HELPFUL,
        };

        const reviews = await store.reviews({
            appId,
            country,
            page: parseInt(page),
            sort: sortMap[sort] || store.sort.RECENT,
        });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews.map(review => ({
                id: review.id,
                userName: review.userName,
                score: review.score,
                title: review.title,
                text: review.text,
                url: review.url,
                version: review.version,
                updated: review.updated,
            })),
        });
    } catch (error) {
        console.error('App Store reviews error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get similar apps
router.get('/app/:appId/similar', async (req, res) => {
    try {
        const { appId } = req.params;
        const { country = 'us' } = req.query;

        const similar = await store.similar({
            appId,
            country,
        });

        res.json({
            success: true,
            count: similar.length,
            data: similar.map(app => ({
                id: app.id,
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
        console.error('App Store similar apps error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Search suggestions
router.get('/suggest', async (req, res) => {
    try {
        const { term, country = 'us' } = req.query;

        if (!term) {
            return res.status(400).json({ error: 'Search term is required' });
        }

        const suggestions = await store.suggest({
            term,
            country,
        });

        res.json({
            success: true,
            data: suggestions,
        });
    } catch (error) {
        console.error('App Store suggestions error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get Market Trends (Top Charts)
router.get('/trends', async (req, res) => {
    const { collection, category, country } = req.query;
    try {
        const results = await store.list({
            collection: store.collection[collection] || store.collection.TOP_FREE_IOS,
            category: store.category[category] || store.category.FINANCE,
            country: country || 'us',
            num: 20
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
