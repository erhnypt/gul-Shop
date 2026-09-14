"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RfqItem {
  productId: string;
  name: string;
  brandName: string;
  image: string | null;
  slug: string;
  quantity: number;
  note?: string;
}

interface RfqStore {
  items: RfqItem[];
  addItem: (item: RfqItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateNote: (productId: string, note: string) => void;
  clear: () => void;
  isOpen: boolean;
  openList: () => void;
  closeList: () => void;
}

export const useRfqStore = create<RfqStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId
        );
        if (existing) return;
        set((state) => ({ items: [...state.items, item] }));
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        })),
      updateNote: (productId, note) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, note } : i
          ),
        })),
      clear: () => set({ items: [] }),
      openList: () => set({ isOpen: true }),
      closeList: () => set({ isOpen: false }),
    }),
    {
      name: "rfq-list",
    }
  )
);
