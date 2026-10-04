"use client";

import { useState } from "react";
import { Heart, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/ui/price-tag";
import { ProductGallery } from "@/components/product/product-gallery";
import { RatingStars } from "@/components/product/rating-stars";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { ColorSelector, SizeSelector } from "@/components/product/variant-selector";
import { ProductCard } from "@/components/product/product-card";
import { useCartStore } from "@/hooks/use-cart-store";
import { useWishlistStore } from "@/hooks/use-wishlist-store";
import { cn } from "@/lib/utils";

export function ProductDetailClient({ product, relatedProducts }) {
  const [size, setSize] = useState(product.variants.sizes[0]);
  const [color, setColor] = useState(product.variants.colors[0]);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isWishlisted = useWishlistStore((state) =>
    state.items.some((item) => item.id === product.id)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div className="flex flex-col gap-5">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              {product.brand}
            </span>
            <h1 className="mt-1 text-2xl font-medium text-neutral-900">{product.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <RatingStars rating={product.rating} reviewCount={product.reviews.length} size="lg" />
            {product.isOnSale && <Badge variant="sale">-{Math.round(product.discountPercentage)}%</Badge>}
          </div>

          <PriceTag price={product.price} discountedPrice={product.discountedPrice} size="lg" />

          <p className="text-sm leading-relaxed text-neutral-600">{product.description}</p>

          <div
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
              product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", product.inStock ? "bg-emerald-500" : "bg-red-500")} />
            {product.inStock ? `In Stock — ${product.stock} available` : "Out of Stock"}
          </div>

          <SizeSelector sizes={product.variants.sizes} selected={size} onSelect={setSize} />
          <ColorSelector colors={product.variants.colors} selected={color} onSelect={setColor} />

          <div>
            <p className="mb-2 text-sm font-medium text-neutral-900">Quantity</p>
            <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock || 1} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              size="lg"
              className="flex-1"
              disabled={!product.inStock}
              onClick={() => addItem(product, { size, color, quantity })}
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-12 w-12"
              onClick={() => toggleWishlist(product)}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={cn("h-5 w-5", isWishlisted && "fill-red-600 text-red-600")} />
            </Button>
          </div>

          <div className="mt-2 flex flex-col gap-2 border-t border-neutral-200 pt-4 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              {product.shippingInformation}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              {product.warrantyInformation}
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-5 text-xl font-medium text-neutral-900">You Might Also Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
