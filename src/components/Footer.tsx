"use client";

import React, { useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Layers, Box, ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/data/portfolio";
import BookCallButton from "@/components/BookCallButton";
import HeroTunnel from "@/components/HeroTunnel";

const socialTags = [
  { label: "LINKEDIN", href: socialLinks.linkedin, external: true },
  { label: "GITHUB", href: socialLinks.github, external: true },
  { label: "GMAIL", href: `mailto:${socialLinks.email}`, external: false },
];

export default function Footer() {
  const pathname = usePathname();

  if (pathname === "/projects") {
    return null;
  }

  return <FooterContent />;
}

function FooterContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = Boolean(pathname && (pathname === "/" || pathname === ""));

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25, 1], [0.8, 0.95, 1]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[960px] sm:min-h-[1050px] md:min-h-[1140px] bg-transparent text-neutral-900 overflow-hidden flex flex-col justify-end"
    >
      {/* ── 3D Perspective Wireframe & Image Tunnel Background (White Theme) ── */}
      <HeroTunnel isDarkMode={false} transparent={isHome} className="opacity-90 z-0" />

      <motion.footer
        style={{ opacity }}
        className="relative z-10 w-full min-h-[960px] sm:min-h-[1050px] md:min-h-[1140px] flex flex-col justify-end items-center pt-24 sm:pt-32 pb-8 sm:pb-12"
      >

          {/* ── Center Section: "BEST IN BUSINESS" with Floating Pill Badges ── */}
          <div className="flex flex-col items-center justify-center text-center z-10 select-none max-w-6xl mx-auto px-6 pointer-events-auto relative w-full mb-6 sm:mb-8">
            <div className="relative w-full flex flex-col items-center">
              {/* Floating Pink Pill: Illustration */}
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                className="absolute right-[4%] sm:right-[10%] md:right-[14%] top-0 sm:-top-2 md:-top-4 z-30 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl bg-[#FFE4F3] border-2 border-white shadow-[0_10px_25px_rgba(236,72,153,0.2)] text-[#D91B82] cursor-pointer rotate-[4deg]"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#EC4899] text-white flex items-center justify-center shadow-sm">
                  <Sparkles size={14} className="sm:w-4 sm:h-4" />
                </div>
                <span
                  className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight text-[#C01574]"
                  style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
                >
                  Illustration
                </span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#9D174D] rounded-bl-sm rotate-45 pointer-events-none" />
              </motion.div>

              {/* Floating Purple Pill: 3D Design */}
              <motion.div
                animate={{ y: [0, 8, 0], rotate: [-6, -2, -6] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, rotate: -2 }}
                className="absolute left-[2%] sm:left-[8%] md:left-[12%] top-1/2 -translate-y-1/2 z-30 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl bg-[#EFE5FF] border-2 border-white shadow-[0_10px_25px_rgba(124,58,237,0.2)] text-[#5B21B6] cursor-pointer -rotate-[6deg]"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center shadow-sm">
                  <Box size={14} className="sm:w-4 sm:h-4" />
                </div>
                <span
                  className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight text-[#6D28D9]"
                  style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
                >
                  3D Design
                </span>
                <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#4C1D95] rounded-br-sm rotate-45 pointer-events-none" />
              </motion.div>

              {/* Floating Sky Blue Pill: UI/UX Design */}
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [2, -2, 2] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, rotate: 0 }}
                className="absolute right-[2%] sm:right-[6%] md:right-[10%] bottom-0 sm:bottom-2 md:bottom-4 z-30 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-2xl bg-[#D6F2FE] border-2 border-white shadow-[0_10px_25px_rgba(2,132,199,0.2)] text-[#0284C7] cursor-pointer rotate-[-4deg]"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-sm">
                  <Layers size={14} className="sm:w-4 sm:h-4" />
                </div>
                <span
                  className="font-extrabold text-xs sm:text-sm md:text-base tracking-tight text-[#0369A1]"
                  style={{ fontFamily: "var(--font-cabinet), system-ui, sans-serif" }}
                >
                  UI/UX Design
                </span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#075985] rounded-bl-sm rotate-45 pointer-events-none" />
              </motion.div>

              {/* "BEST IN BUSINESS" in non-bold Poppins */}
              <h2
                className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10.5rem] tracking-tight text-neutral-900 leading-none uppercase drop-shadow-sm select-none"
                style={{
                  fontFamily: "var(--font-poppins), Poppins, sans-serif",
                  fontWeight: 400,
                }}
              >
                BEST IN BUSINESS
              </h2>
            </div>

            {/* Subtitle */}
            <p className="mt-6 sm:mt-8 md:mt-10 text-sm sm:text-base md:text-lg text-neutral-500 font-normal tracking-wide max-w-xl">
              Wanna know the best in business? You are on the right page.
            </p>

            {/* Animated Book a 15-min call button */}
            <div className="mt-8 sm:mt-10">
              <BookCallButton text="Book a 15-min talk" href="/contact" />
            </div>
          </div>

          {/* ── Social Links Centered at Bottom ── */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 md:gap-20 pb-6 sm:pb-10 z-10 px-6 pointer-events-auto">
            {socialTags.map((tag) => (
              <a
                key={tag.label}
                href={tag.href}
                target={tag.external ? "_blank" : undefined}
                rel={tag.external ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-light tracking-widest text-neutral-700 hover:text-black transition-colors duration-200"
              >
                <span className="font-mono">{tag.label}</span>
                <ArrowUpRight
                  size={22}
                  className="text-neutral-500 group-hover:text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-200 stroke-[1.75]"
                />
              </a>
            ))}
          </div>
        </motion.footer>
    </div>
  );
}
