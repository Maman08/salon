"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import Link from "next/link";

const marqueeItems = [
  "SKINCARE",
  "✦",
  "FRAGRANCE",
  "✦",
  "PREMIUM",
  "✦",
  "LUXURY",
  "✦",
  "GRENIX",
  "✦",
  "GLOW",
  "✦",
];

export default function CTASection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-40 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-raised)] to-[var(--bg)]" />

      {/* Marquee band */}
      <motion.div
        style={{ rotate }}
        className="absolute top-8 -left-10 -right-10 overflow-hidden"
      >
        <div className="flex whitespace-nowrap animate-[shimmer_20s_linear_infinite]">
          <div className="flex items-center gap-8 text-gold/[0.06] text-6xl lg:text-8xl font-[family-name:var(--font-playfair)] font-bold">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span key={i} className="inline-block px-4">
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <motion.div style={{ y }}>
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-6">
              Begin Your Journey
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6">
              Your Beauty,{" "}
              <span className="text-gradient-gold">Elevated</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-[var(--fg-muted)] text-base lg:text-lg leading-relaxed max-w-xl mx-auto mb-10 opacity-60">
              Discover luxury beauty essentials crafted with premium ingredients
              and delivered with care. Your glow-up starts here.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-gradient-to-r from-gold to-gold-light text-[var(--btn-text)] font-semibold text-sm tracking-wider uppercase rounded-full hover:shadow-xl hover:shadow-gold/20 transition-shadow duration-500"
                >
                  Shop Now
                </motion.button>
              </Link>

              <Link href="/collections">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 border border-rose/30 hover:border-rose/50 text-rose-light/70 hover:text-rose-light text-sm tracking-wider uppercase rounded-full transition-all duration-300"
                >
                  Explore Collections
                </motion.button>
              </Link>
            </div>
          </Reveal>
        </motion.div>
      </div>

      {/* Bottom decorative orbs */}
      <div className="absolute bottom-0 left-1/4 w-60 h-60 bg-gold/[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-rose/[0.03] rounded-full blur-[100px]" />
    </section>
  );
}
