"use client";

import Link from "next/link";
import { ArrowUpRight, Hand, Database, Rocket, Search, FlaskConical, BarChart3, Sparkle } from "lucide-react";
import RevealOnScroll from "@/components/RevealOnScroll";
import LogoLoop from "@/components/LogoLoop";
import SectionBadge from "@/components/SectionBadge";
import ScrollReveal from "@/components/ScrollReveal";
import BlurText from "@/components/BlurText";
import ProjectCard from "@/components/ProjectCard";
import CardSwap, { Card } from "@/components/CardSwap";
import { projects, socialLinks } from "@/data/portfolio";
import { techLogos } from "@/data/techLogos";

const featuredProjects = projects.filter((p) => p.featured);

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



const approachSteps = [
  {
    step: "01",
    icon: Search,
    title: "1. Scope & Objective Definition",
    subtitle: "Understanding the problem space, constraints, and success metrics",
    description: "Every successful AI model starts with a clearly defined problem. I work backwards from the business goal, translate it into technical ML objectives, define precise target metrics (F1-score, latency, etc.), and identify key data constraints.",
    highlight: "Key Deliverables: Metric design, data sourcing plans, validation strategies"
  },
  {
    step: "02",
    icon: Database,
    title: "2. Data Pipeline Engineering",
    subtitle: "Ingestion, clean-up, feature extraction, and transformations",
    description: "Great models are built on high-fidelity data. I build scalable ingestion pipelines, handle missing values and outliers systematically, run exhaustive statistical analyses for data drift, and perform advanced feature engineering to uncover predictive signals.",
    highlight: "Tools: pandas, NumPy, scikit-learn, SQL, Feature Store integrations"
  },
  {
    step: "03",
    icon: FlaskConical,
    title: "3. Architecture Design & Iteration",
    subtitle: "Selecting algorithms, model training, and hyperparameters",
    description: "I run structured experiments to identify the optimal model architecture. Starting from strong baselines, I iterate through state-of-the-art models (XGBoost, Transformers, LSTMs), perform hyperparameter tuning, and track experiments meticulously.",
    highlight: "Frameworks: PyTorch, TensorFlow, MLflow for tracking & reproducibility"
  },
  {
    step: "04",
    icon: BarChart3,
    title: "4. Rigorous Validation & Analysis",
    subtitle: "Evaluating performance, robustness, fairness, and bias",
    description: "Accuracy isn't enough. I evaluate model robustness using cross-validation, examine confusion matrices, perform error analysis to uncover system weaknesses, test edge cases, and run bias audits to ensure equitable predictions across demographics.",
    highlight: "Metrics: Precision-Recall curves, SHAP/LIME explainability, slice analysis"
  },
  {
    step: "05",
    icon: Rocket,
    title: "5. Production Deployment & Monitoring",
    subtitle: "Serving predictions at scale, tracking health, and retraining",
    description: "I package models into optimized, high-throughput microservices. I implement API endpoints, containerize apps for deployment, set up real-time latency monitors, track feature drift in production, and build automated retraining loops.",
    highlight: "Stack: FastAPI, Docker, Streamlit UI, live performance monitoring"
  },
];

export default function HomePage() {
  return (
    <div className="relative flex w-full flex-col">
      <section className="max-screen" style={{ paddingBottom: "1.5rem" }}>
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center w-full">
          {/* ── Hero text ── */}
          <div className="w-full">
            <RevealOnScroll delay={0}>
              <p className="text-text-primary mb-8 flex items-center gap-2">
                <span className="wave">
                  <Hand size={24} className="text-text-primary -rotate-12" />
                </span>
                Hey! It&apos;s me Shachin,
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.15}>
              <h1
                className="text-[2.75rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl text-pretty"
                style={{ fontFamily: "var(--font-clash-display), system-ui" }}
              >
                Building{" "}
                <span className="gradient-text">intelligent systems</span>{" "}that
                learn, predict &amp; transform.
              </h1>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <div className="md:flex items-center mt-8 flex flex-col gap-4 md:flex-row">
                <div className="bg-bg-700 h-px w-full hidden md:block" />
                <p className="w-full text-pretty text-text-secondary leading-relaxed">
                  I build end-to-end ML pipelines, real-time prediction systems, and
                  AI-powered applications that transform complex data into scalable,
                  real-world solutions.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.45}>
              <div className="mt-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <ul className="hidden h-fit gap-5 md:flex">
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
                <Link href="/about">
                  <button className="btn-outline">
                    <span>Know me better</span>
                  </button>
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          {/* ── Hero lanyard image ── */}
          <RevealOnScroll delay={0.3} className="w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[400px] aspect-square flex items-center justify-center select-none animate-float">
              {/* Subtle accent glow behind the lanyard */}
              <div className="absolute w-[80%] h-[80%] bg-[var(--highlight-dim)] blur-3xl rounded-full opacity-60 z-0" />
              <img
                src="/images/lanyard_forward.png"
                alt="Shachin VP Lanyard"
                className="w-full h-auto object-contain relative z-10 pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_25px_50px_rgba(255,255,255,0.03)]"
              />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ===== TEXT MARQUEE LOOP ===== */}
      <div className="w-full border-t border-b border-bg-700 py-8 overflow-hidden relative">
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

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="max-screen">
        <RevealOnScroll>
          <SectionBadge label="Featured Projects" />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <div className="flex items-end justify-between mb-8">
            <h2
              className="text-3xl sm:text-4xl font-semibold"
              style={{ fontFamily: "var(--font-clash-display), system-ui" }}
            >
              Selected Work
            </h2>
            <Link href="/projects" className="social-link hidden sm:flex">
              View All
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {featuredProjects.map((project, i) => (
            <RevealOnScroll 
              key={project.title} 
              delay={i * 0.1} 
              direction={i % 2 === 0 ? "left" : "right"}
              className={i % 2 !== 0 ? "md:mt-16 lg:mt-24" : ""}
            >
              <ProjectCard project={project} index={i} />
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll delay={0.2} className="mt-8 flex justify-center sm:hidden">
          <Link href="/projects">
            <button className="btn-outline">
              <span>View All Projects</span>
            </button>
          </Link>
        </RevealOnScroll>
      </section>

      {/* ===== MY APPROACH ===== */}
      <section className="max-screen">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left side text */}
          <div className="flex-1 min-w-0">
            <RevealOnScroll>
              <SectionBadge label="My Approach" />
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <h2
                className="text-3xl sm:text-4xl font-semibold mb-4"
                style={{ fontFamily: "var(--font-clash-display), system-ui" }}
              >
                How I Approach a Project
              </h2>
              <p className="text-text-secondary max-w-xl leading-relaxed">
                Every project is different, but my process is consistent — from
                understanding the problem deeply to shipping robust systems that serve predictions reliably.
              </p>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <ul className="mt-10 space-y-6">
                {approachSteps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <li key={step.step} className="flex items-start gap-4">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-bg-800 border border-bg-700 flex items-center justify-center">
                        <Icon size={14} className="text-text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-text-primary uppercase tracking-widest mb-0.5">{step.step}</p>
                        <h4 className="font-semibold text-text-primary text-base" style={{ fontFamily: "var(--font-clash-display), system-ui" }}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-text-secondary mt-0.5 font-light">{step.subtitle}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </RevealOnScroll>
          </div>

          {/* Right side: CardSwap */}
          <div className="relative flex-1 min-w-0 h-[620px] flex items-center justify-center hidden lg:flex">
            <CardSwap
              cardDistance={35}
              verticalDistance={45}
              delay={5500}
              pauseOnHover={true}
              width={460}
              height={380}
              easing="elastic"
              skewAmount={3}
            >
              {approachSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <Card key={step.step} className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-xl bg-bg-800 border border-bg-700">
                          <Icon size={22} className="text-text-primary" />
                        </div>
                        <span className="text-sm font-bold text-text-primary tracking-widest">{step.step}</span>
                      </div>
                      <h3
                        className="text-lg font-bold mb-1 text-text-primary"
                        style={{ fontFamily: "var(--font-clash-display), system-ui" }}
                      >
                        {step.title}
                      </h3>
                      <p className="text-xs text-text-primary font-medium mb-3 tracking-wide">{step.subtitle}</p>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4 font-normal">
                        {step.description}
                      </p>
                    </div>
                    
                    <div className="pt-3 border-t border-bg-700/60 mt-auto">
                      <p className="text-[11px] text-text-primary font-medium tracking-wide">
                        <span className="text-text-primary uppercase font-bold mr-1">Focus:</span>
                        {step.highlight}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </CardSwap>
          </div>
        </div>
      </section>

      {/* ===== TECH STACK LOGO LOOP ===== */}
      <div className="w-full border-t border-b border-bg-700 py-8 overflow-hidden relative">
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
    </div>
  );
}
