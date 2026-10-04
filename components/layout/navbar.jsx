"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, LogOut, Menu, Package, Search, ShieldCheck, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryDrawer } from "@/components/layout/category-drawer";
import { useCartStore } from "@/hooks/use-cart-store";
import { useWishlistStore } from "@/hooks/use-wishlist-store";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products?category=smartphones", label: "Tech" },
  { href: "/products?category=furniture", label: "Furniture" },
];

export function Navbar({ defaultMobileMenuOpen = false }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(defaultMobileMenuOpen);
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const openCart = useCartStore((state) => state.openCart);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { data: session } = useSession();
  const user = session?.user;

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <button
            type="button"
            className="-ml-2 flex items-center gap-1.5 rounded-md p-2 text-neutral-700 hover:bg-neutral-100"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/" className="text-lg font-medium tracking-tight text-neutral-900">
            Trove
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/products"
            className="hidden rounded-md p-2 text-neutral-700 hover:bg-neutral-100 sm:inline-flex"
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Link
            href="/wishlist"
            className="relative hidden rounded-md p-2 text-neutral-700 transition-colors hover:bg-neutral-100 sm:inline-flex"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <button
            type="button"
            onClick={openCart}
            className="relative rounded-md p-2 text-neutral-700 transition-colors hover:bg-neutral-100 active:scale-90"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-950 text-[10px] font-medium text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative ml-1 h-8 w-8 overflow-hidden rounded-full bg-blue-950 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  aria-label="Account menu"
                >
                  {user.image ? (
                    <Image src={user.image} alt={user.firstName} fill sizes="32px" className="object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  Signed in as <span className="font-medium text-neutral-700">{user.firstName}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push("/orders")}>
                  <Package className="h-4 w-4" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/wishlist")}>
                  <Heart className="h-4 w-4" />
                  Wishlist
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <DropdownMenuItem onSelect={() => router.push("/admin")}>
                    <ShieldCheck className="h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout} className="text-red-600 data-[highlighted]:text-red-600">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" variant="secondary" className="ml-1 hidden sm:inline-flex" asChild>
              <Link href="/login">
                <User className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>

      <CategoryDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        user={user}
        onLogout={handleLogout}
      />
    </header>
  );
}
