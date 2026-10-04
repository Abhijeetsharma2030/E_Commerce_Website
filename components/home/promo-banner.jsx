import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

const ACCENTS = {
  emerald: "bg-emerald-50 text-emerald-900",
  violet: "bg-violet-50 text-violet-900",
  amber: "bg-amber-50 text-amber-900",
};

export function PromoBanner({ title, subtitle, ctaLabel, ctaHref, accent = "emerald" }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 rounded-2xl p-6 sm:flex-row sm:items-center",
        ACCENTS[accent] || ACCENTS.emerald
      )}
    >
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm opacity-80">{subtitle}</p>
      </div>
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
