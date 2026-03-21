"use client";

import Link from "next/link";
import {
  Instagram,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Skincare", href: "/shop?category=skincare" },
    { label: "Fragrance", href: "/shop?category=fragrances" },
  ],
  Company: [
    { label: "Our Story", href: "/about" },
    { label: "Collections", href: "/collections" },
    { label: "Customer Reviews", href: "/#reviews" },
    { label: "Contact Us", href: "/contact" },
  ],
  Support: [
    { label: "Shipping Info", href: "/shipping" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-card)] border-t border-[var(--border)]">
      {/* Newsletter section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {Object.entries(footerLinks).map(([title, links], idx) => (
            <Reveal key={title} delay={idx * 0.1}>
              <div>
                <h3 className="font-[family-name:var(--font-playfair)] text-sm tracking-wider uppercase text-gold/80 mb-4">
                  {title}
                </h3>
                <ul className="space-y-2.5">
                  {links.map((link) => (
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
          ))}

          {/* Contact info */}
          <Reveal delay={0.3}>
            <div>
              <h3 className="font-[family-name:var(--font-playfair)] text-sm tracking-wider uppercase text-gold/80 mb-4">
                Get in Touch
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5 text-sm text-[var(--fg-muted)]">
                  <Mail className="w-4 h-4 flex-shrink-0 text-gold/40" />
                  <a href="mailto:uniquevibegrenix@gmail.com" className="hover:text-gold transition-colors duration-300 break-all">
                    uniquevibegrenix@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[var(--fg-muted)]">
                  <Instagram className="w-4 h-4 flex-shrink-0 text-gold/40" />
                  <a
                    href="https://www.instagram.com/unique_vibe_grenix"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gold transition-colors duration-300"
                  >
                    @unique_vibe_grenix
                  </a>
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-playfair)] text-sm text-gradient-gold">
              GRENIX
            </span>
            <span className="text-[var(--fg-faint)] text-xs">
              © 2026. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/unique_vibe_grenix"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[var(--fg-muted)] opacity-40 hover:opacity-100 hover:text-gold transition-all duration-300"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a href="mailto:uniquevibegrenix@gmail.com" className="p-2 text-[var(--fg-muted)] opacity-40 hover:opacity-100 hover:text-gold transition-all duration-300">
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
