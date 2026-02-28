"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { User, Package, Heart, Settings, LogIn } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { icon: Package, label: "My Orders", description: "Track and manage your orders", href: "#" },
  { icon: Heart, label: "Wishlist", description: "Your saved products", href: "/wishlist" },
  { icon: Settings, label: "Settings", description: "Account preferences", href: "#" },
];

export default function AccountPage() {
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <User className="w-8 h-8 text-gold/40" />
            </motion.div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-2">
              My <span className="text-gradient-gold">Account</span>
            </h1>
            <p className="text-white/40 text-sm">
              Sign in to manage your orders and preferences
            </p>
          </div>
        </Reveal>

        {/* Sign in card */}
        <Reveal delay={0.1}>
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 mb-8">
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/40 transition-colors placeholder:text-white/20"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/40 transition-colors placeholder:text-white/20"
              />
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3.5 bg-gradient-to-r from-gold to-gold-light text-[#0a0a0a] font-semibold text-sm tracking-wider uppercase rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/20 transition-shadow"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </motion.button>
              <p className="text-xs text-center text-white/20">
                Don&apos;t have an account?{" "}
                <span className="text-gold cursor-pointer hover:underline">
                  Create one
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Quick links */}
        <div className="space-y-3">
          {menuItems.map((item, i) => (
            <Reveal key={item.label} delay={0.2 + i * 0.08}>
              <Link href={item.href}>
                <motion.div
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 group"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <item.icon className="w-4 h-4 text-gold/60" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-white/30">{item.description}</p>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
