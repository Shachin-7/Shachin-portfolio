"use client";

import RevealOnScroll from "@/components/RevealOnScroll";
import SectionBadge from "@/components/SectionBadge";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/portfolio";

export default function ProjectsPage() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

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

        {/* Desktop View for Featured Projects */}
        <div className="hidden md:grid grid-cols-2 gap-8 items-start mb-16">
          {/* Left Column */}
          <div className="flex flex-col gap-12">
            {featuredProjects
              .filter((_, idx) => idx % 2 === 0)
              .map((project, i) => (
                <RevealOnScroll 
                  key={project.title} 
                  delay={(i * 2 + 1) * 0.1} 
                  direction="left"
                >
                  <ProjectCard project={project} index={i * 2} />
                </RevealOnScroll>
              ))}
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-12 mt-16 lg:mt-24">
            {featuredProjects
              .filter((_, idx) => idx % 2 !== 0)
              .map((project, i) => (
                <RevealOnScroll 
                  key={project.title} 
                  delay={(i * 2 + 2) * 0.1} 
                  direction="right"
                >
                  <ProjectCard project={project} index={i * 2 + 1} />
                </RevealOnScroll>
              ))}
          </div>
        </div>

        {/* Mobile View for Featured Projects */}
        <div className="flex flex-col gap-8 md:hidden mb-16">
          {featuredProjects.map((project, i) => (
            <RevealOnScroll 
              key={project.title} 
              delay={(i + 1) * 0.1} 
              direction={i % 2 === 0 ? "left" : "right"}
            >
              <ProjectCard project={project} index={i} />
            </RevealOnScroll>
          ))}
        </div>

        {otherProjects.length > 0 && (
          <>
            {/* Other Projects */}
            <RevealOnScroll delay={0.1}>
              <h2
                className="text-xl font-semibold mb-6 text-text-secondary"
                style={{ fontFamily: "var(--font-clash-display), system-ui" }}
              >
                Other Projects
              </h2>
            </RevealOnScroll>

            {/* Desktop View for Other Projects */}
            <div className="hidden md:grid grid-cols-2 gap-8 items-start">
              {/* Left Column */}
              <div className="flex flex-col gap-12">
                {otherProjects
                  .filter((_, idx) => idx % 2 === 0)
                  .map((project, i) => (
                    <RevealOnScroll 
                      key={project.title} 
                      delay={(i * 2 + 1) * 0.1} 
                      direction="left"
                    >
                      <ProjectCard project={project} index={i * 2} />
                    </RevealOnScroll>
                  ))}
              </div>
              {/* Right Column */}
              <div className="flex flex-col gap-12 mt-16 lg:mt-24">
                {otherProjects
                  .filter((_, idx) => idx % 2 !== 0)
                  .map((project, i) => (
                    <RevealOnScroll 
                      key={project.title} 
                      delay={(i * 2 + 2) * 0.1} 
                      direction="right"
                    >
                      <ProjectCard project={project} index={i * 2 + 1} />
                    </RevealOnScroll>
                  ))}
              </div>
            </div>

            {/* Mobile View for Other Projects */}
            <div className="flex flex-col gap-8 md:hidden">
              {otherProjects.map((project, i) => (
                <RevealOnScroll 
                  key={project.title} 
                  delay={(i + 1) * 0.1} 
                  direction={i % 2 === 0 ? "left" : "right"}
                >
                  <ProjectCard project={project} index={i} />
                </RevealOnScroll>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
