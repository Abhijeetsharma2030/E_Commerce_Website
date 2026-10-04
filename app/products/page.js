import { Suspense } from "react";

import { ProductsPageClient } from "./products-page-client";

export const metadata = {
  title: "Shop All Products — Trove",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageClient />
    </Suspense>
  );
}
