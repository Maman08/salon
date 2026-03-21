"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { Truck, Shield, Headphones, Sparkles, Award, Lock } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Pro Formulated",
    description: "Every product is crafted with professional-grade ingredients and formulations",
    color: "#c9a96e",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Complimentary delivery on all orders above ₹1999",
    color: "#d4a0a0",
  },
  {
    icon: Shield,
    title: "100% Authentic",
    description: "Genuine products with verified quality assurance",
    color: "#89b5c9",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "Safe & encrypted payments with trusted gateways",
    color: "#b89ec9",
  },
  {
    icon: Headphones,
    title: "Expert Advice",
    description: "Get personalized beauty consultation from our professionals",
    color: "#c9a96e",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Hand-picked, professional-grade beauty essentials",
    color: "#d4a0a0",
  },
];

export default function TrustBanner() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-raised)] to-[var(--bg)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Reveal>
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-3">
              Why Choose Us
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl">
              The <span className="text-gradient-gold">Grenix</span> Promise
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.08}>
              <motion.div
                className="group relative p-6 lg:p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] text-center transition-all duration-500"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Icon */}
                <div
                  className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                  style={{ background: `${feature.color}10` }}
                >
                  <feature.icon
                    className="w-5 h-5"
                    style={{ color: feature.color }}
                  />
                </div>

                <h3 className="text-sm font-semibold mb-1.5 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-xs text-[var(--fg-muted)] opacity-50 leading-relaxed">
                  {feature.description}
                </p>

                {/* Glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background: `radial-gradient(circle at center, ${feature.color}08, transparent 70%)`,
                  }}
                />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
