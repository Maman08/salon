"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-[#111111]" />
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* 3D Background */}
      <HeroScene />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a] z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]/50 z-[1]" />

      {/* Decorative glow orbs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-rose/5 rounded-full blur-[120px]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          custom={0}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/8 border border-gold/15 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span className="text-xs tracking-widest uppercase text-gold-light font-medium">
            Professional Salon Products — Now Online
          </span>
        </motion.div>

        {/* Main heading */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-bold leading-[0.9] tracking-tight"
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
            className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9rem] font-bold leading-[0.9] tracking-tight"
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
          className="max-w-xl mx-auto text-white/40 text-base sm:text-lg leading-relaxed mb-12"
        >
          Premium beauty products curated by salon professionals.
          <br className="hidden sm:block" />
          The same luxury we use — now delivered to your door.
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
            <MagneticButton className="group px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-[#0a0a0a] font-semibold text-sm tracking-wider uppercase rounded-full flex items-center gap-2 hover:shadow-xl hover:shadow-gold/20 transition-all duration-500">
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </MagneticButton>
          </Link>
          <Link href="/about">
            <MagneticButton className="group px-8 py-4 border border-white/10 hover:border-gold/30 text-white/50 hover:text-white font-medium text-sm tracking-wider uppercase rounded-full flex items-center gap-2 transition-all duration-300">
              <Sparkles className="w-4 h-4" />
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
          className="mt-20 lg:mt-28 flex items-center justify-center gap-8 sm:gap-16"
        >
          {[
            { number: "50+", label: "Products" },
            { number: "10K+", label: "Happy Clients" },
            { number: "5★", label: "Rated Salon" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-[family-name:var(--font-playfair)] text-gradient-gold font-bold">
                {stat.number}
              </p>
              <p className="text-[10px] text-white/25 tracking-[0.2em] uppercase mt-1">
                {stat.label}
              </p>
              {i < 2 && (
                <div className="hidden sm:block absolute" />
              )}
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
        <span className="text-[10px] tracking-widest uppercase text-white/20">
          Scroll
        </span>
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-gold/30 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
