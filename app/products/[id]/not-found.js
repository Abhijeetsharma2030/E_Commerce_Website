import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-2xl font-medium text-neutral-900">Product not found</h1>
      <p className="text-sm text-neutral-500">
        The product you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/products">Back to Shop</Link>
      </Button>
    </div>
  );
}
