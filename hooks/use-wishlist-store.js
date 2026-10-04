"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleItem: (product) => {
        const exists = get().items.some((item) => item.id === product.id);
        set((state) => ({
          items: exists
            ? state.items.filter((item) => item.id !== product.id)
            : [
                ...state.items,
                {
                  id: product.id,
                  title: product.title,
                  price: product.discountedPrice ?? product.price,
                  thumbnail: product.thumbnail,
                },
              ],
        }));
      },

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((item) => item.id !== id) })),

      isWishlisted: (id) => get().items.some((item) => item.id === id),
    }),
    { name: "ecommerce-wishlist" }
  )
);
