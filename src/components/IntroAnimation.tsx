"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

type Phase = "animating" | "exit" | "done";

const LANDING_PHRASES = [
  {
    lines: ["INNOVATE", "WITH", "PURPOSE"],
    accentDotLine: 0, // Green accent square on "INNOVATE"
  },
  {
    lines: ["SHACHIN VP", "PORTFOLIO"],
    accentDotLine: 1, // Green accent square on "PORTFOLIO"
  },
];

export default function IntroAnimation() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<Phase>("animating");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevPathname = useRef(pathname);

  // Trigger animation on initial load or navigation to /projects
  useEffect(() => {
    const isProjectsPage = pathname === "/projects";
    const isFirstVisit = !sessionStorage.getItem("sha-intro-seen");

    if (isFirstVisit || isProjectsPage) {
      setPhase("animating");
      setPhraseIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      setPhase("done");
    }

    prevPathname.current = pathname;
  }, [pathname]);

  // Listen for custom trigger events when any Projects button/link is clicked
  useEffect(() => {
    const handleTrigger = () => {
      setPhase("animating");
      setPhraseIndex(0);
      document.body.style.overflow = "hidden";
    };

    window.addEventListener("sha-trigger-intro", handleTrigger);
    return () => window.removeEventListener("sha-trigger-intro", handleTrigger);
  }, []);

  // Automatic phrase timing & 3D exit trigger
  useEffect(() => {
    if (phase !== "animating") return;

    const phraseInterval = setInterval(() => {
      setPhraseIndex((prev) => {
        if (prev < LANDING_PHRASES.length - 1) {
          return prev + 1;
        } else {
          clearInterval(phraseInterval);
          // Trigger 3D flying OUT OF SCREEN exit sequence
          setTimeout(() => {
            setPhase("exit");
            setTimeout(() => {
              setPhase("done");
              document.body.style.overflow = "";
              sessionStorage.setItem("sha-intro-seen", "1");
            }, 900);
          }, 1400);
          return prev;
        }
      });
    }, 1800);

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

  // Canvas 3D Lightspeed Particles & Out-of-Screen Hyperdrive Loop
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

    const LINE_COUNT = 340;
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
      const radius = 15 + Math.random() * (Math.max(width, height) * 0.8);
      const z = Math.random() * 1000;
      lines.push({
        z,
        pz: z,
        angle,
        radius,
        speed: 20 + Math.random() * 26,
        width: 1.5 + Math.random() * 3.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }

    let speedMultiplier = 1.0;

    const render = () => {
      const isExiting = phase === "exit";
      // Massive speed burst when flying out of screen
      const targetSpeed = isExiting ? 14.0 : 1.2 + phraseIndex * 0.45;
      speedMultiplier += (targetSpeed - speedMultiplier) * 0.12;

      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Subtle high-tech grid overlay
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0, 240, 255, 0.038)";
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

      // Render 3D radial speed lines zooming toward/past camera
      lines.forEach((l) => {
        l.pz = l.z;
        l.z -= l.speed * speedMultiplier;

        if (l.z <= 1) {
          l.z = 1000;
          l.pz = 1000;
          l.angle = Math.random() * Math.PI * 2;
          l.radius = 15 + Math.random() * (Math.max(width, height) * 0.8);
        }

        const k = 420 / l.z;
        const pk = 420 / l.pz;

        const sx = Math.cos(l.angle) * (l.radius * k) + centerX;
        const sy = Math.sin(l.angle) * (l.radius * k) + centerY;

        const ex = Math.cos(l.angle) * (l.radius * pk * (1 + 0.25 * speedMultiplier)) + centerX;
        const ey = Math.sin(l.angle) * (l.radius * pk * (1 + 0.25 * speedMultiplier)) + centerY;

        const alpha = Math.min(1, (1000 - l.z) / 400);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = l.color;
        ctx.globalAlpha = alpha * 0.92;
        ctx.lineWidth = l.width * (k * 0.9);
        ctx.lineCap = "round";
        ctx.shadowColor = l.color;
        ctx.shadowBlur = isExiting ? 25 : 8;
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
    <div
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
      className="fixed inset-0 z-[9999] bg-black overflow-hidden flex flex-col items-center justify-center select-none"
    >
      {/* ── 3D OUT OF SCREEN FLYING CONTAINER ── */}
      <motion.div
        className="relative w-full h-full flex flex-col items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
        initial={{ opacity: 1, scale: 1, z: 0 }}
        animate={
          phase === "exit"
            ? {
                opacity: 0,
                scale: 3.2,
                z: 800,
                rotateX: -22,
                filter: "blur(28px)",
              }
            : { opacity: 1, scale: 1, z: 0, rotateX: 0, filter: "blur(0px)" }
        }
        transition={{ duration: 0.85, ease: [0.7, 0, 0.84, 0] }}
      >
        {/* Lightspeed WebGL Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Radial Vignette Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,#000000_90%)] pointer-events-none z-10" />

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
                  scale: 3.8, // Flies OUT OF SCREEN past camera
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
                        scale: 0.12, // Coming from deep 3D space
                        z: -800,
                        rotateX: 45,
                        filter: "blur(20px)",
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
                        "var(--font-clash-display), 'Outfit', 'Inter', system-ui, sans-serif",
                      letterSpacing: "-0.035em",
                      lineHeight: "0.95",
                    }}
                  >
                    {lineText}
                  </motion.span>

                  {/* Neon Lime Green Accent Square matching Ref Image 2 */}
                  {currentPhraseObj.accentDotLine === lIdx && (
                    <motion.span
                      variants={{
                        hidden: { scale: 0, opacity: 0 },
                        visible: {
                          scale: [0, 1.6, 1],
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

        {/* ── Discreet Skip Button Top-Right ── */}
        <button
          onClick={handleSkip}
          className="absolute top-8 right-8 z-30 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white backdrop-blur-md border border-white/15 text-xs font-mono tracking-widest uppercase transition-all duration-300 cursor-pointer active:scale-95"
        >
          SKIP ✕
        </button>
      </motion.div>
    </div>
  );
}
