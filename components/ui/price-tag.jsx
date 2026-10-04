import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceTag({ price, discountedPrice, size = "md", className }) {
  const hasDiscount = discountedPrice != null && discountedPrice < price;

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
  };

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className={cn("font-medium text-neutral-900", sizeClasses[size])}>
        {formatPrice(hasDiscount ? discountedPrice : price)}
      </span>
      {hasDiscount && (
        <span className="text-sm text-neutral-400 line-through">{formatPrice(price)}</span>
      )}
    </div>
  );
}
