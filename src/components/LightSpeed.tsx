"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, Zap, Play, Pause, ChevronRight } from "lucide-react";

interface LightSpeedProps {
  phrases?: string[];
  autoPlayInterval?: number;
  onExploreClick?: () => void;
  className?: string;
}

const DEFAULT_PHRASES = [
  "INNOVATE WITH PURPOSE",
  "INNOVATE WITH A HUMAN TOUCH",
  "FUTURE-FIRST ALWAYS",
  "BUILDING INTELLIGENT SYSTEMS",
  "SHACHIN VP · AI & ML ENGINEER",
];

/**
 * Interactive 3D lightspeed hyperdrive particles background visualizer.
 */
export default function LightSpeed({
  phrases = DEFAULT_PHRASES,
  autoPlayInterval = 3500,
  onExploreClick,
  className = "",
}: LightSpeedProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBoosting, setIsBoosting] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Auto-cycle phrases
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPlaying, phrases.length, autoPlayInterval]);

  // Track mouse for interactive steering
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Canvas Warp Speed Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Speed line particles initialization
    const LINE_COUNT = 240;
    interface LineParticle {
      x: number;
      y: number;
      z: number;
      pz: number;
      angle: number;
      radius: number;
      speed: number;
      length: number;
      width: number;
      color: string;
    }

    const COLORS = [
      "#00f0ff", // Electric Cyan
      "#0077ff", // Neon Blue
      "#7928ca", // Purple
      "#ff0080", // Vibrant Magenta
      "#00f0ff", // Double Cyan for weight
      "#a8ff00", // Bright Lime Accent
    ];

    const particles: LineParticle[] = [];

    const resetParticle = (p: Partial<LineParticle> = {}): LineParticle => {
      const angle = Math.random() * Math.PI * 2;
      const radius = 20 + Math.random() * (Math.max(width, height) * 0.7);
      const z = Math.random() * 1000 + 200;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: z,
        pz: z,
        angle: angle,
        radius: radius,
        speed: 12 + Math.random() * 18,
        length: 30 + Math.random() * 80,
        width: 1.2 + Math.random() * 2.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        ...p,
      };
    };

    for (let i = 0; i < LINE_COUNT; i++) {
      particles.push(resetParticle({ z: Math.random() * 1000 }));
    }

    let currentSpeedMult = 1.0;

    const render = () => {
      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const speedMultiplier = isBoosting ? 3.8 : 1.0;
      currentSpeedMult += (speedMultiplier - currentSpeedMult) * 0.08;

      // Dark background trail effect
      ctx.fillStyle = "rgba(3, 7, 18, 0.35)";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2 + mouseRef.current.x * 60;
      const centerY = height / 2 + mouseRef.current.y * 60;

      // Draw subtle tech grid background lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
      const gridSize = 120;
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

      // Draw tech crosshairs (+) at center grid points
      ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      const crossSize = 6;
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

      // Render lightspeed particles
      particles.forEach((p) => {
        p.pz = p.z;
        p.z -= p.speed * currentSpeedMult;

        if (p.z <= 1) {
          p.z = 1000;
          p.pz = 1000;
          p.angle = Math.random() * Math.PI * 2;
          p.radius = 15 + Math.random() * (Math.max(width, height) * 0.75);
        }

        // Perspective 3D calculation
        const k = 400 / p.z;
        const pk = 400 / p.pz;

        const sx = Math.cos(p.angle) * (p.radius * k) + centerX;
        const sy = Math.sin(p.angle) * (p.radius * k) + centerY;

        const ex = Math.cos(p.angle) * (p.radius * pk * (1 + 0.15 * currentSpeedMult)) + centerX;
        const ey = Math.sin(p.angle) * (p.radius * pk * (1 + 0.15 * currentSpeedMult)) + centerY;

        // Alpha fade out near edges & center
        const alpha = Math.min(1, (1000 - p.z) / 400);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = alpha * 0.85;
        ctx.lineWidth = p.width * (k * 0.8);
        ctx.lineCap = "round";
        ctx.shadowColor = p.color;
        ctx.shadowBlur = isBoosting ? 15 : 6;
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
  }, [isBoosting]);

  const currentPhrase = phrases[phraseIndex] || "";
  const words = currentPhrase.split(" ");

  return (
    <div
      className={`relative w-full h-[90vh] min-h-[620px] bg-[#030712] overflow-hidden flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* ── WebGL / Canvas LightSpeed Layer ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* ── Vignette & Radial Glow Overlay ── */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#030712_90%)] pointer-events-none z-10" />

      {/* ── Center Kinetic Text Container ── */}
      <div className="relative z-20 max-w-6xl px-6 text-center flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={phraseIndex}
            initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.15, filter: "blur(14px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-1 sm:gap-3"
          >
            {words.map((word, wIdx) => (
              <motion.span
                key={wIdx}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.35, delay: wIdx * 0.08 }}
                className="text-white text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.2rem] font-extrabold uppercase tracking-tight leading-[0.95] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
                style={{
                  fontFamily: "var(--font-clash-display), 'Inter', system-ui, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Top Sci-Fi Tech Pill Badges ── */}
      <div className="absolute top-8 left-6 sm:left-12 z-30 flex items-center gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          WARP SPEED :: ACTIVE
        </div>
      </div>

      {/* ── Bottom Controls Bar ── */}
      <div className="absolute bottom-10 left-0 right-0 z-30 px-6 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 pointer-events-auto">
        {/* Play/Pause & Speed Boost Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/15 transition-all duration-300 active:scale-95 cursor-pointer"
            title={isPlaying ? "Pause auto-cycle" : "Play auto-cycle"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onMouseDown={() => setIsBoosting(true)}
            onMouseUp={() => setIsBoosting(false)}
            onTouchStart={() => setIsBoosting(true)}
            onTouchEnd={() => setIsBoosting(false)}
            className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider uppercase backdrop-blur-md border transition-all duration-300 flex items-center gap-2 cursor-pointer select-none ${
              isBoosting
                ? "bg-cyan-500 text-black border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.8)] scale-105"
                : "bg-white/10 hover:bg-white/20 text-white border-white/15"
            }`}
          >
            <Zap size={14} className={isBoosting ? "fill-black" : ""} />
            <span>{isBoosting ? "LIGHTSPEED BOOST!" : "Hold to Boost Speed"}</span>
          </button>
        </div>

        {/* Explore Portfolio CTA Button */}
        <button
          onClick={() => {
            if (onExploreClick) {
              onExploreClick();
            } else {
              window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" });
            }
          }}
          className="group px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-cyan-300 transition-all duration-300 shadow-[0_10px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_40px_rgba(0,240,255,0.5)] flex items-center gap-2 cursor-pointer"
        >
          <span>EXPLORE PORTFOLIO</span>
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>

      {/* ── Scroll Indicator Chevron ── */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono tracking-widest uppercase text-white/70">SCROLL</span>
        <ArrowDown size={14} className="text-white animate-bounce" />
      </div>
    </div>
  );
}
