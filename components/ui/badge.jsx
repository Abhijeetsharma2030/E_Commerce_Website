import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-blue-950 text-white",
        secondary: "bg-neutral-100 text-neutral-900",
        sale: "bg-red-600 text-white",
        success: "bg-emerald-600 text-white",
        warning: "bg-amber-500 text-white",
        outline: "border border-neutral-300 text-neutral-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
