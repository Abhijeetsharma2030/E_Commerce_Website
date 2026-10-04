"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { PROMO_CODES } from "@/lib/promo";
import { roundCurrency } from "@/lib/utils";

function lineKey(id, size, color) {
  return `${id}::${size || "default"}::${color || "default"}`;
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      promoError: null,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, { size, color, quantity = 1 } = {}) => {
        const key = lineKey(product.id, size, color);

        set((state) => {
          const existing = state.items.find((item) => item.key === key);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.key === key
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isOpen: true,
            };
          }

          return {
            items: [
              ...state.items,
              {
                key,
                id: product.id,
                title: product.title,
                price: product.discountedPrice ?? product.price,
                thumbnail: product.thumbnail,
                size,
                color,
                quantity,
                stock: product.stock,
              },
            ],
            isOpen: true,
          };
        });
      },

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((item) => item.key !== key) })),

      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.key !== key)
              : state.items.map((item) =>
                  item.key === key ? { ...item, quantity } : item
                ),
        })),

      clearCart: () => set({ items: [], promoCode: null, promoError: null }),

      applyPromoCode: (code) => {
        const normalized = code.trim().toUpperCase();
        if (PROMO_CODES[normalized]) {
          set({ promoCode: normalized, promoError: null });
        } else {
          set({ promoCode: null, promoError: "Invalid promo code" });
        }
      },

      clearPromoCode: () => set({ promoCode: null, promoError: null }),

      getTotals: () => {
        const { items, promoCode } = get();
        const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
        const discountRate = promoCode ? PROMO_CODES[promoCode] : 0;
        const discount = roundCurrency(subtotal * discountRate);
        const shipping = subtotal > 0 && subtotal < 50 ? 6.99 : 0;
        const total = roundCurrency(Math.max(subtotal - discount + shipping, 0));

        return { subtotal, discount, shipping, total, itemCount: items.reduce((n, i) => n + i.quantity, 0) };
      },
    }),
    {
      name: "ecommerce-cart",
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode }),
    }
  )
);
