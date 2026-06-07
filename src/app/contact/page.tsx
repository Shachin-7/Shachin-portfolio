"use client";

import { useState, FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  ArrowUpRight,
  Copy,
  Check,
} from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import SectionBadge from "@/components/SectionBadge";
import { socialLinks } from "@/data/portfolio";

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:shachinvp0506@gmail.com?subject=${encodeURIComponent(
      formData.subject || "Portfolio Contact"
    )}&body=${encodeURIComponent(
      `Hi Shachin,\n\nMy name is ${formData.name}.\n\n${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`
    )}`;
    window.open(mailtoUrl, "_blank");
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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Contact Info */}
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
              <button
                onClick={handleCopyEmail}
                className="w-full flex items-center justify-center gap-2 p-3 bg-bg-800 border border-bg-700 rounded-xl text-sm text-text-secondary hover:border-text-primary/30 hover:text-text-primary transition-all"
              >
                {copied ? (
                  <>
                    <Check size={16} className="text-green-400" />
                    <span className="text-green-400">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    <span>Copy Email Address</span>
                  </>
                )}
              </button>
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

          {/* Right: Contact Form */}
          <RevealOnScroll delay={0.2} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-text-secondary mb-2">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-text-secondary mb-2">
                    Your Email
                  </label>
                  <input
                    id="email"
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
                <label htmlFor="subject" className="block text-sm text-text-secondary mb-2">
                  Subject
                </label>
                <input
                  id="subject"
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
                <label htmlFor="message" className="block text-sm text-text-secondary mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  className="form-input"
                  placeholder="Tell me about your project or idea..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center text-base py-3.5">
                <Send size={18} />
                <span>Send Message</span>
              </button>

              <p className="text-text-secondary text-xs text-center">
                This will open your default email client with the message pre-filled.
              </p>
            </form>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
