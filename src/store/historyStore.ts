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

interface AppSettings {
  hasSeenSwipeTutorial: boolean;
  hasSeenPWATutorial: boolean;
}

interface HistoryStore {
  history: HistoryItem[];
  stats: HistoryStats;
  bookmarks: BookmarkItem[];
  learnState: LearnState;
  settings: AppSettings;

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
  setHasSeenSwipeTutorial: (seen: boolean) => void;
  setHasSeenPWATutorial: (seen: boolean) => void;
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
  settings: {
    hasSeenSwipeTutorial: false,
    hasSeenPWATutorial: false,
  },
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

          // 최대 20개까지만 보관
          const limitedHistory = newHistory.slice(0, 20);

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
          const isAlreadyBookmarked = state.bookmarks.some((item) => item.content?.id === content.id);

          if (isAlreadyBookmarked) {
            // 북마크 제거
            const bookmarks = state.bookmarks.filter((item) => item.content?.id !== content.id);
            return { bookmarks };
          } else {
            // 북마크 추가 (최대 100개까지)
            const newBookmarks = [
              { content, bookmarkedAt: new Date().toISOString() },
              ...state.bookmarks,
            ];
            const limitedBookmarks = newBookmarks.slice(0, 100);
            return { bookmarks: limitedBookmarks };
          }
        }),

      isBookmarked: (contentId) => get().bookmarks.some((item) => item.content?.id === contentId),

      getBookmarkedContent: (contentId) => {
        const bookmark = get().bookmarks.find((item) => item.content?.id === contentId);
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

      setHasSeenSwipeTutorial: (seen) =>
        set((state) => ({
          settings: { ...state.settings, hasSeenSwipeTutorial: seen },
        })),

      setHasSeenPWATutorial: (seen) =>
        set((state) => ({
          settings: { ...state.settings, hasSeenPWATutorial: seen },
        })),

      reset: () => set({
        ...initialState,
        learnState: {
          lastSeenId: 0,
          seed: Math.floor(Math.random() * 1000000),
          categories: '',
        },
        settings: {
          hasSeenSwipeTutorial: false,
          hasSeenPWATutorial: false,
        },
      }),
    }),
    {
      name: 'history-storage',
    }
  )
);
