import { notFound } from "next/navigation";

import { fetchProductById, fetchRelatedProducts } from "@/lib/api";
import { ProductDetailClient } from "./product-detail-client";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const product = await fetchProductById(id);
    return {
      title: `${product.title} — Trove`,
      description: product.description,
    };
  } catch {
    return { title: "Product Not Found — Trove" };
  }
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;

  let product;
  try {
    product = await fetchProductById(id);
  } catch {
    notFound();
  }

  const relatedProducts = await fetchRelatedProducts(product.category, product.id, 4);

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
