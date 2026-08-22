"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LetsMakeGreatWorkTogether() {
  return (
    <section className="w-full bg-white text-neutral-950 py-20 sm:py-28 md:py-36 px-6 sm:px-12 md:px-20 overflow-hidden border-t border-b border-neutral-200">
      <div className="max-w-7xl mx-auto flex flex-col items-start justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative text-left"
        >
          <h2 className="font-cabinet text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-extrabold tracking-tighter leading-[0.9] text-neutral-950 select-none uppercase">
            let&apos;s make <br />
            <span className="inline-flex items-center flex-wrap gap-4 sm:gap-8">
              great work
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-[#FACC15] hover:bg-[#EAB308] text-neutral-950 font-sans font-bold text-sm sm:text-base md:text-lg px-6 py-3 sm:px-8 sm:py-4 rounded-full shadow-lg transition-transform cursor-pointer tracking-normal normal-case align-middle my-2"
                >
                  Get in touch
                </motion.button>
              </Link>
            </span> <br />
            together
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
