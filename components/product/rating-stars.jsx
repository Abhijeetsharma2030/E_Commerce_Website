import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function RatingStars({ rating = 0, reviewCount, size = "sm" }) {
  const sizeClass = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";

  return (
    <div className="flex items-center gap-1">
      <div className="flex" role="img" aria-label={`Rated ${rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, index) => {
          const fillAmount = Math.min(Math.max(rating - index, 0), 1);
          return (
            <span key={index} className="relative">
              <Star className={cn(sizeClass, "text-neutral-300")} />
              {fillAmount > 0 && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fillAmount * 100}%` }}
                >
                  <Star className={cn(sizeClass, "fill-amber-400 text-amber-400")} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {reviewCount != null && (
        <span className="text-xs text-neutral-500">({reviewCount})</span>
      )}
    </div>
  );
}
