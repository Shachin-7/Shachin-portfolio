"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Code2, Database, Brain, Rocket, Server, FileText,
  Search, PenTool, Code, Zap, Users, Award, BookOpen, Trophy
} from "lucide-react";
import SectionBadge from "@/components/SectionBadge";
import { skills, experiences, achievements } from "@/data/portfolio";

/* ─── Blur-in wrapper (replaces RevealOnScroll everywhere) ─── */
function Fade({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
      animate={
        inView
          ? { opacity: 1, filter: "blur(0px)", y: 0 }
          : { opacity: 0, filter: "blur(10px)", y: 20 }
      }
      transition={{ duration: 0.65, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─── */
const skillCategories = [
  { title: "Languages",      icon: Code2,     items: skills.languages },
  { title: "ML & AI",        icon: Brain,     items: skills.mlAi },
  { title: "Data Analytics", icon: Database,  items: skills.data },
  { title: "Deployment",     icon: Rocket,    items: skills.deployment },
  { title: "Databases",      icon: Server,    items: skills.databases },
];

const processSteps = [
  {
    number: "01",
    title: "Discovery",
    icon: Search,
    description:
      "I start by deeply understanding the problem space — the data, the business goal, and the constraints. Good solutions begin with the right questions.",
  },
  {
    number: "02",
    title: "Design",
    icon: PenTool,
    description:
      "I design the architecture before writing a single line of code — whether it's a model pipeline, API structure, or UI layout.",
  },
  {
    number: "03",
    title: "Build",
    icon: Code,
    description:
      "I build iteratively. Clean, documented code with a focus on reproducibility — shipping working prototypes fast and refining from there.",
  },
  {
    number: "04",
    title: "Deliver",
    icon: Zap,
    description:
      "The final product is packaged, documented, and handed off. I ensure everything is maintainable and understandable beyond just me.",
  },
];

const communityCards = [
  {
    icon: Trophy,
    title: "10+ Hackathons",
    description:
      "Competed in national-level hackathons across top institutions, winning prizes and building real products under 24–48 hours.",
  },
  {
    icon: Users,
    title: "5+ Teams Led",
    description:
      "Led cross-functional teams of developers and designers to deliver end-to-end solutions under tight hackathon deadlines.",
  },
  {
    icon: Award,
    title: "Smart India Hackathon",
    description:
      "Selected and participated in SIH — India's largest hackathon organised by the Government of India.",
  },
  {
    icon: BookOpen,
    title: "20+ Certificates",
    description:
      "Completed certified courses in ML, Deep Learning, NLP, and cloud platforms from Coursera, NPTEL, and more.",
  },
];

/* ─── Page ─── */
export default function AboutPage() {
  const [showAllExp, setShowAllExp] = useState(false);
  const visibleExp = showAllExp ? experiences : experiences.slice(0, 3);

  return (
    <div className="relative flex w-full flex-col">

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="max-screen relative">
        {/* Spinning "LET'S TALK" ring — floating in the right corner */}
        <div className="absolute top-0 right-4 sm:top-8 sm:right-8 md:top-4 md:right-4 z-10">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28">
            <motion.svg
              className="absolute inset-0"
              viewBox="0 0 100 100"
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 12,
                ease: "linear",
              }}
            >
              <defs>
                <path
                  id="talkCircle"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                />
              </defs>
              <text style={{ fontSize: 10, fill: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.22em" }}>
                <textPath href="#talkCircle">LETS TALK • LETS TALK • LETS TALK •</textPath>
              </text>
            </motion.svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-highlight shadow-lg shadow-highlight/40" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-20">

          {/* ── Photo column ── */}
          <Fade delay={0} className="shrink-0">
            {/* Circle photo */}
            <div className="relative w-64 h-64 sm:w-[300px] sm:h-[300px]">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-bg-700 shadow-xl relative bg-bg-800">
                <Image
                  src="/images/Sha_passport.jpg"
                  alt="Shachin VP"
                  fill
                  className="object-cover object-top"
                  priority
                />
              </div>
            </div>
          </Fade>

          {/* ── Text column ── */}
          <div className="flex-1 text-left">
            <Fade delay={0.1}>
              <h1
                className="text-4xl sm:text-5xl md:text-[3.25rem] font-semibold leading-[1.12] mb-6"
                style={{ fontFamily: "var(--font-clash-display), system-ui" }}
              >
                An aspiring{" "}
                <span className="gradient-text">AI Engineer</span>
                <br />
                &amp; ML Developer
              </h1>
            </Fade>

            <Fade delay={0.18}>
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                I build intelligent systems that transform complex data into scalable,
                real-world AI solutions — specializing in end-to-end ML pipelines,
                real-time prediction systems, and API-based deployments.
              </p>
            </Fade>

            <Fade delay={0.26}>
              <a
                href="https://drive.google.com/file/d/1otdefXUgDGLhufReE-s_qlTBAoPQAVe8/view?usp=share_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-text-primary text-text-primary font-medium hover:bg-text-primary hover:text-bg-900 transition-all duration-300"
              >
                <FileText size={16} />
                My Resume
              </a>
            </Fade>
          </div>
        </div>
      </section>

      {/* ═══════════════ EXPERIENCE ═══════════════ */}
      <section className="max-screen">
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
                I have worked on innovative real-world problems — building automation
                systems, full-stack products, and AI-powered pipelines through
                internship engagements.
              </p>
            </Fade>
          </div>

          {/* Right: list */}
          <div className="md:col-span-2">
            <div className="flex flex-col">
              {visibleExp.map((exp, i) => (
                <Fade key={exp.id} delay={i * 0.08}>
                  <div className="flex items-start gap-4 py-5 border-b border-bg-700 last:border-b-0 hover:bg-bg-800/40 px-3 -mx-3 rounded-xl transition-colors duration-200">
                    <div
                      className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: exp.color }}
                    >
                      {exp.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary text-base">{exp.role}</p>
                      <p className="text-text-secondary text-sm">@{exp.company}</p>
                    </div>
                    <div className="text-text-secondary text-sm shrink-0">{exp.period}</div>
                  </div>
                </Fade>
              ))}
            </div>
            {experiences.length > 3 && (
              <Fade delay={0.3}>
                <button
                  onClick={() => setShowAllExp(!showAllExp)}
                  className="mt-6 mx-auto flex items-center gap-2 text-text-secondary text-sm hover:text-text-primary transition-colors"
                >
                  {showAllExp ? "Show Less ↑" : "Show More ↓"}
                </button>
              </Fade>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════ MY APPROACH (4 steps, grid) ═══════════════ */}
      <section className="max-screen">
        <Fade><SectionBadge label="Steps I Follow" /></Fade>
        <Fade delay={0.1}>
          <h2
            className="text-4xl sm:text-5xl font-semibold mt-4 mb-3"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            My Approach
          </h2>
        </Fade>
        <Fade delay={0.15}>
          <p className="text-text-secondary mb-10 max-w-xl text-sm leading-relaxed">
            A structured, iterative approach to every project — from initial
            discovery to final delivery — ensuring quality at every step.
          </p>
        </Fade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <Fade key={step.number} delay={i * 0.08}>
                <div className="bg-bg-800 border border-bg-700 rounded-2xl p-6 hover:border-text-primary/30 hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="w-10 h-10 rounded-xl bg-text-primary/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-text-primary" />
                  </div>
                  <p className="text-text-primary text-xs font-semibold tracking-widest mb-2 uppercase">
                    {step.number}
                  </p>
                  <h3
                    className="text-lg font-semibold mb-3 text-text-primary"
                    style={{ fontFamily: "var(--font-clash-display), system-ui" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Fade>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ TECH ARSENAL ═══════════════ */}
      <section className="max-screen">
        <Fade><SectionBadge label="Skills & Technologies" /></Fade>
        <Fade delay={0.1}>
          <h2
            className="text-4xl sm:text-5xl font-semibold mt-4 mb-10"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            My Tech Arsenal
          </h2>
        </Fade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillCategories.map((category, i) => {
            const Icon = category.icon;
            return (
              <Fade key={category.title} delay={i * 0.07}>
                <div className="bg-bg-800 border border-bg-700 rounded-2xl p-6 hover:border-text-primary/30 hover:-translate-y-0.5 transition-all duration-300 h-full">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-text-primary/10 flex items-center justify-center">
                      <Icon size={16} className="text-text-primary" />
                    </div>
                    <h3
                      className="font-semibold text-text-primary"
                      style={{ fontFamily: "var(--font-clash-display), system-ui" }}
                    >
                      {category.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-bg-900 border border-bg-700 rounded-full text-text-secondary text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Fade>
            );
          })}
        </div>
      </section>

      {/* ═══════════════ ACHIEVEMENTS ═══════════════ */}
      <section className="max-screen">
        <Fade><SectionBadge label="Awards & Recognition" /></Fade>
        <Fade delay={0.1}>
          <h2
            className="text-4xl sm:text-5xl font-semibold mt-4 mb-10"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            Hackathon Wins
          </h2>
        </Fade>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((a, i) => (
            <Fade key={a.title} delay={i * 0.06}>
              <div className="flex items-start gap-4 bg-bg-800 border border-bg-700 rounded-2xl p-5 hover:border-text-primary/30 hover:-translate-y-0.5 transition-all duration-300">
                <span className="text-2xl shrink-0">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-sm text-text-primary">{a.title}</h4>
                    <span className="text-text-primary text-xs font-bold shrink-0 bg-text-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {a.prize}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs mt-1">{a.description}</p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* ═══════════════ COMMUNITY / HACKATHONS ═══════════════ */}
      <section className="max-screen pb-20 md:pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">

          {/* Left: 2×2 cards */}
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
                I actively participate in the broader tech ecosystem — competing in
                national hackathons, leading teams, representing my college at Smart
                India Hackathon, and continuously upskilling through certified online
                courses. Learning and building, always.
              </p>
            </Fade>

            {/* Stats row */}
            <Fade delay={0.3}>
              <div className="flex gap-10 mb-8">
                {[
                  { value: "10+",  label: "Hackathons" },
                  { value: "5+",   label: "Teams Led" },
                  { value: "20+",  label: "Certificates" },
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
              <a
                href="https://linkedin.com/in/shachinvp"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-text-primary text-text-primary font-medium hover:bg-text-primary hover:text-bg-900 transition-all duration-300"
              >
                Connect on LinkedIn
              </a>
            </Fade>
          </div>
        </div>
      </section>
    </div>
  );
}
