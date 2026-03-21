"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  IndianRupee,
  AlertTriangle,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { adminFetchDashboardStats } from "@/lib/api";

interface Stats {
  total_products: number;
  total_orders: number;
  total_users: number;
  total_revenue: number;
  pending_orders: number;
  low_stock_products: number;
  recent_orders: {
    id: string;
    order_number: string;
    status: string;
    payment_status: string;
    total: number;
    created_at: string;
  }[];
}

const statusColor: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  processing: "text-blue-400 bg-blue-400/10",
  shipped: "text-purple-400 bg-purple-400/10",
  delivered: "text-emerald-400 bg-emerald-400/10",
  cancelled: "text-rose-400 bg-rose-400/10",
};

export default function DashboardView() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminFetchDashboardStats();
        setStats(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-[var(--fg-muted)]">Failed to load dashboard data.</p>;
  }

  const cards = [
    {
      label: "Total Revenue",
      value: `₹${stats.total_revenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Total Orders",
      value: stats.total_orders,
      icon: ShoppingCart,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Total Products",
      value: stats.total_products,
      icon: Package,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      label: "Total Users",
      value: stats.total_users,
      icon: Users,
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      label: "Pending Orders",
      value: stats.pending_orders,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      label: "Low Stock",
      value: stats.low_stock_products,
      icon: AlertTriangle,
      color: "text-rose-400",
      bg: "bg-rose-400/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold">
          Dashboard
        </h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">
          Overview of your store performance
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-[var(--fg-muted)] uppercase tracking-wider font-medium">
                  {card.label}
                </p>
                <p className="text-2xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gold" />
          <h2 className="text-sm font-semibold tracking-wider uppercase">Recent Orders</h2>
        </div>
        {stats.recent_orders.length === 0 ? (
          <div className="p-8 text-center text-[var(--fg-muted)] text-sm">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--fg-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="px-5 py-3 text-left font-medium">Order</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Payment</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                  <th className="px-5 py-3 text-right font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--glass)] transition-colors"
                  >
                    <td className="px-5 py-3.5 font-medium text-gold">
                      #{order.order_number}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                          statusColor[order.status] || "text-[var(--fg-muted)]"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 capitalize text-[var(--fg-muted)]">
                      {order.payment_status}
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium">
                      ₹{order.total.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5 text-right text-[var(--fg-muted)]">
                      {new Date(order.created_at).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
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
