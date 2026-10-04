"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShoppingBag, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatPrice } from "@/lib/utils";

const INITIAL_ADDRESS = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export function CheckoutForm() {
  const router = useRouter();
  const { status } = useSession();

  const items = useCartStore((state) => state.items);
  const promoCode = useCartStore((state) => state.promoCode);
  const getTotals = useCartStore((state) => state.getTotals);
  const clearCart = useCartStore((state) => state.clearCart);

  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?redirect=/checkout");
    }
  }, [status, router]);

  if (status !== "authenticated") return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="h-12 w-12 text-neutral-300" />
        <h1 className="text-2xl font-medium text-neutral-900">Your cart is empty</h1>
        <p className="text-sm text-neutral-500">Add something to your cart before checking out.</p>
        <Button asChild>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  const { subtotal, discount, shipping, total } = getTotals();

  function updateField(field) {
    return (event) => setAddress((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: address,
          promoCode,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not place your order. Please try again.");
      }

      clearCart();
      router.push(`/orders?placed=${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-medium text-neutral-900">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-4 text-lg font-medium text-neutral-900">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={address.fullName} onChange={updateField("fullName")} required />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" type="tel" value={address.phone} onChange={updateField("phone")} required />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="addressLine1">Address</Label>
                <Input
                  id="addressLine1"
                  value={address.addressLine1}
                  onChange={updateField("addressLine1")}
                  placeholder="Street address"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="addressLine2">Apartment, suite, etc. (optional)</Label>
                <Input id="addressLine2" value={address.addressLine2} onChange={updateField("addressLine2")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={address.city} onChange={updateField("city")} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={address.state} onChange={updateField("state")} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="postalCode">Postal code</Label>
                <Input id="postalCode" value={address.postalCode} onChange={updateField("postalCode")} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="country">Country</Label>
                <Input id="country" value={address.country} onChange={updateField("country")} required />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-medium text-neutral-900">Payment Method</h2>
            <div className="flex items-center gap-3 rounded-xl border border-neutral-900 bg-neutral-50 p-4">
              <Truck className="h-5 w-5 text-neutral-700" />
              <div>
                <p className="text-sm font-medium text-neutral-900">Cash on Delivery</p>
                <p className="text-xs text-neutral-500">Pay when your order arrives.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-fit flex-col gap-4 rounded-xl border border-neutral-200 p-5">
          <h2 className="text-lg font-medium text-neutral-900">Order Summary</h2>

          <div className="flex max-h-56 flex-col gap-3 overflow-y-auto">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between gap-3 text-sm">
                <span className="text-neutral-600">
                  {item.title} <span className="text-neutral-400">× {item.quantity}</span>
                </span>
                <span className="shrink-0 font-medium text-neutral-900">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-neutral-200 pt-3 text-sm">
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

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" loading={isSubmitting}>
            {isSubmitting ? "Placing Order…" : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}
