"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

const categories = [
  {
    name: "Skincare",
    description: "Glow from within",
    video: "/skincareanmiation.mp4",
    image: undefined,
    color: "from-rose/20 to-transparent",
    count: "6 Products",
    href: "/shop?category=skincare",
  },
  {
    name: "Fragrances",
    description: "Scent that defines you",
    image: undefined,
    video: "/fragnance.mp4",
    color: "from-gold/20 to-transparent",
    count: "4 Products",
    href: "/shop?category=fragrances",
  },
];

export default function CategoryShowcase() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background — starts from same --bg so no seam with hero */}
      <div className="absolute inset-0 bg-[var(--bg)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-raised)]/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-rose/60 mb-3">
              Explore
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl">
              Shop by{" "}
              <span className="text-gradient-rose">Category</span>
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-rose/40 to-transparent mx-auto mt-6" />
          </div>
        </Reveal>

        {/* Categories grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-3xl mx-auto">
          {categories.map((category, i) => (
            <Reveal key={category.name} delay={i * 0.1}>
              <Link href={category.href}>
              <motion.div
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer"
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Media — video for skincare, image for others */}
                {category.video ? (
                  <video
                    src={category.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <Image
                    src={category.image!}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/40 to-transparent" />
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] tracking-widest uppercase text-[var(--fg-faint)] mb-1">
                    {category.count}
                  </p>
                  <h3 className="font-[family-name:var(--font-playfair)] text-xl lg:text-2xl mb-1 text-[var(--fg)]">
                    {category.name}
                  </h3>
                  <p className="text-sm text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors duration-300">
                    {category.description}
                  </p>

                  {/* Arrow */}
                  <motion.div
                    className="mt-3 w-8 h-8 rounded-full border border-[var(--border-mid)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="text-sm">→</span>
                  </motion.div>
                </div>

                {/* Corner decoration */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[var(--border-mid)] rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Floating decoration */}
      <motion.div
        style={{ y }}
        className="absolute -right-20 top-1/2 w-40 h-40 rounded-full bg-gold/5 blur-[80px]"
      />
    </section>
  );
}
