"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { socialLinks } from "@/data/portfolio";

/**
 * Application footer component rendering social links and bottom navigation.
 */
export default function Footer() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Animated SVG path morphing for the curved scroll reveal effect
  const curveHeight = useTransform(scrollYProgress, [0, 0.8, 1], [110, 35, 0]);

  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.5, 0.9, 1]);

  if (pathname === "/projects") {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#ECEBE6] text-neutral-900"
    >
      {/* ─── Animated Top Curved Reveal Divider ─── */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg
          className="relative block w-full h-16 sm:h-24 md:h-32 text-bg-900"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <motion.path
            d={useTransform(
              curveHeight,
              (h) => `M0,0 C300,${h} 900,${h} 1200,0 L1200,0 L0,0 Z`
            )}
            fill="currentColor"
          />
        </svg>
      </div>

      {/* ─── Main Graphic Footer Container matching 3.png background ─── */}
      <motion.footer
        style={{
          scale,
          opacity,
        }}
        className="relative w-full bg-[#ECEBE6] text-neutral-900 flex flex-col justify-between overflow-hidden"
      >
        {/* Full Web Graphic Banner using /SHA-2.png */}
        <div className="relative w-full min-h-[480px] sm:min-h-[620px] md:min-h-[720px] lg:min-h-[820px] flex items-center justify-center">
          <Image
            src="/SHA-2.png"
            alt="Shachin VP Footer Banner"
            fill
            className="object-cover md:object-contain object-center"
            priority
          />

          {/* Interactive "Get in touch" Button positioned over left text area */}
          <div className="absolute bottom-[22%] left-[6%] sm:left-[8%] md:left-[10%] z-20">
            <Link href="/contact">
              <button className="btn-outline btn-red">
                <span>Get in touch</span>
              </button>
            </Link>
          </div>

          {/* Social Icons Card positioned directly below the 3D computer graphic */}
          <div className="absolute bottom-[10%] sm:bottom-[12%] md:bottom-[14%] lg:bottom-[16%] right-[6%] sm:right-[10%] md:right-[14%] lg:right-[18%] z-20">
            <div className="bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-neutral-200 flex items-center gap-5">
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
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-700 hover:text-black transition-transform hover:scale-110"
                aria-label="GitHub"
              >
                <FaGithub size={17} />
              </a>
              <a
                href={`mailto:${socialLinks.email}`}
                className="text-neutral-700 hover:text-black transition-transform hover:scale-110"
                aria-label="Email"
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Bottom Bar: Copyright */}
          <div className="absolute bottom-4 left-4 sm:left-8 md:left-12 z-20">
            <p className="text-neutral-700 text-xs sm:text-sm font-semibold drop-shadow-sm bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/40">
              © {new Date().getFullYear()} Shachin VP. All rights reserved.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
