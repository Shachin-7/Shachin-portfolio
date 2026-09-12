"use client";

import Link from "next/link";
import { ArrowUpRight, Hand, Sparkle } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import LogoLoop from "@/components/LogoLoop";
import SectionBadge from "@/components/SectionBadge";
import ScrollReveal from "@/components/ScrollReveal";
import BlurText from "@/components/BlurText";
import ProjectCard from "@/components/ProjectCard";
import CardSwap, { Card } from "@/components/CardSwap";
import { projects, socialLinks } from "@/data/portfolio";
import { techLogos } from "@/data/techLogos";
import DepthText from "@/components/DepthText";
import MotionTiles from "@/components/MotionTiles";
import ApproachTimeline from "@/components/ApproachTimeline";
import LiquidMetalButton from "@/components/LiquidMetalButton";

const motionTilesData = [
  {
    title: "OrbitXOS Space Tracking",
    tag: "Space Safety · AI & 3D",
    color: "#a855f7",
    video: "https://gumlet.tv/watch/6aa11d42aa489a4399fc6521/",
    github: "https://github.com/Shachin-7/Orbit-xos",
  },
  {
    title: "Senior Business Analyst Portfolio",
    tag: "Freelance · Analytics",
    color: "#8b5cf6",
    video: "https://gumlet.tv/watch/6aa11bb42f578a19ae52a066/",
    github: "https://www.suryah.pro",
  },
  {
    title: "Director of ABB Company Portfolio",
    tag: "Freelance · Corporate",
    color: "#10b981",
    video: "https://gumlet.tv/watch/6aa11bb4aa489a4399fc5296/",
    github: "https://babu-portfolio-it5x.vercel.app",
  },
  {
    title: "JV Associate LLC Website",
    tag: "Frontend · Web App",
    color: "#ef4444",
    video: "https://gumlet.tv/watch/6aa11de2aa489a4399fc6887/",
    github: "https://web.jvassociatellc.com",
  },
  {
    title: "Lead Gen & Email Automation",
    tag: "Node.js · Automation",
    color: "#f59e0b",
    video: "https://gumlet.tv/watch/6aa11d1daa4fda3466922ca2/",
    github: "https://github.com/Shachin-7/email-automation",
  },
];

const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);

const marqueeWords = [
  "Machine Learning",
  "Deep Learning",
  "AI Engineering",
  "Neural Networks",
  "MLOps",
  "Computer Vision",
  "NLP",
  "Data Pipelines",
];

const marqueeItems = marqueeWords.map((word) => ({
  node: (
    <div className="flex items-center gap-8 md:gap-12 select-none" style={{ pointerEvents: "none" }}>
      <h2
        className="text-4xl md:text-5xl lg:text-6xl font-medium uppercase tracking-wider text-text-primary/10 select-none"
        style={{ fontFamily: "var(--font-clash-display), system-ui" }}
      >
        {word}
      </h2>
      <Sparkle size={28} className="text-text-primary/10 shrink-0" />
    </div>
  )
}));

export default function AboutPage() {
  return (
    <div className="relative flex w-full flex-col">
      <section className="max-screen" style={{ paddingBottom: "1.5rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center w-full">
          {/* ── Hero text ── */}
          <div className="w-full">
            <RevealOnScroll delay={0}>
              <p className="text-text-primary mb-8 flex items-center gap-2 font-poppins">
                <span className="wave">
                  <Hand size={24} className="text-text-primary -rotate-12" />
                </span>
                Hey! It&apos;s me Shachin,
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <h1
                className="text-[2rem] sm:text-4xl md:text-[3.25rem] lg:text-[3.6rem] xl:text-[3.85rem] leading-[1.18] font-poppins"
              >
                Building{" "}
                <DepthText
                  text="Intelligent"
                  layers={23}
                  depth={1.6}
                  faceColor="#ffffff"
                  depthColor="#000000"
                  multiColor={false}
                  tilt={7.5}
                  pointerTracking
                  smoothing={0.14}
                  perspective={1500}
                  autoOrbit
                  orbitSpeed={0.35}
                  fontWeight={900}
                  shadow
                />{" "}
                <br className="hidden sm:block" />
                <span className="gradient-text">systems</span> that learn,{" "}
                <br className="hidden sm:block" />
                predict &amp; transform.
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="md:flex items-center mt-12 flex flex-col gap-4 md:gap-16 md:flex-row">
                <div className="bg-bg-700 h-px w-full hidden md:block" />
                <p className="w-full text-pretty text-text-secondary leading-relaxed">
                  I build end-to-end ML pipelines, real-time prediction systems, and
                  AI-powered applications that transform complex data into scalable,
                  real-world solutions.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.45}>
              <div className="mt-8 flex items-center">
                <ul className="flex h-fit gap-5">
                  <li>
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      LinkedIn
                      <ArrowUpRight size={14} />
                    </a>
                  </li>
                  <li>
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      GitHub
                      <ArrowUpRight size={14} />
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${socialLinks.email}`}
                      className="social-link"
                    >
                      Gmail
                      <ArrowUpRight size={14} />
                    </a>
                  </li>
                </ul>
              </div>
            </RevealOnScroll>
          </div>

          {/* ── Hero lanyard image & CTA ── */}
          <RevealOnScroll delay={0.3} className="w-full flex flex-col items-center lg:items-end justify-center lg:self-start lg:-mt-16 xl:-mt-24">
            <div className="flex flex-col items-center gap-8 lg:mr-0">
              <div className="relative w-full max-w-[240px] sm:max-w-[300px] lg:max-w-[340px] xl:max-w-[420px] aspect-[3/4] flex items-center justify-center select-none animate-float">
                {/* Subtle accent glow behind the lanyard */}
                <div className="absolute w-[80%] h-[80%] bg-[var(--highlight-dim)] blur-3xl rounded-full opacity-60 z-0" />
                <img
                  src="/images/lanyard_forward.png"
                  alt="Shachin VP Lanyard"
                  className="w-full h-auto object-contain relative z-10 pointer-events-none drop-shadow-[0_15px_30px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_20px_40px_rgba(255,255,255,0.03)]"
                />
              </div>
              <LiquidMetalButton
                href="/"
                ariaLabel="Know me better"
                height={52}
              >
                Know me better
              </LiquidMetalButton>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== TEXT MARQUEE LOOP ===== */}
      <div className="w-full py-8 overflow-hidden relative">
        <LogoLoop
          logos={marqueeItems}
          speed={20}
          direction="left"
          logoHeight={70}
          gap={48}
          fadeOut={true}
          pauseOnHover={false}
          scaleOnHover={false}
          ariaLabel="My AI/ML Areas of Expertise"
        />
      </div>

      {/* ===== ABOUT PREVIEW ===== */}
      <section className="max-screen flex flex-col items-center text-center">
        <RevealOnScroll>
          <SectionBadge label="About Me" />
        </RevealOnScroll>
        <BlurText
          text="I'm Shachin VP, an aspiring AI Research & Development Engineer with strong hands-on experience in Python, deep learning architectures, feature engineering, and statistical modeling. Experienced in building end-to-end ML pipelines, real-time prediction systems, and API-based deployments. Passionate about transforming complex data into scalable, real-world AI solutions through continuous learning and experimentation."
          delay={60}
          animateBy="words"
          direction="bottom"
          stepDuration={0.4}
          threshold={0.1}
          className="mx-auto mt-8 max-w-5xl justify-center text-center text-[32px] md:text-[54px] leading-[1.45] font-medium tracking-[-0.03em] text-text-primary"
          style={{ fontFamily: "var(--font-clash-display), system-ui" }}
        />
      </section>

      {/* ===== FEATURED PROJECTS (MotionTiles 3D Depth Stack) ===== */}
      <section id="featured-projects" data-project-section="true" className="max-screen py-16 sm:py-28">
        <RevealOnScroll className="flex flex-col items-center text-center">
          <SectionBadge label="Featured Projects" />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1} className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <h2
            className="text-3xl sm:text-4xl font-semibold"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            Notable Projects
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2} className="w-full">
          <MotionTiles tiles={motionTilesData} />
        </RevealOnScroll>

        <RevealOnScroll delay={0.3} className="mt-32 sm:mt-40 flex justify-center relative z-20">
          <LiquidMetalButton
            href="/projects"
            onClick={() => window.dispatchEvent(new Event("sha-trigger-intro"))}
            ariaLabel="Explore All Projects"
            height={54}
          >
            Explore All Projects
          </LiquidMetalButton>
        </RevealOnScroll>
      </section>

      {/* ===== MY APPROACH (SCROLL TIMELINE) ===== */}
      <ApproachTimeline />

    </div>
  );
}
