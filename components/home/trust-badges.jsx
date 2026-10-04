import { Headset, RefreshCw, ShieldCheck, Truck } from "lucide-react";

const BADGES = [
  {
    icon: Truck,
    title: "Free Shipping",
    subtitle: "On orders over $50",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    subtitle: "30-day return window",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    subtitle: "100% protected payments",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-600",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    subtitle: "Here whenever you need us",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:grid-cols-4 sm:p-8">
      {BADGES.map(({ icon: Icon, title, subtitle, iconBg, iconColor }) => (
        <div key={title} className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-900">{title}</p>
            <p className="text-xs text-neutral-500">{subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
