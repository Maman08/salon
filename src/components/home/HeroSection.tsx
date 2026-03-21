"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] to-[var(--bg)]" />
  ),
});

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5 + i * 0.15,
      duration: 0.8,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <HeroScene />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/40 via-transparent to-[var(--bg)] z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/60 via-transparent to-[var(--bg)]/60 z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-[10px] sm:text-xs tracking-widest uppercase text-gold-light">
            Premium Beauty, Delivered to You
          </span>
        </motion.div>

        {/* Main heading */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            Redefine Your
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-8">
          <motion.h1
            custom={2}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight"
          >
            <span className="text-gradient-gold">Beauty</span>{" "}
            <span className="text-gradient-rose">Ritual</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="max-w-xl mx-auto text-[var(--fg-muted)] text-base sm:text-lg leading-relaxed mb-10"
        >
          Luxury beauty essentials, expertly curated for your every ritual.
          <br className="hidden sm:block" />
          Professional-grade quality, delivered to your door.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/shop">
            <MagneticButton className="group px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-[var(--btn-text)] font-semibold text-sm tracking-wider uppercase rounded-full flex items-center gap-2 hover:shadow-xl hover:shadow-gold/20 transition-shadow duration-500">
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </Link>
          <Link href="/about">
            <MagneticButton className="group px-8 py-4 border border-[var(--border-mid)] hover:border-[var(--border-mid)] text-[var(--fg-muted)] hover:text-[var(--fg)] font-medium text-sm tracking-wider uppercase rounded-full flex items-center gap-2 transition-all duration-300">
              <Play className="w-4 h-4" />
              Our Story
            </MagneticButton>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          custom={5}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="mt-16 lg:mt-24 flex items-center justify-center gap-6 sm:gap-16"
        >
          {[
            { number: "6+", label: "Products" },
            { number: "100%", label: "Premium Quality" },
            { number: "5★", label: "Expert Rated" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-[family-name:var(--font-playfair)] text-gradient-gold">
                {stat.number}
              </p>
              <p className="text-xs text-[var(--fg-muted)] opacity-40 tracking-wider uppercase mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <span className="text-[10px] tracking-widest uppercase text-[var(--fg-muted)] opacity-30">
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-gold/40 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
