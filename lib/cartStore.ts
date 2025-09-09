"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartState, CartItem } from "./types";

// item aceito pelo addItem (quantity opcional na entrada)
type AddableItem = Omit<CartItem, "quantity"> & { quantity?: number };

const useCartStore = create<CartState>()(
  persist(
    (set, get): CartState => ({
      items: [],

      addItem: (item: AddableItem) => {
        set((state) => {
          const idx = state.items.findIndex((it) => it.id === item.id);
          const inc = item.quantity ?? 1;

          if (idx >= 0) {
            const copy = [...state.items];
            copy[idx] = {
              ...copy[idx],
              quantity: (copy[idx].quantity ?? 0) + inc,
            };
            return { items: copy };
          }

          return { items: [...state.items, { ...item, quantity: inc }] };
        });
      },

      remove: (id: string) =>
        set((state) => ({
          items: state.items.filter((it) => it.id !== id),
        })),

      updateQty: (id: string, qty: number) =>
        set((state) => ({
          items: state.items
            .map((it) => (it.id === id ? { ...it, quantity: qty } : it))
            .filter((it) => (it.quantity ?? 0) > 0),
        })),

      // manter os dois nomes por compatibilidade com páginas existentes
      clear: () => set({ items: [] }),
      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce(
          (acc, it) => acc + (it.price ?? 0) * (it.quantity ?? 0),
          0
        ),
    }),
    {
      name: "cd-cart-v1",
      storage: createJSONStorage(() => localStorage),
      version: 1,
      // partialize removido para evitar erro de tipos nas versões da lib
    }
  )
);

export default useCartStore;
