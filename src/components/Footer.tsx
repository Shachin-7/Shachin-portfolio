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

  // Curved reveal transformation (Screenshot 3 style)
  const clipCurve = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [
      "ellipse(140% 60% at 50% 100%)",
      "ellipse(150% 85% at 50% 100%)",
      "ellipse(200% 100% at 50% 100%)",
    ]
  );

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

        {/* ── Center Visual Hero Composition ── */}
        <div className="relative w-full my-auto flex flex-col items-center justify-center min-h-[460px] sm:min-h-[540px]">
          {/* 1. Red Brush Graffiti Text ("SHACHIN") from public/SHA.png */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[65%] w-[92%] max-w-5xl h-[220px] sm:h-[320px] md:h-[400px] pointer-events-none z-0">
            <Image
              src="/SHA.png"
              alt="SHACHIN"
              fill
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          {/* 2. Shachin Portrait Cutout in Black Suit */}
          <div className="relative z-10 w-[240px] sm:w-[320px] md:w-[380px] h-[320px] sm:h-[420px] md:h-[480px] flex items-center justify-center my-4">
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-neutral-300/60 bg-neutral-900">
              <Image
                src="/profile.jpeg"
                alt="Shachin VP"
                fill
                className="object-cover object-top"
              />
              {/* Overlay pixel text on suit */}
              <div className="absolute bottom-12 inset-x-0 flex flex-col items-center justify-center text-center z-20 pointer-events-none px-2">
                <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-[0.18em] uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-tight">
                  SOFTWARE
                </span>
                <span className="font-mono text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-[0.18em] uppercase drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] leading-tight">
                  DEVELOPER
                </span>
              </div>
            </div>
          </div>

          {/* 3. Left Sticker Badge: "let's make great work together" */}
          <div className="absolute left-2 sm:left-6 md:left-12 bottom-6 sm:bottom-12 z-20 max-w-[210px] sm:max-w-[270px]">
            <div className="relative bg-[#1A191C] text-white p-5 sm:p-7 rounded-[32px] shadow-2xl border border-neutral-700/50 transform -rotate-2 hover:rotate-0 transition-transform duration-300">
              <h3
                className="text-2xl sm:text-3xl font-extrabold text-white leading-[1.05] tracking-tight mb-3"
                style={{ fontFamily: "var(--font-clash-display), system-ui" }}
              >
                let&apos;s make<br />
                great work<br />
                together
              </h3>

              <Link href="/contact">
                <button className="absolute -bottom-3 -right-3 bg-[#FACC15] hover:bg-[#EAB308] text-neutral-950 font-semibold text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-all cursor-pointer">
                  Get in touch
                </button>
              </Link>
            </div>
          </div>

          {/* 4. Right Laptop Device Mockup */}
          <div className="hidden lg:block absolute right-6 md:right-12 bottom-12 z-20 w-[260px] xl:w-[310px]">
            <div className="bg-neutral-900 border-4 border-neutral-700 rounded-2xl p-2.5 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300">
              {/* Laptop screen header */}
              <div className="flex items-center gap-1.5 mb-2 px-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              {/* Laptop screen content preview */}
              <div className="bg-white rounded-lg p-3 text-neutral-900 text-left border border-neutral-200">
                <div className="flex items-center justify-between text-[8px] font-bold text-neutral-400 mb-2">
                  <span>SHA</span>
                  <span>Home About Projects</span>
                </div>
                <p className="text-[10px] font-semibold leading-tight text-neutral-900 mb-2">
                  Building <span className="text-green-600 font-bold">intelligent systems</span> that learn, predict &amp; transform.
                </p>
                <div className="w-full h-12 bg-neutral-100 rounded border border-neutral-200 flex items-center justify-center text-[9px] text-neutral-400">
                  Interactive Preview
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar: Copyright & Social Links Floating Card ── */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-300/80 z-20">
          <p className="text-neutral-600 text-xs font-medium">
            © {new Date().getFullYear()} Shachin VP. All rights reserved.
          </p>

          {/* Social Icons Card (Screenshot 1 bottom right bar) */}
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
