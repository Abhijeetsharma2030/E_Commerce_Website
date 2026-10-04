"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronRight,
  Heart,
  LogOut,
  Package,
  ShieldCheck,
  Store,
  TrendingUp,
  User,
  X,
} from "lucide-react";

import { fetchCategories } from "@/lib/api";
import { cn } from "@/lib/utils";

const TRENDING_LINKS = [
  { label: "Best Sellers", href: "/products?sort=rating-desc" },
  { label: "New Releases", href: "/products?sort=newest" },
  { label: "Today's Deals", href: "/products?category=smartphones" },
];

function Section({ title, children }) {
  return (
    <div className="border-b border-neutral-200 py-3">
      <p className="px-4 pb-2 text-base font-medium text-neutral-900">{title}</p>
      {children}
    </div>
  );
}

function Row({ href, onClick, children }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center justify-between px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-100"
    >
      <span>{children}</span>
      <ChevronRight className="h-4 w-4 text-neutral-400" />
    </Link>
  );
}

export function CategoryDrawer({ open, onClose, user, onLogout }) {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    if (open && categories === null) {
      fetchCategories()
        .then(setCategories)
        .catch(() => setCategories([]));
    }
  }, [open, categories]);

  return (
    <div
      className={cn("fixed inset-0 z-40", open ? "pointer-events-auto" : "pointer-events-none")}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/50 transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute left-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-xl transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-3 bg-blue-950 px-4 py-4 text-white">
          <Link
            href={user ? "/orders" : "/login"}
            onClick={onClose}
            className="flex items-center gap-2 text-base font-medium"
          >
            <User className="h-5 w-5" />
            Hello, {user ? user.firstName : "sign in"}
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Section title="Trending">
            {TRENDING_LINKS.map((link) => (
              <Row key={link.label} href={link.href} onClick={onClose}>
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-neutral-400" />
                  {link.label}
                </span>
              </Row>
            ))}
          </Section>

          <Section title="Shop by Category">
            <Row href="/products" onClick={onClose}>
              All Products
            </Row>
            {categories === null ? (
              <p className="px-4 py-2.5 text-sm text-neutral-400">Loading categories…</p>
            ) : (
              categories.map((category) => (
                <Row key={category.slug} href={`/products?category=${category.slug}`} onClick={onClose}>
                  {category.name}
                </Row>
              ))
            )}
          </Section>

          <Section title="Your Account">
            {user ? (
              <>
                <Row href="/orders" onClick={onClose}>
                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-neutral-400" />
                    My Orders
                  </span>
                </Row>
                <Row href="/wishlist" onClick={onClose}>
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-neutral-400" />
                    Wishlist
                  </span>
                </Row>
                {user.role === "admin" && (
                  <Row href="/admin" onClick={onClose}>
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-neutral-400" />
                      Admin Panel
                    </span>
                  </Row>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onLogout();
                  }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="px-4 py-2">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-900"
                >
                  <Store className="h-4 w-4" />
                  Sign In
                </Link>
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  );
}
