"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "./CartProvider";
import Image from "next/image";
import Link from "next/link";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-[201] w-full max-w-md bg-[var(--bg-card)] border-l border-[var(--border)] flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="font-[family-name:var(--font-playfair)] text-lg">
                  Your Bag
                </h2>
                <span className="text-xs text-[var(--fg-muted)]">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <div className="w-20 h-20 rounded-full bg-[var(--bg-raised)] flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-[var(--fg-faint)]" />
                  </div>
                  <p className="text-[var(--fg-muted)] text-sm">Your bag is empty</p>
                  <Link
                    href="/shop"
                    onClick={onClose}
                    className="text-gold text-sm flex items-center gap-2 hover:gap-3 transition-all duration-300"
                  >
                    Start Shopping <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="flex gap-4 p-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--bg-raised)]">
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">
                            {item.product.name}
                          </h3>
                          <p className="text-xs text-[var(--fg-muted)] mt-0.5">
                            {item.product.brand}
                          </p>
                          <p className="text-sm text-gold mt-1">
                            ₹{item.product.price.toLocaleString()}
                          </p>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                              className="w-6 h-6 rounded-full bg-[var(--glass)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm w-4 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              className="w-6 h-6 rounded-full bg-[var(--glass)] border border-[var(--border)] flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="ml-auto text-xs text-[var(--fg-faint)] hover:text-rose transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[var(--border)] px-6 py-5 space-y-4">
                {/* Free shipping progress */}
                <div className="space-y-2">
                  {totalPrice < 1999 ? (
                    <>
                      <p className="text-xs text-[var(--fg-muted)]">
                        Add ₹{(1999 - totalPrice).toLocaleString()} more for
                        free shipping
                      </p>
                      <div className="h-1 bg-[var(--bg-raised)] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-gold to-rose rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              (totalPrice / 1999) * 100,
                              100
                            )}%`,
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-gold">
                      ✨ You&apos;ve unlocked free shipping!
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[var(--fg-muted)]">Total</span>
                  <span className="text-xl font-[family-name:var(--font-playfair)] text-gold">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>

                <motion.button
                  className="w-full py-3.5 bg-gradient-to-r from-gold to-gold-light text-[var(--btn-text)] font-semibold text-sm tracking-wider uppercase rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-shadow duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Proceed to Checkout
                </motion.button>

                <button
                  onClick={onClose}
                  className="w-full text-center text-xs text-[var(--fg-faint)] hover:text-[var(--fg-muted)] transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
