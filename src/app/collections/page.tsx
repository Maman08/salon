"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: "glow-ritual",
    name: "The Glow Ritual",
    description: "A complete skincare routine for luminous, radiant skin. Curated from our most-loved rituals.",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&h=600&fit=crop",
    products: 5,
    color: "#d4a0a0",
    gradient: "from-rose/30 via-rose/10 to-transparent",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    description: "Luxurious gold-infused beauty essentials that add warmth and radiance to every look.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=600&fit=crop",
    products: 4,
    color: "#c9a96e",
    gradient: "from-gold/30 via-gold/10 to-transparent",
  },
  {
    id: "midnight-noir",
    name: "Midnight Noir",
    description: "Dark, mysterious, unforgettable. Our signature evening collection for bold statements.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop",
    products: 3,
    color: "#9e6b6b",
    gradient: "from-[#2a1a3e]/40 via-[#2a1a3e]/10 to-transparent",
  },
  {
    id: "daily-essentials",
    name: "Daily Essentials",
    description: "The everyday products our experts swear by. Professional-grade quality, now for your home.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop",
    products: 6,
    color: "#c9a96e",
    gradient: "from-gold/20 via-gold/5 to-transparent",
  },
];

export default function CollectionsPage() {
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,160,160,0.05),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-rose/60 mb-3">
              Thoughtfully Curated
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl mb-4">
              Our <span className="text-gradient-rose">Collections</span>
            </h1>
            <p className="text-[var(--fg-muted)] max-w-lg mx-auto">
              Discover beauty sets curated around themes, rituals, and
              experiences. Each collection tells a story.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Collections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {collections.map((collection, i) => (
            <Reveal key={collection.id} delay={i * 0.1}>
              <motion.div
                className="group relative rounded-3xl overflow-hidden cursor-pointer"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative aspect-[4/3] sm:aspect-[3/1] lg:aspect-[4/1]">
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/90 via-[var(--bg)]/60 to-transparent" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500`} />
                </div>

                <div className="absolute inset-0 flex items-center px-8 sm:px-12 lg:px-16">
                  <div className="max-w-lg">
                    <p className="text-[10px] tracking-widest uppercase text-[var(--fg-faint)] mb-2">
                      {collection.products} Products
                    </p>
                    <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl mb-3 text-[var(--fg)]">
                      {collection.name}
                    </h2>
                    <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-6 max-w-md hidden sm:block">
                      {collection.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gold group-hover:gap-3 transition-all duration-300">
                      <span className="tracking-wider uppercase">Explore Collection</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Border glow on hover */}
                <div
                  className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-opacity-100 transition-all duration-500"
                  style={{ borderColor: `${collection.color}20` }}
                />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
