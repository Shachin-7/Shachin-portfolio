"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Phase = "enter" | "hold" | "split" | "done";

// Custom cubic-bezier for dramatic elastic split
const SPLIT_EASE = [0.76, 0, 0.24, 1] as const;

export default function IntroAnimation() {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    // Only show intro once per session
    if (sessionStorage.getItem("sha-intro-seen")) {
      setPhase("done");
      return;
    }

    // Lock body scroll during animation
    document.body.style.overflow = "hidden";

    const t0 = setTimeout(() => setPhase("hold"), 200);   // fade text in
    const t1 = setTimeout(() => setPhase("split"), 1800);  // start split
    const t2 = setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      sessionStorage.setItem("sha-intro-seen", "1");
    }, 2900);                                              // unmount overlay

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const isSplitting = phase === "split";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        pointerEvents: "all",
      }}
    >
      {/* Background fade-out when splitting */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0a0a0a",
          zIndex: 0,
        }}
        animate={isSplitting ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.55, delay: 0.65, ease: "easeOut" }}
      />

      {/* ──────── Text row ──────── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "0 4vw",
        }}
      >
        {/* LEFT — SHACHIN'S */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={
            phase === "enter"
              ? { opacity: 0, y: 20 }
              : isSplitting
                ? { opacity: 1, y: 0, x: "-115vw" }
                : { opacity: 1, y: 0, x: 0 }
          }
          transition={
            isSplitting
              ? { duration: 1.05, ease: SPLIT_EASE }
              : { duration: 0.55, ease: [0.33, 1, 0.68, 1] }
          }
          style={{
            fontFamily: "var(--font-clash-display), 'Outfit', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.2rem, 9.5vw, 9rem)",
            color: "#ffffff",
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          SHACHIN&apos;S
        </motion.span>

        {/* CENTER — star icon */}
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            phase === "enter"
              ? { opacity: 0, scale: 0.5 }
              : isSplitting
                ? { opacity: 0, scale: 0, rotate: 180 }
                : { opacity: 1, scale: 1, rotate: 0 }
          }
          transition={
            isSplitting
              ? { duration: 0.4, ease: "easeIn" }
              : { duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: 0.08 }
          }
          style={{
            display: "inline-block",
            color: "#22c55e",
            fontSize: "clamp(1.4rem, 5vw, 5rem)",
            margin: "0 clamp(0.4rem, 1.5vw, 1.8rem)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          ✦
        </motion.span>

        {/* RIGHT — PORTFOLIO */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={
            phase === "enter"
              ? { opacity: 0, y: 20 }
              : isSplitting
                ? { opacity: 1, y: 0, x: "115vw" }
                : { opacity: 1, y: 0, x: 0 }
          }
          transition={
            isSplitting
              ? { duration: 1.05, ease: SPLIT_EASE }
              : { duration: 0.55, ease: [0.33, 1, 0.68, 1], delay: 0.06 }
          }
          style={{
            fontFamily: "var(--font-clash-display), 'Outfit', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.2rem, 9.5vw, 9rem)",
            color: "#ffffff",
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          PORTFOLIO
        </motion.span>
      </div>

      {/* Subtle bottom caption */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={
          phase === "enter"
            ? { opacity: 0 }
            : isSplitting
              ? { opacity: 0 }
              : { opacity: 1 }
        }
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#555555",
          fontSize: "0.7rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily: "var(--font-clash-display), system-ui",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        Let's turn ideas into reality through code.
      </motion.p>
    </div>
  );
}
