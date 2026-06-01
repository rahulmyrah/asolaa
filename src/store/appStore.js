import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiUrl } from '../services/api';
import { projectKeywords, projectRatings, projects, projectUpdates } from '../data/projects';

export const useAppStore = create(
  persist(
    (set, get) => ({
      currentApp: projects[0],
      apps: projects,
      keywords: projectKeywords,
      reviews: projectUpdates,
      ratings: projectRatings,
      sidebarOpen: true,
      currentPage: 'dashboard',
      selectedCountry: 'United Kingdom',
      dateRange: { start: '2026-06-01', end: '2026-08-30' },
      isLoading: false,
      user: null,
      authLoading: true,
      history: [
        { date: '2026-05-26', rating: 66, reviews: 2 },
        { date: '2026-05-27', rating: 69, reviews: 2 },
        { date: '2026-05-28', rating: 72, reviews: 2 },
        { date: '2026-05-29', rating: 76, reviews: 3 },
        { date: '2026-05-30', rating: 79, reviews: 3 },
        { date: '2026-05-31', rating: 82, reviews: 3 },
        { date: '2026-06-01', rating: 83, reviews: 3 },
      ],

      setUser: (user) => set({ user, authLoading: false }),
      setAuthLoading: (loading) => set({ authLoading: loading }),
      logout: () => set({ user: null, authLoading: false, apps: projects, currentApp: projects[0], history: [] }),

      fetchUserApps: async (userId) => {
        console.info('Neon auth active. Internal project data is loaded from the ASOLAA workspace seed.', userId);
      },

      fetchAppDetails: async (appId, country = 'gb') => {
        const localProject = projects.find((project) => project.id === appId || project.bundleId === appId);
        if (localProject) {
          set({ currentApp: localProject, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const isIos = /^\d+$/.test(appId);
          const store = isIos ? 'appstore' : 'playstore';
          const res = await fetch(apiUrl(`/${store}/app/${appId}?country=${country}`));
          if (!res.ok) throw new Error('Failed to fetch app');
          const appData = await res.json();

          set({
            currentApp: {
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
              asoScore: 75,
              reviews: appData.reviews || 0,
              rating: appData.score || 0,
              downloads: appData.installs || 'N/A',
              version: appData.version,
              updated: appData.updated,
            },
          });
        } catch (error) {
          console.error('Error fetching app data:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchHistory: async (appId) => {
        const { user } = get();
        if (!user || !appId) return;
      },

      addApp: (app) => set((state) => ({
        apps: [...state.apps, { ...app, id: Date.now() }],
      })),

      updateApp: (id, updates) => set((state) => ({
        apps: state.apps.map((app) => (app.id === id ? { ...app, ...updates } : app)),
        currentApp: state.currentApp?.id === id ? { ...state.currentApp, ...updates } : state.currentApp,
      })),

      setCurrentApp: (app) => set({ currentApp: app }),

      addKeyword: (keyword) => {
        set((state) => {
          if (state.keywords.some((item) => item.keyword === keyword.keyword)) return state;
          return {
            keywords: [...state.keywords, { ...keyword, id: Date.now(), rank: null, change: 0 }],
          };
        });
      },

      removeKeyword: (keywordToRemove) => {
        set((state) => ({
          keywords: state.keywords.filter((item) => item.keyword !== keywordToRemove),
        }));
      },

      updateKeyword: (id, updates) => set((state) => ({
        keywords: state.keywords.map((keyword) => (keyword.id === id ? { ...keyword, ...updates } : keyword)),
      })),

      deleteKeyword: (id) => set((state) => ({
        keywords: state.keywords.filter((keyword) => keyword.id !== id),
      })),

      markReviewReplied: (id) => set((state) => ({
        reviews: state.reviews.map((review) => (review.id === id ? { ...review, replied: true } : review)),
      })),

      addReview: (review) => set((state) => ({
        reviews: [{ ...review, id: Date.now() }, ...state.reviews],
      })),

      updateRatings: (newRatings) => set({ ratings: newRatings }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setCurrentPage: (page) => set({ currentPage: page }),
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      setDateRange: (range) => set({ dateRange: range }),
    }),
    {
      name: 'asolaa-growth-console-v2',
      partialize: (state) => ({
        currentApp: state.currentApp,
        apps: state.apps,
        keywords: state.keywords,
        reviews: state.reviews,
        ratings: state.ratings,
        user: state.user,
        authLoading: state.authLoading,
      }),
    }
  )
);
