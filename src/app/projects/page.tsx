"use client";

import RevealOnScroll from "@/components/RevealOnScroll";
import SectionBadge from "@/components/SectionBadge";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/portfolio";

export default function ProjectsPage() {
  return (
    <div className="relative flex w-full flex-col">
      <section className="max-screen">
        <RevealOnScroll>
          <SectionBadge label="Projects" />
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 leading-tight"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mb-12 leading-relaxed">
            A collection of ML systems, AI-powered tools, and full-stack
            applications I&apos;ve built — from satellite error prediction to
            automated trading bots.
          </p>
        </RevealOnScroll>

        {/* Featured Projects */}
        <RevealOnScroll delay={0.15}>
          <h2
            className="text-xl font-semibold mb-6 text-text-secondary"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            Featured
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {projects
            .filter((p) => p.featured)
            .map((project, i) => (
              <RevealOnScroll key={project.title} delay={i * 0.08}>
                <ProjectCard project={project} index={i} />
              </RevealOnScroll>
            ))}
        </div>

        {/* Other Projects */}
        <RevealOnScroll delay={0.1}>
          <h2
            className="text-xl font-semibold mb-6 text-text-secondary"
            style={{ fontFamily: "var(--font-clash-display), system-ui" }}
          >
            Other Projects
          </h2>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects
            .filter((p) => !p.featured)
            .map((project, i) => (
              <RevealOnScroll key={project.title} delay={i * 0.08}>
                <ProjectCard project={project} index={i} />
              </RevealOnScroll>
            ))}
        </div>
      </section>
    </div>
  );
}
