import { create } from 'zustand';
import {LearningData} from "@/api/model/response/learndata.ts";

interface ContentStore {
  contentList: LearningData[];
  currentContent: LearningData | null;
  seenIds: number[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setContentList: (content: LearningData[]) => void;
  setCurrentContent: (content: LearningData | null) => void;
  addSeenId: (id: number) => void;
  clearSeenIds: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  contentList: [],
  currentContent: null,
  seenIds: [],
  isLoading: false,
  error: null,
};

export const contentStore = create<ContentStore>((set) => ({
  ...initialState,

  setContentList: (contentList) => set({ contentList }),

  setCurrentContent: (currentContent) => set({ currentContent }),

  addSeenId: (id) =>
    set((state) => ({
      seenIds: state.seenIds.includes(id)
        ? state.seenIds
        : [...state.seenIds, id],
    })),

  clearSeenIds: () => set({ seenIds: [] }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
