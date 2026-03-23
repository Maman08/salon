"use client";

import Link from "next/link";
import { Instagram, Mail, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const shopLinks = [
  { label: "All Products", href: "/shop" },
  { label: "Skincare", href: "/shop?category=skincare" },
  { label: "Fragrance", href: "/shop?category=fragrances" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-card)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Links grid — 3 cols: brand, shop, contact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">

          {/* Brand blurb */}
          <Reveal delay={0}>
            <div>
              {/* Logo + name lockup */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/logo-final.png"
                  alt="Unique Vibe Grenix logo"
                  className="h-12 w-auto object-contain"
                />
                <div className="flex flex-col leading-none">
                  <span className="font-[family-name:var(--font-playfair)] text-[9px] tracking-[0.25em] uppercase text-[var(--fg-faint)]">Unique Vibe</span>
                  <span
                    className="font-[family-name:var(--font-playfair)] text-xl font-bold tracking-wide text-gradient-gold leading-tight"
                    style={{ textShadow: "0 0 20px rgba(201,169,110,0.6), 0 0 40px rgba(201,169,110,0.3)" }}
                  >
                    Grenix
                  </span>
                </div>
              </div>
              <p className="text-sm text-[var(--fg-faint)] leading-relaxed max-w-xs">
                Luxury beauty essentials crafted with premium ingredients, delivered with care.
              </p>
            </div>
          </Reveal>

          {/* Shop links */}
          <Reveal delay={0.1}>
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] text-sm tracking-wider uppercase text-gold/80 mb-4">
                Shop
              </h3>
              <ul className="space-y-2.5">
                {shopLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Contact */}
          <Reveal delay={0.2}>
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] text-sm tracking-wider uppercase text-gold/80 mb-4">
                Get in Touch
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-[var(--fg-muted)]">
                  <Mail className="w-4 h-4 flex-shrink-0 text-gold/40" />
                  <a
                    href="mailto:uniquevibegrenix@gmail.com"
                    className="hover:text-gold transition-colors duration-300 break-all"
                  >
                    uniquevibegrenix@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[var(--fg-muted)]">
                  <Instagram className="w-4 h-4 flex-shrink-0 text-gold/40" />
                  <a
                    href="https://www.instagram.com/uniquevibegrenix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors duration-300"
                  >
                    @uniquevibegrenix
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[var(--fg-faint)] text-xs">
            © 2026 Unique Vibe Grenix. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/uniquevibegrenix"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[var(--fg-muted)] opacity-40 hover:opacity-100 hover:text-gold transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="mailto:uniquevibegrenix@gmail.com"
              className="p-2 text-[var(--fg-muted)] opacity-40 hover:opacity-100 hover:text-gold transition-all duration-300"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
