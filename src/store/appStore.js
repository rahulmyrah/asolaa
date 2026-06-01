import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiUrl } from '../services/api';

// Sample data for the app
const sampleApp = {
  id: 1,
  name: 'FinLaa AI Suite',
  bundleId: 'com.finlaa.aisuite',
  developer: 'RAHUL SACHIWAL',
  store: 'ios',
  category: 'Finance',
  price: 'Free',
  hasInAppPurchases: true,
  asoScore: 91,
  icon: null,
  title: 'FinLaa AI Suite',
  subtitle: 'Financial Calculators with AI',
  description: `Understand your finances clearly with smart calculators and simple AI explanations. Explore loans, savings, and investments with clarity.

FinLaa AI Suite Financial Calculators with AI Explanations

FinLaa AI Suite is a financial planning app designed to help users calculate understand and compare everyday financial scenarios using over 130 original financial calculators built with custom calculation logic.

The app focuses on clarity and understanding. Each calculator provides accurate numerical results and optional AI powered explanations that help users understand how results are derived and what they mean using simple language.

What FinLaa Offers

Financial Calculators

FinLaa includes calculators for:
• Loans and EMI planning
• Mortgage and interest calculations
• Investment and ROI analysis
• SIP retirement and savings planning
• Tax budget and expense calculations

All calculators use custom formulas implemented directly within the app and are not generic templates.`,
  downloads: '>1K',
  revenue: '>$1K',
  totalKeywords: 46,
  keywordChange: -48,
  categoryRank: null,
};

const sampleKeywords = [
  { id: 1, keyword: 'ai', count: 12, density: 2.68, rank: 45, change: 2 },
  { id: 2, keyword: 'financial', count: 11, density: 2.73, rank: 23, change: -5 },
  { id: 3, keyword: 'finlaa', count: 10, density: 2.48, rank: 1, change: 0 },
  { id: 4, keyword: 'calculators', count: 9, density: 2.23, rank: 67, change: 12 },
  { id: 5, keyword: 'explanations', count: 7, density: 1.74, rank: 89, change: -3 },
  { id: 6, keyword: 'app', count: 6, density: 1.49, rank: 156, change: 8 },
  { id: 7, keyword: 'users', count: 6, density: 1.49, rank: 234, change: -15 },
  { id: 8, keyword: 'roi', count: 5, density: 1.24, rank: 45, change: 0 },
  { id: 9, keyword: 'results', count: 5, density: 1.24, rank: 78, change: 5 },
  { id: 10, keyword: 'investment', count: 4, density: 0.99, rank: 34, change: -2 },
];

const sampleReviews = [
  {
    id: 1,
    author: 'Reema mirta Channel',
    rating: 5,
    content: 'Bagus banget cocok buat ibu yang jago belanja tapi aku kasih bintang 4 dulu ya',
    date: '2025-02-01',
    replied: false,
  },
  {
    id: 2,
    author: 'Reema mirta Channel',
    rating: 5,
    content: 'Bagus banget cocok buat ibu yang jago belanja tapi aku kasih bintang 4 dulu ya',
    date: '2025-02-01',
    replied: false,
  },
  {
    id: 3,
    author: 'Miss Galapen',
    rating: 5,
    content: 'Add more levels please! I really enjoyed it! So much!',
    date: '2025-01-28',
    replied: true,
  },
];

const sampleRatings = {
  average: 5.0,
  total: 2,
  distribution: {
    5: 2,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
  history: [
    { date: '2025-01-01', rating: 5.0 },
    { date: '2025-01-08', rating: 5.0 },
    { date: '2025-01-15', rating: 5.0 },
    { date: '2025-01-22', rating: 5.0 },
    { date: '2025-01-29', rating: 5.0 },
    { date: '2025-02-05', rating: 5.0 },
  ],
};

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Current app data
      currentApp: sampleApp,
      apps: [sampleApp],

      // Keywords
      keywords: sampleKeywords,

      // Reviews & Ratings
      reviews: sampleReviews,
      ratings: sampleRatings,

      // UI State
      sidebarOpen: true,
      currentPage: 'dashboard',
      selectedCountry: 'All Countries',
      dateRange: { start: '2025-01-01', end: '2025-02-06' },
      isLoading: false,

      // Auth State
      user: null,
      authLoading: true,

      // History
      history: [],

      // Auth Actions
      setUser: (user) => set({ user, authLoading: false }),
      setAuthLoading: (loading) => set({ authLoading: loading }),
      logout: () => set({ user: null, authLoading: false, apps: [sampleApp], currentApp: sampleApp, history: [] }),

      // Sync User Data
      fetchUserApps: async (userId) => {
        console.info('Neon auth active. App-store tracking sync is local until Neon app data tables are added.', userId);
      },

      // Actions - Async Data Fetching
      fetchAppDetails: async (appId, country = 'us') => {
        set({ isLoading: true });
        try {
          const isIos = /^\d+$/.test(appId);
          const store = isIos ? 'appstore' : 'playstore';

          // Allow searching by exact ID if search endpoint supports it, otherwise use 'app' endpoint directly
          // Our backend has /api/appstore/app/:id
          const res = await fetch(apiUrl(`/${store}/app/${appId}?country=${country}`));
          if (!res.ok) throw new Error('Failed to fetch app');

          const appData = await res.json();

          // Normalize app data
          const newApp = {
            id: appId,
            name: appData.title,
            bundleId: appData.appId,
            developer: appData.developer,
            store: isIos ? 'ios' : 'android',
            category: appData.genres?.[0] || 'Unknown',
            price: appData.price || 'Free',
            icon: appData.icon,
            title: appData.title,
            description: appData.description,
            asoScore: 85, // Placeholder
            reviews: appData.reviews || 0,
            rating: appData.score || 0,
            downloads: appData.installs || 'N/A',
            version: appData.version,
            updated: appData.updated
          };

          set({ currentApp: newApp });

          // Also fetch reviews if possible
          try {
            const reviewsRes = await fetch(apiUrl(`/${store}/app/${appId}/reviews`));
            if (reviewsRes.ok) {
              const reviewsData = await reviewsRes.json();
              const formattedReviews = reviewsData.slice(0, 50).map((r, i) => ({
                id: r.id || i,
                author: r.userName,
                rating: r.score,
                content: r.text,
                date: r.date,
                replied: false
              }));
              set({ reviews: formattedReviews });
            }
          } catch (rErr) {
            console.warn('Reviews fetch failed', rErr);
          }

        } catch (error) {
          console.error('Error fetching app data:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchHistory: async (appId) => {
        const { user } = get();
        if (!user || !appId) return;
        set({ history: [] });
      },

      // Actions - Apps
      addApp: (app) => set((state) => ({
        apps: [...state.apps, { ...app, id: Date.now() }],
      })),

      updateApp: (id, updates) => set((state) => ({
        apps: state.apps.map((app) =>
          app.id === id ? { ...app, ...updates } : app
        ),
        currentApp: state.currentApp?.id === id
          ? { ...state.currentApp, ...updates }
          : state.currentApp,
      })),

      setCurrentApp: (app) => set({ currentApp: app }),

      // Actions - Keywords
      addKeyword: (keyword) => {
          set((state) => {
            // Check if already exists
            if (state.keywords.some(k => k.keyword === keyword.keyword)) return state;

          const newKeyword = {
            ...keyword,
            id: Date.now(),
            rank: null,
            change: 0
          };

          return { keywords: [...state.keywords, newKeyword] };
        });
      },

      removeKeyword: (keywordToRemove) => {
        set((state) => ({
          keywords: state.keywords.filter((k) => k.keyword !== keywordToRemove),
        }));
      },

      updateKeyword: (id, updates) => set((state) => ({
        keywords: state.keywords.map((kw) =>
          kw.id === id ? { ...kw, ...updates } : kw
        ),
      })),

      deleteKeyword: (id) => set((state) => ({
        keywords: state.keywords.filter((kw) => kw.id !== id),
      })),

      // Actions - Reviews
      markReviewReplied: (id) => set((state) => ({
        reviews: state.reviews.map((review) =>
          review.id === id ? { ...review, replied: true } : review
        ),
      })),

      addReview: (review) => set((state) => ({
        reviews: [{ ...review, id: Date.now() }, ...state.reviews],
      })),

      // Actions - Ratings
      updateRatings: (newRatings) => set({ ratings: newRatings }),

      // Actions - UI
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setCurrentPage: (page) => set({ currentPage: page }),
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      setDateRange: (range) => set({ dateRange: range }),
    }),
    {
      name: 'asolaa-storage',
    }
  )
);
