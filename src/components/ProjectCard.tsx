import { ArrowUpRight } from "lucide-react";

import TiltedCard from "@/components/TiltedCard";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  github: string;
  image?: string;
  video?: string;
  featured?: boolean;
  isHero?: boolean;
  year?: string;
  bgColor?: string;
}

interface ProjectCardProps {
  project: Project;
  index: number;
  isHero?: boolean;
}

export default function ProjectCard({ project, index, isHero = false }: ProjectCardProps) {
  return (
    <a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full outline-none"
    >
      <div className={`w-full mb-6 transition-transform duration-500 group-hover:-translate-y-2 group-focus-visible:-translate-y-2 ${
        isHero ? "aspect-[1.5/1] md:aspect-[2/1] lg:aspect-[21/9]" : "aspect-[4/3]"
      }`}>
        <TiltedCard 
          containerHeight="100%" 
          containerWidth="100%" 
          scaleOnHover={1.03} 
          rotateAmplitude={isHero ? 4 : 8}
        >
          <div
            className={`w-full h-full rounded-[2rem] p-6 sm:p-12 flex items-center justify-center ${
              project.bgColor || "bg-bg-800"
            }`}
          >
            {project.video ? (
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-xl shadow-xl"
              />
            ) : project.image ? (
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover rounded-xl shadow-xl"
              />
            ) : (
              <div className="w-full h-full bg-bg-900/50 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-4 text-text-secondary border border-text-primary/10 shadow-xl">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span className="font-medium tracking-wide">View on GitHub</span>
              </div>
            )}
          </div>
        </TiltedCard>
      </div>

      <div className={`px-2 ${project.isHero || isHero ? "text-center" : ""}`}>
        <h3
          className={`text-xl sm:text-2xl font-semibold text-text-primary mb-4 transition-colors group-hover:text-highlight ${
            project.isHero || isHero ? "text-center" : ""
          }`}
          style={{ fontFamily: "var(--font-clash-display), system-ui" }}
        >
          {project.title}
        </h3>
        <div className={`flex items-center ${project.isHero || isHero ? "justify-center gap-4 sm:gap-6 flex-wrap" : "justify-between"}`}>
          <div className={`flex flex-wrap gap-2 ${project.isHero || isHero ? "justify-center" : ""}`}>
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-bg-800 text-text-secondary text-xs font-medium rounded-full border border-bg-700"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-3 py-1 bg-bg-800 text-text-secondary text-xs font-medium rounded-full border border-bg-700">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
          <span className="text-text-secondary text-sm font-medium">
            {project.year || "2026"}
          </span>
        </div>
      </div>
    </a>
  );
}
