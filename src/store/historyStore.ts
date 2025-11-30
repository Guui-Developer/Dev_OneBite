import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LearningData } from '@/api/model/response/learndata';

interface HistoryItem {
  content: LearningData;
  viewedAt: string;
}

interface BookmarkItem {
  content: LearningData;
  bookmarkedAt: string;
}

interface HistoryStats {
  today: number;
  total: number;
  streak: number;
  lastVisit: string;
}

interface LearnState {
  lastSeenId: number;
  seed: number;
  categories: string;
}

interface HistoryStore {
  history: HistoryItem[];
  stats: HistoryStats;
  bookmarks: BookmarkItem[];
  learnState: LearnState;

  // Actions
  addToHistory: (content: LearningData) => void;
  clearHistory: () => void;
  clearBookmarks: () => void;
  updateStats: (stats: Partial<HistoryStats>) => void;
  toggleBookmark: (content: LearningData) => void;
  isBookmarked: (contentId: number) => boolean;
  getBookmarkedContent: (contentId: number) => LearningData | undefined;
  updateLearnState: (state: Partial<LearnState>) => void;
  resetLearnState: () => void;
  reset: () => void;
}

const initialLearnState: LearnState = {
  lastSeenId: 0,
  seed: Math.floor(Math.random() * 1000000),
  categories: '',
};

const initialState = {
  history: [],
  stats: {
    today: 0,
    total: 0,
    streak: 0,
    lastVisit: new Date().toISOString(),
  },
  bookmarks: [],
  learnState: initialLearnState,
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

      clearBookmarks: () =>
        set({
          bookmarks: [],
        }),

      updateStats: (stats) =>
        set((state) => ({
          stats: { ...state.stats, ...stats },
        })),

      toggleBookmark: (content) =>
        set((state) => {
          const isAlreadyBookmarked = state.bookmarks.some((item) => item.content.id === content.id);

          const bookmarks = isAlreadyBookmarked
            ? state.bookmarks.filter((item) => item.content.id !== content.id)
            : [...state.bookmarks, { content, bookmarkedAt: new Date().toISOString() }];

          return { bookmarks };
        }),

      isBookmarked: (contentId) => get().bookmarks.some((item) => item.content.id === contentId),

      getBookmarkedContent: (contentId) => {
        const bookmark = get().bookmarks.find((item) => item.content.id === contentId);
        return bookmark?.content;
      },

      updateLearnState: (state) =>
        set((prevState) => ({
          learnState: { ...prevState.learnState, ...state },
        })),

      resetLearnState: () =>
        set({
          learnState: initialLearnState,
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'history-storage',
    }
  )
);
