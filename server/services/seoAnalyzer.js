const extractTag = (html, pattern) => html.match(pattern)?.[1]?.trim() || '';

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export const normalizeUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') {
        throw new Error('A valid URL is required.');
    }

    const withProtocol = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const parsed = new URL(withProtocol);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Only http and https URLs are supported.');
    }
    return parsed;
};

export const fetchPageSnapshot = async (url) => {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'ASOLAA-SEO-Audit/1.0',
            },
            signal: AbortSignal.timeout(12000),
        });
        const html = await response.text();
        return {
            ok: response.ok,
            status: response.status,
            finalUrl: response.url,
            html: html.slice(0, 600000),
        };
    } catch (error) {
        return {
            ok: false,
            status: 0,
            finalUrl: url,
            html: '',
            error: error.message,
        };
    }
};

export const analyzePage = ({ url, html, niche, targetAudience }) => {
    const title = extractTag(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = extractTag(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i)
        || extractTag(html, /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i);
    const h1 = extractTag(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const hasSchema = /application\/ld\+json|itemscope|itemtype=/i.test(html);
    const hasCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
    const hasOg = /property=["']og:/i.test(html);
    const hasFaq = /FAQPage/i.test(html);
    const hasRobots = /<meta[^>]+name=["']robots["']/i.test(html);
    const headings = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)]
        .map((match) => match[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .slice(0, 12);
    const wordCount = html.replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;

    const technical = clamp(40 + (hasCanonical ? 15 : 0) + (hasOg ? 15 : 0) + (hasRobots ? 10 : 0) + (title ? 10 : 0) + (description ? 10 : 0));
    const contentQuality = clamp(25 + (h1 ? 15 : 0) + Math.min(30, Math.floor(wordCount / 35)) + (headings.length >= 4 ? 15 : headings.length * 3));
    const schemaScore = clamp((hasSchema ? 55 : 15) + (hasFaq ? 25 : 0) + (hasOg ? 10 : 0));
    const aiReadiness = clamp(25 + (hasFaq ? 20 : 0) + (headings.length >= 5 ? 20 : headings.length * 3) + (description ? 10 : 0) + (wordCount >= 800 ? 20 : Math.floor(wordCount / 80)));
    const trustSignals = clamp(35 + (/about|contact|privacy|terms|review|case stud/i.test(html) ? 25 : 0) + (hasOg ? 10 : 0) + (description ? 10 : 0));
    const overall = Math.round((technical + contentQuality + schemaScore + aiReadiness + trustSignals) / 5);

    const seedKeyword = niche || h1 || title || url.hostname.replace(/^www\./, '');
    const snippets = {
        faqSchema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: `What does ${seedKeyword} help with?`,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: `${seedKeyword} helps ${targetAudience || 'customers'} understand the problem, compare options, and take the next step with confidence.`,
                    },
                },
            ],
        }, null, 2),
        llmsTxt: `# ${title || url.hostname}\n\n## Summary\n${description || `Useful information about ${seedKeyword}.`}\n\n## Recommended pages\n- ${url.href}\n`,
        answerBlock: `${seedKeyword} is best explained with a direct answer first: define the user problem, state the result, then support it with proof, steps, and examples.`,
        meta: `<title>${title || seedKeyword}</title>\n<meta name="description" content="${description || `Learn how ${seedKeyword} helps ${targetAudience || 'your audience'} solve a specific problem.`}">`,
    };

    return {
        url: url.href,
        domain: url.hostname.replace(/^www\./, ''),
        title,
        description,
        h1,
        wordCount,
        headings,
        checks: { hasSchema, hasCanonical, hasOg, hasFaq, hasRobots },
        scores: {
            overall,
            technical,
            contentQuality,
            schema: schemaScore,
            aiReadiness,
            trustSignals,
        },
        grade: overall >= 85 ? 'A' : overall >= 70 ? 'B' : overall >= 55 ? 'C' : overall >= 40 ? 'D' : 'F',
        snippets,
    };
};

export const buildPrioritizedFixes = (analysis, backlinkSummary) => {
    const fixes = [];
    if (!analysis.checks.hasSchema) fixes.push({ priority: 'critical', title: 'Add structured data', impact: 'Improves rich results and AI extractability.', effort: 'medium', snippetKey: 'faqSchema' });
    if (!analysis.checks.hasFaq) fixes.push({ priority: 'high', title: 'Add answer-first FAQ section', impact: 'Improves GEO citation readiness for long-tail questions.', effort: 'low', snippetKey: 'answerBlock' });
    if (!analysis.description) fixes.push({ priority: 'high', title: 'Write a search-focused meta description', impact: 'Improves SERP clarity and click-through quality.', effort: 'low', snippetKey: 'meta' });
    if (analysis.wordCount < 700) fixes.push({ priority: 'high', title: 'Expand topical coverage', impact: 'Gives search engines and LLMs more extractable evidence.', effort: 'medium' });
    if (!analysis.checks.hasCanonical) fixes.push({ priority: 'medium', title: 'Add a canonical URL', impact: 'Reduces duplicate URL ambiguity.', effort: 'low' });
    if (!backlinkSummary?.referring_domains) fixes.push({ priority: 'medium', title: 'Build a relevant backlink pipeline', impact: 'Improves authority and trust signals.', effort: 'high' });
    fixes.push({ priority: 'medium', title: 'Create llms.txt', impact: 'Gives AI crawlers a concise map of useful pages.', effort: 'low', snippetKey: 'llmsTxt' });
    return fixes.slice(0, 8);
};

export const fallbackKeywords = (seed) => {
    const clean = seed || 'seo strategy';
    return [
        `best ${clean} tools`,
        `${clean} for small business`,
        `how to improve ${clean}`,
        `${clean} checklist`,
        `${clean} examples`,
        `${clean} strategy template`,
        `affordable ${clean} service`,
        `${clean} for beginners`,
    ].map((keyword, index) => ({
        keyword,
        searchVolume: index < 3 ? 1000 - index * 150 : 250 + index * 40,
        cpc: Number((1.2 + index * 0.35).toFixed(2)),
        competition: Number((0.18 + index * 0.07).toFixed(2)),
        difficulty: 30 + index * 6,
        intent: index < 2 ? 'commercial' : 'informational',
        source: 'fallback',
    }));
};
