import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CategoryGroup } from '@/api/model/response/category';

interface CategoryStore {
  categories: CategoryGroup[];
  selectedCategories: string[];
  totalContent: number;

  setCategories: (categories: CategoryGroup[], totalContent: number) => void;
  setSelectedCategories: (categories: string[]) => void;
  toggleCategory: (categoryKey: string) => void;
  reset: () => void;
}

const initialState = {
  categories: [],
  selectedCategories: [],
  totalContent: 0,
};

export const categoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      ...initialState,

      setCategories: (categories, totalContent) =>
        set({ categories, totalContent }),

      setSelectedCategories: (categories) =>
        set({ selectedCategories: categories }),

      toggleCategory: (categoryKey) =>
        set((state) => {
          const selected = state.selectedCategories.includes(categoryKey)
            ? state.selectedCategories.filter((key) => key !== categoryKey)
            : [...state.selectedCategories, categoryKey];
          return { selectedCategories: selected };
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'category-storage',
      partialize: (state) => ({ selectedCategories: state.selectedCategories }),
    }
  )
);
