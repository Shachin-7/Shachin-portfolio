"use client";

import React, { RefObject, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface AboutScrollLineProps {
  containerRef: RefObject<HTMLDivElement | null>;
  dotRef: RefObject<HTMLDivElement | null>;
}

/**
 * SVG scroll progress path connecting journey milestone nodes on the About page.
 */
export default function AboutScrollLine({
  containerRef,
  dotRef,
}: AboutScrollLineProps) {
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const [containerSize, setContainerSize] = useState<{
    width: number;
    height: number;
  }>({ width: 1200, height: 3500 });

  useEffect(() => {
    const updateCoords = () => {
      if (!containerRef.current || !dotRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const dotRect = dotRef.current.getBoundingClientRect();

      const x = dotRect.left + dotRect.width / 2 - containerRect.left;
      const y = dotRect.top + dotRect.height / 2 - containerRect.top;

      setStartPos({ x, y });
      setContainerSize({
        width: containerRect.width,
        height: containerRect.height,
      });
    };

    updateCoords();
    const timer = setTimeout(updateCoords, 100);
    window.addEventListener("resize", updateCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateCoords);
    };
  }, [containerRef, dotRef]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const strokeDashoffset = useTransform(pathLength, (value) => 1 - value);

  if (!startPos) return null;

  const { x: sx, y: sy } = startPos;
  const { width: W, height: H } = containerSize;

  // Build dramatic wide sweeping curves starting EXACTLY from (sx, sy)
  // down behind the footer
  const pathData = `
    M ${sx} ${sy}
    C ${sx + 80} ${sy + 220}, ${W * 0.1} ${sy + 450}, ${W * 0.18} ${sy + 750}
    C ${W * 0.25} ${sy + 1050}, ${W * 0.9} ${sy + 1350}, ${W * 0.82} ${sy + 1650}
    C ${W * 0.74} ${sy + 1950}, ${W * 0.08} ${sy + 2250}, ${W * 0.28} ${sy + 2550}
    C ${W * 0.48} ${sy + 2850}, ${W * 0.88} ${sy + 3100}, ${W * 0.7} ${H + 80}
  `.replace(/\s+/g, " ");

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      fill="none"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible"
      aria-hidden="true"
    >
      <motion.path
        d={pathData}
        stroke="#C2F84F"
        strokeWidth="16"
        strokeLinecap="round"
        style={{
          pathLength,
          strokeDashoffset,
        }}
      />
    </svg>
  );
}
