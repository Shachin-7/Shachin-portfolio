"use client";

import { useState, useRef, FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUpRight,
  Copy,
  Check,
  Sparkles,
  X,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RevealOnScroll from "@/components/RevealOnScroll";
import SectionBadge from "@/components/SectionBadge";
import FramerSendButton, { SendButtonStatus } from "@/components/FramerSendButton";
import OneWishWillow from "@/components/OneWishWillow";
import { socialLinks } from "@/data/portfolio";
import LiquidMetalButton from "@/components/LiquidMetalButton";

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "shachinvp0506@gmail.com",
    href: "mailto:shachinvp0506@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 6380330342",
    href: "tel:+916380330342",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Dindigul, Tamil Nadu, India",
    href: null,
  },
];

const socials = [
  {
    IconComponent: GithubIcon,
    label: "GitHub",
    href: socialLinks.github,
    username: "@Shachin-7",
  },
  {
    IconComponent: LinkedinIcon,
    label: "LinkedIn",
    href: socialLinks.linkedin,
    username: "Shachin VP",
  },
  {
    IconComponent: ({ size }: { size?: number }) => <Mail size={size || 18} />,
    label: "Gmail",
    href: `mailto:${socialLinks.email}`,
    username: socialLinks.email,
  },
];

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [sendButtonStatus, setSendButtonStatus] = useState<SendButtonStatus>("idle");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasBrokenWillow, setHasBrokenWillow] = useState(false);
  const resetWillowRef = useRef<(() => void) | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("shachinvp0506@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Called when the 3D willow stick is snapped/broken in Two
  const handleWillowBreak = () => {
    setHasBrokenWillow(true);
    // Open the popup modal field smoothly after the snapping animation
    setTimeout(() => {
      setIsModalOpen(true);
    }, 750);
  };

  const handleResetWillow = () => {
    if (resetWillowRef.current) {
      resetWillowRef.current();
    }
    setHasBrokenWillow(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (sendButtonStatus !== "idle") return;

    setSendButtonStatus("pending");

    // Flight & dot animation takes ~1.8s
    setTimeout(() => {
      setSendButtonStatus("success");

      const mailtoUrl = `mailto:shachinvp0506@gmail.com?subject=${encodeURIComponent(
        formData.subject || "Portfolio Contact"
      )}&body=${encodeURIComponent(
        `Hi Shachin,\n\nMy name is ${formData.name}.\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`
      )}`;
      window.open(mailtoUrl, "_blank");

      // Reset button state and clear form after 4 seconds
      setTimeout(() => {
        setSendButtonStatus("idle");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setIsModalOpen(false);
      }, 3500);
    }, 1800);
  };

  return (
    <div className="relative flex w-full flex-col">
      <section className="max-screen">
        <RevealOnScroll>
          <SectionBadge label="Contact" />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            Get in <span className="gradient-text">Touch</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mb-12 leading-relaxed">
            Have a project idea, want to collaborate on ML research, or just
            want to say hi? Feel free to reach out — I&apos;d love to hear from you.
          </p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left: Contact Info & Socials (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <RevealOnScroll delay={0.15}>
              <div className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-4 bg-bg-800 border border-bg-700 rounded-xl hover:border-text-primary/30 transition-all group">
                      <div className="p-2.5 bg-text-primary/10 rounded-lg shrink-0">
                        <Icon size={18} className="text-text-primary" />
                      </div>
                      <div>
                        <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                          {info.label}
                        </p>
                        <p className="text-text-primary text-sm font-medium">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  );

                  return info.href ? (
                    <a key={info.label} href={info.href} className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={info.label}>{content}</div>
                  );
                })}
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <LiquidMetalButton
                type="button"
                onClick={handleCopyEmail}
                ariaLabel="Copy Email Address"
                icon={copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                height={50}
                className="w-full flex justify-center"
              >
                {copied ? "Email Copied!" : "Copy Email Address"}
              </LiquidMetalButton>
            </RevealOnScroll>

            <RevealOnScroll delay={0.25}>
              <h3
                className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4"
                style={{ fontFamily: "var(--font-clash-display), system-ui" }}
              >
                Socials
              </h3>
              <div className="space-y-3">
                {socials.map((social) => {
                  const Icon = social.IconComponent;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-bg-800 border border-bg-700 rounded-xl hover:border-text-primary/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-text-secondary group-hover:text-text-primary transition-colors">
                          <Icon size={18} />
                        </span>
                        <div>
                          <p className="text-sm font-medium">{social.label}</p>
                          <p className="text-text-secondary text-xs">
                            {social.username}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="text-text-secondary group-hover:text-text-primary transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  );
                })}
              </div>
            </RevealOnScroll>
          </div>

          {/* Right: 3D One Wish Willow Interactive Experience (3 cols) */}
          <RevealOnScroll delay={0.2} className="lg:col-span-3">
            <div className="bg-bg-800 border border-bg-700 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col">
              {/* Header Bar of 3D Card */}
              <div className="px-6 py-4 border-b border-bg-700 flex items-center justify-between bg-bg-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                    3D OBJECT // ONE WISH WILLOW
                  </span>
                </div>
                <span className="text-xs text-text-secondary hidden sm:inline-block font-mono">
                  INTERACTIVE WISH RIG
                </span>
              </div>

              {/* 3D Canvas Container */}
              <div className="relative w-full h-[460px] sm:h-[500px] bg-gradient-to-b from-bg-900/30 to-bg-900/80">
                <OneWishWillow
                  onWillowBreak={handleWillowBreak}
                  onResetReady={(resetFn) => {
                    resetWillowRef.current = resetFn;
                  }}
                />
              </div>

              {/* Bottom Control & Action Bar */}
              <div className="px-6 py-4 border-t border-bg-700 bg-bg-900/70 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-text-secondary text-center sm:text-left">
                  {hasBrokenWillow ? (
                    <span className="text-emerald-400 font-medium">
                      ✨ Willow stick broken! Wish granted.
                    </span>
                  ) : (
                    <span>
                      Click the candy box to open, then click the willow stick to break it.
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
                  {hasBrokenWillow && (
                    <LiquidMetalButton
                      type="button"
                      onClick={handleResetWillow}
                      ariaLabel="Reset Stick"
                      icon={<RotateCcw size={14} />}
                      height={46}
                    >
                      Reset Stick
                    </LiquidMetalButton>
                  )}

                  <LiquidMetalButton
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    ariaLabel="Send Message"
                    icon={<MessageSquare size={15} />}
                    height={48}
                  >
                    Send Message
                  </LiquidMetalButton>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── Pop-Up Field / Modal: Send Email Form ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 25 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 25 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="relative w-full max-w-xl bg-bg-900 border border-bg-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative Accent Top Line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-500" />

              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles size={15} />
                    <span>Wish Granted // Send Message</span>
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary"
                    style={{ fontFamily: "var(--font-clash-display), system-ui" }}
                  >
                    Send an <span className="gradient-text">Email</span>
                  </h2>
                  <p className="text-text-secondary text-xs sm:text-sm mt-1">
                    Your wish has been cast! Enter your message below to send directly to Shachin:
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-bg-800 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  aria-label="Close message form"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="popup-name"
                      className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
                    >
                      Your Name
                    </label>
                    <input
                      id="popup-name"
                      type="text"
                      required
                      className="form-input"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      autoFocus
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="popup-email"
                      className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
                    >
                      Your Email
                    </label>
                    <input
                      id="popup-email"
                      type="email"
                      required
                      className="form-input"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="popup-subject"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
                  >
                    Subject
                  </label>
                  <input
                    id="popup-subject"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Project Collaboration / ML Research / Freelance"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label
                    htmlFor="popup-message"
                    className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="popup-message"
                    required
                    className="form-input"
                    placeholder="Tell me about your project or idea..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <div className="pt-2">
                  <FramerSendButton status={sendButtonStatus} type="submit" />
                </div>

                <p className="text-text-secondary text-xs text-center pt-1">
                  This will open your default email client with the message pre-filled.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
