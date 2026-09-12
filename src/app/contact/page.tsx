"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, MessageSquare, X, Send } from "lucide-react";
import BlockGame from "@/components/BlockGame";
import TextArrowCTA from "@/components/TextArrowCTA";
import LiquidMetalButton from "@/components/LiquidMetalButton";
import WarpText from "@/components/WarpText";
import DinoGame from "@/components/DinoGame";
import DotField from "@/components/DotField";
import { socialLinks } from "@/data/portfolio";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSent, setIsSent] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("shachinvp0506@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setIsModalOpen(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 2000);
  };

  // Ensure contact page never has any window or body scrolling
  useEffect(() => {
    window.scrollTo(0, 0);
    const origHtmlOverflow = document.documentElement.style.overflow;
    const origBodyOverflow = document.body.style.overflow;
    const origHtmlHeight = document.documentElement.style.height;
    const origBodyHeight = document.body.style.height;
    const origHtmlOverscroll = document.documentElement.style.overscrollBehavior;
    const origBodyOverscroll = document.body.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.height = "100vh";
    document.documentElement.style.maxHeight = "100vh";
    document.documentElement.style.overscrollBehavior = "none";

    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    document.body.style.maxHeight = "100vh";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.documentElement.style.overflow = origHtmlOverflow;
      document.documentElement.style.height = origHtmlHeight;
      document.documentElement.style.maxHeight = "";
      document.documentElement.style.overscrollBehavior = origHtmlOverscroll;

      document.body.style.overflow = origBodyOverflow;
      document.body.style.height = origBodyHeight;
      document.body.style.maxHeight = "";
      document.body.style.overscrollBehavior = origBodyOverscroll;
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-84px)] max-h-[calc(100vh-84px)] overflow-hidden bg-white text-gray-900 select-none flex flex-col justify-start">
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          overflow: hidden !important;
          height: 100vh !important;
          max-height: 100vh !important;
          overscroll-behavior: none !important;
        }
      `}} />

      {/* Interactive Dot Field Background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={false}
          waveAmplitude={0}
          cursorRadius={500}
          cursorForce={0.1}
          bulgeOnly
          gradientFrom="#000000"
          gradientTo="#000000"
          glowColor="rgba(0, 0, 0, 0.04)"
        />
      </div>

      <div className="relative w-full max-w-[1320px] mx-auto px-4 sm:px-6 pt-4 sm:pt-5 pb-1 flex flex-col justify-start z-10">

        {/* 1. GIANT WORDMARK: Zen Dots font with WarpText WebGL animation (Increased size) */}
        <div className="relative w-full z-0 overflow-hidden">
          <WarpText
            text="SHACHIN"
            color="#FFDE5A"
            warpStrength={0.08}
            warpScale={1.7}
            speed={0.55}
            pointerInfluence={0.42}
            pointerStrength={0.38}
            refraction={0}
            ripple
            fontSize={200}
            fontWeight={900}
            style={{ height: "196px" }}
            fontFamily="'Zen Dots', sans-serif"
            letterSpacing={-0.03}
            lineHeight={0.9}
          />
        </div>

        {/* 2. CENTER PIXEL CHARACTER & SEND MESSAGE BUTTON (Scaled up & overlapping ON TOP OF SHACHIN) */}
        <div className="absolute top-[32px] sm:top-[36px] left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/shachin-character.png"
            alt="Shachin"
            className="max-h-[490px] sm:max-h-[510px] max-w-[325px] sm:max-w-[350px] w-auto h-auto object-contain drop-shadow-2xl pointer-events-none select-none"
          />

          {/* Send Message Button: Bottom Centre directly below the pixel */}
          <div className="mt-2.5 pointer-events-auto z-40">
            <LiquidMetalButton
              onClick={() => setIsModalOpen(true)}
              ariaLabel="Send Message"
              icon={<MessageSquare size={16} />}
              height={46}
            >
              Send Message
            </LiquidMetalButton>
          </div>
        </div>

        {/* 3. FLANKING CONTENT: Below SHACHIN accordingly without overlaying anything */}
        <div className="relative z-10 flex justify-center items-start w-full mt-2 sm:mt-2.5 pointer-events-none">

          {/* LEFT COLUMN: Below 'SHA' without overlaying */}
          <div className="w-[380px] sm:w-[410px] flex flex-col gap-3.5 pointer-events-auto shrink-0">
            {/* Social Links below 'SHA' */}
            <div className="flex items-center gap-7 font-mono text-gray-500 tracking-widest text-sm uppercase pl-0.5">
              <TextArrowCTA
                text="LINKEDIN"
                href={socialLinks.linkedin}
                fontSize={16}
                fontColor="#4B5563"
                bottomLineColor="#111827"
                iconColor="#4B5563"
              />
              <TextArrowCTA
                text="GITHUB"
                href={socialLinks.github}
                fontSize={16}
                fontColor="#4B5563"
                bottomLineColor="#111827"
                iconColor="#4B5563"
              />
            </div>

            {/* Copy Email Address Button below 'SHA' */}
            <div className="w-fit">
              <LiquidMetalButton
                onClick={handleCopyEmail}
                ariaLabel="Copy Email Address"
                icon={
                  copied ? (
                    <Check size={16} className="text-emerald-400" />
                  ) : (
                    <Copy size={16} />
                  )
                }
                height={45}
              >
                {copied ? "Email Copied!" : "Copy Email Address"}
              </LiquidMetalButton>
            </div>

            {/* Let's build something MEANINGFUL AND MEMORABLE */}
            <div className="w-full max-w-[410px] mt-5 sm:mt-6">
              <div
                className="relative rounded-3xl p-5 sm:p-6 overflow-hidden shadow-sm w-full"
                style={{
                  backgroundColor: "#FDE661",
                  backgroundImage:
                    "radial-gradient(rgba(0, 0, 0, 0.16) 1.5px, transparent 1.5px)",
                  backgroundSize: "14px 14px",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                }}
              >
                <p className="text-gray-900 text-[15px] sm:text-[16px] font-normal mb-1 font-sans">
                  Let&apos;s build something
                </p>
                <h3
                  className="text-gray-950 font-black text-2xl sm:text-[27px] md:text-[29px] leading-[1.06] tracking-tight uppercase"
                  style={{
                    fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                  }}
                >
                  MEANINGFUL
                  <br />
                  AND MEMORABLE
                </h3>
              </div>
            </div>
          </div>

          {/* Center Spacer for Pixel Character & Send Message Button */}
          <div className="w-[270px] sm:w-[290px] pointer-events-none shrink-0" aria-hidden="true" />

          {/* RIGHT COLUMN: Below 'HI' in SHACHIN */}
          <div className="w-[320px] sm:w-[335px] flex flex-col items-start gap-2 pointer-events-auto shrink-0">
            {/* Get in Touch: Aligned under 'HI' */}
            <div>
              <h2
                className="text-4xl sm:text-[44px] md:text-[46px] font-extrabold tracking-tight text-gray-950 leading-none mb-3"
                style={{
                  fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                }}
              >
                Get in <span className="text-[#10b981]">Touch</span>
              </h2>

              {/* If you are bored try this below Get in Touch with clear breathing space */}
              <p
                className="text-gray-950 uppercase"
                style={{
                  fontFamily: "'HK Modular', monospace, sans-serif",
                  fontSize: "13.5px",
                  lineHeight: 1.25,
                  letterSpacing: "0.03em",
                }}
              >
                If you are bored
                <br />
                try this :
              </p>
            </div>

            {/* Block Game Widget */}
            <div className="w-full">
              <BlockGame
                backgroundColor="#FFFFFF"
                headerBackgroundColor="#F5EFEB"
                cellSize={9.8}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. CHROME DINO RUNNER: Spans from start of the page in left till the end of right side */}
      <div className="absolute bottom-0 left-0 right-0 w-full z-10 pointer-events-auto">
        <DinoGame height={115} />
      </div>

      {/* ================= MESSAGE MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-gray-200 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <h2
                className="text-2xl font-bold text-gray-900 mb-1"
                style={{
                  fontFamily: "var(--font-cabinet), system-ui, sans-serif",
                }}
              >
                Send a Message
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Have a project in mind or want to collaborate? Leave a message below.
              </p>

              {isSent ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Message Sent!
                  </h3>
                  <p className="text-sm text-gray-500">
                    Thanks for reaching out! I&apos;ll get back to you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Collaboration / Project Inquiry"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell me about your project or inquiry..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <a
                      href={`mailto:${socialLinks.email}`}
                      className="text-xs text-gray-500 hover:text-gray-900 underline"
                    >
                      Or email directly
                    </a>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium rounded-lg shadow transition-all cursor-pointer"
                    >
                      <span>Send</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}