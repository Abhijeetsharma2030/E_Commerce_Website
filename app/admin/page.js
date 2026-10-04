import Link from "next/link";
import { IndianRupee, Package, ShoppingBag, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/ui/count-up";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { formatPrice } from "@/lib/utils";

const STATUS_VARIANT = {
  pending: "warning",
  paid: "success",
  shipped: "secondary",
  delivered: "success",
  cancelled: "outline",
};

function StatCard({ icon: Icon, label, value, currency = false }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-neutral-200 p-5 transition-shadow hover:shadow-md">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-100">
        <Icon className="h-5 w-5 text-neutral-700" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">{label}</p>
        <p className="text-xl font-medium text-neutral-900">
          <CountUp value={value} currency={currency} />
        </p>
      </div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  await connectDB();

  const [userCount, orderCount, recentOrders, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "firstName lastName username").lean(),
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
  ]);

  const revenue = revenueAgg[0]?.total || 0;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-medium text-neutral-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={IndianRupee} label="Total Revenue" value={revenue} currency />
        <StatCard icon={ShoppingBag} label="Total Orders" value={orderCount} />
        <StatCard icon={Users} label="Total Users" value={userCount} />
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-neutral-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-200 py-16 text-center">
            <Package className="h-10 w-10 text-neutral-300" />
            <p className="text-sm text-neutral-500">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrders.map((order) => (
                  <tr key={order._id.toString()}>
                    <td className="px-4 py-3 font-medium text-neutral-900">
                      #{order._id.toString().slice(-6).toUpperCase()}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {order.user ? `${order.user.firstName} ${order.user.lastName}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANT[order.status] || "secondary"}>{order.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-neutral-900">
                      {formatPrice(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
