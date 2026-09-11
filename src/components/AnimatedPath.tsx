"use client";

import React, { useRef, useState, useEffect, useLayoutEffect, useId } from "react";

const VIEW_WIDTH = 927;
const VIEW_HEIGHT = 400;

const PROCESS_PATH = `
    M 77 54
    C 132 2 244 8 297 118
    C 350 70 461 75 507 185
    C 571 124 698 136 757 271
`;

export const processPoints = [
  {
    x: 77,
    y: 54,
    step: "01",
    title: "Collect",
    desc: "Gather production, machine, and sensor data from connected systems in real time.",
  },
  {
    x: 297,
    y: 118,
    step: "02",
    title: "Analyze",
    desc: "Process operational data to identify bottlenecks, trends, and anomalies.",
  },
  {
    x: 507,
    y: 185,
    step: "03",
    title: "Predict",
    desc: "Detect potential failures before they impact production performance.",
  },
  {
    x: 757,
    y: 271,
    step: "04",
    title: "Optimize",
    desc: "Turn insights into better actions that improve throughput, quality, reliability, and efficiency.",
  },
];

export interface AnimatedPathProps {
  lineColor?: string;
  dotColor?: string;
  strokeWidth?: number;
  dashLength?: number;
  gapLength?: number;
  dotSize?: number;
  speed?: number;
  trailLength?: number;
  startDelay?: number;
  startOnView?: boolean;
  showBase?: boolean;
  baseOpacity?: number;
  className?: string;
}

export default function AnimatedPath({
  lineColor = "currentColor",
  dotColor = "currentColor",
  strokeWidth = 1.5,
  dashLength = 7,
  gapLength = 7,
  dotSize = 11,
  speed = 130,
  trailLength = 0.3,
  startDelay = 0,
  startOnView = false,
  showBase = true,
  baseOpacity = 0.25,
  className = "",
}: AnimatedPathProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measurementPathRef = useRef<SVGPathElement>(null);
  const [started, setStarted] = useState(!startOnView);
  const [pathLength, setPathLength] = useState(800);

  const rawId = useId();
  const uniqueId = rawId.replace(/:/g, "");
  const animationName = `smooth-process-flow-${uniqueId}`;
  const animationClass = `smooth-process-path-${uniqueId}`;

  useLayoutEffect(() => {
    const path = measurementPathRef.current;
    if (!path) return;
    const measuredLength = path.getTotalLength();
    if (measuredLength > 0) {
      setPathLength(measuredLength);
    }
  }, []);

  useEffect(() => {
    if (!startOnView) {
      setStarted(true);
      return;
    }
    const element = containerRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setStarted(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [startOnView]);

  const animationDuration = Math.max(pathLength / Math.max(speed, 1), 0.4);
  const normalizedTrail = Math.max(0.01, Math.min(trailLength, 0.9999));
  const normalizedGap = 1 - normalizedTrail;

  const animationStyles = `
    @keyframes ${animationName} {
        from { stroke-dashoffset: 0; }
        to { stroke-dashoffset: -1; }
    }
    .${animationClass} {
        animation-name: ${animationName};
        animation-duration: ${animationDuration}s;
        animation-delay: ${Math.max(startDelay, 0)}s;
        animation-timing-function: linear;
        animation-iteration-count: infinite;
        animation-fill-mode: both;
        will-change: stroke-dashoffset;
    }
    @media (prefers-reduced-motion: reduce) {
        .${animationClass} {
            animation: none !important;
            stroke-dashoffset: 0 !important;
        }
    }
  `;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-visible ${className}`}
    >
      <style>{animationStyles}</style>

      {/* SVG Container with Process Path and Dots */}
      <div className="relative w-full aspect-[927/440] min-h-[380px] sm:min-h-[460px]">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
          className="absolute inset-0 block overflow-visible pointer-events-none"
        >
          <path
            ref={measurementPathRef}
            d={PROCESS_PATH}
            fill="none"
            stroke="transparent"
            strokeWidth={1}
            pointerEvents="none"
          />

          <defs>
            <mask
              id={`moving-trail-mask-${uniqueId}`}
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
              x={-100}
              y={-100}
              width={VIEW_WIDTH + 200}
              height={VIEW_HEIGHT + 200}
            >
              <path
                d={PROCESS_PATH}
                pathLength={1}
                fill="none"
                stroke="white"
                strokeWidth={Math.max(strokeWidth + 14, 18)}
                strokeLinecap="round"
                strokeDasharray={`${normalizedTrail} ${normalizedGap}`}
                strokeDashoffset={0}
                className={started ? animationClass : undefined}
              />
            </mask>
          </defs>

          {showBase && (
            <path
              d={PROCESS_PATH}
              fill="none"
              stroke={lineColor}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${gapLength}`}
              strokeLinecap="round"
              opacity={baseOpacity}
              vectorEffect="non-scaling-stroke"
            />
          )}

          <path
            d={PROCESS_PATH}
            fill="none"
            stroke={lineColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${gapLength}`}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            mask={`url(#moving-trail-mask-${uniqueId})`}
          />

          {processPoints.map((point, index) => (
            <circle
              key={`dot-${index}`}
              cx={point.x}
              cy={point.y}
              r={dotSize / 2}
              fill={dotColor}
            />
          ))}
        </svg>

        {/* Process Step Text Cards positioned next to each curve node */}
        <div className="absolute inset-0 pointer-events-none">
          {processPoints.map((point) => {
            const leftPct = (point.x / VIEW_WIDTH) * 100;
            const topPct = (point.y / VIEW_HEIGHT) * 100;

            return (
              <div
                key={point.step}
                className="absolute pointer-events-auto"
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  transform: "translate(-8%, 20px)",
                  width: "220px",
                  maxWidth: "25vw",
                }}
              >
                <div className="flex flex-col gap-1.5 text-left">
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-1 font-sans tracking-tight">
                    <span className="text-text-secondary">{point.step})</span>
                    <span>{point.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-normal">
                    {point.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
