import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { fetchTrendingProducts } from "@/lib/api";
import { fetchCategoryTiles, fetchHeroBanners, fetchPromoBanners } from "@/lib/cms";
import { HeroBanner } from "@/components/home/hero-banner";
import { CategoryGrid } from "@/components/home/category-grid";
import { PromoBanner } from "@/components/home/promo-banner";
import { TrustBadges } from "@/components/home/trust-badges";
import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/ui/reveal";

export default async function HomePage() {
  const [heroSlides, categories, promoBanners, trendingProducts] = await Promise.all([
    fetchHeroBanners(),
    fetchCategoryTiles(),
    fetchPromoBanners(),
    fetchTrendingProducts(8).catch(() => []),
  ]);

  return (
    <div className="mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6 lg:px-8">
      <HeroBanner slides={heroSlides} />

      <Reveal>
        <TrustBadges />
      </Reveal>

      <Reveal>
        <section>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
            Browse
          </p>
          <h2 className="mb-6 text-2xl font-medium text-neutral-900">Shop by Category</h2>
          <CategoryGrid categories={categories} />
        </section>
      </Reveal>

      {trendingProducts.length > 0 && (
        <Reveal>
          <section>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="mb-1.5 text-xs font-medium uppercase tracking-widest text-neutral-400">
                  Curated for you
                </p>
                <h2 className="text-2xl font-medium text-neutral-900">Trending Products</h2>
              </div>
              <Link
                href="/products"
                className="group flex items-center gap-1 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </Reveal>
      )}

      <Reveal>
        <section className="grid gap-4 sm:grid-cols-2">
          {promoBanners.map((banner) => (
            <PromoBanner key={banner.title} {...banner} />
          ))}
        </section>
      </Reveal>
    </div>
  );
}
