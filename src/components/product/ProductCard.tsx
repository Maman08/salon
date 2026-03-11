"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Star, ShoppingBag, Heart, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/components/cart/CartProvider";
import { useState } from "react";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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
      <div className="product-card relative rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] transition-all duration-500">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-[var(--bg-raised)]">
          <Link href={`/product/${product.id}`}>
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
          </Link>

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

          {/* Hover actions */}
          <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-black/80 to-transparent pt-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => addItem(product)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gold/90 hover:bg-gold text-[var(--btn-text)] text-xs font-semibold tracking-wider uppercase rounded-full transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Bag
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className={`p-2.5 rounded-full backdrop-blur-sm transition-colors ${
                isLiked
                  ? "bg-rose/20 text-rose"
                  : "bg-[var(--glass)] text-[var(--fg-muted)] hover:text-rose"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-current" : ""}`} />
            </motion.button>

            <Link href={`/product/${product.id}`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-full bg-[var(--glass)] text-[var(--fg-muted)] hover:text-[var(--fg)] backdrop-blur-sm transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
              </motion.div>
            </Link>
          </div>

        </div>

        {/* Product info */}
        <div className="p-4">
          <p className="text-[10px] tracking-widest uppercase text-[var(--fg-muted)] opacity-50 mb-1">
            {product.brand}
          </p>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-medium text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-300 line-clamp-1 mb-1.5">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
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
            <span className="text-base font-semibold text-gold">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[var(--fg-muted)] opacity-30 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
