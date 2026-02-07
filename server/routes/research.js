import express from 'express';
import appStore from 'app-store-scraper';
import gplay from 'google-play-scraper';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// Deep research - full market analysis and keyword generation
router.post('/deep', async (req, res) => {
    try {
        const {
            appIdea,
            category,
            targetAudience,
            features,
            country = 'us'
        } = req.body;

        const geminiKey = req.headers['x-gemini-api-key'];
        const anthropicKey = req.headers['x-anthropic-api-key'];

        if (!geminiKey || !anthropicKey) {
            return res.status(400).json({
                error: 'Both Gemini and Anthropic API keys required'
            });
        }

        console.log('🔬 Starting deep research for:', appIdea);
        const startTime = Date.now();

        // Step 1: Generate search terms from app idea
        console.log('Step 1: Generating search terms...');
        const genAI = new GoogleGenerativeAI(geminiKey);
        const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-preview-05-06' });

        const searchTermsPrompt = `Given this app idea, generate 10 search terms to find similar competing apps:
App Idea: ${appIdea}
Category: ${category}

Return ONLY a JSON array of search terms: ["term1", "term2", ...]`;

        const searchTermsResult = await geminiModel.generateContent(searchTermsPrompt);
        const searchTermsText = await searchTermsResult.response.text();
        const searchTermsMatch = searchTermsText.match(/\[[\s\S]*\]/);
        const searchTerms = searchTermsMatch ? JSON.parse(searchTermsMatch[0]) : [appIdea];

        // Step 2: Search both stores for competitors
        console.log('Step 2: Searching app stores...');
        const allCompetitors = [];

        for (const term of searchTerms.slice(0, 5)) {
            try {
                // iOS App Store
                const iosResults = await appStore.search({ term, country, num: 10 });
                allCompetitors.push(...iosResults.map(app => ({
                    ...app,
                    store: 'ios',
                    searchTerm: term
                })));

                // Google Play Store
                const androidResults = await gplay.search({ term, country, num: 10 });
                allCompetitors.push(...androidResults.map(app => ({
                    ...app,
                    store: 'android',
                    searchTerm: term
                })));
            } catch (err) {
                console.log(`Search error for term "${term}":`, err.message);
            }
        }

        // Deduplicate competitors
        const uniqueCompetitors = Array.from(
            new Map(allCompetitors.map(app => [app.appId || app.id, app])).values()
        );
        console.log(`Found ${uniqueCompetitors.length} unique competitors`);

        // Step 3: Extract keywords from competitors
        console.log('Step 3: Extracting keywords from competitors...');
        const competitorData = uniqueCompetitors.slice(0, 30).map(app => ({
            title: app.title,
            description: app.description || app.summary || '',
            score: app.score,
            store: app.store
        }));

        // Step 4: Generate long-tail keywords using AI
        console.log('Step 4: Generating long-tail keywords...');
        const keywordPrompt = `You are an ASO expert. Analyze these competitor apps and generate 100 long-tail keywords.

App Idea: ${appIdea}
Category: ${category}
Target Audience: ${targetAudience}

Competitor Apps:
${competitorData.map((app, i) => `${i + 1}. ${app.title}: ${app.description?.slice(0, 200)}`).join('\n')}

Generate 100 unique long-tail keywords following these rules:
1. Mix of head (1-2 words), mid-tail (2-3 words), long-tail (3-5 words)
2. Include intent modifiers: "best", "free", "top", "easy", etc.
3. Include use-case keywords: "for beginners", "at home", "without equipment"
4. Include audience keywords: "for students", "for professionals"
5. Estimated difficulty (1-100) and relevance (1-100)

Return ONLY valid JSON:
{
  "keywords": [
    {"keyword": "phrase", "type": "long-tail", "difficulty": 45, "relevance": 90}
  ]
}`;

        const keywordResult = await geminiModel.generateContent(keywordPrompt);
        const keywordText = await keywordResult.response.text();
        const keywordMatch = keywordText.match(/\{[\s\S]*\}/);
        const keywordData = keywordMatch ? JSON.parse(keywordMatch[0]) : { keywords: [] };

        // Step 5: Generate full ASO content using Claude
        console.log('Step 5: Generating ASO content...');
        const anthropic = new Anthropic({ apiKey: anthropicKey });

        const contentPrompt = `Create a complete ASO package for this app idea.

App Idea: ${appIdea}
Category: ${category}
Target Audience: ${targetAudience}
Key Features: ${features?.join(', ') || 'Not specified'}

Top Keywords from research: ${keywordData.keywords.slice(0, 20).map(k => k.keyword).join(', ')}

Generate:
1. 5 Title options (max 30 chars, keyword-rich)
2. 5 Subtitle options (max 30 chars)
3. Promotional text (170 chars)
4. Full description (4000 chars, use top keywords naturally)
5. 6 Screenshot headlines (3-5 words each)
6. 3 Icon concepts

Return ONLY valid JSON:
{
  "titles": ["t1", "t2", "t3", "t4", "t5"],
  "subtitles": ["s1", "s2", "s3", "s4", "s5"],
  "promoText": "promo text",
  "description": "full description",
  "screenshotHeadlines": ["h1", "h2", "h3", "h4", "h5", "h6"],
  "iconConcepts": [
    {"name": "concept", "description": "visual desc", "colors": ["#hex"]}
  ]
}`;

        const contentMessage = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [{ role: 'user', content: contentPrompt }],
        });

        const contentText = contentMessage.content[0].text;
        const contentMatch = contentText.match(/\{[\s\S]*\}/);
        const asoContent = contentMatch ? JSON.parse(contentMatch[0]) : {};

        // Step 6: Generate 6-month strategy
        console.log('Step 6: Generating growth strategy...');
        const strategyPrompt = `Create a 6-month growth strategy for this app.

App: ${appIdea}
Category: ${category}
Target: ${targetAudience}

Return ONLY valid JSON with 6 months of strategy:
{
  "months": [
    {
      "month": 1,
      "theme": "Launch & Foundation",
      "asoTasks": ["task1"],
      "marketing": ["activity1"],
      "kpis": ["kpi1"]
    }
  ],
  "totalBudgetSuggestion": "$X-$Y/month",
  "priorityChannels": ["channel1", "channel2"]
}`;

        const strategyMessage = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            messages: [{ role: 'user', content: strategyPrompt }],
        });

        const strategyText = strategyMessage.content[0].text;
        const strategyMatch = strategyText.match(/\{[\s\S]*\}/);
        const strategy = strategyMatch ? JSON.parse(strategyMatch[0]) : {};

        const duration = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`✅ Deep research completed in ${duration}s`);

        res.json({
            success: true,
            duration: `${duration}s`,
            data: {
                competitors: {
                    count: uniqueCompetitors.length,
                    topApps: uniqueCompetitors.slice(0, 10).map(app => ({
                        title: app.title,
                        score: app.score,
                        store: app.store
                    }))
                },
                keywords: keywordData.keywords,
                asoContent,
                strategy
            }
        });

    } catch (error) {
        console.error('Deep research error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Quick research - faster keyword suggestions only
router.post('/quick', async (req, res) => {
    try {
        const { appIdea, category } = req.body;
        const geminiKey = req.headers['x-gemini-api-key'];

        if (!geminiKey) {
            return res.status(400).json({ error: 'Gemini API key required' });
        }

        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

        const prompt = `Generate 30 ASO keywords for this app idea:
App: ${appIdea}
Category: ${category}

Return ONLY JSON: {"keywords": [{"keyword": "phrase", "type": "long-tail", "difficulty": 50}]}`;

        const result = await model.generateContent(prompt);
        const text = await result.response.text();
        const match = text.match(/\{[\s\S]*\}/);

        if (match) {
            res.json({ success: true, data: JSON.parse(match[0]) });
        } else {
            res.status(500).json({ error: 'Failed to parse response' });
        }
    } catch (error) {
        console.error('Quick research error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Validate keywords - check real rankings
router.post('/validate-keywords', async (req, res) => {
    try {
        const { keywords, store = 'ios', country = 'us' } = req.body;

        const results = [];

        for (const keyword of keywords.slice(0, 10)) {
            try {
                let searchResults;
                if (store === 'ios') {
                    searchResults = await appStore.search({ term: keyword, country, num: 25 });
                } else {
                    searchResults = await gplay.search({ term: keyword, country, num: 25 });
                }

                results.push({
                    keyword,
                    resultsCount: searchResults.length,
                    topApps: searchResults.slice(0, 5).map(app => ({
                        title: app.title,
                        score: app.score
                    })),
                    validated: true
                });
            } catch (err) {
                results.push({ keyword, validated: false, error: err.message });
            }
        }

        res.json({ success: true, data: results });
    } catch (error) {
        console.error('Keyword validation error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
