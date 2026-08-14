import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CompareItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  specifications: string; // JSON string from DB
}

interface CompareStore {
  items: CompareItem[];
  isOpen: boolean;
  addItem: (item: CompareItem) => void;
  removeItem: (id: string) => void;
  clearCompare: () => void;
  toggleModal: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const currentItems = get().items;
        if (currentItems.find((i) => i.id === item.id)) return;
        // Limit to 4 items max for comparison
        if (currentItems.length >= 4) {
          alert('You can only compare up to 4 items at a time.');
          return;
        }
        set({ items: [...currentItems, item], isOpen: true });
      },
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCompare: () => set({ items: [] }),
      toggleModal: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'nexora-compare-storage',
    }
  )
);
