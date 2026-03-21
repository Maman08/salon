"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ShoppingCart,
  Loader2,
  Eye,
  X,
  ChevronDown,
  Truck,
  Clock,
  CheckCircle2,
  Package,
  XCircle,
  MapPin,
} from "lucide-react";
import {
  adminFetchOrders,
  adminUpdateOrderStatus,
  AdminOrder,
  ApiError,
} from "@/lib/api";

const statuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const paymentStatuses = ["pending", "paid", "failed", "refunded"];

const statusColor: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10",
  confirmed: "text-blue-400 bg-blue-400/10",
  processing: "text-blue-400 bg-blue-400/10",
  shipped: "text-purple-400 bg-purple-400/10",
  delivered: "text-emerald-400 bg-emerald-400/10",
  cancelled: "text-rose-400 bg-rose-400/10",
};

const paymentStatusColor: Record<string, string> = {
  pending: "text-yellow-400",
  paid: "text-emerald-400",
  failed: "text-rose-400",
  refunded: "text-orange-400",
};

export default function OrdersView() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<AdminOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetchOrders({ page, per_page: 15 });
      setOrders(res.items);
      setTotalPages(res.total_pages);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdating(true);
    setMsg(null);
    try {
      const updated = await adminUpdateOrderStatus(orderId, { status });
      setSelected(updated);
      setMsg("Status updated!");
      await loadOrders();
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-[family-name:var(--font-playfair)] font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-gold" /> Orders
        </h1>
        <p className="text-sm text-[var(--fg-muted)] mt-1">Manage and track all customer orders</p>
      </div>

      {/* Orders table */}
      <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-5 h-5 text-gold animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-[var(--fg-muted)] text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[var(--fg-muted)] text-xs uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="px-5 py-3 text-left font-medium">Order</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Payment</th>
                  <th className="px-5 py-3 text-left font-medium">Items</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                  <th className="px-5 py-3 text-right font-medium">Date</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--glass)] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gold">#{order.order_number}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor[order.status] || ""}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs capitalize ${paymentStatusColor[order.payment_status] || "text-[var(--fg-muted)]"}`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--fg-muted)]">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium">₹{order.total?.toLocaleString("en-IN")}</td>
                    <td className="px-5 py-3.5 text-right text-[var(--fg-muted)]">
                      {new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => { setSelected(order); setMsg(null); }}
                        className="p-1.5 rounded-lg hover:bg-gold/10 text-[var(--fg-muted)] hover:text-gold transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-[var(--border)]">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                  page === i + 1
                    ? "bg-gold text-[var(--btn-text)]"
                    : "bg-[var(--glass)] text-[var(--fg-muted)]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">
                Order <span className="text-gold">#{selected.order_number}</span>
              </h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-[var(--glass)] text-[var(--fg-muted)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {msg && (
              <div className="p-3 rounded-lg bg-gold/10 text-gold text-sm mb-4">
                {msg}
              </div>
            )}

            {/* Status controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Order Status</label>
                <div className="relative">
                  <select
                    value={selected.status}
                    onChange={(e) => handleStatusUpdate(selected.id, e.target.value)}
                    disabled={updating}
                    className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-gold/40 transition-colors appearance-none pr-10 disabled:opacity-50"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-faint)] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--fg-muted)] mb-1.5 uppercase tracking-wide">Payment Status</label>
                <div className={`px-3 py-2.5 text-sm rounded-lg bg-[var(--bg-raised)] border border-[var(--border)] capitalize ${paymentStatusColor[selected.payment_status] || ""}`}>
                  {selected.payment_status}
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="mb-6">
              <h3 className="text-xs text-[var(--fg-muted)] uppercase tracking-wide mb-3">Items</h3>
              <div className="space-y-2">
                {selected.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-raised)]">
                    {item.product_image ? (
                      <img src={item.product_image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
                        <Package className="w-4 h-4 text-[var(--fg-faint)]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product_name}</p>
                      <p className="text-xs text-[var(--fg-muted)]">Qty: {item.quantity} × ₹{item.unit_price}</p>
                    </div>
                    <p className="text-sm font-medium">₹{item.total_price?.toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="p-4 rounded-xl bg-[var(--bg-raised)] space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--fg-muted)]">Subtotal</span>
                <span>₹{selected.subtotal?.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--fg-muted)]">Shipping</span>
                <span>{selected.shipping_fee > 0 ? `₹${selected.shipping_fee}` : "Free"}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-[var(--border)]">
                <span>Total</span>
                <span className="text-gold">₹{selected.total?.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Shipping address */}
            {selected.shipping_address && (
              <div>
                <h3 className="text-xs text-[var(--fg-muted)] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Shipping Address
                </h3>
                <div className="p-4 rounded-xl bg-[var(--bg-raised)] text-sm space-y-0.5">
                  <p className="font-medium">{selected.shipping_address.full_name}</p>
                  <p className="text-[var(--fg-muted)]">{selected.shipping_address.phone}</p>
                  <p className="text-[var(--fg-muted)]">
                    {selected.shipping_address.address_line1}
                    {selected.shipping_address.address_line2 && `, ${selected.shipping_address.address_line2}`}
                  </p>
                  <p className="text-[var(--fg-muted)]">
                    {selected.shipping_address.city}, {selected.shipping_address.state} — {selected.shipping_address.pincode}
                  </p>
                </div>
              </div>
            )}

            {/* Notes */}
            {selected.notes && (
              <div className="mt-4">
                <h3 className="text-xs text-[var(--fg-muted)] uppercase tracking-wide mb-2">Notes</h3>
                <p className="p-3 rounded-xl bg-[var(--bg-raised)] text-sm text-[var(--fg-muted)]">
                  {selected.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
