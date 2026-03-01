"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";

export default function SalonStory() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-40 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,169,110,0.04),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,160,160,0.04),transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Image composition */}
          <Reveal direction="left">
            <motion.div style={{ scale, opacity }} className="relative">
              {/* Main image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-rose/5 to-transparent z-10" />
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=1000&fit=crop"
                  alt="Unique Vibe Grenix Salon"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating card */}
              <motion.div
                className="absolute -bottom-6 -right-6 lg:right-[-2rem] p-6 rounded-2xl glass-gold max-w-[240px]"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-3xl font-[family-name:var(--font-playfair)] text-gradient-gold mb-1">
                  8+
                </p>
                <p className="text-xs text-white/50 tracking-wider">
                  Years of crafting beauty experiences
                </p>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 border border-gold/10 rounded-2xl" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gold/5 rounded-full blur-xl" />
            </motion.div>
          </Reveal>

          {/* Right — Content */}
          <div className="lg:pl-8">
            <Reveal>
              <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-4">
                Our Story
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">
                Born in the{" "}
                <span className="text-gradient-gold">Salon</span>,<br />
                Made for{" "}
                <span className="text-gradient-rose">You</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-white/40 leading-relaxed mb-6">
                Every product in our collection has been tested, trusted, and
                loved in our salon. We don&apos;t just sell beauty products — we
                share the exact formulas our professionals use every day on
                hundreds of happy clients.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-white/40 leading-relaxed mb-8">
                From the luxurious Rose Serum that gives our facials their
                signature glow, to the Golden Elixir that transforms hair in our
                premium treatments — now you can bring the salon experience
                home.
              </p>
            </Reveal>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: "🧪", label: "Salon Tested" },
                { icon: "🌿", label: "Clean Beauty" },
                { icon: "💎", label: "Premium Grade" },
                { icon: "🤝", label: "Expert Curated" },
              ].map((feature, i) => (
                <Reveal key={feature.label} delay={0.4 + i * 0.1}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-xs tracking-wider text-white/50">
                      {feature.label}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.6}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 border border-gold/30 hover:border-gold/60 text-gold text-sm tracking-wider uppercase rounded-full hover:bg-gold/5 transition-all duration-300"
              >
                Discover Our Journey
              </motion.button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
