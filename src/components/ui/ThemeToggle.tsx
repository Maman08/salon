"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === "dark";

  return (
    <motion.button
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-9 h-9 rounded-full flex items-center justify-center overflow-hidden"
      style={{
        background: isDark
          ? "rgba(201,169,110,0.10)"
          : "rgba(201,169,110,0.14)",
        border: "1px solid rgba(201,169,110,0.28)",
      }}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="moon"
            initial={{ rotate: -40, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 40, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Moon size={16} className="text-[#c9a96e]" strokeWidth={1.8} />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 40, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -40, opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            <Sun size={16} className="text-[#c9870a]" strokeWidth={1.8} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
