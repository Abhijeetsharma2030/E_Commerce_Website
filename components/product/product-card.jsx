"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { Heart, ShoppingBag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";
import { Skeleton } from "@/components/ui/skeleton";
import { RatingStars } from "@/components/product/rating-stars";
import { useCartStore } from "@/hooks/use-cart-store";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { cn, SHIMMER_BLUR_DATA_URL } from "@/lib/utils";

const SPRING = { stiffness: 300, damping: 25, mass: 0.5 };

export function ProductCard({ product, className }) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) =>
    state.items.some((item) => item.id === product.id)
  );

  const outOfStock = !product.inStock;

  const cardRef = useRef(null);
  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 60%)`;

  function handleMouseMove(event) {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const px = (event.clientX - bounds.left) / bounds.width;
    const py = (event.clientY - bounds.top) / bounds.height;

    rotateY.set((px - 0.5) * 10);
    rotateX.set((0.5 - py) * 10);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl",
        className
      )}
    >
      <Link href={`/products/${product.id}`} className="relative block aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL={SHIMMER_BLUR_DATA_URL}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={cn(
            "object-cover transition-transform duration-500 group-hover:scale-105",
            outOfStock && "opacity-50 grayscale"
          )}
        />

        <motion.div
          aria-hidden="true"
          style={{ background: glareBackground }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isOnSale && !outOfStock && (
            <Badge variant="sale">-{Math.round(product.discountPercentage)}%</Badge>
          )}
          {outOfStock && <Badge variant="outline" className="bg-white">Out of Stock</Badge>}
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition-colors hover:text-red-600 active:scale-90"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4", isWishlisted && "fill-red-600 text-red-600")} />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          {product.category?.replace(/-/g, " ")}
        </span>

        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-900 hover:underline">
            {product.title}
          </h3>
        </Link>

        <RatingStars rating={product.rating} />

        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceTag price={product.price} discountedPrice={product.discountedPrice} />

          <Button
            size="icon"
            variant={outOfStock ? "secondary" : "primary"}
            disabled={outOfStock}
            aria-label="Add to cart"
            onClick={() => addItem(product, { quantity: 1 })}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
