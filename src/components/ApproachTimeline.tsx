"use client";

import React, { useEffect, useRef } from "react";
import { useMotionValue, animate, type Transition } from "framer-motion";
import { Sparkle } from "lucide-react";

export interface TimelineItem {
  eyebrow: string;
  desc: string;
  bigText: string;
  bg: string;
  fg: string;
  eyebrowColor: string;
  descColor: string;
  bigTextColor: string;
  image?: string;
  imageAlt?: string;
}

export interface ApproachTimelineProps {
  items?: TimelineItem[];
  totalScrollHeight?: string;
  scrollTransition?: Transition;
}

// Background sequence: white, black, light green, white, red
const DEFAULT_APPROACH_ITEMS: TimelineItem[] = [
  {
    // 1: White background
    bg: "#ffffff",
    fg: "#000000",
    eyebrowColor: "rgba(0, 0, 0, 0.55)",
    descColor: "#000000",
    bigTextColor: "#000000",
    eyebrow: "01 / OBJECTIVE SCOPING",
    desc: "Deconstructing complex product bottlenecks into mathematical objective functions. Before authoring code, I establish baseline metrics, false-positive thresholds, and strict P99 latency budgets.",
    bigText: "01",
    image: "/images/approach/01-objective-scoping.png",
    imageAlt: "01 Objective Scoping illustration",
  },
  {
    // 2: Black background
    bg: "#0c0c0c",
    fg: "#ffffff",
    eyebrowColor: "rgba(255, 255, 255, 0.55)",
    descColor: "#ffffff",
    bigTextColor: "#ffffff",
    eyebrow: "02 / SIGNAL ARCHITECTURE",
    desc: "Automated ETL pipelines with temporal splitting to eradicate lookahead bias, outlier neutralization, and high-entropy feature store embeddings.",
    bigText: "02",
    image: "/images/approach/02-signal-architecture.png",
    imageAlt: "02 Signal Architecture illustration",
  },
  {
    // 3: Green background (exact user swatch: #a1d44c)
    bg: "#a1d44c",
    fg: "#000000",
    eyebrowColor: "rgba(0, 0, 0, 0.65)",
    descColor: "#000000",
    bigTextColor: "#000000",
    eyebrow: "03 / EXPERIMENTATION MATRIX",
    desc: "Structured benchmarking across gradient-boosted trees, custom Transformers, and hybrid architectures with Bayesian hyperparameter tuning and ablation studies.",
    bigText: "03",
    image: "/images/approach/03-experimentation-matrix.png",
    imageAlt: "03 Experimentation Matrix illustration",
  },
  {
    // 4: White background
    bg: "#ffffff",
    fg: "#000000",
    eyebrowColor: "rgba(0, 0, 0, 0.55)",
    descColor: "#000000",
    bigTextColor: "#000000",
    eyebrow: "04 / PRODUCTION TELEMETRY",
    desc: "Compiling model weights via ONNX & TensorRT for sub-10ms edge inference with continuous Kolmogorov-Smirnov monitors for real-time concept drift.",
    bigText: "04",
    image: "/images/approach/04-production-telemetry.png",
    imageAlt: "04 Production Telemetry illustration",
  },
  {
    // 5: Red background
    bg: "#e62b1e",
    fg: "#ffffff",
    eyebrowColor: "rgba(255, 255, 255, 0.75)",
    descColor: "#ffffff",
    bigTextColor: "#ffffff",
    eyebrow: "05 / CONTINUOUS FEEDBACK",
    desc: "Production models degrade without closed feedback loops. Automating active learning triggers, shadow deployments, and retraining pipelines for peak accuracy.",
    bigText: "05",
    image: "/images/approach/05-continuous-feedback.png",
    imageAlt: "05 Continuous Feedback illustration",
  },
];

export default function ApproachTimeline({
  items = DEFAULT_APPROACH_ITEMS,
  totalScrollHeight = "500vh",
  scrollTransition = { type: "tween", ease: "linear", duration: 0 },
}: ApproachTimelineProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // Motion value that tracks the scrub progress
  const progress = useMotionValue(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const panels = Array.from(wrap.querySelectorAll<HTMLElement>(".approach-panel"));
    const n = panels.length;
    if (n === 0) return;

    const prefixEl = wrap.querySelector<HTMLElement>(".approach-title-prefix");
    const suffixEl = wrap.querySelector<HTMLElement>(".approach-title-suffix");
    const sparkleEl = wrap.querySelector<HTMLElement>(".approach-sparkle");

    function applyAt(raw: number) {
      const scaled = Math.min(n - 1, Math.max(0, raw));
      const idx = Math.min(n - 2, Math.floor(scaled));
      const t = scaled - idx;
      const currentIdx = Math.round(scaled);

      // Dynamically update stationary header colors based on underlying background
      if (prefixEl && suffixEl) {
        if (currentIdx === 0) {
          // Panel 1: White
          prefixEl.style.color = "#000000";
          suffixEl.style.color = "#a1d44c"; // user green
          if (sparkleEl) sparkleEl.style.color = "#a1d44c";
        } else if (currentIdx === 1) {
          // Panel 2: Black
          prefixEl.style.color = "#ffffff";
          suffixEl.style.color = "#a1d44c"; // user green
          if (sparkleEl) sparkleEl.style.color = "#a1d44c";
        } else if (currentIdx === 2) {
          // Panel 3: Green (#a1d44c)
          prefixEl.style.color = "#000000";
          suffixEl.style.color = "#1a3303"; // high contrast dark tone over lime background
          if (sparkleEl) sparkleEl.style.color = "#1a3303";
        } else if (currentIdx === 3) {
          // Panel 4: White
          prefixEl.style.color = "#000000";
          suffixEl.style.color = "#a1d44c"; // user green
          if (sparkleEl) sparkleEl.style.color = "#a1d44c";
        } else if (currentIdx === 4) {
          // Panel 5: Red
          prefixEl.style.color = "#ffffff";
          suffixEl.style.color = "#ffffff";
          if (sparkleEl) sparkleEl.style.color = "#ffffff";
        }
      }

      // Update panels and rotating big typography
      panels.forEach((panel, i) => {
        const bigText = panel.querySelector<HTMLElement>(".approach-bigtext");
        if (!bigText) return;

        if (i < idx) {
          panel.style.clipPath = "inset(0 0 0 100%)";
          bigText.style.transform = "rotate(-90deg)";
        } else if (i === idx) {
          const visible = 1 - t;
          panel.style.clipPath = `inset(0 ${(1 - visible) * 100}% 0 0)`;
          bigText.style.transform = `rotate(${-90 * t}deg)`;
        } else if (i === idx + 1) {
          const visible = t;
          panel.style.clipPath = `inset(0 0 0 ${(1 - visible) * 100}%)`;
          bigText.style.transform = "rotate(0deg)";
        } else {
          panel.style.clipPath = "inset(0 0 0 100%)";
          bigText.style.transform = "rotate(0deg)";
        }
        panel.style.zIndex = String(i);
      });
    }

    function update() {
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      let raw = total > 0 ? -rect.top / total : 0;
      raw = Math.min(1, Math.max(0, raw));
      const scaled = raw * (n - 1);
      animate(progress, scaled, scrollTransition);
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    applyAt(0);
    update();

    const unsubscribe = progress.on("change", applyAt);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      if (unsubscribe) unsubscribe();
    };
  }, [items, scrollTransition, progress]);

  return (
    <div className="relative w-full">
      {/* ── Scroll Timeline Scrub Area (Full Page Screen Width & Height) ── */}
      <div
        ref={wrapRef}
        className="relative w-full"
        style={{ height: totalScrollHeight }}
      >
        <div
          className="sticky top-0 left-0 w-full h-screen overflow-hidden"
          style={{
            background: "#000000",
          }}
        >
          {/* ── Stationary Persistent Header at Top-Left (Does NOT swap on scroll) ── */}
          <div className="absolute top-8 sm:top-12 md:top-14 left-8 sm:left-14 md:left-20 z-30 pointer-events-none select-none max-w-[460px]">
            {/* Shimmer Badge with exact same font, green color (#a1d44c), and shimmer animation as Featured Projects */}
            <div className="section-badge !mb-2 sm:!mb-3 flex items-center gap-2">
              <Sparkle size={16} className="approach-sparkle text-[#a1d44c] transition-colors duration-300" />
              <span
                className="shimmer-text"
                style={{
                  background: "linear-gradient(90deg, #a1d44c 0%, #a1d44c 25%, #ffffff 50%, #a1d44c 75%, #a1d44c 100%)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: "shimmer 3s linear infinite",
                  fontFamily: "var(--font-clash-display), system-ui, sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                My Approach
              </span>
            </div>

            <h2
              className="text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-tight transition-colors duration-300"
              style={{ fontFamily: "var(--font-clash-display), system-ui, sans-serif" }}
            >
              <span className="approach-title-prefix text-black transition-colors duration-300">How I </span>
              <span className="approach-title-suffix text-[#a1d44c] transition-colors duration-300">
                Approach a Project
              </span>
            </h2>
          </div>

          {/* ── Wiping Panels (01 to 05) ── */}
          {items.map((s, i) => (
            <section
              key={i}
              className="approach-panel absolute inset-0 w-full h-full will-change-[clip-path]"
              style={{
                background: s.bg,
                color: s.fg,
                clipPath: i === 0 ? "inset(0 0 0 0)" : "inset(0 0 0 100%)",
                zIndex: i,
              }}
            >
              <div className="relative w-full h-full p-8 sm:p-14 md:p-20 flex flex-col justify-between box-border overflow-hidden">
                {/* ── Top-Right Section: Raw Text Directly on Background + Character Illustration Below Para ── */}
                <div className="self-end max-w-[480px] w-full text-left z-20 pt-4 sm:pt-6 md:pt-8 flex flex-col items-start">
                  <span
                    className="block text-xs sm:text-sm font-mono font-medium uppercase tracking-widest mb-3 sm:mb-4 select-none"
                    style={{ color: s.eyebrowColor }}
                  >
                    {s.eyebrow}
                  </span>

                  <p
                    className="m-0 text-base sm:text-lg md:text-xl leading-relaxed font-normal"
                    style={{
                      color: s.descColor,
                      fontFamily: "var(--font-poppins), system-ui, sans-serif",
                    }}
                  >
                    {s.desc}
                  </p>

                  {/* Character Illustration directly below the paragraph */}
                  {s.image && (
                    <div className="mt-4 sm:mt-6 md:mt-8 flex justify-center w-full pointer-events-none select-none">
                      <img
                        src={s.image}
                        alt={s.imageAlt || s.eyebrow}
                        className="h-[32vh] sm:h-[40vh] md:h-[46vh] max-h-[440px] min-h-[200px] w-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.18)] transition-transform duration-500 hover:scale-105"
                        loading="eager"
                        draggable={false}
                      />
                    </div>
                  )}
                </div>

                {/* ── Bottom-Left Section: Non-Bold Poppins Big Numbers (01 - 05) ── */}
                <div className="absolute left-8 sm:left-14 md:left-20 bottom-4 sm:bottom-8 md:bottom-12 z-10 pointer-events-none select-none">
                  <h2
                    className="approach-bigtext select-none m-0 font-normal leading-[0.82] tracking-tighter"
                    style={{
                      color: s.bigTextColor,
                      fontFamily: "var(--font-poppins), 'Poppins', sans-serif",
                      fontWeight: 400, // Non-bold as requested
                      fontSize: "clamp(120px, 22vw, 340px)",
                      transformOrigin: "left bottom",
                      willChange: "transform",
                    }}
                  >
                    {s.bigText}
                  </h2>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
