"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface TextArrowCTAProps {
  text: string;
  href: string;
  fontSize?: number;
  fontColor?: string;
  bottomLineColor?: string;
  iconColor?: string;
  iconWidth?: number;
  className?: string;
  openInNewTab?: boolean;
}

const springTransition1 = {
  type: "spring" as const,
  duration: 0.6,
  bounce: 0.3,
};

const springTransition2 = {
  type: "spring" as const,
  duration: 0.6,
  bounce: 0.3,
  delay: 0.1,
};

export default function TextArrowCTA({
  text,
  href,
  fontSize = 17,
  fontColor = "#4B5563",
  bottomLineColor = "#111827",
  iconColor = "#4B5563",
  iconWidth = 2,
  className = "",
  openInNewTab = true,
}: TextArrowCTAProps) {
  const [isHovered, setIsHovered] = useState(false);
  const iconSize = Math.round(fontSize * 1.05);

  return (
    <a
      href={href}
      target={openInNewTab ? "_blank" : undefined}
      rel={openInNewTab ? "noopener noreferrer" : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative inline-flex flex-col items-start justify-center cursor-pointer select-none group no-underline ${className}`}
      style={{ width: "fit-content" }}
    >
      {/* Top Label & Animated Arrows */}
      <div className="relative flex items-center gap-1.5 overflow-visible py-0.5">
        {/* Left Arrow (Hidden by default, scales & rotates in on hover) */}
        <motion.div
          animate={
            isHovered
              ? { opacity: 1, rotate: 0, scale: 1, x: 0 }
              : { opacity: 0, rotate: -90, scale: 0, x: -6 }
          }
          transition={isHovered ? springTransition1 : springTransition2}
          className="flex items-center justify-center -ml-1"
          style={{ originX: 0.5, originY: 0.5 }}
        >
          <ArrowUpRight
            size={iconSize}
            color={iconColor}
            strokeWidth={iconWidth}
          />
        </motion.div>

        {/* Text */}
        <motion.span
          animate={{
            x: isHovered ? 2 : 0,
            color: isHovered ? "#111827" : fontColor,
          }}
          transition={springTransition1}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily: "monospace",
            fontWeight: 500,
            letterSpacing: "0.16em",
            lineHeight: 1.2,
            textTransform: "uppercase",
          }}
          className="whitespace-nowrap"
        >
          {text}
        </motion.span>

        {/* Right Arrow (Visible by default, scales & rotates out on hover) */}
        <motion.div
          animate={
            isHovered
              ? { opacity: 0, rotate: -90, scale: 0, x: 6 }
              : { opacity: 1, rotate: 0, scale: 1, x: 0 }
          }
          transition={isHovered ? springTransition2 : springTransition1}
          className="flex items-center justify-center"
          style={{ originX: 0.5, originY: 0.5 }}
        >
          <ArrowUpRight
            size={iconSize}
            color={iconColor}
            strokeWidth={iconWidth}
          />
        </motion.div>
      </div>

      {/* Animated Bottom Line (sweeps in on hover) */}
      <div className="relative w-full h-[1.5px] overflow-hidden mt-0.5">
        <motion.div
          animate={{
            width: isHovered ? "100%" : "0%",
            opacity: isHovered ? 1 : 0,
          }}
          transition={isHovered ? springTransition1 : springTransition2}
          style={{
            backgroundColor: bottomLineColor,
            height: "1.5px",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
      </div>
    </a>
  );
}
