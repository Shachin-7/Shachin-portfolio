"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { WarpFieldBackground } from "@/shaders/warp-field/WarpFieldBackground";

type Phase = "animating" | "exit" | "done";

const LANDING_PHRASES = [
  {
    lines: ["INNOVATE", "WITH", "PURPOSE"],
    accentDotLine: 0, // Green accent square on "INNOVATE" (matching Screenshot 1)
  },
  {
    lines: ["SHACHIN VP", "PORTFOLIO"],
    accentDotLine: 1, // Green accent square on "PORTFOLIO" (matching Screenshot 2)
  },
];

/**
 * High-performance 3D Hyperspace WarpField Intro Splash Animation.
 */
export default function IntroAnimation() {
  const pathname = usePathname();

  if (pathname === "/projects" || pathname === "/contact") {
    return null;
  }

  return <IntroAnimationInner />;
}

function IntroAnimationInner() {
  const [phase, setPhase] = useState<Phase>("animating");
  const [phraseIndex, setPhraseIndex] = useState(0);

  // Trigger on initial visit or manual trigger event
  useEffect(() => {
    const isFirstVisit = !sessionStorage.getItem("sha-intro-seen");
    if (isFirstVisit) {
      setPhase("animating");
      setPhraseIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      setPhase("done");
      document.body.style.overflow = "";
    }

    const handleTrigger = () => {
      setPhase("animating");
      setPhraseIndex(0);
      document.body.style.overflow = "hidden";
    };
    window.addEventListener("sha-trigger-intro", handleTrigger);

    return () => {
      window.removeEventListener("sha-trigger-intro", handleTrigger);
      document.body.style.overflow = "";
    };
  }, []);

  // Automatic phrase sequence timing & smooth 3D hyperspace exit
  useEffect(() => {
    if (phase !== "animating") return;

    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => {
        if (prev < LANDING_PHRASES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(phraseInterval);
          // Trigger 3D flying OUT OF SCREEN hyperdrive sequence
          setTimeout(() => {
            setPhase("exit");
            setTimeout(() => {
              setPhase("done");
              document.body.style.overflow = "";
              sessionStorage.setItem("sha-intro-seen", "1");
            }, 900);
          }, 1500);
          return prev;
        }
      });
    }, 1900);

    return () => {
      clearInterval(phraseInterval);
    };
  }, [phase]);

  const handleSkip = () => {
    setPhase("exit");
    setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      sessionStorage.setItem("sha-intro-seen", "1");
    }, 700);
  };

  if (phase === "done") return null;

  const currentPhraseObj = LANDING_PHRASES[phraseIndex] || LANDING_PHRASES[0];

  return (
    <div
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      className="fixed inset-0 z-[9999] bg-black overflow-hidden flex flex-col items-center justify-center select-none"
    >
      {/* ── 3D Container with Hyperspace Warp Field ── */}
      <motion.div
        className="relative w-full h-full flex flex-col items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ opacity: 1, scale: 1, z: 0 }}
        animate={
          phase === "exit"
            ? {
                opacity: 0,
                scale: 3.4,
                z: 800,
                rotateX: -18,
                filter: "blur(24px)",
              }
            : { opacity: 1, scale: 1, z: 0, rotateX: 0, filter: "blur(0px)" }
        }
        transition={{ duration: 0.85, ease: [0.7, 0, 0.84, 0] }}
      >
        {/* ── Authored WarpField Background: 400 colored additive streaks & 40 luminous tiles ── */}
        <WarpFieldBackground
          variant="hyperspace"
          speed={phase === "exit" ? 38.0 : 15.0}
          streakOpacity={0.60}
          tileOpacity={0.90}
          fov={75}
          hue={0}
          saturation={1.00}
          brightness={1.00}
          className="z-0"
        />

        {/* Radial Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,#000000_92%)] pointer-events-none z-10" />

        {/* ── Centered 3D Zooming Kinetic Typography ── */}
        <div
          className="relative z-20 max-w-6xl px-6 text-center flex flex-col items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={phraseIndex}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
                exit: {
                  opacity: 0,
                  scale: 3.6,
                  z: 900,
                  filter: "blur(18px)",
                  transition: { duration: 0.4, ease: "easeIn" },
                },
              }}
              className="flex flex-col items-center justify-center leading-[0.96]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {currentPhraseObj.lines.map((lineText, lIdx) => (
                <div
                  key={lIdx}
                  className="relative inline-flex items-center justify-center overflow-hidden py-1"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <motion.span
                    variants={{
                      hidden: {
                        opacity: 0,
                        scale: 0.15,
                        z: -800,
                        rotateX: 45,
                        filter: "blur(16px)",
                      },
                      visible: {
                        opacity: 1,
                        scale: 1,
                        z: 0,
                        rotateX: 0,
                        filter: "blur(0px)",
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 18,
                          mass: 0.7,
                        },
                      },
                    }}
                    className="text-white text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[6.8rem] font-black uppercase tracking-tight text-center drop-shadow-[0_12px_45px_rgba(0,0,0,0.95)] inline-block"
                    style={{
                      fontFamily:
                        "var(--font-clash-display), var(--font-cabinet), 'Outfit', 'Inter', system-ui, sans-serif",
                      letterSpacing: "-0.035em",
                      lineHeight: "0.95",
                    }}
                  >
                    {lineText}
                  </motion.span>

                  {/* Neon Lime Green Accent Square matching Authored Screenshots */}
                  {currentPhraseObj.accentDotLine === lIdx && (
                    <motion.span
                      variants={{
                        hidden: { scale: 0, opacity: 0 },
                        visible: {
                          scale: [0, 1.5, 1],
                          opacity: 1,
                          transition: { delay: 0.28, duration: 0.4 },
                        },
                      }}
                      className="inline-block w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-2.5 bg-[#a8ff00] shadow-[0_0_20px_#a8ff00] align-baseline rounded-[1px]"
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Discreet SKIP × Button Top-Right matching Screenshots ── */}
        <button
          onClick={handleSkip}
          className="absolute top-8 right-8 z-30 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/20 text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer active:scale-95"
        >
          SKIP ×
        </button>
      </motion.div>
    </div>
  );
}
