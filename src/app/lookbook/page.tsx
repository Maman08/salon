"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { X, ShoppingBag, Eye } from "lucide-react";

const looks = [
  {
    id: 1,
    title: "Golden Hour Glow",
    description: "A luminous, radiant look built around our signature gold-infused skincare",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop",
    category: "Bridal",
    products: ["Luminous Rose Serum", "Diamond Glow Foundation", "Golden Elixir Hair Oil"],
    productIds: ["1", "6", "2"],
  },
  {
    id: 2,
    title: "Midnight Glam",
    description: "Bold evening beauty with deep tones and dramatic, confident highlights",
    image: "https://images.unsplash.com/photo-1526045478516-99145907023c?w=600&h=800&fit=crop",
    category: "Evening",
    products: ["Velvet Matte Lipstick", "Midnight Oud Perfume"],
    productIds: ["3", "4"],
  },
  {
    id: 3,
    title: "Natural Radiance",
    description: "Effortless everyday glow with a minimal, skin-first approach",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=800&fit=crop",
    category: "Everyday",
    products: ["Vitamin C Brightening Cream", "Collagen Boost Eye Cream"],
    productIds: ["9", "12"],
  },
  {
    id: 4,
    title: "Silk & Shine",
    description: "Glossy, healthy-hair transformation powered by our premium oil treatment",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=800&fit=crop",
    category: "Haircare",
    products: ["Golden Elixir Hair Oil", "Keratin Silk Shampoo"],
    productIds: ["2", "5"],
  },
  {
    id: 5,
    title: "Rose Petal Ritual",
    description: "Our signature skincare ritual that leaves skin dewy, plump, and luminous",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=800&fit=crop",
    category: "Skincare",
    products: ["Luminous Rose Serum", "Retinol Night Repair Mask"],
    productIds: ["1", "11"],
  },
  {
    id: 6,
    title: "Date Night Ready",
    description: "Soft romantic beauty with warm tones and a hint of mystery",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=800&fit=crop",
    category: "Evening",
    products: ["Orchid Bloom Eau de Parfum", "Velvet Matte Lipstick", "Diamond Glow Foundation"],
    productIds: ["10", "3", "6"],
  },
];

const filterCategories = ["All", "Bridal", "Evening", "Everyday", "Haircare", "Skincare"];

export default function LookbookPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedLook, setSelectedLook] = useState<typeof looks[0] | null>(null);

  const filtered =
    activeFilter === "All" ? looks : looks.filter((l) => l.category === activeFilter);

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 lg:pt-32 pb-24">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,169,110,0.05),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-3">
              Inspiration Gallery
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl mb-4">
              The <span className="text-gradient-gold">Lookbook</span>
            </h1>
            <p className="text-[var(--fg-muted)] max-w-lg mx-auto opacity-60">
              Explore curated beauty looks and shop the exact products that bring
              each one to life.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters */}
        <Reveal>
          <div className="flex items-center gap-2 justify-center mb-12 flex-wrap">
            {filterCategories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm tracking-wider transition-all duration-300 ${
                  activeFilter === cat
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : "bg-[var(--bg-card)] text-[var(--fg-muted)] border border-[var(--border)] hover:border-[var(--border-mid)]"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
          >
            {filtered.map((look, i) => (
              <Reveal key={look.id} delay={i * 0.08}>
                <motion.div
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => setSelectedLook(look)}
                >
                  <div className={`relative ${i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"}`}>
                    <Image
                      src={look.image}
                      alt={look.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity duration-500" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                    <span className="inline-block px-2.5 py-0.5 text-[9px] tracking-widest uppercase bg-gold/10 text-gold/70 border border-gold/20 rounded-full mb-3">
                      {look.category}
                    </span>
                    <h3 className="font-[family-name:var(--font-playfair)] text-lg lg:text-xl mb-1 text-white/90">
                      {look.title}
                    </h3>
                    <p className="text-xs text-white/50 mb-3 line-clamp-2">{look.description}</p>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <ShoppingBag className="w-3 h-3 text-gold/60" />
                      <span className="text-[10px] text-white/50 tracking-wider">
                        {look.products.length} products featured
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Look Detail Modal */}
      <AnimatePresence>
        {selectedLook && (
          <motion.div
            className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLook(null)}
          >
            <motion.div
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-card)] border border-[var(--border)]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedLook(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[var(--bg-raised)] border border-[var(--border)] flex items-center justify-center hover:border-gold/30 transition-colors"
              >
                <X className="w-5 h-5 text-[var(--fg-muted)]" />
              </button>

              <div className="relative aspect-video">
                <Image
                  src={selectedLook.image}
                  alt={selectedLook.title}
                  fill
                  className="object-cover rounded-t-3xl"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-transparent to-transparent" />
              </div>

              <div className="p-6 lg:p-8 -mt-12 relative">
                <span className="inline-block px-3 py-1 text-xs tracking-widest uppercase bg-gold/10 text-gold border border-gold/20 rounded-full mb-3">
                  {selectedLook.category}
                </span>
                <h2 className="font-[family-name:var(--font-playfair)] text-2xl lg:text-3xl mb-3 text-[var(--fg)]">
                  {selectedLook.title}
                </h2>
                <p className="text-[var(--fg-muted)] mb-8 opacity-60">{selectedLook.description}</p>

                <h3 className="text-sm tracking-wider uppercase text-[var(--fg-muted)] opacity-40 mb-4">
                  Products Featured in This Look
                </h3>
                <div className="space-y-3">
                  {selectedLook.products.map((productName, i) => (
                    <Link
                      key={i}
                      href={`/product/${selectedLook.productIds[i]}`}
                      onClick={() => setSelectedLook(null)}
                    >
                      <motion.div
                        className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)] hover:border-gold/20 transition-all duration-300 group"
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-sm font-semibold">
                            {i + 1}
                          </div>
                          <span className="text-sm text-[var(--fg)]">{productName}</span>
                        </div>
                        <Eye className="w-4 h-4 text-[var(--fg-faint)] group-hover:text-gold transition-colors" />
                      </motion.div>
                    </Link>
                  ))}
                </div>

                <Link href="/shop" onClick={() => setSelectedLook(null)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 py-3.5 bg-gradient-to-r from-gold to-gold-light text-[var(--btn-text)] font-semibold text-sm tracking-wider uppercase rounded-xl hover:shadow-lg hover:shadow-gold/20 transition-shadow"
                  >
                    Shop This Look
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
