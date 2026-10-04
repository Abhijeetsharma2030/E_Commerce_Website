import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { PROMO_CODES } from "@/lib/promo";
import { roundCurrency } from "@/lib/utils";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order._id.toString(),
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
    })),
  });
}

const REQUIRED_ADDRESS_FIELDS = [
  "fullName",
  "phone",
  "addressLine1",
  "city",
  "state",
  "postalCode",
  "country",
];

export async function POST(request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { items, shippingAddress, promoCode } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ message: "Your cart is empty." }, { status: 400 });
  }

  for (const field of REQUIRED_ADDRESS_FIELDS) {
    if (!shippingAddress?.[field]?.trim()) {
      return NextResponse.json(
        { message: `Shipping address is missing "${field}".` },
        { status: 400 }
      );
    }
  }

  const subtotal = roundCurrency(items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const promoRate = promoCode ? PROMO_CODES[String(promoCode).trim().toUpperCase()] || 0 : 0;
  const safeDiscount = roundCurrency(subtotal * promoRate);
  const shippingCost = subtotal > 0 && subtotal < 50 ? 6.99 : 0;
  const total = roundCurrency(Math.max(subtotal - safeDiscount + shippingCost, 0));

  await connectDB();

  const order = await Order.create({
    user: session.user.id,
    items: items.map((item) => ({
      productId: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color?.name,
    })),
    shippingAddress,
    subtotal,
    discount: safeDiscount,
    shipping: shippingCost,
    total,
    status: "pending",
  });

  return NextResponse.json({ id: order._id.toString() }, { status: 201 });
}
