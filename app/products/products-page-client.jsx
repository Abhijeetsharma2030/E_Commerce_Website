"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { fetchCategories, fetchProducts } from "@/lib/api";
import { ProductCard, ProductCardSkeleton } from "@/components/product/product-card";
import { FiltersSidebar, PRICE_RANGES } from "@/components/product/filters-sidebar";
import { SearchBar } from "@/components/product/search-bar";
import { SortSelect } from "@/components/product/sort-select";
import { useInView } from "@/hooks/use-in-view";

const SORT_MAP = {
  newest: { sortBy: "id", order: "desc" },
  "price-asc": { sortBy: "price", order: "asc" },
  "price-desc": { sortBy: "price", order: "desc" },
  "rating-desc": { sortBy: "rating", order: "desc" },
};

const PAGE_SIZE = 12;

export function ProductsPageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "newest";

  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [minRating, setMinRating] = useState(0);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(0);

  const updateQuery = useCallback(
    (updates) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all" || value === "newest") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      router.push(`${pathname}${params.toString() ? `?${params}` : ""}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const handleSearchChange = useCallback(
    (value) => updateQuery({ search: value }),
    [updateQuery]
  );
  const handleSortChange = useCallback((value) => updateQuery({ sort: value }), [updateQuery]);
  const handleCategoryChange = useCallback(
    (value) => updateQuery({ category: value }),
    [updateQuery]
  );
  const handleClearAll = useCallback(() => {
    setPriceRange(PRICE_RANGES[0]);
    setMinRating(0);
    updateQuery({ category: "all", search: "", sort: "newest" });
  }, [updateQuery]);

  const pendingSkipRef = useRef(null);

  const loadProducts = useCallback(
    async (nextSkip) => {
      if (pendingSkipRef.current === nextSkip) return;
      pendingSkipRef.current = nextSkip;

      setIsLoading(true);
      try {
        const { sortBy, order } = SORT_MAP[sort] || SORT_MAP.newest;
        const result = await fetchProducts({
          limit: PAGE_SIZE,
          skip: nextSkip,
          category,
          search: search || undefined,
          sortBy,
          order,
        });

        setProducts((previous) => {
          if (nextSkip === 0) return result.products;
          const existingIds = new Set(previous.map((product) => product.id));
          const newItems = result.products.filter((product) => !existingIds.has(product.id));
          return [...previous, ...newItems];
        });
        setTotal(result.total);
        setSkip(nextSkip);
      } catch (error) {
        console.error(error);
        setProducts([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
        pendingSkipRef.current = null;
      }
    },
    [category, search, sort]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProducts(0);
  }, [loadProducts]);

  const visibleProducts = products.filter((product) => {
    const priceMatch = product.price >= priceRange.min && product.price <= priceRange.max;
    const ratingMatch = product.rating >= minRating;
    return priceMatch && ratingMatch;
  });

  const hasMore = products.length < total;
  const isLoadingMore = isLoading && skip > 0;

  const [sentinelRef, sentinelInView] = useInView({
    rootMargin: "600px",
    enabled: hasMore && !isLoading,
  });

  useEffect(() => {
    if (sentinelInView && hasMore && !isLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadProducts(skip + PAGE_SIZE);
    }
  }, [sentinelInView, hasMore, isLoading, skip, loadProducts]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">All Products</h1>
          <p className="text-sm text-neutral-500">{total} items</p>
        </div>
        <div className="flex flex-col gap-3 sm:w-auto sm:flex-row">
          <SearchBar defaultValue={search} onSearch={handleSearchChange} />
          <SortSelect value={sort} onChange={handleSortChange} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <FiltersSidebar
          categories={categories}
          filters={{ category, priceRange, minRating }}
          onCategoryChange={handleCategoryChange}
          onPriceRangeChange={setPriceRange}
          onMinRatingChange={setMinRating}
          onClearAll={handleClearAll}
        />

        <div>
          {isLoading && skip === 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
              <p className="text-lg font-medium text-neutral-900">No products found</p>
              <p className="text-sm text-neutral-500">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div ref={sentinelRef} className="mt-8">
                  {isLoadingMore && (
                    <>
                      <div className="mb-4 flex items-center justify-center gap-2 text-sm text-neutral-400">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Loading more products…
                      </div>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <ProductCardSkeleton key={index} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <p className="mt-10 text-center text-sm text-neutral-400">
                  You&apos;ve reached the end — {products.length} of {total} products
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
