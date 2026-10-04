"use client";

import { useState } from "react";
import { ChevronDown, Star, X } from "lucide-react";

import { cn } from "@/lib/utils";

export const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $25", min: 0, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100+", min: 100, max: Infinity },
];

export const RATING_FILTERS = [4, 3, 2];

const CATEGORY_PREVIEW_COUNT = 6;

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 py-4 first:pt-0 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-neutral-900">{title}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-neutral-400 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function FilterRow({ selected, onClick, className, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-1.5 text-left text-sm capitalize transition-colors",
        selected
          ? "bg-neutral-100 font-medium text-neutral-900"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
        className
      )}
    >
      {children}
    </button>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1 rounded-full bg-blue-950 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-blue-900"
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}

export function FiltersSidebar({
  categories,
  filters,
  onCategoryChange,
  onPriceRangeChange,
  onMinRatingChange,
  onClearAll,
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, CATEGORY_PREVIEW_COUNT);

  const activeChips = [];
  if (filters.category !== "all") {
    const category = categories.find((item) => item.slug === filters.category);
    activeChips.push({
      key: "category",
      label: category?.name || filters.category,
      onRemove: () => onCategoryChange("all"),
    });
  }
  if (filters.priceRange.label !== "All Prices") {
    activeChips.push({
      key: "price",
      label: filters.priceRange.label,
      onRemove: () => onPriceRangeChange(PRICE_RANGES[0]),
    });
  }
  if (filters.minRating > 0) {
    activeChips.push({
      key: "rating",
      label: `${filters.minRating}+ stars`,
      onRemove: () => onMinRatingChange(0),
    });
  }

  return (
    <aside>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-base font-medium text-neutral-900">Filters</h2>
        {activeChips.length > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-medium text-neutral-500 hover:text-neutral-900"
          >
            Clear all
          </button>
        )}
      </div>

      {activeChips.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2 pt-3">
          {activeChips.map((chip) => (
            <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
          ))}
        </div>
      )}

      <FilterSection title="Category">
        <div className="flex flex-col gap-0.5">
          <FilterRow selected={filters.category === "all"} onClick={() => onCategoryChange("all")}>
            All Categories
          </FilterRow>
          {visibleCategories.map((category) => (
            <FilterRow
              key={category.slug}
              selected={filters.category === category.slug}
              onClick={() => onCategoryChange(category.slug)}
            >
              {category.name}
            </FilterRow>
          ))}
        </div>
        {categories.length > CATEGORY_PREVIEW_COUNT && (
          <button
            type="button"
            onClick={() => setShowAllCategories((prev) => !prev)}
            className="mt-2 px-2.5 text-xs font-medium text-neutral-500 hover:text-neutral-900"
          >
            {showAllCategories ? "Show less" : `Show all (${categories.length})`}
          </button>
        )}
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="flex flex-col gap-0.5">
          {PRICE_RANGES.map((range) => (
            <FilterRow
              key={range.label}
              selected={filters.priceRange.label === range.label}
              onClick={() => onPriceRangeChange(range)}
            >
              {range.label}
            </FilterRow>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Rating">
        <div className="flex flex-col gap-0.5">
          {RATING_FILTERS.map((rating) => (
            <FilterRow
              key={rating}
              selected={filters.minRating === rating}
              onClick={() => onMinRatingChange(filters.minRating === rating ? 0 : rating)}
              className="flex items-center gap-1.5"
            >
              <span className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={cn(
                      "h-3.5 w-3.5",
                      index < rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"
                    )}
                  />
                ))}
              </span>
              & Up
            </FilterRow>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
