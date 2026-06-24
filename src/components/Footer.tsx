"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaInstagram, FaXTwitter } from "react-icons/fa6";
import { socialLinks } from "@/data/portfolio";

export default function Footer() {
  const pathname = usePathname();
  const isContactPage = pathname === "/contact";

  return (
    <footer className="w-full pb-28 sm:pb-8">
      <div className="max-screen">
        {/* ─── Upper CTA Card (Hidden on Contact page) ─── */}
        {!isContactPage && (
          <div className="w-full bg-bg-800 border border-bg-700 rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center text-center gap-6 mb-12 shadow-sm">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 border border-green-500/20 text-green-500 dark:bg-green-400/10 dark:border-green-400/20 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
              Available for work
            </div>

            {/* Title */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-semibold text-text-primary tracking-tight max-w-2xl leading-tight text-pretty"
              style={{ fontFamily: "var(--font-clash-display), system-ui" }}
            >
              Let&apos;s
              <br />
              Connect
            </h2>

            {/* Contact Button */}
            <Link href="/contact" className="mt-2">
              <button className="px-6 py-2.5 rounded-full border border-bg-600 hover:border-text-primary bg-transparent text-text-primary font-medium transition-all duration-300 cursor-pointer">
                Contact Me
              </button>
            </Link>
          </div>
        )}

        {/* ─── Lower Copyright & Socials Bar ─── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-bg-700">
          <p className="text-text-secondary text-xs sm:text-sm">
            © {new Date().getFullYear()} Shachin VP. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="https://github.com/Shachin-7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors duration-300"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors duration-300"
              aria-label="Instagram"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="mailto:shachinvp0506@gmail.com"
              className="text-text-secondary hover:text-text-primary transition-colors duration-300"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors duration-300"
              aria-label="Twitter"
            >
              <FaXTwitter size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
