import { Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="flex h-9 items-center justify-center gap-2 bg-blue-950 px-4 text-xs font-medium tracking-wide text-white">
      <Truck className="h-3.5 w-3.5" aria-hidden="true" />
      Free shipping on orders over $50 — new arrivals dropping weekly
    </div>
  );
}
