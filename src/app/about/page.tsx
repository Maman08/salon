"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import { Sparkles, Heart, Users, Award } from "lucide-react";

const timeline = [
  {
    year: "2018",
    title: "The Vision",
    description: "Unique Vibe Grenix was born from a deep love of beauty and a desire to make premium-grade products accessible to everyone.",
  },
  {
    year: "2020",
    title: "The Formula",
    description: "We partnered with expert cosmetic scientists to develop our signature formulations — clean, effective, and luxurious.",
  },
  {
    year: "2023",
    title: "The Launch",
    description: "Grenix Luxe launched — our own curated line of professional-grade products, built on real results and honest ingredients.",
  },
  {
    year: "2026",
    title: "Going Global",
    description: "Bringing the luxury beauty experience to every doorstep. Premium quality, now a click away.",
  },
];

const values = [
  {
    icon: Sparkles,
    title: "Pro-Grade Quality",
    description: "Every product is formulated with professional-grade ingredients. We set the same standard we expect from the best.",
  },
  {
    icon: Heart,
    title: "Passion for Beauty",
    description: "We believe beauty is a ritual, not a routine. Our products are designed to make every moment feel special.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Our 10,000+ customers are family. Their feedback shapes every product we create and curate.",
  },
  {
    icon: Award,
    title: "Uncompromising Standards",
    description: "Clean ingredients, ethical sourcing, and premium formulations. No shortcuts, ever.",
  },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1600&h=900&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-[var(--bg)]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)]/40 via-transparent to-[var(--bg)]" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative text-center px-4 max-w-3xl">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-4">Our Story</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-7xl leading-tight mb-6">
              Born from a{" "}
              <span className="text-gradient-gold">Passion</span> for Beauty
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-[var(--fg-muted)] text-lg leading-relaxed max-w-xl mx-auto opacity-60">
              A brand built on expertise, honesty, and the belief that
              everyone deserves luxury beauty — without compromise.
            </p>
          </Reveal>
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold/40 to-transparent" />
        </motion.div>
      </section>

      {/* Brand Story */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&h=1000&fit=crop"
                    alt="Unique Vibe Grenix beauty"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 p-6 rounded-2xl glass-gold max-w-[200px]">
                  <p className="text-2xl font-[family-name:var(--font-playfair)] text-gradient-gold">
                    10K+
                  </p>
                  <p className="text-xs text-[var(--fg-muted)] opacity-60 mt-1">
                    Happy customers and counting
                  </p>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-6">
                  Crafted for Your{" "}
                  <span className="text-gradient-gold">Daily Ritual</span>
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-[var(--fg-muted)] leading-relaxed mb-4 opacity-60">
                  Unique Vibe Grenix was created with a single belief — that
                  professional-grade beauty should be within everyone&apos;s reach.
                  We curate only what truly works, formulated by experts and
                  tested by real people.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-[var(--fg-muted)] leading-relaxed mb-4 opacity-60">
                  Every product in our collection tells a story — of careful
                  ingredient sourcing, meticulous formulation, and an
                  unwavering commitment to results that you can see and feel.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <p className="text-[var(--fg-muted)] leading-relaxed mb-8 opacity-60">
                  This isn&apos;t just an online store. It&apos;s a curated sanctuary
                  for people who take their beauty seriously — and deserve
                  nothing but the best.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-32" style={{ background: "var(--bg-raised)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-3">Our Journey</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl">
                The <span className="text-gradient-gold">Timeline</span>
              </h2>
            </div>
          </Reveal>

          <div className="relative">
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-gold/20 via-gold/10 to-transparent" />

            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.15}>
                <div className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                  <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold/20 border-2 border-gold/40 z-10">
                    <div className="absolute inset-1 rounded-full bg-gold/60" />
                  </div>
                  <div className={`ml-16 lg:ml-0 lg:w-1/2 ${i % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                    <span className="text-sm font-[family-name:var(--font-playfair)] text-gold">{item.year}</span>
                    <h3 className="text-lg font-medium mt-1 mb-2 text-[var(--fg)]">{item.title}</h3>
                    <p className="text-sm text-[var(--fg-muted)] opacity-60 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.3em] uppercase text-rose/60 mb-3">What We Believe</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl">
                Our <span className="text-gradient-rose">Values</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.1}>
                <motion.div
                  className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-mid)] transition-all duration-500 group"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-[var(--fg)]">{value.title}</h3>
                  <p className="text-sm text-[var(--fg-muted)] opacity-60 leading-relaxed">{value.description}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
