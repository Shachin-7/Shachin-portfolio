"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { mountLiquidMetal } from "./liquidMetalShader";

export type SendButtonStatus = "idle" | "pending" | "success" | "error";

interface FramerSendButtonProps {
  status: SendButtonStatus;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  type?: "submit" | "button";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function PaperPlaneSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      {/* Soft Drop Shadow */}
      <g transform="translate(1, 1.5)" opacity="0.25">
        <path d="M8 26L43 9L25 30L8 26Z" fill="#000000" />
        <path d="M25 30L43 9L30.5 38L25 30Z" fill="#000000" />
        <path d="M8 26L25 30L30.5 38L19.8 31.7L8 26Z" fill="#000000" />
      </g>
      {/* Main Wings & Folds */}
      <path d="M8 26L43 9L25 30L8 26Z" fill="currentColor" fillOpacity="0.95" />
      <path d="M25 30L43 9L30.5 38L25 30Z" fill="currentColor" fillOpacity="0.75" />
      <path d="M8 26L25 30L30.5 38L19.8 31.7L8 26Z" fill="currentColor" fillOpacity="0.55" />
      <path
        d="M25 30L43 9L20.9 28.7"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

const burstParticles = [
  { x: -16, y: -12, r: -28, scale: 0.9 },
  { x: -4, y: -20, r: -6, scale: 1.0 },
  { x: 14, y: -12, r: 18, scale: 0.8 },
  { x: 10, y: 4, r: 35, scale: 0.7 },
  { x: -12, y: 8, r: -40, scale: 0.85 },
];

export default function FramerSendButton({
  status,
  buttonText = "Send Message",
  className = "",
  disabled = false,
  type = "submit",
  onClick,
}: FramerSendButtonProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stageRef.current) return;
    const cleanup = mountLiquidMetal(stageRef.current);
    return cleanup;
  }, []);

  const isPending = status === "pending";
  const isSuccess = status === "success";
  const isError = status === "error";

  return (
    <div
      ref={stageRef}
      className={`liquid-stage w-full ${className}`}
      style={{ "--h": "56px", width: "100%" } as React.CSSProperties}
      data-liquid-metal="explore"
    >
      <div className="liquid-plate" aria-hidden="true" />
      <canvas className="liquid-fx" aria-hidden="true" />

      <button
        type={type}
        onClick={onClick}
        disabled={disabled || isPending}
        className="liquid-button w-full px-7 flex items-center justify-center font-medium text-white select-none relative"
        style={{ width: "100%" }}
      >
        <span className="lbl w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center gap-2.5"
            >
              <span>{buttonText}</span>
              <div className="relative w-5 h-5 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <PaperPlaneSvg className="w-5 h-5 text-current" />
              </div>
            </motion.div>
          )}

          {isPending && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center gap-1 text-current font-medium"
            >
              <span>Sending</span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: 0 }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: 0.2 }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: 0.4 }}
              >
                .
              </motion.span>
            </motion.div>
          )}

          {isSuccess && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center gap-2 text-white font-medium"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 22 }}
              >
                <Check size={19} className="text-white stroke-[2.5]" />
              </motion.div>
              <span>Delivered!</span>
            </motion.div>
          )}

          {isError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center justify-center gap-2 text-white font-medium"
            >
              <span>Failed to send</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paper Plane Flying Overlay Animation */}
        {isPending && (
          <div className="absolute inset-0 pointer-events-none overflow-visible z-20">
            {/* Burst Particles */}
            {burstParticles.map((p, idx) => (
              <motion.span
                key={idx}
                className="absolute right-8 top-1/2 w-1.5 h-1.5 rounded-full bg-text-primary/70"
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                animate={{
                  x: p.x * 1.5,
                  y: p.y * 1.5,
                  opacity: [0, 0.9, 0],
                  scale: [0.5, p.scale, 0],
                }}
                transition={{ duration: 0.4, delay: idx * 0.02, ease: "easeOut" }}
              />
            ))}

            {/* Flight Trail Arc (Dashed Line) */}
            <svg
              className="absolute right-6 top-1/2 -translate-y-1/2 w-[420px] h-[260px] pointer-events-none overflow-visible"
              style={{ transform: "translate(10px, -130px)" }}
              viewBox="0 0 420 260"
            >
              <motion.path
                d="M 0 130 C 40 70, 130 50, 110 110 C 90 170, 180 60, 400 -20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeDasharray="5 5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 0.95, 0.95],
                  opacity: [0, 0.65, 0],
                }}
                transition={{ duration: 1.8, ease: "easeInOut", times: [0, 0.7, 1] }}
                className="text-text-primary/40"
              />
            </svg>

            {/* Paper Plane Flying along Catmull-Rom/Keyframe trajectory */}
            <motion.div
              initial={{ x: 0, y: 0, rotate: -8, scale: 1, opacity: 1 }}
              animate={{
                x: [0, 30, 85, 110, 88, 145, 270, 400],
                y: [0, -45, -70, -30, 15, -60, -120, -170],
                rotate: [-8, -35, -95, -180, -270, -45, -30, -35],
                scale: [1, 1.25, 1.35, 1.15, 1.0, 0.85, 0.6, 0],
                opacity: [1, 1, 1, 1, 1, 1, 0.85, 0],
              }}
              transition={{
                duration: 1.8,
                ease: "easeInOut",
                times: [0, 0.15, 0.32, 0.48, 0.62, 0.76, 0.9, 1],
              }}
              className="absolute right-6 top-1/2 -mt-3 w-6 h-6 text-text-primary"
            >
              <PaperPlaneSvg className="w-6 h-6 text-current drop-shadow-md" />
            </motion.div>
          </div>
        )}
        </span>
      </button>
    </div>
  );
}
