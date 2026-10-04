import Image from "next/image";
import { Trash2 } from "lucide-react";

import { QuantityStepper } from "@/components/product/quantity-stepper";
import { formatPrice, SHIMMER_BLUR_DATA_URL } from "@/lib/utils";

export function CartLineItem({ item, onUpdateQuantity, onRemove }) {
  return (
    <div className="flex gap-4 py-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100">
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.title}
            fill
            loading="lazy"
            placeholder="blur"
            blurDataURL={SHIMMER_BLUR_DATA_URL}
            sizes="80px"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-neutral-900">{item.title}</p>
          <button
            type="button"
            onClick={() => onRemove(item.key)}
            className="text-neutral-400 hover:text-red-600"
            aria-label={`Remove ${item.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {(item.size || item.color) && (
          <p className="text-xs text-neutral-500">
            {[item.size, item.color?.name].filter(Boolean).join(" · ")}
          </p>
        )}

        <div className="mt-1 flex items-center justify-between">
          <QuantityStepper
            value={item.quantity}
            onChange={(quantity) => onUpdateQuantity(item.key, quantity)}
            max={item.stock || 99}
          />
          <p className="text-sm font-medium text-neutral-900">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
