"use client";

import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

const CartDrawer = dynamic(
  () => import("@/components/cart/cart-drawer").then((mod) => mod.CartDrawer),
  { ssr: false }
);

export function Providers({ children }) {
  return (
    <SessionProvider>
      {children}
      <CartDrawer />
    </SessionProvider>
  );
}
