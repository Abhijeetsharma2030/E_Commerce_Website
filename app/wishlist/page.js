"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/hooks/use-cart-store";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { formatPrice, SHIMMER_BLUR_DATA_URL } from "@/lib/utils";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addToCart = useCartStore((state) => state.addItem);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
        <Heart className="h-12 w-12 text-neutral-300" />
        <h1 className="text-2xl font-medium text-neutral-900">Your wishlist is empty</h1>
        <p className="text-sm text-neutral-500">Save items you love by tapping the heart icon.</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-medium text-neutral-900">Your Wishlist ({items.length})</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white"
          >
            <Link href={`/products/${item.id}`} className="relative block aspect-square bg-neutral-100">
              <Image
                src={item.thumbnail}
                alt={item.title}
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL={SHIMMER_BLUR_DATA_URL}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </Link>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <Link href={`/products/${item.id}`}>
                <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 hover:underline">
                  {item.title}
                </h3>
              </Link>
              <p className="text-sm font-medium text-neutral-900">{formatPrice(item.price)}</p>
              <div className="mt-auto flex gap-2 pt-2">
                <Button size="sm" className="flex-1" onClick={() => addToCart(item, { quantity: 1 })}>
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.title} from wishlist`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
