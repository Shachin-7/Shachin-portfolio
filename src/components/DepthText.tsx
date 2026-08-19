"use client";

import React, { useEffect, useMemo, useRef } from "react";
import "./DepthText.css";

const MAX_LAYERS = 64;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const DEFAULT_MULTI_COLORS = [
  "#a7ff21", // Lime Green
  "#00f0ff", // Electric Cyan
  "#a855f7", // Neon Purple
  "#ec4899", // Bright Magenta
  "#3b82f6", // Vibrant Blue
];

const getLayerColor = (
  faceColor: string,
  depthColor: string,
  index: number,
  total: number,
  multiColor?: boolean,
  customColors?: string[]
): string => {
  if (multiColor) {
    const palette = customColors && customColors.length > 0 ? customColors : DEFAULT_MULTI_COLORS;
    const progress = total <= 1 ? 0 : (index - 1) / (total - 1);
    const colorIdx = Math.min(
      Math.floor(progress * palette.length),
      palette.length - 1
    );
    const nextColorIdx = Math.min(colorIdx + 1, palette.length - 1);
    const subProgress = (progress * palette.length) % 1;
    const mixPct = Math.round((1 - subProgress) * 100);
    return `color-mix(in srgb, ${palette[colorIdx]} ${mixPct}%, ${palette[nextColorIdx]})`;
  }

  const progress = total <= 1 ? 1 : index / total;
  const eased = progress * progress;
  const faceMix = Math.round((1 - eased) * 72 + 4);
  return `color-mix(in srgb, ${faceColor} ${faceMix}%, ${depthColor})`;
};

const getTransform = (rotateX: number, rotateY: number) =>
  `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg)`;

export interface DepthTextProps {
  text?: string;
  layers?: number;
  depth?: number;
  faceColor?: string;
  depthColor?: string;
  multiColor?: boolean;
  multiColors?: string[];
  tilt?: number;
  pointerTracking?: boolean;
  smoothing?: number;
  perspective?: number;
  autoOrbit?: boolean;
  orbitSpeed?: number;
  fontSize?: string;
  fontWeight?: number | string;
  lineHeight?: number | string;
  shadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function DepthText({
  text = "Intelligent",
  layers = 34,
  depth = 2.4,
  faceColor = "#ffffff",
  depthColor = "#a7ff21",
  multiColor = true,
  multiColors = DEFAULT_MULTI_COLORS,
  tilt = 7.5,
  pointerTracking = true,
  smoothing = 0.14,
  perspective = 900,
  autoOrbit = true,
  orbitSpeed = 0.35,
  fontSize,
  fontWeight = 900,
  lineHeight,
  shadow = true,
  className = "",
  style = {},
}: DepthTextProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const stageRef = useRef<HTMLSpanElement | null>(null);

  const safeLayers = clamp(Math.round(Number(layers) || 1), 2, MAX_LAYERS);
  const safeDepth = clamp(Number(depth) || 0, 0, 12);
  const safeTilt = clamp(Number(tilt) || 0, 0, 12);
  const safeSmoothing = clamp(Number(smoothing) || 0.14, 0.02, 0.35);
  const safePerspective = clamp(Number(perspective) || 900, 300, 2000);
  const safeOrbitSpeed = clamp(Number(orbitSpeed) || 0, 0, 2);

  const baseRotation = useMemo(
    () => ({ x: -safeTilt * 0.32, y: safeTilt * 0.42 }),
    [safeTilt]
  );

  const depthLayers = useMemo(
    () =>
      Array.from({ length: safeLayers }, (_, layerIndex) => {
        const index = safeLayers - layerIndex;
        return {
          index,
          color: getLayerColor(
            faceColor,
            depthColor,
            index,
            safeLayers,
            multiColor,
            multiColors
          ),
          transform: `translateZ(${-index * safeDepth}px)`,
        };
      }),
    [safeLayers, safeDepth, faceColor, depthColor, multiColor, multiColors]
  );

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage || typeof window === "undefined") return undefined;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const canTrackPointer = pointerTracking && finePointer && !reducedMotion;

    let frameId = 0;
    let activePointer = false;
    let startTime = performance.now();
    const current = { ...baseRotation };
    const target = { ...baseRotation };

    const applyTransform = () => {
      stage.style.transform = getTransform(current.x, current.y);
    };

    if (reducedMotion) {
      stage.style.transform = getTransform(baseRotation.x, baseRotation.y);
      return undefined;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      activePointer = true;
      const x = clamp(
        (event.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.8),
        -1,
        1
      );
      const y = clamp(
        (event.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.8),
        -1,
        1
      );

      target.x = baseRotation.x - y * safeTilt;
      target.y = baseRotation.y + x * safeTilt;
    };

    const handlePointerLeave = () => {
      activePointer = false;
      target.x = baseRotation.x;
      target.y = baseRotation.y;
    };

    if (canTrackPointer) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerleave", handlePointerLeave);
      window.addEventListener("blur", handlePointerLeave);
    }

    const tick = (now: number) => {
      if ((!canTrackPointer || !activePointer) && autoOrbit) {
        const elapsed = (now - startTime) / 1000;
        const orbit = elapsed * safeOrbitSpeed * Math.PI * 2;
        const fallbackAmount = canTrackPointer ? 0.18 : 0.55;
        target.x = baseRotation.x + Math.sin(orbit) * safeTilt * fallbackAmount;
        target.y =
          baseRotation.y + Math.cos(orbit * 0.85) * safeTilt * fallbackAmount;
      }

      current.x += (target.x - current.x) * safeSmoothing;
      current.y += (target.y - current.y) * safeSmoothing;
      applyTransform();
      frameId = requestAnimationFrame(tick);
    };

    applyTransform();
    frameId = requestAnimationFrame(tick);

    return () => {
      if (canTrackPointer) {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
        window.removeEventListener("blur", handlePointerLeave);
      }
      cancelAnimationFrame(frameId);
      startTime = 0;
    };
  }, [
    autoOrbit,
    baseRotation,
    pointerTracking,
    safeOrbitSpeed,
    safeSmoothing,
    safeTilt,
  ]);

  const rootStyle: React.CSSProperties = {
    ...style,
    ["--depth-text-perspective" as any]: `${safePerspective}px`,
    ...(fontSize ? { ["--depth-text-font-size" as any]: fontSize } : {}),
    ...(fontWeight ? { ["--depth-text-font-weight" as any]: fontWeight } : {}),
    ...(lineHeight ? { ["--depth-text-line-height" as any]: lineHeight } : {}),
    ["--depth-text-face-color" as any]: faceColor,
    ["--depth-text-depth-color" as any]: depthColor,
    ["--depth-text-shadow" as any]: shadow
      ? `0 22px 34px color-mix(in srgb, ${depthColor} 36%, transparent), 0 4px 14px rgba(0, 0, 0, 0.4)`
      : "none",
  };

  return (
    <span
      ref={rootRef}
      className={`depth-text ${className}`.trim()}
      style={rootStyle}
    >
      <span ref={stageRef} className="depth-text__stage">
        {depthLayers.map((layer) => (
          <span
            aria-hidden="true"
            className="depth-text__layer"
            key={layer.index}
            style={{ color: layer.color, transform: layer.transform }}
          >
            {text}
          </span>
        ))}
        <span className="depth-text__face">{text}</span>
      </span>
    </span>
  );
}
