"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Heart,
  User,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import ThemeToggle from "@/components/ui/ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/lookbook", label: "Lookbook" },
  { href: "/about", label: "Our Story" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, isOpen, setIsOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
      >
        {/* Top announcement bar */}
        <AnimatePresence>
          {!scrolled && (
            <motion.div
              className="bg-gradient-to-r from-gold/10 via-rose/10 to-gold/10 border-b border-gold/10"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-center gap-2 text-xs tracking-widest uppercase">
                <Sparkles className="w-3 h-3 text-gold" />
                <span className="text-gold-light">
                  Free shipping on orders above ₹1999
                </span>
                <Sparkles className="w-3 h-3 text-gold" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -ml-2 text-[var(--fg-muted)] hover:text-[var(--fg)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Nav links - desktop left */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm tracking-wider uppercase text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-gold to-rose group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Logo - center */}
            <Link href="/" className="flex flex-col items-center group">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h1 className="font-[family-name:var(--font-playfair)] text-lg sm:text-xl lg:text-2xl font-bold tracking-wider">
                  <span className="text-gradient-gold">UNIQUE VIBE</span>
                </h1>
                <p className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-center text-[var(--fg-faint)] -mt-0.5">
                  Grenix
                </p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
              </motion.div>
            </Link>

            {/* Nav links - desktop right */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.slice(3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm tracking-wider uppercase text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-300 group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-gold to-rose group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Action icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-[var(--fg-muted)] hover:text-gold transition-colors duration-300"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <Link
                href="/wishlist"
                className="hidden sm:block p-2 text-[var(--fg-muted)] hover:text-rose transition-colors duration-300"
              >
                <Heart className="w-[18px] h-[18px]" />
              </Link>

              <Link
                href="/account"
                className="hidden sm:block p-2 text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors duration-300"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>

              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-[var(--fg-muted)] hover:text-gold transition-colors duration-300"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-[var(--btn-text)] text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[200] bg-[var(--bg)]/95 backdrop-blur-xl flex items-start justify-center pt-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="w-full max-w-2xl px-6"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 text-gold/60" />
                <input
                  type="text"
                  placeholder="Search products, categories..."
                  className="w-full bg-transparent border-b-2 border-gold/20 focus:border-gold/60 outline-none py-4 pl-10 pr-4 text-2xl font-light text-[var(--fg)] placeholder:text-[var(--fg-faint)] transition-colors duration-300"
                  autoFocus
                />
              </div>
              <p className="text-[var(--fg-faint)] text-sm mt-4">
                Try: &quot;Rose Serum&quot;, &quot;Hair Oil&quot;, &quot;Lipstick&quot;
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[150] bg-[var(--bg)]/98 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className="text-2xl font-[family-name:var(--font-playfair)] tracking-wider text-[var(--fg-muted)] hover:text-gold transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 w-16 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"
              />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 mt-4"
              >
                <ThemeToggle />
                <Link
                  href="/wishlist"
                  className="text-[var(--fg-faint)] hover:text-rose transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link
                  href="/account"
                  className="text-[var(--fg-faint)] hover:text-[var(--fg)] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
