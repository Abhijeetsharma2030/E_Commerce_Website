import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/require-admin";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  await connectDB();
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "firstName lastName username email")
    .lean();

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order._id.toString(),
      user: order.user
        ? {
            name: `${order.user.firstName} ${order.user.lastName}`,
            username: order.user.username,
            email: order.user.email,
          }
        : null,
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
