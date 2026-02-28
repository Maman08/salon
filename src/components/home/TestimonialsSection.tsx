"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Loyal Client • 3 years",
    avatar: "PS",
    rating: 5,
    text: "The Rose Serum changed my skin completely. I've been getting it from the salon for years, and now I can reorder online! The quality is exactly the same — pure luxury.",
    product: "Luminous Rose Serum",
    color: "#d4a0a0",
  },
  {
    name: "Rahul Mehta",
    role: "First-time Buyer",
    avatar: "RM",
    rating: 5,
    text: "I was skeptical about buying beauty products online, but the 3D previews and detailed descriptions convinced me. The Golden Elixir Hair Oil is absolutely premium.",
    product: "Golden Elixir Hair Oil",
    color: "#c9a96e",
  },
  {
    name: "Ananya Patel",
    role: "Beauty Enthusiast",
    avatar: "AP",
    rating: 5,
    text: "Finally, a beauty brand that feels authentic! You can tell these products are salon-tested. The Midnight Oud is now my signature scent. Get compliments every time.",
    product: "Midnight Oud Perfume",
    color: "#9e6b6b",
  },
  {
    name: "Kavita Reddy",
    role: "Makeup Artist",
    avatar: "KR",
    rating: 5,
    text: "As a professional MUA, I'm very particular about quality. The Diamond Glow Foundation has the most natural finish I've ever worked with. My clients love it!",
    product: "Diamond Glow Foundation",
    color: "#e8c99b",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.03),transparent_60%)]" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.3em] uppercase text-rose/60 mb-3">
              Loved by Many
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl">
              What Our{" "}
              <span className="text-gradient-rose">Clients</span> Say
            </h2>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-rose/40 to-transparent mx-auto mt-6" />
          </div>
        </Reveal>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, i) => (
            <Reveal key={testimonial.name} delay={i * 0.1}>
              <motion.div
                className={`relative p-6 lg:p-8 rounded-2xl border transition-all duration-500 cursor-pointer ${
                  activeIndex === i
                    ? "bg-white/[0.04] border-gold/20 shadow-lg shadow-gold/5"
                    : "bg-white/[0.01] border-white/5 hover:border-white/10"
                }`}
                onMouseEnter={() => setActiveIndex(i)}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Quote icon */}
                <Quote
                  className="absolute top-6 right-6 w-8 h-8 text-white/[0.03]"
                  style={{ color: activeIndex === i ? `${testimonial.color}20` : undefined }}
                />

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-sm lg:text-base text-white/50 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `${testimonial.color}20`,
                        color: testimonial.color,
                      }}
                    >
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-[10px] text-white/30 tracking-wider">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Product tag */}
                  <span className="hidden sm:block text-[10px] tracking-wider uppercase px-3 py-1 rounded-full bg-white/5 text-white/30">
                    {testimonial.product}
                  </span>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
