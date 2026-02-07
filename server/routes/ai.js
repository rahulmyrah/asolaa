import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// Initialize AI clients (will use API keys from request headers)
const getGeminiClient = (apiKey) => {
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
};

const getAnthropicClient = (apiKey) => {
    if (!apiKey) return null;
    return new Anthropic({ apiKey });
};

// Generate keyword suggestions
router.post('/keywords/suggest', async (req, res) => {
    try {
        const { appDescription, category, targetAudience, features } = req.body;
        const geminiKey = req.headers['x-gemini-api-key'];

        if (!geminiKey) {
            return res.status(400).json({ error: 'Gemini API key required in x-gemini-api-key header' });
        }

        const genAI = getGeminiClient(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro-preview-05-06' });

        const prompt = `You are an ASO (App Store Optimization) expert. Generate 50 highly relevant long-tail keywords for this app.

App Description: ${appDescription}
Category: ${category}
Target Audience: ${targetAudience}
Key Features: ${features?.join(', ') || 'Not specified'}

Rules:
1. Include a mix of head terms (1-2 words), mid-tail (2-3 words), and long-tail (3-5 words)
2. Focus on user intent and search behavior
3. Include variations with modifiers like "best", "free", "top", etc.
4. Consider seasonal and trending terms
5. Include competitor-related terms (generic, not brand names)

Return ONLY a JSON array of objects with this structure:
[
  {
    "keyword": "the keyword phrase",
    "type": "head|mid-tail|long-tail",
    "intent": "informational|navigational|transactional",
    "difficulty": 1-100 (estimated),
    "relevance": 1-100
  }
]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const keywords = JSON.parse(jsonMatch[0]);
            res.json({ success: true, data: keywords });
        } else {
            res.status(500).json({ error: 'Failed to parse AI response' });
        }
    } catch (error) {
        console.error('AI keyword suggestion error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate ASO content (titles, subtitles, descriptions)
router.post('/content/generate', async (req, res) => {
    try {
        const { appIdea, category, targetAudience, features, monetization } = req.body;
        const anthropicKey = req.headers['x-anthropic-api-key'];

        if (!anthropicKey) {
            return res.status(400).json({ error: 'Anthropic API key required in x-anthropic-api-key header' });
        }

        const anthropic = getAnthropicClient(anthropicKey);

        const prompt = `You are a world-class ASO (App Store Optimization) expert. Generate a complete ASO package for this app idea.

App Idea: ${appIdea}
Category: ${category}
Target Audience: ${targetAudience}
Key Features: ${features?.join(', ') || 'Not specified'}
Monetization: ${monetization || 'Freemium'}

Generate:
1. 5 App Title options (max 30 characters each, keyword-rich)
2. 5 Subtitle options (max 30 characters each, benefit-focused)
3. Promotional text (max 170 characters, Apple App Store)
4. Full description (max 4000 characters, keyword-optimized, compelling)
5. 6 Screenshot headlines (3-5 words each, keyword + benefit)
6. 3 Icon concept descriptions (describe visual elements)

Return ONLY valid JSON with this structure:
{
  "titles": ["title1", "title2", "title3", "title4", "title5"],
  "subtitles": ["subtitle1", "subtitle2", "subtitle3", "subtitle4", "subtitle5"],
  "promoText": "promotional text here",
  "description": "full description here",
  "screenshotHeadlines": ["headline1", "headline2", "headline3", "headline4", "headline5", "headline6"],
  "iconConcepts": [
    {"name": "concept1", "description": "visual description"},
    {"name": "concept2", "description": "visual description"},
    {"name": "concept3", "description": "visual description"}
  ]
}`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }],
        });

        const text = message.content[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const content = JSON.parse(jsonMatch[0]);
            res.json({ success: true, data: content });
        } else {
            res.status(500).json({ error: 'Failed to parse AI response' });
        }
    } catch (error) {
        console.error('AI content generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Analyze ASO score
router.post('/analyze/aso-score', async (req, res) => {
    try {
        const { title, subtitle, description, keywords } = req.body;
        const anthropicKey = req.headers['x-anthropic-api-key'];

        if (!anthropicKey) {
            return res.status(400).json({ error: 'Anthropic API key required' });
        }

        const anthropic = getAnthropicClient(anthropicKey);

        const prompt = `Analyze this app's ASO (App Store Optimization) and provide a detailed score.

Title: ${title}
Subtitle: ${subtitle}
Description: ${description}
Keywords: ${keywords?.join(', ') || 'None provided'}

Analyze and score (0-100) each of these factors:
1. Title optimization (keyword usage, length, clarity)
2. Subtitle optimization (benefits, keywords)
3. Description quality (keyword density, readability, CTA)
4. Keyword relevance and coverage
5. Overall ASO score

Return ONLY valid JSON:
{
  "overallScore": 0-100,
  "breakdown": {
    "title": { "score": 0-100, "feedback": "specific feedback" },
    "subtitle": { "score": 0-100, "feedback": "specific feedback" },
    "description": { "score": 0-100, "feedback": "specific feedback" },
    "keywords": { "score": 0-100, "feedback": "specific feedback" }
  },
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"]
}`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2048,
            messages: [{ role: 'user', content: prompt }],
        });

        const text = message.content[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const analysis = JSON.parse(jsonMatch[0]);
            res.json({ success: true, data: analysis });
        } else {
            res.status(500).json({ error: 'Failed to parse AI response' });
        }
    } catch (error) {
        console.error('AI ASO analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate 6-month growth strategy
router.post('/strategy/growth', async (req, res) => {
    try {
        const { appIdea, category, targetAudience, budget, currentStage } = req.body;
        const anthropicKey = req.headers['x-anthropic-api-key'];

        if (!anthropicKey) {
            return res.status(400).json({ error: 'Anthropic API key required' });
        }

        const anthropic = getAnthropicClient(anthropicKey);

        const prompt = `Create a comprehensive 6-month growth strategy for this mobile app.

App Idea: ${appIdea}
Category: ${category}
Target Audience: ${targetAudience}
Monthly Budget: ${budget || 'Limited/Bootstrap'}
Current Stage: ${currentStage || 'Pre-launch'}

Create a detailed month-by-month plan covering:
1. ASO optimization tasks
2. Content marketing activities
3. Paid acquisition channels
4. Organic growth tactics
5. Key milestones and KPIs

Return ONLY valid JSON:
{
  "summary": "brief strategy overview",
  "months": [
    {
      "month": 1,
      "theme": "Month theme",
      "asoTasks": ["task1", "task2"],
      "contentMarketing": ["activity1", "activity2"],
      "paidAcquisition": ["channel1", "channel2"],
      "organicGrowth": ["tactic1", "tactic2"],
      "milestones": ["milestone1"],
      "kpis": ["kpi1", "kpi2"]
    }
  ],
  "budgetAllocation": {
    "aso": "percentage",
    "content": "percentage",
    "paid": "percentage",
    "tools": "percentage"
  },
  "keyChannels": ["channel1", "channel2", "channel3"]
}`;

        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: [{ role: 'user', content: prompt }],
        });

        const text = message.content[0].text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
            const strategy = JSON.parse(jsonMatch[0]);
            res.json({ success: true, data: strategy });
        } else {
            res.status(500).json({ error: 'Failed to parse AI response' });
        }
    } catch (error) {
        console.error('AI strategy generation error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Analyze review sentiment
router.post('/analyze/sentiment', async (req, res) => {
    try {
        const { reviews } = req.body;
        const geminiKey = req.headers['x-gemini-api-key'];

        if (!geminiKey) {
            return res.status(400).json({ error: 'Gemini API key required' });
        }

        const genAI = getGeminiClient(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });

        const prompt = `Analyze these app reviews and extract insights.

Reviews:
${reviews.map((r, i) => `${i + 1}. [${r.score}/5] ${r.text}`).join('\n')}

Analyze and return ONLY valid JSON:
{
  "overallSentiment": "positive|neutral|negative",
  "sentimentScore": 0-100,
  "topPositives": ["feature users love 1", "feature 2"],
  "topNegatives": ["complaint 1", "complaint 2"],
  "featureRequests": ["requested feature 1", "requested feature 2"],
  "commonThemes": ["theme 1", "theme 2"],
  "reviewBreakdown": {
    "positive": percentage,
    "neutral": percentage,
    "negative": percentage
  }
}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const sentiment = JSON.parse(jsonMatch[0]);
            res.json({ success: true, data: sentiment });
        } else {
            res.status(500).json({ error: 'Failed to parse AI response' });
        }
    } catch (error) {
        console.error('AI sentiment analysis error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
