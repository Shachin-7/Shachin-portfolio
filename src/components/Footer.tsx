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

  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.4, 0.9, 1]);

  if (pathname === "/projects") {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-black text-neutral-900 pt-12"
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
        className="relative w-full bg-[#ECEBE6] text-neutral-900 flex flex-col justify-between overflow-hidden rounded-t-[40px] sm:rounded-t-[60px]"
      >
        {/* Full Web Graphic Banner using /3.png */}
        <div className="relative w-full min-h-[480px] sm:min-h-[620px] md:min-h-[720px] lg:min-h-[820px] flex items-center justify-center">
          <Image
            src="/3.png"
            alt="Shachin VP Footer Banner"
            fill
            className="object-cover md:object-contain object-center"
            priority
          />

          {/* Interactive "Get in touch" Button positioned over left text area */}
          <div className="absolute bottom-[22%] left-[6%] sm:left-[8%] md:left-[10%] z-20">
            <Link href="/contact">
              <button className="bg-[#FACC15] hover:bg-[#EAB308] text-neutral-950 font-bold text-xs sm:text-sm md:text-base px-6 py-2.5 sm:px-8 sm:py-3 rounded-full shadow-xl hover:scale-105 transition-all cursor-pointer">
                Get in touch
              </button>
            </Link>
          </div>

          {/* Bottom Bar: Copyright & Social Icons Overlay directly on the image */}
          <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 md:inset-x-12 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
            <p className="text-neutral-700 text-xs sm:text-sm font-semibold drop-shadow-sm bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/40">
              © {new Date().getFullYear()} Shachin VP. All rights reserved.
            </p>

            {/* Social Icons Card */}
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
        </div>
      </motion.footer>
    </div>
  );
}
