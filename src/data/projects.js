export const sanathanMvpModules = [
  {
    title: "Today's Quote",
    status: 'MVP',
    detail: '365 quote library with one quote shown per day on the home screen.',
  },
  {
    title: "Today's Panchang",
    status: 'MVP',
    detail: 'Sunrise, tithi, Rahu Kaal, festival, and small what-to-do guide.',
  },
  {
    title: 'Daily Puja Guide',
    status: 'MVP',
    detail: 'Day-wise deity, chant, remedies, Japa counter, and wallpaper action.',
  },
  {
    title: 'Daily Astrology Insight',
    status: 'MVP',
    detail: 'Free daily insight, with advanced Kundli and AI Guruji advice for Pro.',
  },
  {
    title: 'Live Classes',
    status: 'MVP',
    detail: 'Bal Sanskar on Saturday and Yoga/Meditation on Sunday, each in English and Hindi.',
  },
  {
    title: 'Recordings Archive',
    status: 'MVP',
    detail: 'Week 1, Week 2, Week 3 archive so parents can replay missed sessions.',
  },
  {
    title: 'AI Guruji',
    status: 'Free + Pro',
    detail: 'Basic advice free, advanced advice for monthly and yearly Pro users.',
  },
  {
    title: 'Referral Offer',
    status: 'Growth',
    detail: 'Onboard 5 users and get one month free access, one time only.',
  },
];

export const projects = [
  {
    id: 'applaa',
    name: 'Applaa',
    bundleId: 'applaa.com',
    developer: 'ASOLAA',
    store: 'web',
    category: 'AI Education',
    price: 'Free',
    hasInAppPurchases: false,
    asoScore: 83,
    icon: null,
    title: 'Applaa - AI App Builder & Academy for Kids',
    subtitle: 'Build apps. Learn subjects. Prepare exams.',
    description: `Applaa is an AI education platform for children aged 3-18, combining a kids app builder, UK curriculum learning, exam preparation, verified Olympiad papers, AI tutor support, brain training, music learning, and parent dashboards.

Primary SEO positioning:
- AI app builder for kids in the UK
- AI coding app for children
- UK curriculum learning from Reception to Year 13
- UKMT and BMO past papers with real explanations
- 11 plus, GCSE, A-Level, and exam board practice
- Offline-friendly desktop learning platform`,
    downloads: 'Early launch',
    revenue: 'Pre-scale',
    totalKeywords: 21,
    keywordChange: 12,
    categoryRank: 'New',
    rating: 5,
    version: 'SEO launch',
    updated: '2026-06-01',
    website: 'https://applaa.com',
    focus: 'SEO/GEO growth for AI education, coding for kids, UK exams, and parent-led learning.',
    roadmap: [
      'Create AI app builder for kids landing page',
      'Publish UKMT past papers topic cluster',
      'Create 11 plus AI practice content hub',
      "Build comparison pages vs IXL, Code.org, Tynker, Khan Academy, and BYJU'S",
    ],
  },
  {
    id: 'sanathan',
    name: 'Sanathan App',
    bundleId: 'sanathan.app',
    developer: 'ASOLAA',
    store: 'web',
    category: 'Hindu Spirituality',
    price: 'Free + Pro',
    hasInAppPurchases: true,
    asoScore: 59,
    icon: null,
    title: 'Sanathan App - Daily Hindu Spiritual Guide',
    subtitle: 'Panchang, Kundli, AI Guruji, Puja & Classes',
    description: `Sanathan App is a Hindu spiritual companion focused on daily engagement. The MVP includes daily quotes, Panchang, festivals, puja guidance, Japa counter, AI Guruji, basic Kundli, astrology insights, Sloka classes, Bal Sanskar, Yoga and Meditation classes, replay archives, and Pro spiritual guidance.

First-round MVP:
- Today's Quote from a 365 quote library
- Today's Panchang with sunrise, tithi, Rahu Kaal, and festival
- Push guide for fasting rules and festival actions
- Daily Puja Guide with deity, chant, remedies, and Japa counter
- Set today's deity wallpaper
- Daily astrology insight
- Bal Sanskar live class every Saturday in English and Hindi
- Yoga/Meditation live class every Sunday in English and Hindi
- Replay archive by week
- Basic Kundli and AI Guruji free
- Advanced Kundli and AI Guruji Pro at Rs. 99/month or Rs. 999/year
- OTP registration and referral onboarding`,
    downloads: 'MVP planning',
    revenue: 'Rs. 99/mo Pro',
    totalKeywords: 34,
    keywordChange: 18,
    categoryRank: 'MVP',
    rating: 5,
    version: 'MVP scope',
    updated: '2026-06-01',
    website: 'https://sanathan.app',
    focus: 'Daily spiritual retention, Hindu SEO content, festival-led notifications, and Pro conversion.',
    roadmap: [
      'Build daily quote and Panchang home screen',
      'Create daily puja guide CMS/settings',
      'Add class reminders and replay archive',
      'Launch Kundli and AI Guruji free/pro split',
      'Add OTP registration and referral reward flow',
    ],
    mvpModules: sanathanMvpModules,
  },
];

export const projectKeywords = [
  { id: 1, keyword: 'AI app builder for kids UK', count: 8, density: 2.8, rank: 18, change: 6, project: 'Applaa' },
  { id: 2, keyword: 'AI coding app for kids', count: 7, density: 2.4, rank: 24, change: 8, project: 'Applaa' },
  { id: 3, keyword: 'UKMT past papers with solutions', count: 6, density: 2.1, rank: 31, change: 11, project: 'Applaa' },
  { id: 4, keyword: '11 plus AI practice', count: 5, density: 1.9, rank: 44, change: 7, project: 'Applaa' },
  { id: 5, keyword: 'daily panchang app', count: 9, density: 3.1, rank: 39, change: 12, project: 'Sanathan' },
  { id: 6, keyword: 'AI Guruji app', count: 8, density: 2.7, rank: 22, change: 14, project: 'Sanathan' },
  { id: 7, keyword: 'online sloka classes for kids', count: 6, density: 2.2, rank: 51, change: 9, project: 'Sanathan' },
  { id: 8, keyword: 'basic kundli app free', count: 6, density: 2.0, rank: 48, change: 5, project: 'Sanathan' },
  { id: 9, keyword: 'daily puja guide app', count: 5, density: 1.8, rank: 36, change: 10, project: 'Sanathan' },
  { id: 10, keyword: 'Hindu festival calendar app', count: 5, density: 1.7, rank: 42, change: 8, project: 'Sanathan' },
];

export const projectUpdates = [
  {
    id: 1,
    author: 'SEO Team',
    rating: 5,
    content: 'Applaa audit is live with DataForSEO keywords, SERP competitors, backlinks, and Applaa education positioning.',
    date: '2026-06-01',
    replied: true,
  },
  {
    id: 2,
    author: 'Product Team',
    rating: 5,
    content: 'Sanathan MVP scope added: quote, Panchang, puja guide, Japa counter, AI Guruji, Kundli, classes, recordings, Pro plan, referral, and OTP.',
    date: '2026-06-01',
    replied: false,
  },
  {
    id: 3,
    author: 'Growth Team',
    rating: 5,
    content: 'Next focus is content calendar and backlink competitor research for Applaa and Sanathan.',
    date: '2026-06-01',
    replied: false,
  },
];

export const projectRatings = {
  average: 5,
  total: 3,
  distribution: {
    5: 3,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
};

export const competitorSets = {
  applaa: [
    { id: 'ixl', title: 'IXL', developer: 'Personalized learning', rating: 4.7, rank: 1, reviews: 98000, downloads: 'Global', visibility: 92, lastUpdated: 'Tracked today' },
    { id: 'khanacademy', title: 'Khan Academy', developer: 'Free learning platform', rating: 4.8, rank: 2, reviews: 176000, downloads: 'Global', visibility: 95, lastUpdated: 'Tracked today' },
    { id: 'codeorg', title: 'Code.org', developer: 'Coding education', rating: 4.6, rank: 3, reviews: 52000, downloads: 'Global', visibility: 88, lastUpdated: 'Tracked today' },
    { id: 'tynker', title: 'Tynker', developer: 'Coding for kids', rating: 4.5, rank: 4, reviews: 42000, downloads: 'Global', visibility: 84, lastUpdated: 'Tracked today' },
    { id: 'byjus', title: "BYJU'S", developer: 'Indian edtech', rating: 4.4, rank: 5, reviews: 210000, downloads: 'India', visibility: 86, lastUpdated: 'Tracked today' },
  ],
  sanathan: [
    { id: 'astrotalk', title: 'Astrotalk', developer: 'Astrology consultations', rating: 4.6, rank: 1, reviews: 124000, downloads: 'India', visibility: 91, lastUpdated: 'Tracked today' },
    { id: 'ganeshaspeaks', title: 'GaneshaSpeaks', developer: 'Horoscope and astrology', rating: 4.5, rank: 2, reviews: 68000, downloads: 'India', visibility: 82, lastUpdated: 'Tracked today' },
    { id: 'instaastro', title: 'InstaAstro', developer: 'Kundli and astrology', rating: 4.7, rank: 3, reviews: 54000, downloads: 'India', visibility: 80, lastUpdated: 'Tracked today' },
    { id: 'sadhguru', title: 'Sadhguru App', developer: 'Yoga and spirituality', rating: 4.8, rank: 4, reviews: 99000, downloads: 'Global', visibility: 89, lastUpdated: 'Tracked today' },
    { id: 'vedicrishi', title: 'Vedic Rishi', developer: 'Astrology APIs and Kundli', rating: 4.4, rank: 5, reviews: 31000, downloads: 'India', visibility: 76, lastUpdated: 'Tracked today' },
  ],
};
