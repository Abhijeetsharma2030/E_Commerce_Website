import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

export function QuantityStepper({ value, onChange, min = 1, max = 99, className }) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-neutral-300",
        className
      )}
    >
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        className="flex h-9 w-9 items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-10 text-center text-sm font-medium text-neutral-900" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        className="flex h-9 w-9 items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-40"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
