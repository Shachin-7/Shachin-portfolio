"use client";

import React, { RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AboutScrollLineProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * ScrollLineDraw component for About page.
 * Draws a single, minimal, elegant green stroke starting from the green dot
 * inside the "LET'S TALK" badge down through the About section content as the user scrolls.
 */
export default function AboutScrollLine({ containerRef }: AboutScrollLineProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end 0.95"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.92], [0, 1]);
  const strokeDashoffset = useTransform(pathLength, (v) => 1 - v);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
      viewBox="0 0 1000 3200"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <motion.path
        d="M 865,185 C 920,380 840,550 780,720 C 720,890 860,1050 820,1220 C 780,1390 250,1520 180,1700 C 120,1880 820,2050 840,2250 C 860,2450 720,2650 780,2850 C 820,2980 850,3080 850,3150"
        stroke="#22c55e"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        style={{
          pathLength,
          strokeDashoffset,
        }}
      />
    </svg>
  );
}
