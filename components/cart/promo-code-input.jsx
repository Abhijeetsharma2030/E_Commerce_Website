"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/hooks/use-cart-store";

export function PromoCodeInput() {
  const [code, setCode] = useState("");
  const promoCode = useCartStore((state) => state.promoCode);
  const promoError = useCartStore((state) => state.promoError);
  const applyPromoCode = useCartStore((state) => state.applyPromoCode);
  const clearPromoCode = useCartStore((state) => state.clearPromoCode);

  if (promoCode) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
        <span className="flex items-center gap-1.5 font-medium">
          <Tag className="h-4 w-4" />
          {promoCode} applied
        </span>
        <button
          type="button"
          onClick={clearPromoCode}
          className="text-xs font-medium text-emerald-700 underline hover:text-emerald-900"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (code.trim()) applyPromoCode(code);
      }}
      className="flex flex-col gap-1.5"
    >
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Promo code (try WELCOME10)"
          aria-label="Promo code"
        />
        <Button type="submit" variant="secondary" size="md">
          Apply
        </Button>
      </div>
      {promoError && <p className="text-xs text-red-600">{promoError}</p>}
    </form>
  );
}
