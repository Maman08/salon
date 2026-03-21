"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Star, ShoppingBag, Heart, Eye } from "lucide-react";
import { Product } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";
import { useState } from "react";
import Link from "next/link";
import { addToWishlist, removeFromWishlist, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthProvider";
import { Loader2 } from "lucide-react";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast("Sign in to save items");
      return;
    }
    if (wishlistLoading) return;
    setWishlistLoading(true);
    try {
      if (isLiked) {
        await removeFromWishlist(product.id);
        setIsLiked(false);
        showToast("Removed from wishlist");
      } else {
        await addToWishlist(product.id);
        setIsLiked(true);
        showToast("Added to wishlist ♥");
      }
    } catch (err: unknown) {
      // 409 = already in wishlist — treat as success
      if (err instanceof ApiError && err.status === 409) {
        setIsLiked(true);
        showToast("Already in wishlist ♥");
      } else {
        showToast("Something went wrong");
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.4, 0.25, 1] as const,
      }}
    >
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-black/80 text-white text-[10px] tracking-wide whitespace-nowrap backdrop-blur-sm pointer-events-none"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
      <Link href={`/product/${product.slug}`} className="block">
      <div className="product-card relative rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] transition-all duration-500">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-[var(--bg-raised)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImageLoaded(true)}
            />

          {/* Subtle color glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${product.color || "#c9a96e"}, transparent 70%)`,
            }}
          />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className="px-2.5 py-1 text-[10px] tracking-wider uppercase font-medium bg-gold/90 text-[var(--btn-text)] rounded-full backdrop-blur-sm">
                {product.badge}
              </span>
            </div>
          )}

          {/* Discount badge */}
          {discount > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="px-2 py-1 text-[10px] font-semibold bg-rose/90 text-white rounded-full">
                -{discount}%
              </span>
            </div>
          )}

          {/* Hover actions — desktop only */}
          <div className="hidden sm:flex absolute inset-x-0 bottom-0 p-3 items-center justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/80 to-transparent pt-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-gold/90 hover:bg-gold text-[var(--btn-text)] text-xs font-semibold tracking-wider uppercase rounded-full transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Bag
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`p-2.5 rounded-full backdrop-blur-sm transition-colors ${
                isLiked
                  ? "bg-rose/20 text-rose"
                  : "bg-[var(--glass)] text-[var(--fg-muted)] hover:text-rose"
              }`}
            >
              {wishlistLoading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
              }
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-full bg-[var(--glass)] text-[var(--fg-muted)] hover:text-[var(--fg)] backdrop-blur-sm transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
            </motion.div>
          </div>

          {/* Mobile action buttons — always visible */}
          <div className="sm:hidden absolute top-2 right-2 z-10 flex flex-col gap-1.5">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                isLiked
                  ? "bg-rose/20 text-rose"
                  : "bg-black/40 text-white/80"
              }`}
            >
              {wishlistLoading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
              }
            </motion.button>
          </div>

        </div>

        {/* Product info */}
        <div className="p-3 sm:p-4">
          <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-[var(--fg-muted)] opacity-50 mb-0.5 sm:mb-1">
            {product.brand}
          </p>
            <h3 className="text-xs sm:text-sm font-medium text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-300 line-clamp-1 mb-1 sm:mb-1.5">
              {product.name}
            </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-2.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 sm:w-3 h-2.5 sm:h-3 ${
                    i < Math.floor(product.rating)
                      ? "text-gold fill-gold"
                      : "text-[var(--fg-faint)]"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-[var(--fg-muted)] opacity-40">
              ({product.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-semibold text-gold">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-[var(--fg-muted)] opacity-30 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile Add to Bag */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addItem(product); }}
            className="sm:hidden mt-2.5 w-full py-2 bg-gold/90 active:bg-gold text-[var(--btn-text)] text-[11px] font-semibold tracking-wider uppercase rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3 h-3" />
            Add to Bag
          </button>
        </div>
      </div>
      </Link>
    </motion.div>
  );
}
