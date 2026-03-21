"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/product/ProductCard";
import { Product, mapApiProductToProduct } from "@/lib/products";
import { fetchFeaturedProducts } from "@/lib/api";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts(6)
      .then((data) => setProducts(data.map((p) => mapApiProductToProduct(p))))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-[var(--bg-raised)]" />
                <div className="p-4 space-y-2">
                  <div className="h-2 bg-[var(--bg-raised)] rounded w-16" />
                  <div className="h-3 bg-[var(--bg-raised)] rounded w-full" />
                  <div className="h-2 bg-[var(--bg-raised)] rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

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