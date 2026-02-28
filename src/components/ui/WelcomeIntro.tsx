"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHASES = {
  GREETING: "greeting",
  CLOSE_EYES: "close_eyes",
  COUNTING: "counting",
  REVEAL_FLASH: "reveal_flash",
  DONE: "done",
} as const;

type Phase = (typeof PHASES)[keyof typeof PHASES];

export default function WelcomeIntro({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>(PHASES.GREETING);
  const [count, setCount] = useState(5);

  const advancePhase = useCallback(() => {
    setPhase((prev) => {
      if (prev === PHASES.GREETING) return PHASES.CLOSE_EYES;
      if (prev === PHASES.CLOSE_EYES) return PHASES.COUNTING;
      if (prev === PHASES.COUNTING) return PHASES.REVEAL_FLASH;
      if (prev === PHASES.REVEAL_FLASH) return PHASES.DONE;
      return prev;
    });
  }, []);

  // Phase timings
  useEffect(() => {
    if (phase === PHASES.GREETING) {
      const t = setTimeout(advancePhase, 3000);
      return () => clearTimeout(t);
    }
    if (phase === PHASES.CLOSE_EYES) {
      const t = setTimeout(advancePhase, 3500);
      return () => clearTimeout(t);
    }
    if (phase === PHASES.REVEAL_FLASH) {
      const t = setTimeout(advancePhase, 1800);
      return () => clearTimeout(t);
    }
  }, [phase, advancePhase]);

  // Countdown logic
  useEffect(() => {
    if (phase !== PHASES.COUNTING) return;

    if (count <= 0) {
      const t = setTimeout(advancePhase, 600);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, count, advancePhase]);

  // Skip on click during any phase
  const handleSkip = () => {
    if (phase !== PHASES.DONE) {
      setPhase(PHASES.REVEAL_FLASH);
      setTimeout(() => setPhase(PHASES.DONE), 800);
    }
  };

  if (phase === PHASES.DONE) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <>
      {/* Preload the site behind */}
      <div className="fixed inset-0 opacity-0 pointer-events-none">{children}</div>

      {/* Intro overlay */}
      <AnimatePresence mode="wait">
        <motion.div
            key="intro-overlay"
            className="fixed inset-0 z-[10000] flex items-center justify-center cursor-pointer"
            onClick={handleSkip}
            style={{ background: "#0a0a0a" }}
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: "easeInOut" },
            }}
          >
            {/* Ambient particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    background:
                      i % 3 === 0
                        ? "rgba(201, 169, 110, 0.4)"
                        : i % 3 === 1
                        ? "rgba(212, 160, 160, 0.3)"
                        : "rgba(255, 255, 255, 0.15)",
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30 - Math.random() * 60, 0],
                    x: [0, (Math.random() - 0.5) * 40, 0],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1 + Math.random(), 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Soft glowing orbs */}
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)",
              }}
              animate={{
                x: [-100, 100, -100],
                y: [-50, 50, -50],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(212,160,160,0.06) 0%, transparent 70%)",
              }}
              animate={{
                x: [80, -80, 80],
                y: [40, -40, 40],
                scale: [1.1, 0.9, 1.1],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* ====== PHASE: GREETING ====== */}
            <AnimatePresence mode="wait">
              {phase === PHASES.GREETING && (
                <motion.div
                  key="greeting"
                  className="relative text-center px-6 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Small sparkle */}
                  <motion.div
                    className="mx-auto mb-6 text-2xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: [0, 15, -15, 0] }}
                    transition={{
                      delay: 0.3,
                      duration: 1,
                      rotate: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    ✨
                  </motion.div>

                  <motion.p
                    className="text-white/30 text-sm tracking-[0.3em] uppercase mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    Hey
                  </motion.p>

                  <motion.h1
                    className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
                  >
                    <span
                      style={{
                        background: "linear-gradient(135deg, #c9a96e 0%, #e4d5b7 40%, #d4a0a0 60%, #c9a96e 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Tanya
                    </span>
                  </motion.h1>

                  <motion.div
                    className="mt-6 flex justify-center"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                  >
                    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#c9a96e]/40 to-transparent" />
                  </motion.div>

                  {/* Hearts floating up */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {["💛", "🤍", "✨", "💫", "💛"].map((emoji, i) => (
                      <motion.span
                        key={i}
                        className="absolute text-lg"
                        style={{ left: `${20 + i * 15}%`, bottom: 0 }}
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: [0, 1, 0], y: -200 }}
                        transition={{
                          delay: 1.5 + i * 0.3,
                          duration: 2.5,
                          ease: "easeOut",
                        }}
                      >
                        {emoji}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ====== PHASE: CLOSE YOUR EYES ====== */}
              {phase === PHASES.CLOSE_EYES && (
                <motion.div
                  key="close-eyes"
                  className="relative text-center px-6 z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div
                    className="mx-auto mb-8 text-4xl"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    🌙
                  </motion.div>

                  <motion.p
                    className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/80 leading-snug max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    Close your eyes...
                  </motion.p>

                  <motion.p
                    className="mt-4 text-white/30 text-base sm:text-lg font-light tracking-wide"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                  >
                    and count till 5
                  </motion.p>

                  <motion.p
                    className="mt-2 text-white/15 text-sm tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                  >
                    then open them ✨
                  </motion.p>
                </motion.div>
              )}

              {/* ====== PHASE: COUNTING ====== */}
              {phase === PHASES.COUNTING && (
                <motion.div
                  key="counting"
                  className="relative text-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 1.5, filter: "blur(30px)" }}
                  transition={{ duration: 0.6 }}
                >
                  {/* Pulsing ring */}
                  <div className="relative inline-flex items-center justify-center">
                    <motion.div
                      className="absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full border border-[#c9a96e]/10"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-[#d4a0a0]/15"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.1, 0.5],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    />

                    {/* The number */}
                    <AnimatePresence mode="wait">
                      {count > 0 ? (
                        <motion.span
                          key={count}
                          className="font-[family-name:var(--font-playfair)] text-8xl sm:text-9xl md:text-[10rem] font-bold"
                          style={{
                            background:
                              "linear-gradient(180deg, #c9a96e 0%, #d4a0a0 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }}
                          initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                        >
                          {count}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="open"
                          className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl text-white/80"
                          initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
                          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
                          transition={{ duration: 0.5 }}
                        >
                          Open your eyes ✨
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Bottom text */}
                  {count > 0 && (
                    <motion.p
                      className="mt-8 text-white/15 text-xs tracking-[0.3em] uppercase"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Something special is waiting...
                    </motion.p>
                  )}
                </motion.div>
              )}

              {/* ====== PHASE: REVEAL FLASH ====== */}
              {phase === PHASES.REVEAL_FLASH && (
                <motion.div
                  key="reveal"
                  className="fixed inset-0 z-50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 1.8, times: [0, 0.15, 0.5, 1] }}
                >
                  {/* Bright flash effect */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at center, rgba(201,169,110,0.4) 0%, rgba(212,160,160,0.2) 30%, rgba(10,10,10,0) 70%)",
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 3] }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />

                  {/* Sparkle burst */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const angle = (i / 20) * Math.PI * 2;
                      const distance = 100 + Math.random() * 200;
                      return (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            background:
                              i % 2 === 0
                                ? "rgba(201,169,110,0.8)"
                                : "rgba(212,160,160,0.8)",
                          }}
                          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                          animate={{
                            x: Math.cos(angle) * distance,
                            y: Math.sin(angle) * distance,
                            opacity: 0,
                            scale: 0,
                          }}
                          transition={{
                            duration: 1.2,
                            delay: 0.2,
                            ease: "easeOut",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Center text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.p
                      className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl text-white font-bold text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.1] }}
                      transition={{ duration: 1.8, times: [0, 0.2, 0.6, 1] }}
                    >
                      This is for you 💝
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Skip hint */}
            <motion.p
              className="absolute bottom-8 text-white/10 text-xs tracking-widest z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              tap anywhere to skip
            </motion.p>
          </motion.div>
      </AnimatePresence>
    </>
  );
}
