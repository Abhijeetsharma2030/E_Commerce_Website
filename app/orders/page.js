"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CheckCircle2, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, SHIMMER_BLUR_DATA_URL } from "@/lib/utils";

const STATUS_VARIANT = {
  pending: "warning",
  paid: "success",
  shipped: "secondary",
  delivered: "success",
  cancelled: "outline",
};

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState(null);

  const placedOrderId = searchParams.get("placed");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?redirect=/orders");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]));
  }, [status]);

  if (status !== "authenticated") return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {placedOrderId && (
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>
            Order placed successfully — <strong>#{placedOrderId.slice(-6).toUpperCase()}</strong>.
            We&apos;ll email you when it ships.
          </span>
        </div>
      )}

      <h1 className="mb-1 text-2xl font-medium text-neutral-900">My Orders</h1>
      <p className="mb-6 text-sm text-neutral-500">
        Order history for {session.user.firstName} {session.user.lastName}
      </p>

      {orders === null ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <Package className="h-12 w-12 text-neutral-300" />
          <p className="text-lg font-medium text-neutral-900">No orders yet</p>
          <p className="text-sm text-neutral-500">Your past orders will show up here.</p>
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-neutral-200 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {order.items.length} items ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[order.status] || "secondary"}>
                    {order.status}
                  </Badge>
                  <p className="text-sm font-medium text-neutral-900">{formatPrice(order.total)}</p>
                </div>
              </div>

              <div className="flex -space-x-3">
                {order.items.slice(0, 6).map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-neutral-100"
                  >
                    {item.thumbnail && (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={SHIMMER_BLUR_DATA_URL}
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
                {order.items.length > 6 && (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-neutral-100 text-xs font-medium text-neutral-600">
                    +{order.items.length - 6}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={null}>
      <OrdersContent />
    </Suspense>
  );
}
