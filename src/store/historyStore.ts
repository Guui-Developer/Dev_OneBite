import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LearningData } from '@/api/model/response/learndata';

interface HistoryItem {
  content: LearningData;
  viewedAt: string;
}

interface HistoryStats {
  today: number;
  total: number;
  streak: number;
  lastVisit: string;
}

interface HistoryStore {
  history: HistoryItem[];
  stats: HistoryStats;
  bookmarks: number[];

  // Actions
  addToHistory: (content: LearningData) => void;
  clearHistory: () => void;
  updateStats: (stats: Partial<HistoryStats>) => void;
  toggleBookmark: (contentId: number) => void;
  isBookmarked: (contentId: number) => boolean;
  reset: () => void;
}

const initialState = {
  history: [],
  stats: {
    today: 0,
    total: 0,
    streak: 0,
    lastVisit: new Date().toISOString(),
  },
  bookmarks: [],
};

export const historyStore = create<HistoryStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      addToHistory: (content) =>
        set((state) => {
          // 중복 방지: 이미 있는 항목은 제거하고 최신 항목을 맨 앞에 추가
          const filtered = state.history.filter((item) => item.content.id !== content.id);
          const newHistory = [
            { content, viewedAt: new Date().toISOString() },
            ...filtered,
          ];

          // 최대 100개까지만 보관
          const limitedHistory = newHistory.slice(0, 100);

          // 통계 업데이트
          const today = new Date().toDateString();
          const lastVisitDate = new Date(state.stats.lastVisit).toDateString();
          const isToday = today === lastVisitDate;

          return {
            history: limitedHistory,
            stats: {
              ...state.stats,
              today: isToday ? state.stats.today + 1 : 1,
              total: state.stats.total + 1,
              lastVisit: new Date().toISOString(),
            },
          };
        }),

      clearHistory: () =>
        set({
          history: [],
          stats: {
            today: 0,
            total: 0,
            streak: 0,
            lastVisit: new Date().toISOString(),
          },
        }),

      updateStats: (stats) =>
        set((state) => ({
          stats: { ...state.stats, ...stats },
        })),

      toggleBookmark: (contentId) =>
        set((state) => {
          const bookmarks = state.bookmarks.includes(contentId)
            ? state.bookmarks.filter((id) => id !== contentId)
            : [...state.bookmarks, contentId];
          return { bookmarks };
        }),

      isBookmarked: (contentId) => get().bookmarks.includes(contentId),

      reset: () => set(initialState),
    }),
    {
      name: 'history-storage',
    }
  )
);
