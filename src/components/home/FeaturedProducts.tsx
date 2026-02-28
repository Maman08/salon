"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Heart, Eye } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { useCart } from "@/components/cart/CartProvider";
import { featuredProducts, Product } from "@/data/products";

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();

  return (
    <Reveal delay={index * 0.1} className="group">
      <div className="product-card relative rounded-2xl overflow-hidden bg-white/[0.02] border border-white/5 hover:border-gold/20">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gold/90 text-[#0a0a0a] text-[10px] font-bold tracking-wider uppercase">
              {product.badge}
            </div>
          )}

          {/* Salon badge */}
          {product.usedInSalon && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] tracking-wider text-white/70">
              ✨ Used in Salon
            </div>
          )}

          {/* Quick actions */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addItem(product)}
              className="flex-1 py-2.5 bg-gold/90 hover:bg-gold text-[#0a0a0a] text-xs font-bold tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Bag
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-colors"
            >
              <Heart className="w-4 h-4" />
            </motion.button>
            <Link href={`/product/${product.id}`}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </motion.div>
            </Link>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[10px] tracking-widest uppercase text-gold/60 mb-1">
            {product.brand}
          </p>
          <Link href={`/product/${product.id}`}>
            <h3 className="text-sm font-medium text-white/80 group-hover:text-white transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-white/30 mt-1 line-clamp-1">
            {product.shortDescription}
          </p>

          {/* Rating & Price */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span className="text-xs text-white/50">{product.rating}</span>
              <span className="text-xs text-white/20">
                ({product.reviews})
              </span>
            </div>
            <div className="flex items-center gap-2">
              {product.originalPrice && (
                <span className="text-xs text-white/20 line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
              <span className="text-sm font-semibold text-gold">
                ₹{product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export default function FeaturedProducts() {
  return (
    <section className="relative py-24 lg:py-32">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/[0.02] rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-3">
              Curated for You
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl">
              Featured{" "}
              <span className="text-gradient-gold">Collection</span>
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mx-auto mt-6" />
          </div>
        </Reveal>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          {featuredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* View all link */}
        <Reveal>
          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm text-gold/70 hover:text-gold tracking-wider uppercase border-b border-gold/20 hover:border-gold/50 pb-1 transition-all duration-300 group"
            >
              View All Products
              <motion.span
                className="inline-block"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
