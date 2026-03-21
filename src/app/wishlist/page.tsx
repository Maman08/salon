"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, X, Loader2 } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { useAuth } from "@/lib/AuthProvider";
import { useCart } from "@/components/cart/CartProvider";
import { fetchWishlist, removeFromWishlist, ApiError } from "@/lib/api";
import { mapListItemToProduct } from "@/lib/products";
import type { Product } from "@/lib/products";

export default function WishlistPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const loadWishlist = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await fetchWishlist();
      const products = data.items
        .filter((i) => i.product !== null)
        .map((i) => mapListItemToProduct(i.product!));
      setItems(products);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleRemove = async (product: Product) => {
    setRemoving(product.id);
    try {
      await removeFromWishlist(product.id);
      setItems((prev) => prev.filter((p) => p.id !== product.id));
    } catch (err) {
      if (err instanceof ApiError) console.error(err.message);
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-24">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose/5 border border-rose/10 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-rose/40" />
            </motion.div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-4">
              Your <span className="text-gradient-rose">Wishlist</span>
            </h1>
            <p className="text-[var(--fg-muted)] max-w-md mx-auto mb-8">
              Sign in to save and view your favourite products.
            </p>
            <Link href="/account">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-gradient-to-r from-rose/20 to-gold/20 border border-rose/20 text-[var(--fg-muted)] font-medium text-sm tracking-wider uppercase rounded-full hover:border-rose/40 transition-all duration-300"
              >
                Sign In
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 lg:pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-24">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose/5 border border-rose/10 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-rose/40" />
            </motion.div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-4">
              Your <span className="text-gradient-rose">Wishlist</span>
            </h1>
            <p className="text-[var(--fg-muted)] max-w-md mx-auto mb-8">
              No saved products yet. Browse our collection and save what you love.
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-gradient-to-r from-rose/20 to-gold/20 border border-rose/20 text-[var(--fg-muted)] font-medium text-sm tracking-wider uppercase rounded-full hover:border-rose/40 transition-all duration-300"
              >
                Explore Products
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Wishlist with items ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-10">
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-2">
              Your <span className="text-gradient-rose">Wishlist</span>
            </h1>
            <p className="text-[var(--fg-muted)] text-sm">
              {items.length} {items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          <AnimatePresence>
            {items.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group relative"
              >
                <div className="rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] transition-all duration-500">
                  {/* Image */}
                  <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-[var(--bg-raised)]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {/* Remove button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.preventDefault(); handleRemove(product); }}
                      disabled={removing === product.id}
                      className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-rose hover:bg-rose hover:text-white transition-colors duration-200"
                    >
                      {removing === product.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <X className="w-3.5 h-3.5" />
                      }
                    </motion.button>
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium bg-gold/90 text-[var(--btn-text)] rounded-full">
                          {product.badge}
                        </span>
                      </div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-[9px] tracking-widest uppercase text-[var(--fg-muted)] opacity-50 mb-0.5">{product.brand}</p>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="text-sm font-medium text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors line-clamp-1 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-semibold text-gold">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-[var(--fg-muted)] opacity-30 line-through ml-1.5">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(product)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/90 hover:bg-gold text-[var(--btn-text)] text-[10px] font-semibold tracking-wider uppercase rounded-full transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        Add
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
