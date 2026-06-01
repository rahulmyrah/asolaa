import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

const hasAnthropic = () => Boolean(process.env.ANTHROPIC_API_KEY);
const hasGemini = () => Boolean(process.env.GEMINI_API_KEY);

const parseJsonBlock = (text, fallback) => {
    const match = text?.match(/\{[\s\S]*\}/);
    if (!match) return fallback;
    try {
        return JSON.parse(match[0]);
    } catch {
        return fallback;
    }
};

export const aiStatus = () => ({
    anthropicConfigured: hasAnthropic(),
    geminiConfigured: hasGemini(),
    requiredEnv: ['ANTHROPIC_API_KEY', 'GEMINI_API_KEY'],
});

export const generateStrategy = async ({ audit, seedKeywords = [], competitors = [], goal = 'Grow qualified organic traffic' }) => {
    const profileKeywords = audit?.productProfile?.keywordOpportunities || [];
    const keywords = seedKeywords.length ? seedKeywords : [...profileKeywords, ...(audit?.keywords?.slice(0, 12)?.map((item) => item.keyword) || [])];
    const fallback = {
        summary: `Prioritize answer-first SEO content for ${audit?.domain || 'the website'} and support it with relevant authority building.`,
        keywordClusters: [
            { stage: 'TOFU', theme: 'Problem education', keywords: keywords.slice(0, 4), contentType: 'guides' },
            { stage: 'MOFU', theme: 'Comparison and evaluation', keywords: keywords.slice(4, 8), contentType: 'comparison pages' },
            { stage: 'BOFU', theme: 'Conversion intent', keywords: keywords.slice(8, 12), contentType: 'landing pages' },
        ],
        roadmap: [
            { window: '30 days', actions: ['Fix schema/meta gaps', 'Publish two answer-first articles', 'Create llms.txt'] },
            { window: '60 days', actions: ['Build comparison content', 'Launch backlink outreach', 'Refresh internal links'] },
            { window: '90 days', actions: ['Expand keyword clusters', 'Publish case-study content', 'Review SERP movement'] },
        ],
        contentRoadmap: keywords.slice(0, 6).map((keyword) => ({
            keyword,
            title: `How to choose the right ${keyword}`,
            format: 'SEO article',
            intent: 'informational',
        })),
        socialCalendar: keywords.slice(0, 5).map((keyword, index) => ({
            channel: ['LinkedIn', 'X', 'Facebook', 'Instagram', 'Medium'][index % 5],
            post: `New guide: ${keyword}. Here are the practical steps, common mistakes, and what to measure first.`,
            status: 'draft',
        })),
        backlinkPlan: competitors.slice(0, 5).map((competitor) => ({
            prospect: competitor.domain || competitor.url,
            angle: 'Competitor/link-gap outreach',
            status: 'needs review',
        })),
    };

    if (!hasAnthropic()) return { source: 'fallback', data: fallback };

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const prompt = `Create a practical SEO/GEO strategy as JSON only.
Goal: ${goal}
Audit: ${JSON.stringify(audit).slice(0, 12000)}
Keywords: ${keywords.join(', ')}
Competitors: ${JSON.stringify(competitors).slice(0, 6000)}
Product profile: ${JSON.stringify(audit?.productProfile || {}).slice(0, 5000)}

Return JSON with summary, keywordClusters, roadmap, contentRoadmap, socialCalendar, backlinkPlan.`;

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3500,
        messages: [{ role: 'user', content: prompt }],
    });

    return {
        source: 'anthropic',
        data: parseJsonBlock(message.content?.[0]?.text, fallback),
    };
};

export const generateContentBrief = async ({ keyword, funnelStage = 'TOFU', targetUrl, competitors = [] }) => {
    const fallback = {
        keyword,
        funnelStage,
        searchIntent: funnelStage === 'BOFU' ? 'commercial' : 'informational',
        titleOptions: [
            `${keyword}: Practical Guide`,
            `How to Use ${keyword} to Grow Faster`,
            `Best ${keyword} Strategy for 2026`,
        ],
        outline: ['Answer the query directly', 'Define the problem', 'Compare options', 'Show examples', 'Add FAQ and next step'],
        faq: [
            { question: `What is ${keyword}?`, answer: `${keyword} is a search topic users rely on when comparing solutions and next steps.` },
            { question: `How should I start with ${keyword}?`, answer: 'Start with the user intent, then build answer-first content backed by examples and proof.' },
        ],
        schemaSuggestions: ['Article', 'FAQPage', 'BreadcrumbList'],
        socialSnippets: [
            `Working on ${keyword}? Start by answering the core question in the first 120 words.`,
            `SEO tip: turn ${keyword} into a comparison page, FAQ block, and internal-link hub.`,
        ],
        backlinkOutreachAngle: `Offer a concise expert quote or data-backed guide around ${keyword}.`,
        targetUrl,
        competitors,
    };

    const prompt = `Return JSON only for an SEO content brief.
Keyword: ${keyword}
Funnel stage: ${funnelStage}
Target URL: ${targetUrl || 'none'}
Competitors: ${JSON.stringify(competitors).slice(0, 5000)}
Fields: keyword, funnelStage, searchIntent, titleOptions, outline, faq, schemaSuggestions, socialSnippets, backlinkOutreachAngle.`;

    if (!hasGemini() && !hasAnthropic()) return { source: 'fallback', data: fallback };

    if (hasGemini()) {
        try {
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-05-20' });
            const result = await model.generateContent(prompt);
            const text = result.response.text();
            return {
                source: 'gemini',
                data: parseJsonBlock(text, fallback),
            };
        } catch (error) {
            console.warn('Gemini content brief generation failed, falling back to Anthropic or local brief:', error.message);
        }
    }

    if (hasAnthropic()) {
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2200,
            messages: [{ role: 'user', content: prompt }],
        });

        return {
            source: 'anthropic',
            data: parseJsonBlock(message.content?.[0]?.text, fallback),
        };
    }

    return { source: 'fallback', data: fallback };
};
