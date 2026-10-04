import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/require-admin";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";

const VALID_STATUSES = ["pending", "paid", "shipped", "delivered", "cancelled"];

export async function PATCH(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { status } = await request.json();

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  await connectDB();
  const order = await Order.findByIdAndUpdate(id, { status }, { returnDocument: "after" });

  if (!order) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ id: order._id.toString(), status: order.status });
}
