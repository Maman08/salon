"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import { Sparkles, Heart, Users, Award, MapPin } from "lucide-react";

const timeline = [
  {
    year: "2018",
    title: "The Beginning",
    description: "Opened our first salon with a vision to bring premium beauty experiences to everyone.",
  },
  {
    year: "2020",
    title: "Growing Demand",
    description: "Clients started asking to buy the products we use in our treatments. That planted the seed.",
  },
  {
    year: "2023",
    title: "Our Own Line",
    description: "Launched Grenix Luxe — our own line of salon-grade products formulated with our professionals.",
  },
  {
    year: "2026",
    title: "Going Online",
    description: "Bringing the salon experience to your doorstep. Same products, same quality — now a click away.",
  },
];

const values = [
  {
    icon: Sparkles,
    title: "Salon-Tested Quality",
    description: "Every product passes through our salon before reaching your shelf. If we don't use it, we don't sell it.",
  },
  {
    icon: Heart,
    title: "Passion for Beauty",
    description: "We believe beauty is a ritual, not a routine. Our products are designed to make every moment feel special.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "Our 10,000+ clients are family. Their feedback shapes every product we create and curate.",
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
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&h=900&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-[#0a0a0a]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]" />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity }} className="relative text-center px-4 max-w-3xl">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-gold/60 mb-4">
              Our Story
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-7xl leading-tight mb-6">
              Born from a{" "}
              <span className="text-gradient-gold">Passion</span> for Beauty
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto">
              What started as a small salon in the heart of the city has grown
              into a movement — redefining beauty, one client at a time.
            </p>
          </Reveal>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold/40 to-transparent" />
        </motion.div>
      </section>

      {/* Story */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="left">
              <div className="relative">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=800&h=1000&fit=crop"
                    alt="Our Salon"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 p-6 rounded-2xl glass-gold max-w-[200px]">
                  <p className="text-2xl font-[family-name:var(--font-playfair)] text-gradient-gold">
                    10K+
                  </p>
                  <p className="text-xs text-white/40 mt-1">Happy clients and counting</p>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-6">
                  From Our Salon Chair to{" "}
                  <span className="text-gradient-gold">Your Vanity</span>
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-white/40 leading-relaxed mb-4">
                  Unique Vibe Grenix started as a unisex salon with one simple
                  belief — everyone deserves to feel beautiful. Over the years,
                  our clients fell in love not just with our services, but with
                  the products we used.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-white/40 leading-relaxed mb-4">
                  &quot;Can I buy that serum?&quot; &quot;What shampoo did you use on my
                  hair?&quot; &quot;I need that perfume!&quot; — We heard it every day. And that&apos;s
                  when we knew: it was time to share our best-kept secrets with
                  the world.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <p className="text-white/40 leading-relaxed mb-8">
                  Today, every product on this website has been tested in our
                  salon, loved by our clients, and trusted by our professionals.
                  This isn&apos;t just an online store — it&apos;s an extension of our salon,
                  designed to bring that luxurious experience right to your doorstep.
                </p>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="flex items-center gap-3 text-white/30">
                  <MapPin className="w-4 h-4 text-gold/60" />
                  <span className="text-sm">123 Beauty Lane, Fashion Street, Mumbai</span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-[#0a0a0a] via-[#0c0a08] to-[#0a0a0a]">
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
            {/* Line */}
            <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-gold/20 via-gold/10 to-transparent" />

            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.15}>
                <div className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                  {/* Dot */}
                  <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gold/20 border-2 border-gold/40 z-10">
                    <div className="absolute inset-1 rounded-full bg-gold/60" />
                  </div>

                  {/* Content */}
                  <div className={`ml-16 lg:ml-0 lg:w-1/2 ${i % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                    <span className="text-sm font-[family-name:var(--font-playfair)] text-gold">{item.year}</span>
                    <h3 className="text-lg font-medium mt-1 mb-2">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
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
                  className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 group"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{value.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{value.description}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
