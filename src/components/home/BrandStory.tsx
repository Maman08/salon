"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import Link from "next/link";

export default function BrandStory() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(42,154,92,0.07),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(90,171,58,0.05),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — image */}
          <Reveal direction="left">
            <motion.div style={{ scale, opacity }} className="relative overflow-hidden sm:overflow-visible">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-rose/5 to-transparent z-10" />
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=1000&fit=crop"
                  alt="Grenix beauty products"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating stat card */}
              <motion.div
                className="absolute -bottom-6 right-2 sm:-right-6 lg:right-[-2rem] p-4 sm:p-6 rounded-2xl glass-gold max-w-[200px] sm:max-w-[240px]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-2xl sm:text-3xl font-[family-name:var(--font-playfair)] text-gradient-gold mb-1">
                  50+
                </p>
                <p className="text-[10px] sm:text-xs text-[var(--fg-muted)] opacity-60 tracking-wider">
                  Expertly curated beauty products
                </p>
              </motion.div>

              <div className="absolute -top-4 -left-4 w-24 h-24 border border-gold/10 rounded-2xl hidden sm:block" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold/5 rounded-full blur-xl hidden sm:block" />
            </motion.div>
          </Reveal>

          {/* Right — content */}
          <div className="lg:pl-8">
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-4">
                Our Story
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
                Crafted with{" "}
                <span className="text-gradient-gold">Passion</span>,<br />
                Made for{" "}
                <span className="text-gradient-rose">You</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-[var(--fg-muted)] leading-relaxed mb-6 opacity-60">
                Grenix was born from a love of beauty that goes
                beyond the surface. We believe that luxurious, professional-grade
                products shouldn&apos;t be a privilege — they should be part of
                every person&apos;s daily ritual.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-[var(--fg-muted)] leading-relaxed mb-8 opacity-60">
                From our luminous Rose Serum to the transformative Golden Elixir
                Hair Oil — every product is chosen for its results, not just its
                promise. Premium ingredients, honest formulas, and a vibe that
                is entirely your own.
              </p>
            </Reveal>

            {/* Feature pills */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: "🧪", label: "Pro Formulated" },
                { icon: "🌿", label: "Clean Beauty" },
                { icon: "💎", label: "Premium Grade" },
                { icon: "🤝", label: "Expert Curated" },
              ].map((feature, i) => (
                <Reveal key={feature.label} delay={0.4 + i * 0.1}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-raised)] border border-[var(--border)]">
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-xs tracking-wider text-[var(--fg-muted)] opacity-70">
                      {feature.label}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.6}>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 border border-gold/30 hover:border-gold/60 text-gold text-sm tracking-wider uppercase rounded-full hover:bg-gold/5 transition-all duration-300"
                >
                  Discover Our Journey
                </motion.button>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
