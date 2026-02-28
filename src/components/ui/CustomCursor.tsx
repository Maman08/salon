"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Don't show custom cursor on touch devices
    const checkTouch = () => {
      setIsTouch("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };
    checkTouch();

    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("cursor-pointer") ||
        window.getComputedStyle(target).cursor === "pointer";

      setIsPointer(!!isClickable);
    };

    const leave = () => setIsVisible(false);
    const enter = () => setIsVisible(true);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, []);

  if (isTouch) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Main dot */}
          <motion.div
            className="fixed top-0 left-0 w-2 h-2 rounded-full bg-gold pointer-events-none z-[99999] mix-blend-difference"
            animate={{
              x: position.x - 4,
              y: position.y - 4,
              scale: isPointer ? 0 : 1,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
          />
          {/* Outer ring */}
          <motion.div
            className="fixed top-0 left-0 rounded-full border border-gold/40 pointer-events-none z-[99999] mix-blend-difference"
            animate={{
              x: position.x - (isPointer ? 24 : 16),
              y: position.y - (isPointer ? 24 : 16),
              width: isPointer ? 48 : 32,
              height: isPointer ? 48 : 32,
              borderColor: isPointer
                ? "rgba(201, 169, 110, 0.6)"
                : "rgba(201, 169, 110, 0.3)",
            }}
            transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.8 }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
