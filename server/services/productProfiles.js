const profiles = {
    'applaa.com': {
        id: 'applaa-education',
        name: 'Applaa',
        category: 'AI education app and kids app builder',
        primaryMarket: 'United Kingdom',
        secondaryMarkets: ['India', 'United States', 'Ireland', 'Australia', 'Canada'],
        audience: 'Children aged 3-18, parents, homeschool families, schools, and exam-prep learners',
        seedKeyword: 'AI app builder for kids UK',
        positioning: 'The only AI app-builder for kids combined with a full academic academy from early years to A-Level.',
        differentiators: [
            'AI coding agent for kids that builds real apps, not only lessons',
            'Full UK curriculum coverage from Reception to Year 13',
            'Verified UKMT and BMO past papers with hints and explanations',
            'All major UK exam boards in one desktop app',
            'AI tutor, exam prediction engine, brain training, and coding builder in one install',
            'Desktop-first and offline-friendly learning experience',
        ],
        competitorDomains: [
            'atomlearning.com',
            'mathsaurus.com',
            'mathswatch.co.uk',
            'sparxmaths.uk',
            'eedi.com',
            'tynker.com',
            'code.org',
            'scratch.mit.edu',
            'senecalearning.com',
            'tassomai.com',
            'mymaths.co.uk',
            'thirdspacelearning.com',
            'whizz.com',
            'embibe.com',
            'codeyoung.com',
            'brightchamps.com',
            'byjus.com',
            'vedantu.com',
            'whitehatjr.com',
            'cuemath.com',
            'khanmigo.ai',
            'khanacademy.org',
            'ixl.com',
            'codemonkey.com',
        ],
        keywordOpportunities: [
            'AI app builder for kids UK',
            'AI coding app for kids UK',
            'UKMT past papers with solutions',
            'UKMT junior practice',
            '11 plus AI practice',
            '11 plus mock test online',
            'GCSE mock test online free',
            'KS2 maths AI tutor',
            'coding app for kids build games',
            'AI tutor for children India',
            'AI coding tutor for kids',
            'build games with AI kids',
            'kids AI learning app',
        ],
    },
    'sanathan.app': {
        id: 'sanathan-spiritual-learning',
        name: 'Sanathan',
        category: 'Sanatan dharma spiritual learning app',
        primaryMarket: 'Global Hindu diaspora',
        secondaryMarkets: ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'],
        audience: 'Families, learners, temples, and spiritual seekers',
        seedKeyword: 'Sanatan dharma learning app',
        positioning: 'A structured app for Sanatan learning, practice, and cultural education.',
        differentiators: [
            'Structured spiritual learning experience',
            'App-first access for families and learners',
            'Content-led approach for dharma education',
        ],
        competitorDomains: [
            'sanatanmarg.org',
            'hinduamerican.org',
            'iskconeducationalservices.org',
            'chinmayamission.com',
            'vedabase.io',
        ],
        keywordOpportunities: [
            'Sanatan dharma app',
            'Hindu learning app',
            'Bhagavad Gita learning app',
            'Sanatan dharma for kids',
            'Hindu culture learning online',
        ],
    },
};

export const getProductProfile = (domain) => profiles[String(domain || '').replace(/^www\./, '').toLowerCase()] || null;

export const mergeProfileCompetitors = (serpCompetitors, profile) => {
    if (!profile) return serpCompetitors;
    const seen = new Set();
    const combined = [
        ...profile.competitorDomains.map((domain, index) => ({
            title: `${domain} education competitor`,
            domain,
            url: `https://${domain}`,
            rank: index + 1,
            source: 'profile',
            description: `${profile.name} competitor in ${profile.category}.`,
        })),
        ...serpCompetitors.map((competitor) => ({ ...competitor, source: competitor.source || 'serp' })),
    ];

    return combined.filter((competitor) => {
        const key = competitor.domain || competitor.url;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};
