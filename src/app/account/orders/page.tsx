"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  X,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import {
  fetchOrders,
  fetchOrder,
  cancelOrder,
  ApiOrderListItem,
  ApiOrder,
} from "@/lib/api";
import Reveal from "@/components/ui/Reveal";

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "text-yellow-400", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-400", icon: CheckCircle2 },
  processing: { label: "Processing", color: "text-blue-400", icon: Package },
  shipped: { label: "Shipped", color: "text-purple-400", icon: Truck },
  delivered: { label: "Delivered", color: "text-emerald-400", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-rose-400", icon: XCircle },
};

const paymentStatusColors: Record<string, string> = {
  pending: "text-yellow-400",
  paid: "text-emerald-400",
  failed: "text-rose-400",
  refunded: "text-orange-400",
};

export default function OrdersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<ApiOrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchOrders({ page, per_page: 10 });
      setOrders(res.items);
      setTotalPages(res.total_pages);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/account");
      return;
    }
    if (isAuthenticated) loadOrders();
  }, [isAuthenticated, authLoading, loadOrders, router]);

  const handleViewDetail = async (orderId: string) => {
    setDetailLoading(true);
    try {
      const detail = await fetchOrder(orderId);
      setSelectedOrder(detail);
    } catch {
      // handle error
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCancel = async (orderId: string) => {
    setCancelling(orderId);
    try {
      await cancelOrder(orderId);
      setSelectedOrder(null);
      await loadOrders();
    } catch {
      // handle error
    } finally {
      setCancelling(null);
    }
  };

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 py-8 border-b border-[var(--border)] mb-8">
          <button
            onClick={() => router.push("/account")}
            className="p-2 rounded-full hover:bg-[var(--glass)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-2xl lg:text-3xl">
              My <span className="text-gradient-gold">Orders</span>
            </h1>
            <p className="text-xs text-[var(--fg-muted)] mt-1">Track and manage your orders</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-gold animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          /* Empty state */
          <Reveal>
            <div className="text-center py-20">
              <ShoppingBag className="w-12 h-12 text-[var(--fg-faint)] mx-auto mb-4" />
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl mb-2">No orders yet</h2>
              <p className="text-[var(--fg-muted)] text-sm mb-6">
                Start shopping to see your orders here.
              </p>
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 bg-gold/90 hover:bg-gold text-[var(--btn-text)] text-sm font-semibold tracking-wider uppercase rounded-xl transition-colors"
                >
                  Shop Now
                </motion.button>
              </Link>
            </div>
          </Reveal>
        ) : (
          /* Orders list */
          <div className="space-y-4">
            {orders.map((order, i) => {
              const sc = statusConfig[order.status] || statusConfig.pending;
              const StatusIcon = sc.icon;
              return (
                <Reveal key={order.id} delay={i * 0.05}>
                  <motion.div
                    className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] transition-all"
                    whileHover={{ y: -1 }}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-gold">#{order.order_number}</span>
                          <span className={`text-xs font-medium flex items-center gap-1 ${sc.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {sc.label}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--fg-muted)]">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm font-medium">₹{order.total.toLocaleString()}</span>
                          <span className="text-xs text-[var(--fg-faint)]">
                            {order.items_count} {order.items_count === 1 ? "item" : "items"}
                          </span>
                          <span className={`text-xs capitalize ${paymentStatusColors[order.payment_status] || "text-[var(--fg-muted)]"}`}>
                            {order.payment_status}
                          </span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleViewDetail(order.id)}
                        className="px-4 py-2 text-xs font-medium tracking-wider uppercase bg-[var(--glass)] border border-[var(--border)] rounded-lg hover:border-gold/30 text-[var(--fg-muted)] hover:text-gold transition-all flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </motion.button>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                      page === i + 1
                        ? "bg-gold text-[var(--btn-text)]"
                        : "bg-[var(--glass)] border border-[var(--border)] text-[var(--fg-muted)] hover:border-gold/30"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Order Detail Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {(selectedOrder || detailLoading) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !detailLoading && setSelectedOrder(null)}
            />

            {/* Panel */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-6"
            >
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-gold animate-spin" />
                </div>
              ) : selectedOrder ? (
                <>
                  {/* Close */}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[var(--glass)] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Header */}
                  <div className="mb-5">
                    <h2 className="font-[family-name:var(--font-playfair)] text-xl mb-1">
                      Order <span className="text-gold">#{selectedOrder.order_number}</span>
                    </h2>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {new Date(selectedOrder.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Status badges */}
                  <div className="flex gap-2 mb-5 flex-wrap">
                    {(() => {
                      const sc = statusConfig[selectedOrder.status] || statusConfig.pending;
                      const StatusIcon = sc.icon;
                      return (
                        <span className={`text-xs font-medium flex items-center gap-1 px-3 py-1.5 rounded-full border border-current/20 ${sc.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {sc.label}
                        </span>
                      );
                    })()}
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full border border-current/20 capitalize ${paymentStatusColors[selectedOrder.payment_status] || "text-[var(--fg-muted)]"}`}>
                      Payment: {selectedOrder.payment_status}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-5">
                    <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--fg-muted)]">Items</h3>
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--bg-raised)] flex-shrink-0">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-[var(--fg-faint)]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{item.product_name}</p>
                          <p className="text-xs text-[var(--fg-muted)]">
                            ₹{item.unit_price.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-gold flex-shrink-0">
                          ₹{item.total_price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping address */}
                  <div className="mb-5 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                    <h3 className="text-xs font-semibold tracking-wider uppercase text-[var(--fg-muted)] mb-2">Shipping Address</h3>
                    <p className="text-sm">{selectedOrder.shipping_address.full_name}</p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {selectedOrder.shipping_address.address_line1}
                      {selectedOrder.shipping_address.address_line2 && `, ${selectedOrder.shipping_address.address_line2}`}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)]">
                      {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} — {selectedOrder.shipping_address.pincode}
                    </p>
                    <p className="text-xs text-[var(--fg-muted)]">{selectedOrder.shipping_address.phone}</p>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-[var(--border)] pt-4 space-y-1.5 mb-5">
                    <div className="flex justify-between text-sm text-[var(--fg-muted)]">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-[var(--fg-muted)]">
                      <span>Shipping</span>
                      <span className={selectedOrder.shipping_fee === 0 ? "text-gold" : ""}>
                        {selectedOrder.shipping_fee === 0 ? "FREE" : `₹${selectedOrder.shipping_fee}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold pt-2 border-t border-[var(--border)]">
                      <span>Total</span>
                      <span className="text-gold">₹{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Cancel button for pending orders */}
                  {selectedOrder.status === "pending" && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCancel(selectedOrder.id)}
                      disabled={cancelling === selectedOrder.id}
                      className="w-full py-3 bg-rose/10 border border-rose/20 text-rose font-medium text-sm tracking-wider uppercase rounded-xl hover:bg-rose/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {cancelling === selectedOrder.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Cancel Order
                        </>
                      )}
                    </motion.button>
                  )}
                </>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
