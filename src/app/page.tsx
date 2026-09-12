"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import {
  Trophy, Briefcase, Award, Code2,
  FileText,
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import { experiences, socialLinks } from "@/data/portfolio";
import LogoLoop from "@/components/LogoLoop";
import { techLogos } from "@/data/techLogos";
import ClotheslineGallery from "@/components/ClotheslineGallery";
import AnimatedPath from "@/components/AnimatedPath";
import LiquidMetalButton from "@/components/LiquidMetalButton";
import ParallaxSocialFAB from "@/components/ParallaxSocialFAB";

/* ─── Blur-in wrapper ─── */
function Fade({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Static Data ─── */

const communityCards = [
  {
    icon: Trophy,
    title: "5x Hackathon Champion",
    description: "1st Place Winner at BIT Hackathon (Rs.50,000) & multi-time podium finisher across top engineering institutions.",
  },
  {
    icon: Briefcase,
    title: "US Corporate Client Developer",
    description: "Engineered & deployed multi-page corporate web application and NLP automation pipeline for US industrial sourcing firm.",
  },
  {
    icon: Award,
    title: "Executive Freelance Engineer",
    description: "Architected custom high-impact web applications for ABB Company Director and Senior Business Analysts.",
  },
  {
    icon: Code2,
    title: "Hybrid AI Architect",
    description: "Engineered multi-model framework (LSTM + Transformer + GAN) achieving 85%+ accuracy & 35% error reduction.",
  },
];

/* ─── Page ─── */
export default function HomePage() {
  return (
    <div className="relative flex w-full flex-col bg-transparent text-[#111827]">

      {/* ═══════════════ HERO SECTION (Matches Reference Image Exactly) ═══════════════ */}
      <section className="relative z-10 w-full min-h-[calc(100vh-86px)] flex flex-col justify-between pt-4 sm:pt-6 md:pt-8 pb-10 sm:pb-12 px-6 sm:px-10 lg:px-16 max-w-[1440px] mx-auto overflow-visible">

        {/* ── TOP ROW: Headline (Left) & Profile Card (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          {/* Main Headline */}
          <div className="lg:col-span-8">
            <Fade delay={0.05}>
              <h1
                className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold tracking-tight text-[#111827] leading-[1.08]"
                style={{ fontFamily: "var(--font-cabinet), system-ui" }}
              >
                An aspiring <span className="text-[#16a34a]">AI Engineer</span>
                <br />
                &amp; ML Developer
              </h1>
            </Fade>
          </div>

          {/* Right Profile Card */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <Fade delay={0.15}>
              <div className="flex flex-col items-start max-w-[340px] bg-white/70 backdrop-blur-sm lg:bg-transparent rounded-2xl p-4 lg:p-0">
                {/* Avatar + Available badge */}
                <div className="flex items-center gap-3">
                  <img
                    src="/images/Sha_passport.jpg"
                    alt="Shachin"
                    className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-zinc-200"
                  />
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f1f5f9] text-xs font-medium text-zinc-700">
                    <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
                    <span>Available for work</span>
                  </div>
                </div>

                {/* Role Title */}
                <h2 className="text-xs sm:text-sm font-bold tracking-wider text-[#111827] uppercase mt-4 mb-1.5">
                  SHACHIN - AI ENGINEER &amp; DEVELOPER
                </h2>

                {/* Bio paragraph */}
                <p className="text-xs sm:text-[13px] text-zinc-500 leading-relaxed max-w-[300px]">
                  I build clean web apps, landing pages, and AI models that look sharp, feel clearer, and convert better.
                </p>

                {/* Thin divider */}
                <div className="w-full border-t border-zinc-200/90 my-2.5" />

                {/* Tags */}
                <div className="text-xs font-semibold text-zinc-600 flex items-center gap-2">
                  <span>UI/UX</span>
                  <span className="text-zinc-300">·</span>
                  <span>Machine Learning</span>
                  <span className="text-zinc-300">·</span>
                  <span>Web AI</span>
                </div>
              </div>
            </Fade>
          </div>
        </div>

        {/* ── BOTTOM ROW: Description + Resume CTA (Left), Social FAB (Center) & Spinning Stamp (Right) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end w-full">
          {/* Subparagraph & Resume Button (Left) */}
          <div className="flex flex-col items-start max-w-[420px]">
            <Fade delay={0.25}>
              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed mb-4 font-normal">
                I build intelligent systems that transform complex data into scalable, real-world AI solutions – specializing in end-to-end ML pipelines, real-time prediction systems, and API-based deployments.
              </p>
            </Fade>

            <Fade delay={0.35}>
              <LiquidMetalButton
                href={socialLinks.resume}
                target="_blank"
                ariaLabel="My Resume"
                icon={<FileText size={16} />}
                height={50}
              >
                My Resume
              </LiquidMetalButton>
            </Fade>
          </div>

          {/* Center-Bottom: Parallax Social FAB (Exact Horizontal Center) */}
          <div className="flex justify-center items-end relative pb-0 translate-y-6 sm:translate-y-8 md:translate-y-10 z-20">
            <Fade delay={0.38}>
              <div className="relative w-24 h-24 flex items-center justify-center">
                <ParallaxSocialFAB
                  fabSize={36}
                  itemSize={30}
                  spread={76}
                  startAngle={-180}
                  angleSpread={180}
                  fabIcon="Plus"
                  liquidGlass={true}
                  fabOpenOnHover={true}
                  pulseEnabled={false}
                  tooltipEnabled={true}
                  showGithub={true}
                  showLinkedin={true}
                  showTwitter={true}
                  showWhatsapp={true}
                  showCopy={true}
                />
              </div>
            </Fade>
          </div>

          {/* Bottom-Right: Rotating Circular "LET'S TALK" Stamp (Right) */}
          <div className="flex justify-start md:justify-end">
            <Fade delay={0.4}>
              <a
                href="/contact"
                className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 select-none cursor-pointer"
                title="Let's Talk"
              >
                {/* Spinning circular curved text */}
                <svg
                  viewBox="0 0 120 120"
                  className="w-full h-full animate-[spin_12s_linear_infinite]"
                >
                  <path
                    id="circlePath"
                    d="M 60, 60 m -45, 0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
                    fill="none"
                  />
                  <text
                    className="text-[10.5px] font-bold fill-[#111827] uppercase"
                    style={{ letterSpacing: "0.345em" }}
                    xmlSpace="preserve"
                  >
                    <textPath href="#circlePath" startOffset="0%">
                      {"· LET'S TALK · LET'S TALK · LET'S TALK "}
                    </textPath>
                  </text>
                </svg>

                {/* Center luminous lime-green dot */}
                <div className="absolute w-3.5 h-3.5 rounded-full bg-[#84cc16] shadow-md shadow-[#84cc16]/50" />
              </a>
            </Fade>
          </div>
        </div>
      </section>

      {/* ═══════════════ SECTION 2: EXPERIENCE / WORK HISTORY ═══════════════ */}
      <section id="work-history" className="max-screen py-16 md:py-28 relative z-10">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

            {/* Left */}
            <div className="md:col-span-1">
              <Fade><SectionBadge label="Work History" /></Fade>
              <Fade delay={0.1}>
                <h2
                  className="text-4xl sm:text-5xl font-semibold mt-4 mb-4 leading-tight"
                  style={{ fontFamily: "var(--font-clash-display), system-ui" }}
                >
                  Experience
                </h2>
              </Fade>
              <Fade delay={0.15}>
                <p className="text-text-secondary leading-relaxed text-sm">
                  I have worked on innovative real-world problems building automation
                  systems, full-stack products, and AI-powered pipelines through
                  internship engagements.
                </p>
              </Fade>
            </div>

            {/* Right: list */}
            <div className="md:col-span-2">
              <div className="flex flex-col">
                {experiences.map((exp, i) => (
                  <Fade key={exp.id} delay={i * 0.08}>
                    <div className="flex items-start gap-4 py-5 border-b border-bg-700/60 last:border-b-0 hover:bg-bg-800/50 backdrop-blur-sm px-4 -mx-4 rounded-xl transition-all duration-300">
                      <div
                        className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: exp.color }}
                      >
                        {exp.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary text-base">{exp.role}</p>
                        {(exp as any).link ? (
                          <a
                            href={(exp as any).link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative inline-block text-text-secondary hover:text-text-primary text-sm font-medium transition-colors group/link mt-0.5"
                          >
                            <span>@{(exp as any).company}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-highlight transition-all duration-300 ease-out group-hover/link:w-full" />
                          </a>
                        ) : (
                          <p className="text-text-secondary text-sm">@{exp.company}</p>
                        )}
                      </div>
                      <div className="text-text-secondary text-sm shrink-0">{exp.period}</div>
                    </div>
                  </Fade>
                ))}
              </div>
            </div>
          </div>
        </section>

      {/* ===== TECH STACK LOGO LOOP ===== */}
      <div className="w-full py-8 overflow-hidden relative">
        <LogoLoop
          logos={techLogos}
          speed={25}
          direction="right"
          logoHeight={46}
          gap={24}
          fadeOut={true}
          scaleOnHover={true}
          ariaLabel="My Tech Stack"
        />
      </div>

      {/* ═══════════════ ACHIEVEMENTS / CLOTHESLINE GALLERY ═══════════════ */}
      <div className="max-screen relative z-10">
        <Fade>
          <ClotheslineGallery />
        </Fade>
      </div>

      {/* ═══════════════ COMMUNITY / HACKATHONS ═══════════════ */}
      <section className="max-screen pb-20 md:pb-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left: 2x2 cards */}
          <Fade delay={0}>
            <div className="grid grid-cols-2 gap-4">
              {communityCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-bg-800 border border-bg-700 rounded-2xl p-5 hover:border-text-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-xl bg-text-primary/10 flex items-center justify-center mb-3">
                      <Icon size={17} className="text-text-primary" />
                    </div>
                    <h4
                      className="font-semibold text-text-primary text-sm mb-1"
                      style={{ fontFamily: "var(--font-clash-display), system-ui" }}
                    >
                      {card.title}
                    </h4>
                    <p className="text-text-secondary text-xs leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Fade>

          {/* Right: heading + stats */}
          <div>
            <Fade delay={0.1}>
              <SectionBadge label="Community Work" />
            </Fade>
            <Fade delay={0.18}>
              <h2
                className="text-4xl sm:text-5xl font-semibold mt-4 mb-5 leading-tight"
                style={{ fontFamily: "var(--font-clash-display), system-ui" }}
              >
                Active in the<br />Tech Community
              </h2>
            </Fade>
            <Fade delay={0.24}>
              <p className="text-text-secondary leading-relaxed mb-8 text-sm max-w-md">
                I actively participate in the broader tech ecosystem competing in
                national hackathons, leading teams, representing my college at Smart
                India Hackathon, and continuously upskilling through certified online
                courses. Learning and building, always.
              </p>
            </Fade>

            {/* Stats row */}
            <Fade delay={0.3}>
              <div className="flex gap-10 mb-8">
                {[
                  { value: "10+", label: "Hackathons" },
                  { value: "5+", label: "Teams Led" },
                  { value: "20+", label: "Certificates" },
                ].map((s) => (
                  <div key={s.label}>
                    <p
                      className="text-4xl font-bold text-text-primary leading-none mb-1"
                      style={{ fontFamily: "var(--font-clash-display), system-ui" }}
                    >
                      {s.value}
                    </p>
                    <p className="text-text-secondary text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </Fade>

            <Fade delay={0.36}>
              <LiquidMetalButton
                href={socialLinks.linkedin}
                target="_blank"
                ariaLabel="Connect on LinkedIn"
                height={52}
              >
                Connect on LinkedIn
              </LiquidMetalButton>
            </Fade>
          </div>
        </div>
      </section>

      {/* ═══════════════ MY APPROACH (From Home Page) ═══════════════ */}
      <section className="max-screen py-16 sm:py-24 relative z-10">
        <Fade className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <SectionBadge label="My Approach" />
          <h2
            className="text-3xl sm:text-5xl font-semibold mt-3"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            How I Approach a Project
          </h2>
          <p className="text-text-secondary mt-3 max-w-xl text-base sm:text-lg leading-relaxed">
            A structured, iterative approach to every project — from initial discovery to final delivery.
          </p>
        </Fade>

        <Fade delay={0.2} className="w-full mt-6">
          <AnimatedPath
            lineColor="currentColor"
            dotColor="currentColor"
            strokeWidth={1.5}
            dashLength={7}
            gapLength={7}
            dotSize={11}
            speed={130}
            trailLength={0.3}
            startOnView={true}
            showBase={true}
            baseOpacity={0.25}
            className="text-text-primary"
          />
        </Fade>
      </section>
    </div>
  );
}
