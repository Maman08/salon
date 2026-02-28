"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/ui/Reveal";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="min-h-screen pt-24 lg:pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center py-24">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose/5 border border-rose/10 flex items-center justify-center"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Heart className="w-8 h-8 text-rose/40" />
            </motion.div>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-4">
              Your <span className="text-gradient-rose">Wishlist</span>
            </h1>
            <p className="text-white/40 max-w-md mx-auto mb-8">
              Save your favorite products here. Start browsing our collection to
              add items you love.
            </p>
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3.5 bg-gradient-to-r from-rose/20 to-gold/20 border border-rose/20 text-white/70 font-medium text-sm tracking-wider uppercase rounded-full hover:border-rose/40 transition-all duration-300"
              >
                Explore Products
              </motion.button>
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
