"use client";

import React, { RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AboutScrollLineProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

/**
 * ScrollLineDraw component for About page.
 * Uses exact Skiper19 color (#C2F84F) and bold stroke width (14px),
 * originating directly from the center of the green dot in the "LET'S TALK" badge.
 */
export default function AboutScrollLine({ containerRef }: AboutScrollLineProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const strokeDashoffset = useTransform(pathLength, (value) => 1 - value);

  return (
    <svg
      width="1278"
      height="3200"
      viewBox="0 0 1278 3200"
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
      aria-hidden="true"
    >
      <motion.path
        d="M 915 235 C 980 460 880 640 820 840 C 760 1040 920 1220 860 1440 C 790 1660 260 1800 200 2000 C 140 2200 880 2420 850 2680 C 820 2920 880 3080 850 3200"
        stroke="#C2F84F"
        strokeWidth="14"
        strokeLinecap="round"
        style={{
          pathLength,
          strokeDashoffset,
        }}
      />
    </svg>
  );
}
