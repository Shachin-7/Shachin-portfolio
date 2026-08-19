"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "animating" | "exit" | "done";

const LANDING_PHRASES = [
  {
    lines: ["INNOVATE", "WITH", "PURPOSE"],
    accentDotLine: 0, // Green accent square on "INNOVATE"
  },
  {
    lines: ["INNOVATE", "WITH A", "HUMAN TOUCH"],
    accentDotLine: -1,
  },
  {
    lines: ["FUTURE-FIRST", "ALWAYS"],
    accentDotLine: 1, // Green accent square on "ALWAYS"
  },
  {
    lines: ["SHACHIN VP", "AI & ML ENGINEER"],
    accentDotLine: -1,
  },
];

export default function IntroAnimation() {
  const [phase, setPhase] = useState<Phase>("animating");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run once per session (optional reset on refresh)
    if (sessionStorage.getItem("sha-intro-seen")) {
      setPhase("done");
      return;
    }

    // Lock body scroll during landing animation
    document.body.style.overflow = "hidden";

    // Cycle through phrases automatically
    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => {
        if (prev < LANDING_PHRASES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(phraseInterval);
          // Start hyperdrive exit sequence
          setTimeout(() => {
            setPhase("exit");
            setTimeout(() => {
              setPhase("done");
              document.body.style.overflow = "";
              sessionStorage.setItem("sha-intro-seen", "1");
            }, 800);
          }, 1100);
          return prev;
        }
      });
    }, 1250);

    return () => {
      clearInterval(phraseInterval);
      document.body.style.overflow = "";
    };
  }, []);

  const handleSkip = () => {
    setPhase("exit");
    setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      sessionStorage.setItem("sha-intro-seen", "1");
    }, 600);
  };

  // Canvas Lightspeed 3D Warp Field Render Loop
  useEffect(() => {
    if (phase === "done") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const LINE_COUNT = 300;
    interface SpeedLine {
      z: number;
      pz: number;
      angle: number;
      radius: number;
      speed: number;
      width: number;
      color: string;
    }

    const COLORS = [
      "#00f0ff", // Electric Cyan
      "#0066ff", // Neon Blue
      "#c026d3", // Vibrant Magenta
      "#9333ea", // Deep Purple
      "#00f0ff", // Double Cyan weight
      "#a8ff00", // Neon Lime Accent
    ];

    const lines: SpeedLine[] = [];

    for (let i = 0; i < LINE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 15 + Math.random() * (Math.max(width, height) * 0.7);
      const z = Math.random() * 1000;
      lines.push({
        z,
        pz: z,
        angle,
        radius,
        speed: 16 + Math.random() * 22,
        width: 1.4 + Math.random() * 3.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    let speedMultiplier = 1.0;

    const render = () => {
      // Accelerate speed significantly during the exit hyperdrive phase
      const targetSpeed = phase === "exit" ? 9.0 : 1.2 + phraseIndex * 0.4;
      speedMultiplier += (targetSpeed - speedMultiplier) * 0.1;

      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle background grid lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.035)";
      const gridSize = 140;
      for (let x = (centerX % gridSize) - gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = (centerY % gridSize) - gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw tech crosshair '+' marks at intersections
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      const crossSize = 5;
      [
        { x: centerX - gridSize * 2, y: centerY - gridSize },
        { x: centerX + gridSize * 2, y: centerY - gridSize },
        { x: centerX - gridSize * 2, y: centerY + gridSize },
        { x: centerX + gridSize * 2, y: centerY + gridSize },
      ].forEach((pt) => {
        ctx.beginPath();
        ctx.moveTo(pt.x - crossSize, pt.y);
        ctx.lineTo(pt.x + crossSize, pt.y);
        ctx.moveTo(pt.x, pt.y - crossSize);
        ctx.lineTo(pt.x, pt.y + crossSize);
        ctx.stroke();
      });

      // Render 3D radial speed lines
      lines.forEach((l) => {
        l.pz = l.z;
        l.z -= l.speed * speedMultiplier;

        if (l.z <= 1) {
          l.z = 1000;
          l.pz = 1000;
          l.angle = Math.random() * Math.PI * 2;
          l.radius = 15 + Math.random() * (Math.max(width, height) * 0.75);
        }

        const k = 400 / l.z;
        const pk = 400 / l.pz;

        const sx = Math.cos(l.angle) * (l.radius * k) + centerX;
        const sy = Math.sin(l.angle) * (l.radius * k) + centerY;

        const ex = Math.cos(l.angle) * (l.radius * pk * (1 + 0.2 * speedMultiplier)) + centerX;
        const ey = Math.sin(l.angle) * (l.radius * pk * (1 + 0.2 * speedMultiplier)) + centerY;

        const alpha = Math.min(1, (1000 - l.z) / 450);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = l.color;
        ctx.globalAlpha = alpha * 0.9;
        ctx.lineWidth = l.width * (k * 0.85);
        ctx.lineCap = "round";
        ctx.shadowColor = l.color;
        ctx.shadowBlur = phase === "exit" ? 18 : 6;
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [phase, phraseIndex]);

  if (phase === "done") return null;

  const currentPhraseObj = LANDING_PHRASES[phraseIndex] || LANDING_PHRASES[0];

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black overflow-hidden flex flex-col items-center justify-center select-none"
      initial={{ opacity: 1 }}
      animate={phase === "exit" ? { opacity: 0, scale: 1.08, filter: "blur(20px)" } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Lightspeed WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#000000_90%)] pointer-events-none z-10" />

      {/* ── Centered Bold Kinetic Typography (Exact Ref 2 & 3 Styling) ── */}
      <div className="relative z-20 max-w-6xl px-6 text-center flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={phraseIndex}
            initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)", y: 15 }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
            exit={{ opacity: 0, scale: 1.08, filter: "blur(12px)", y: -15 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center leading-[0.96]"
          >
            {currentPhraseObj.lines.map((lineText, lIdx) => (
              <div
                key={lIdx}
                className="relative inline-flex items-center justify-center"
              >
                <span
                  className="text-white text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[6.8rem] font-black uppercase tracking-tight text-center drop-shadow-[0_12px_40px_rgba(0,0,0,0.95)]"
                  style={{
                    fontFamily: "var(--font-clash-display), 'Outfit', 'Inter', system-ui, sans-serif",
                    letterSpacing: "-0.035em",
                    lineHeight: "0.95",
                  }}
                >
                  {lineText}
                </span>

                {/* Neon Lime Green Accent Square matching Ref Image 2 */}
                {currentPhraseObj.accentDotLine === lIdx && (
                  <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-2.5 bg-[#a8ff00] shadow-[0_0_15px_#a8ff00] align-baseline rounded-[1px]" />
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Discreet Skip Button Top-Right ── */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 z-30 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/15 text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer active:scale-95"
      >
        SKIP ✕
      </button>
    </motion.div>
  );
}
