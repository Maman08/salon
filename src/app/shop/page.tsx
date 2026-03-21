"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { fetchProducts, fetchCategories, ApiCategory } from "@/lib/api";
import { Product, mapListItemToProduct, CategoryMap } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import Reveal from "@/components/ui/Reveal";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 lg:pt-32 flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([
    { id: "all", name: "All Products", icon: "✨" },
  ]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Fetch products & categories from API
  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([
          fetchProducts({ per_page: 100 }),
          fetchCategories(),
        ]);

        // Build a map from category UUID → slug for proper category assignment
        const categoryMap: CategoryMap = {};
        categoryRes.forEach((c: ApiCategory) => {
          categoryMap[c.id] = c.slug;
        });

        setProducts(productRes.items.map((p) => mapListItemToProduct(p, categoryMap)));
        setCategories([
          { id: "all", name: "All Products", icon: "✨" },
          ...categoryRes.map((c: ApiCategory) => ({
            id: c.slug,
            name: c.name,
            icon: c.slug === "fragrances" ? "🌸" : "🧴",
          })),
        ]);
      } catch (err) {
        console.error("Failed to load shop data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by price range
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [products, activeCategory, sortBy, priceRange]);

  return (
    <div className="min-h-screen pt-24 lg:pt-32">
      {/* Hero banner */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.05),transparent_60%)]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-3">
              Curated Collection
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl mb-4">
              The <span className="text-gradient-gold">Shop</span>
            </h1>
            <p className="text-[var(--fg-muted)] max-w-lg mx-auto">
              Premium beauty products, handpicked and tested by
              our experts. Find your perfect beauty ritual.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Category pills */}
        <Reveal>
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "bg-[var(--glass)] text-[var(--fg-muted)] border border-[var(--border)] hover:border-[var(--border-mid)] hover:text-[var(--fg)]"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>{cat.icon}</span>
                <span className="tracking-wider">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </Reveal>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-8 pb-6 border-b border-[var(--border)]">
          <p className="text-sm text-[var(--fg-faint)]">
            Showing{" "}
            <span className="text-[var(--fg-muted)]">{filteredProducts.length}</span>{" "}
            products
          </p>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[var(--glass)] border border-[var(--border)] rounded-lg px-3 sm:px-4 py-2 pr-8 text-xs sm:text-sm text-[var(--fg-muted)] outline-none focus:border-gold/30 transition-colors cursor-pointer flex-1 sm:flex-none"
              >
                {sortOptions.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-[var(--bg-card)]"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-faint)] pointer-events-none" />
            </div>

            {/* Filter button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                showFilters
                  ? "bg-gold/10 text-gold border border-gold/30"
                  : "bg-[var(--glass)] text-[var(--fg-muted)] border border-[var(--border)]"
              }`}
            >
              {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
              Filters
            </motion.button>
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                <div className="grid grid-cols-1 gap-6">
                  {/* Price range */}
                  <div>
                    <label className="text-xs tracking-wider uppercase text-[var(--fg-muted)] mb-3 block">
                      Price Range
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) =>
                          setPriceRange([Number(e.target.value), priceRange[1]])
                        }
                        className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-gold/30"
                        placeholder="Min"
                      />
                      <span className="text-[var(--fg-faint)]">—</span>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([priceRange[0], Number(e.target.value)])
                        }
                        className="w-full bg-[var(--bg-raised)] border border-[var(--border-mid)] rounded-lg px-3 py-2 text-sm text-[var(--fg)] outline-none focus:border-gold/30"
                        placeholder="Max"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-[var(--bg-raised)]" />
                <div className="p-4 space-y-2">
                  <div className="h-2 bg-[var(--bg-raised)] rounded w-16" />
                  <div className="h-3 bg-[var(--bg-raised)] rounded w-full" />
                  <div className="h-3 bg-[var(--bg-raised)] rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + sortBy}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
            >
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Empty state */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-[var(--fg-muted)] text-lg">No products found</p>
            <p className="text-[var(--fg-faint)] text-sm mt-2">
              Try adjusting your filters
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setPriceRange([0, 10000]);
              }}
              className="mt-4 text-gold text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
