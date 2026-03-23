"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Menu, X, Heart, User, Sparkles, Sun, Moon } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import CartDrawer from "@/components/cart/CartDrawer";
import { useTheme } from "@/lib/ThemeProvider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "Our Story" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, isOpen, setIsOpen } = useCart();
  const { theme, toggleTheme } = useTheme();

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
            <button
              className="lg:hidden p-2 -ml-2 text-[var(--fg-muted)] hover:text-[var(--fg)]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.slice(0, 2).map((link) => (
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

            <Link href="/" className="flex items-center gap-1 group">
              <motion.div
                className="relative flex items-center gap-1"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Logo */}
                <img
                  src="/logo-final.png"
                  alt="Unique Vibe Grenix logo"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
                {/* Company name */}
                <div className="flex flex-col leading-none gap-0.5">
                  <span className="font-[family-name:var(--font-playfair)] text-[11px] tracking-[0.3em] uppercase text-[var(--fg-muted)]">
                    Unique Vibe
                  </span>
                  <span
                    className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold tracking-wider text-gradient-gold leading-none"
                    style={{
                      textShadow:
                        "0 0 10px rgba(201,169,110,0.9), 0 0 25px rgba(201,169,110,0.6), 0 0 50px rgba(201,169,110,0.35)",
                    }}
                  >
                    Grenix
                  </span>
                </div>
              </motion.div>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.slice(2).map((link) => (
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

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="relative p-2 text-[var(--fg-muted)] hover:text-gold transition-colors duration-300"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {theme === "light" ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0, scale: 0 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: 90, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Moon className="w-[18px] h-[18px]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0, scale: 0 }}
                      animate={{ rotate: 0, opacity: 1, scale: 1 }}
                      exit={{ rotate: -90, opacity: 0, scale: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <Sun className="w-[18px] h-[18px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[150] bg-[var(--bg)]/98 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
          >
            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-2 text-[var(--fg-muted)] hover:text-[var(--fg)] z-10"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

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
                <button
                  onClick={toggleTheme}
                  className="text-[var(--fg-faint)] hover:text-gold transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>
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

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
