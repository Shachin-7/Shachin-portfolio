"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { socialLinks } from "@/data/portfolio";

export default function Footer() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.4, 0.9, 1]);

  if (pathname === "/projects") {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black text-neutral-900 pt-16"
    >
      {/* ─── Top Curved Transition Divider (Screenshot 3 / Poppr.be style) ─── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg
          className="relative block w-full h-12 sm:h-20 md:h-28 text-bg-900"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,90 900,90 1200,0 L1200,0 L0,0 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ─── Main Graphic Footer Container ─── */}
      <motion.footer
        style={{
          scale,
          opacity,
        }}
        className="relative w-full min-h-screen bg-[#ECEBE6] text-neutral-900 flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-hidden rounded-t-[40px] sm:rounded-t-[60px]"
      >
        {/* ── Top Header Row ── */}
        <div className="w-full flex items-center justify-between z-10 pt-4">
          <p className="text-center w-full font-mono text-[11px] sm:text-xs tracking-[0.25em] font-semibold text-neutral-600 uppercase">
            WANNA KNOW THE BEST IN BUSINESS?
          </p>
          <span className="font-mono text-sm font-bold text-neutral-400 absolute right-6 sm:right-12">
            01
          </span>
        </div>

        {/* ── Centerpiece Visual: SHA.png + Clean Overlay ── */}
        <div className="relative w-full my-auto flex flex-col items-center justify-center min-h-[460px] sm:min-h-[560px] md:min-h-[640px] px-2 sm:px-6">
          {/* 1. Full-Width Fixed SHA.png Graffiti Image */}
          <div className="relative w-full max-w-7xl h-[260px] sm:h-[420px] md:h-[540px] flex items-center justify-center z-0">
            <Image
              src="/SHA.png"
              alt="SHACHIN"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* 2. Text Overlay: "let's make great work together" in BLACK font with NO background + Yellow Button */}
          <div className="absolute left-4 sm:left-10 md:left-16 bottom-6 sm:bottom-12 z-20 flex flex-col items-start gap-4 max-w-xs sm:max-w-md">
            <h3
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-950 leading-[1.05] tracking-tight"
              style={{ fontFamily: "var(--font-clash-display), system-ui" }}
            >
              let&apos;s make<br />
              great work<br />
              together
            </h3>

            <Link href="/contact">
              <button className="bg-[#FACC15] hover:bg-[#EAB308] text-neutral-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer">
                Get in touch
              </button>
            </Link>
          </div>
        </div>

        {/* ── Bottom Bar: Copyright & Social Links Floating Card ── */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-300/80 z-20">
          <p className="text-neutral-600 text-xs font-medium">
            © {new Date().getFullYear()} Shachin VP. All rights reserved.
          </p>

          {/* Social Icons Card */}
          <div className="bg-white px-5 py-2.5 rounded-full shadow-lg border border-neutral-200 flex items-center gap-5">
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-700 hover:text-black transition-transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={17} />
            </a>
            <a
              href="https://github.com/Shachin-7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-700 hover:text-black transition-transform hover:scale-110"
              aria-label="GitHub"
            >
              <FaGithub size={17} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-700 hover:text-black transition-transform hover:scale-110"
              aria-label="Instagram"
            >
              <FaInstagram size={17} />
            </a>
            <a
              href="mailto:shachinvp0506@gmail.com"
              className="text-neutral-700 hover:text-black transition-transform hover:scale-110"
              aria-label="Email"
            >
              <Mail size={17} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-700 hover:text-black transition-transform hover:scale-110"
              aria-label="Twitter"
            >
              <FaXTwitter size={17} />
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
