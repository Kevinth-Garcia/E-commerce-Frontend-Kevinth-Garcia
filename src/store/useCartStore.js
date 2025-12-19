// src/store/useCartStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

//funcion de carro de compras persistente que actualiza en tiempo real

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // [{id,title,price,image,qty}]

      addItem: (p) => {
        const items = get().items;
        const found = items.find((i) => i.id === p.id);

        if (found) {
          set({
            items: items.map((i) =>
              i.id === p.id ? { ...i, qty: i.qty + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...p, qty: 1 }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      inc: (id) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, qty: i.qty + 1 } : i
          ),
        }),

      dec: (id) => {
        const items = get()
          .items.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0);
        set({ items });
      },

      clear: () => set({ items: [] }),

      total: () => get().items.reduce((acc, i) => acc + i.price * i.qty, 0),
      count: () => get().items.reduce((acc, i) => acc + i.qty, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    }
  )
);
