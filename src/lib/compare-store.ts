"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompareItem {
  productId: string;
  name: string;
  slug: string;
  brandName: string;
  image: string | null;
}

interface CompareStore {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const MAX_COMPARE = 3;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const items = get().items;
        if (items.some((i) => i.productId === item.productId)) return;
        if (items.length >= MAX_COMPARE) return;
        set({ items: [...items, item], isOpen: true });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      clear: () => set({ items: [], isOpen: false }),
      setOpen: (open) => set({ isOpen: open }),
    }),
    {
      name: "compare-list",
    }
  )
);

export const MAX_COMPARE_ITEMS = MAX_COMPARE;