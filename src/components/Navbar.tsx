"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Smile, LayoutDashboard, Send, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { socialLinks } from "@/data/portfolio";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Smile },
  { href: "/projects", label: "Projects", icon: LayoutDashboard },
  { href: "/contact", label: "Contact", icon: Send },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <header
        className="pointer-events-none sticky top-0 right-0 left-0 z-50 w-full transition-all duration-500 ease-out"
        style={{
          padding: scrolled ? "0.5rem 1rem" : "0.75rem 0",
        }}
      >
        <nav
          className="pointer-events-auto mx-auto flex items-center justify-between gap-6 transition-all duration-500 ease-out"
          style={{
            maxWidth: scrolled ? "720px" : "1280px",
            borderRadius: scrolled ? "9999px" : "0",
            padding: scrolled ? "0.5rem 1.5rem" : "0.5rem 1.5rem",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
            backgroundColor: scrolled
              ? "color-mix(in srgb, var(--bg-900) 40%, transparent)"
              : "transparent",
            border: scrolled
              ? "1px solid color-mix(in srgb, var(--text-primary) 8%, transparent)"
              : "1px solid transparent",
            boxShadow: scrolled
              ? "0 4px 30px rgba(0, 0, 0, 0.1)"
              : "none",
          }}
        >
          <Link
            href="/"
            className="text-2xl font-semibold sm:text-xl tracking-tight text-text-primary"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            <span>SHA</span>
          </Link>

          <ul className="text-text-secondary hidden gap-8 text-sm sm:flex">
            {navItems.map((item) => (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`nav-link flex items-center gap-1.5 ${
                    pathname === item.href ? "text-highlight" : ""
                  }`}
                >
                  {pathname === item.href && (
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full bg-highlight"
                      style={{ flexShrink: 0 }}
                    />
                  )}
                  <span className="nav-link-text">
                    <span className="default">{item.label}</span>
                    <span className="hover">{item.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden sm:flex items-center gap-3">
            <a
              href={socialLinks.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded-full hover:bg-black/90 transition-all duration-300 shadow-sm flex items-center gap-1.5"
            >
              <FileText size={14} />
              <span>Resume</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav flex sm:hidden">
        <ul className="flex w-full justify-evenly">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="p-3">
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                    isActive ? "text-highlight" : "text-text-secondary"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs">{item.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="p-3">
            <a
              href={socialLinks.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1 text-text-secondary hover:text-highlight transition-colors"
            >
              <FileText size={18} />
              <span className="text-xs">Resume</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
