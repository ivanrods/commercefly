import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem } from "../types/cart-item-type";

type CartStore = {
  items: CartItem[];

  addItem: (item: CartItem) => void;
  decrementItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;

  totalItems: () => number;
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
              ),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      decrementItem: (id) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === id);

          if (!existing) return state;

          if (existing.quantity === 1) {
            return {
              items: state.items.filter((i) => i.id !== id),
            };
          }

          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity - 1 } : i,
            ),
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearCart: () =>
        set({
          items: [],
        }),

      totalItems: () =>
        get().items.reduce((acc, item) => acc + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),

    {
      name: "commercefly-cart",
    },
  ),
);
