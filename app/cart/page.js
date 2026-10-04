"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { PromoCodeInput } from "@/components/cart/promo-code-input";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getTotals = useCartStore((state) => state.getTotals);

  const { subtotal, discount, shipping, total } = getTotals();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-neutral-300" />
        <h1 className="text-2xl font-medium text-neutral-900">Your cart is empty</h1>
        <p className="text-sm text-neutral-500">Looks like you haven&apos;t added anything yet.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-medium text-neutral-900">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 px-4">
          {items.map((item) => (
            <CartLineItem
              key={item.key}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-5">
          <h2 className="text-lg font-medium text-neutral-900">Order Summary</h2>

          <PromoCodeInput />

          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Shipping</span>
              <span>{shipping > 0 ? formatPrice(shipping) : "Free"}</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-neutral-200 pt-3 text-base font-medium text-neutral-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Button size="lg" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
