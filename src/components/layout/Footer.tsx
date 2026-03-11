"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/shop" },
    { label: "Skincare", href: "/shop?category=skincare" },
    { label: "Haircare", href: "/shop?category=haircare" },
    { label: "Makeup", href: "/shop?category=makeup" },
    { label: "Fragrance", href: "/shop?category=fragrance" },
  ],
  Company: [
    { label: "Our Story", href: "/about" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Collections", href: "/collections" },
    { label: "Blog", href: "/blog" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping & Returns", href: "/shipping" },
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-[var(--bg-card)] border-t border-[var(--border)]">
      {/* Newsletter section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-24">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl mb-4">
              Join the{" "}
              <span className="text-gradient-gold">Vibe</span>
            </h2>
            <p className="text-[var(--fg-muted)] text-sm mb-8">
              Subscribe for exclusive offers, beauty tips, and early access to
              new products.
            </p>
            <div className="flex max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-[var(--bg-raised)] border border-[var(--border)] rounded-l-xl px-4 py-3 text-sm outline-none focus:border-gold/40 transition-colors placeholder:text-[var(--fg-faint)] text-[var(--fg)]"
              />
              <button className="bg-gradient-to-r from-gold to-gold-light text-[var(--btn-text)] px-6 py-3 rounded-r-xl font-semibold text-sm tracking-wider uppercase hover:shadow-lg hover:shadow-gold/20 transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </Reveal>

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
                <li className="flex items-start gap-2.5 text-sm text-[var(--fg-muted)] opacity-60">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gold/40" />
                  <span>
                    123 Beauty Lane, Fashion Street
                    <br />
                    Mumbai, MH 400001
                  </span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[var(--fg-muted)] opacity-60">
                  <Phone className="w-4 h-4 flex-shrink-0 text-gold/40" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2.5 text-sm text-[var(--fg-muted)] opacity-60">
                  <Mail className="w-4 h-4 flex-shrink-0 text-gold/40" />
                  <span>hello@uniquevibegrenix.com</span>
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
              UNIQUE VIBE GRENIX
            </span>
            <span className="text-[var(--fg-faint)] text-xs">
              © 2026. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#" className="p-2 text-[var(--fg-muted)] opacity-40 hover:opacity-100 hover:text-gold transition-all duration-300">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 text-[var(--fg-muted)] opacity-40 hover:opacity-100 hover:text-gold transition-all duration-300">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 text-[var(--fg-muted)] opacity-40 hover:opacity-100 hover:text-gold transition-all duration-300">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
