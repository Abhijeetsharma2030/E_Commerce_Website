import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/icons/social-icons";

const SOCIAL_LINKS = [
  { icon: FacebookIcon, label: "Facebook", href: "https://facebook.com", className: "bg-[#1877F2]" },
  {
    icon: InstagramIcon,
    label: "Instagram",
    href: "https://instagram.com",
    className: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
  },
  { icon: XIcon, label: "X (Twitter)", href: "https://twitter.com", className: "bg-neutral-900" },
  { icon: LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com", className: "bg-[#0A66C2]" },
];

const SHOP_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "Smartphones", href: "/products?category=smartphones" },
  { label: "Furniture", href: "/products?category=furniture" },
];

const ACCOUNT_LINKS = [
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "My Orders", href: "/orders" },
  { label: "Sign In", href: "/login" },
];

export function Footer() {
  return (
    <footer>
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 text-sm font-medium text-white">
              T
            </span>
            <span className="text-lg font-medium text-neutral-900">Trove</span>
          </Link>
          <Button asChild>
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </div>

      <div className="bg-blue-950">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href, className }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-white transition-opacity hover:opacity-80 ${className}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Curated essentials in tech, fragrance, and home — designed for everyday living.
              Shop once, and we handle sourcing, shipping, and support from there.
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-white">Shop</p>
            <ul className="mt-3 space-y-2.5 text-sm text-white/70">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-white">Account</p>
            <ul className="mt-3 space-y-2.5 text-sm text-white/70">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-white">Contact</p>
            <ul className="mt-3 flex flex-col gap-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-white/50" />
                <a href="mailto:support@trove.com" className="hover:text-white">
                  support@trove.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50" />
                <span>123 Connaught Place, New Delhi, Delhi 110001, India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Trove. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="hover:text-neutral-900">Terms and Conditions</span>
            <span className="hover:text-neutral-900">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
