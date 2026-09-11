"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowLeft, Home, User, Folder, Mail } from "lucide-react";

interface FramerNavMenuProps {
  className?: string;
}

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "About", href: "/about", icon: User },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function FramerNavMenu({ className = "" }: FramerNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`fixed top-6 right-6 z-[100] select-none ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        {!isOpen ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, scale: 0.9, x: 15 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.88, x: 15 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => setIsOpen(true)}
            onMouseEnter={() => setIsOpen(true)}
          >
            <motion.div
              whileHover={{ scale: 1.04, backgroundColor: "#f8f8f8" }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="bg-white text-neutral-900 font-semibold text-sm px-6 py-2.5 rounded-full shadow-2xl flex items-center justify-center border border-black/5"
            >
              Menu
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.08, rotate: 15, backgroundColor: "#f8f8f8" }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="w-10 h-10 bg-white text-neutral-900 rounded-full shadow-2xl flex items-center justify-center border border-black/5"
            >
              <ArrowRight size={17} className="stroke-[2.5]" />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 20 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
            onMouseLeave={() => setIsOpen(false)}
            className="bg-white text-neutral-900 rounded-full p-1.5 shadow-2xl flex items-center gap-2 border border-black/5"
          >
            {/* Back Button Circle (←) */}
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#e5e5e5" }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-900 flex items-center justify-center transition-colors shrink-0"
              aria-label="Close menu"
            >
              <ArrowLeft size={16} className="stroke-[2.5]" />
            </motion.button>

            {/* Menu Links */}
            <div className="flex items-center gap-1 pr-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer ${
                        isActive
                          ? "text-black font-semibold"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="menuActivePill"
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.45,
                          }}
                          className="absolute inset-0 bg-neutral-100 rounded-full z-0 border border-neutral-200/50"
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Icon
                          size={15}
                          className={
                            isActive ? "text-neutral-900" : "text-neutral-400"
                          }
                        />
                        {item.name}
                      </span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
