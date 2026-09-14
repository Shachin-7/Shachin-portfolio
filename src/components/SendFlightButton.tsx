"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── MATH & SPLINE UTILITIES ────────────────────────────────────────────────

const clamp = (val: number, min: number, max: number) =>
  Math.min(max, Math.max(min, val));
const smoothStep = (t: number) => t * t * (3 - 2 * t);
const easeInQuad = (t: number) => t * t;
const smootherStep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

const START_POSE_ROTATION = -8;
const INTRINSIC_NOSE_ANGLE = (Math.atan2(9 - 26, 43 - 22) * 180) / Math.PI;

const closestAngleTo = (target: number, reference: number) => {
  let adjusted = target;
  while (adjusted - reference > 180) adjusted -= 360;
  while (adjusted - reference < -180) adjusted += 360;
  return adjusted;
};

function catmullRom(
  p0: { x: number; y: number },
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number },
  t: number
) {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

function buildRoutePoints(
  distance: number,
  size: number,
  mode: "right" | "up" = "right",
  availableRight = 420,
  upwardDistance = 320
) {
  if (mode === "right") {
    const d = clamp(distance, 180, 500);
    const r = clamp(size * 1.75, 30, 60);
    const cx = Math.min(102, d * 0.32);
    const cy = -Math.min(70, d * 0.24);
    const glideRise = Math.min(d * 0.22, 120);

    const points = [
      { x: 0, y: 0 },
      { x: -1, y: 1.2 },
      { x: 11, y: -8.5 },
      { x: cx - r * 0.95, y: cy + r * 0.48 },
    ];

    const startAngle = (214 * Math.PI) / 180;
    const firstGlidePoint = { x: d * 0.5, y: -glideRise * (0.32 / 0.22) };

    const angleDiff = (a: number, b: number) => {
      let delta = a - b;
      while (delta > Math.PI) delta -= Math.PI * 2;
      while (delta < -Math.PI) delta += Math.PI * 2;
      return Math.abs(delta);
    };

    let bestTurns = 2 * Math.PI * 1.12;
    let bestError = Number.POSITIVE_INFINITY;
    for (let m = 1.08; m <= 1.16; m += 0.002) {
      const turns = 2 * Math.PI * m;
      const endAngle = startAngle - turns;
      const exitPoint = {
        x: cx + r * Math.cos(endAngle),
        y: cy + r * Math.sin(endAngle),
      };
      const targetDirection = Math.atan2(
        firstGlidePoint.y - exitPoint.y,
        firstGlidePoint.x - exitPoint.x
      );
      const tangentDirection = Math.atan2(
        -Math.cos(endAngle),
        Math.sin(endAngle)
      );
      const error = angleDiff(tangentDirection, targetDirection);
      if (error < bestError) {
        bestError = error;
        bestTurns = turns;
      }
    }

    const turns = bestTurns;
    const loopSamples = 16;
    for (let i = 1; i <= loopSamples; i++) {
      const p = i / loopSamples;
      const angle = startAngle - turns * p;
      points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }

    const endAngle = startAngle - turns;
    const tangentVector = { x: Math.sin(endAngle), y: -Math.cos(endAngle) };
    points.push({
      x: cx + r * Math.cos(endAngle) + tangentVector.x * (r * 0.9),
      y: cy + r * Math.sin(endAngle) + tangentVector.y * (r * 0.9),
    });
    points.push(
      firstGlidePoint,
      { x: d * 0.74, y: -glideRise * (0.25 / 0.22) },
      { x: d, y: -glideRise }
    );

    return points;
  }

  // Up route (for compact screens or near right viewport edge)
  const upDistance = clamp(upwardDistance, 180, 420);
  const r = clamp(size * 1.6, 28, 54);
  const rightBudget = clamp(availableRight - 24, 44, 180);
  const cx = Math.min(rightBudget * 0.54, 72);
  const cy = -Math.min(62, upDistance * 0.2);
  const maxDrift = Math.max(36, Math.min(rightBudget * 0.86, 140));

  const points = [
    { x: 0, y: 0 },
    { x: -1.2, y: 1.4 },
    { x: 10.8, y: -8.8 },
    { x: cx - r * 0.94, y: cy + r * 0.56 },
  ];

  const startAngle = (214 * Math.PI) / 180;
  const firstClimbPoint = {
    x: Math.min(maxDrift * 0.68, maxDrift - 10),
    y: -Math.min(upDistance * 0.46, upDistance - 100),
  };

  const angleDiff = (a: number, b: number) => {
    let delta = a - b;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    return Math.abs(delta);
  };

  let bestTurns = 2 * Math.PI * 1.12;
  let bestError = Number.POSITIVE_INFINITY;
  for (let m = 1.08; m <= 1.16; m += 0.002) {
    const turns = 2 * Math.PI * m;
    const endAngle = startAngle - turns;
    const exitPoint = {
      x: cx + r * Math.cos(endAngle),
      y: cy + r * Math.sin(endAngle),
    };
    const targetDirection = Math.atan2(
      firstClimbPoint.y - exitPoint.y,
      firstClimbPoint.x - exitPoint.x
    );
    const tangentDirection = Math.atan2(
      -Math.cos(endAngle),
      Math.sin(endAngle)
    );
    const error = angleDiff(tangentDirection, targetDirection);
    if (error < bestError) {
      bestError = error;
      bestTurns = turns;
    }
  }

  const turns = bestTurns;
  const loopSamples = 16;
  for (let i = 1; i <= loopSamples; i++) {
    const p = i / loopSamples;
    const angle = startAngle - turns * p;
    points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
  }

  const endAngle = startAngle - turns;
  const tangentVector = { x: Math.sin(endAngle), y: -Math.cos(endAngle) };
  points.push({
    x: cx + r * Math.cos(endAngle) + tangentVector.x * (r * 0.78),
    y: cy + r * Math.sin(endAngle) + tangentVector.y * (r * 0.78),
  });
  points.push(
    firstClimbPoint,
    {
      x: Math.min(maxDrift * 0.88, maxDrift),
      y: -Math.min(upDistance * 0.72, upDistance - 70),
    },
    {
      x: Math.min(maxDrift * 0.82, maxDrift - 2),
      y: -Math.min(upDistance * 0.9, upDistance - 24),
    },
    { x: Math.min(maxDrift * 0.64, maxDrift - 12), y: -upDistance }
  );

  return points;
}

function pointOnSpline(points: { x: number; y: number }[], u: number) {
  const segs = points.length - 1;
  const s = clamp(u, 0, 1) * segs;
  const i = Math.min(segs - 1, Math.floor(s));
  const t = s - i;
  const p0 = points[Math.max(0, i - 1)];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[Math.min(points.length - 1, i + 2)];
  return catmullRom(p0, p1, p2, p3, t);
}

function remapProgress(t: number) {
  const phaseA = 0.12 * smootherStep(t);
  const phaseB = 0.5 * easeInQuad(t);
  const phaseC = 1 - Math.pow(1 - t, 1.15);
  const mixAB = smoothStep(clamp((t - 0.18) / 0.3, 0, 1));
  const ab = phaseA * (1 - mixAB) + phaseB * mixAB;
  const mixBC = smoothStep(clamp((t - 0.56) / 0.34, 0, 1));
  return clamp(ab * (1 - mixBC) + phaseC * mixBC, 0, 1);
}

function pointsToSmoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return "";
  let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return path;
}

function buildKeyframes(
  distance: number,
  size: number,
  samples = 140,
  mode: "right" | "up" = "right",
  availableRight = 420,
  upwardDistance = 320
) {
  const route = buildRoutePoints(distance, size, mode, availableRight, upwardDistance);
  const xs: number[] = [];
  const ys: number[] = [];
  const rotates: number[] = [];
  const scaleXs: number[] = [];
  const scaleYs: number[] = [];
  const scales: number[] = [];
  const opacities: number[] = [];
  const trailOffsets: number[] = [];
  const trailOpacity: number[] = [];
  const times: number[] = [];
  const routePoints: { x: number; y: number }[] = [];
  const h = 0.0018;

  const baseProgresses: number[] = [];
  const timeSamples: number[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    baseProgresses.push(remapProgress(t));
    timeSamples.push(t);
  }

  const weights: number[] = [];
  for (let i = 0; i < samples; i++) {
    const progress = baseProgresses[i];
    const prev = pointOnSpline(route, clamp(progress - h, 0, 1));
    const next = pointOnSpline(route, clamp(progress + h, 0, 1));
    const dy = next.y - prev.y;
    const gravityFactor = 1 + 0.18 * clamp(dy / 26, -1, 1);
    weights.push(Math.max(0.2, gravityFactor));
  }

  const cumulative = [0];
  for (let i = 1; i < samples; i++) {
    const dt = timeSamples[i] - timeSamples[i - 1];
    const avgWeight = (weights[i] + weights[i - 1]) * 0.5;
    cumulative.push(cumulative[i - 1] + dt * avgWeight);
  }
  const total = cumulative[cumulative.length - 1] || 1;
  const weightedProgresses = cumulative.map((c) => clamp(c / total, 0, 1));

  const rawRotates: number[] = [];
  let lastAngle = START_POSE_ROTATION;

  for (let i = 0; i < samples; i++) {
    const t = timeSamples[i];
    const progress = weightedProgresses[i];
    const pt = pointOnSpline(route, progress);
    const prev = pointOnSpline(route, clamp(progress - h, 0, 1));
    const next = pointOnSpline(route, clamp(progress + h, 0, 1));
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;

    let tangentDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    while (tangentDeg - lastAngle > 180) tangentDeg -= 360;
    while (tangentDeg - lastAngle < -180) tangentDeg += 360;
    lastAngle = tangentDeg;

    const launchPulse = Math.exp(-Math.pow((t - 0.17) / 0.07, 2)) * 0.015;
    const loopPhase = clamp((t - 0.26) / 0.34, 0, 1);
    const bankEnvelope =
      smoothStep(loopPhase) * (1 - smoothStep(clamp((t - 0.6) / 0.2, 0, 1)));
    const bank = Math.sin(loopPhase * Math.PI * 2) * 0.04 * bankEnvelope;
    const growthPhase = smootherStep(clamp((t - 0.04) / 0.22, 0, 1));
    const glidePhase = smootherStep(clamp((t - 0.62) / 0.38, 0, 1));
    const baseScale = 1 + 0.4 * growthPhase - 0.35 * glidePhase;

    xs.push(pt.x);
    ys.push(pt.y);
    rawRotates.push(tangentDeg);
    scales.push(baseScale);
    scaleXs.push(baseScale * (1 + launchPulse + bank));
    scaleYs.push(baseScale * (1 - launchPulse * 0.7 - bank * 0.65));
    opacities.push(t > 0.95 ? 1 - (t - 0.95) / 0.05 : 1);
    trailOffsets.push(1 - progress);
    trailOpacity.push(
      t < 0.96 ? 0.82 : 0.82 * (1 - smoothStep((t - 0.96) / 0.04))
    );
    times.push(t);
    routePoints.push(pt);
  }

  // Smooth angles
  const smoothingWindow = 4;
  const smoothedAngles = rawRotates.map((_, i) => {
    let sum = 0;
    let count = 0;
    for (let j = i - smoothingWindow; j <= i + smoothingWindow; j++) {
      if (j < 0 || j >= rawRotates.length) continue;
      sum += rawRotates[j];
      count += 1;
    }
    return sum / Math.max(1, count);
  });

  const calibratedAngles = smoothedAngles.map(
    (angle) => angle - INTRINSIC_NOSE_ANGLE
  );

  for (let i = 0; i < calibratedAngles.length; i++) {
    const t = times[i];
    if (i === 0) {
      rotates.push(START_POSE_ROTATION);
      continue;
    }
    const previous = rotates[i - 1];
    const poseBlend = smoothStep(clamp(t / 0.14, 0, 1));
    const trueTarget = closestAngleTo(calibratedAngles[i], previous);
    const startReference = closestAngleTo(START_POSE_ROTATION, trueTarget);
    const blendedTarget =
      startReference * (1 - poseBlend) + trueTarget * poseBlend;
    const stabilizedTarget = closestAngleTo(blendedTarget, previous);
    const isGlide = t > 0.6;
    const baseMaxDelta = isGlide ? 2.5 : 8;
    const lag = Math.abs(trueTarget - previous);
    const adaptiveMaxDelta =
      baseMaxDelta + clamp((lag - baseMaxDelta) * 0.35, 0, 18);
    const delta = clamp(stabilizedTarget - previous, -adaptiveMaxDelta, adaptiveMaxDelta);
    rotates.push(previous + delta);
  }

  const trailPath = pointsToSmoothPath(routePoints);
  return {
    xs,
    ys,
    rotates,
    scales,
    scaleXs,
    scaleYs,
    opacities,
    times,
    trailOffsets,
    trailOpacity,
    trailPath,
    routePoints,
  };
}

// ─── 3D ORIGAMI PAPER AIRPLANE SVG ──────────────────────────────────────────

function OrigamiPlane({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className="overflow-visible select-none pointer-events-none"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient
          id="plane-near-wing-live"
          x1="8"
          y1="27.5"
          x2="43"
          y2="8.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5e7eb" />
        </linearGradient>
        <linearGradient
          id="plane-far-wing-live"
          x1="20"
          y1="33.5"
          x2="43"
          y2="8.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <g transform="translate(0.8 1.2)" opacity="0.2">
        <path d="M8 26L43 9L25 30L8 26Z" fill="#000000" />
        <path d="M25 30L43 9L30.5 38L25 30Z" fill="#000000" />
        <path d="M8 26L25 30L30.5 38L19.8 31.7L8 26Z" fill="#000000" />
      </g>

      {/* Main Body Facets */}
      <path d="M8 26L43 9L25 30L8 26Z" fill="url(#plane-near-wing-live)" />
      <path d="M25 30L43 9L30.5 38L25 30Z" fill="url(#plane-far-wing-live)" />
      <path d="M8 26L25 30L30.5 38L19.8 31.7L8 26Z" fill="#9ca3af" />
      <path
        d="M25 30L43 9L20.9 28.7"
        fill="none"
        stroke="#6b7280"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 26L43 9L30.5 38L19.8 31.7L8 26Z"
        fill="none"
        stroke="rgba(24, 22, 20, 0.85)"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── ACTIVE FLIGHT ANIMATION OVERLAY ────────────────────────────────────────

function ActivePlaneFlight({
  onFlightComplete,
  duration = 2.4,
}: {
  onFlightComplete: () => void;
  duration?: number;
}) {
  const [routeMode, setRouteMode] = useState<"right" | "up">("right");
  const [availableRight, setAvailableRight] = useState(420);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const rightSpace = window.innerWidth - 300;
      if (rightSpace < 340 || window.innerWidth < 768) {
        setRouteMode("up");
        setAvailableRight(Math.max(60, window.innerWidth - 80));
      } else {
        setRouteMode("right");
        setAvailableRight(Math.max(260, rightSpace));
      }
    }
  }, []);

  const flightDistance = 320;
  const size = 24;
  const keyframes = useMemo(
    () =>
      buildKeyframes(
        flightDistance,
        size,
        140,
        routeMode,
        availableRight,
        flightDistance
      ),
    [flightDistance, size, routeMode, availableRight]
  );



  useEffect(() => {
    const timer = setTimeout(() => {
      onFlightComplete();
    }, duration * 1000 - 150);
    return () => clearTimeout(timer);
  }, [duration, onFlightComplete]);

  return (
    <div
      className="absolute top-1/2 right-6 pointer-events-none z-50 overflow-visible"
      style={{ width: 0, height: 0 }}
      aria-hidden="true"
    >
      {/* Animated Flying Origami Airplane ("Deliver Component") */}
      <motion.div
        className="absolute pointer-events-none select-none drop-shadow-lg"
        style={{
          width: size,
          height: size,
          marginLeft: -size / 2,
          marginTop: -size / 2,
        }}
        initial={{ x: 0, y: 0, rotate: START_POSE_ROTATION, opacity: 1 }}
        animate={{
          x: keyframes.xs,
          y: keyframes.ys,
          rotate: keyframes.rotates,
          scale: keyframes.scales,
          scaleX: keyframes.scaleXs,
          scaleY: keyframes.scaleYs,
          opacity: keyframes.opacities,
        }}
        transition={{ duration, times: keyframes.times, ease: "linear" }}
      >
        <OrigamiPlane size={size} />
      </motion.div>
    </div>
  );
}

// ─── MAIN EXPORT: SEND FLIGHT BUTTON COMPONENT ───────────────────────────────

export interface SendFlightButtonProps {
  status?: "default" | "pending" | "success" | "error";
  onClick?: (e: React.MouseEvent) => void;
  disabled?: boolean;
  onFlightComplete?: () => void;
  className?: string;
}

export default function SendFlightButton({
  status = "default",
  onClick,
  disabled = false,
  onFlightComplete,
  className = "",
}: SendFlightButtonProps) {
  const [internalStatus, setInternalStatus] = useState<
    "default" | "pending" | "success" | "error"
  >(status);

  useEffect(() => {
    setInternalStatus(status);
  }, [status]);

  const handleComplete = useCallback(() => {
    setInternalStatus("success");
    onFlightComplete?.();
  }, [onFlightComplete]);

  return (
    <div className="relative inline-flex items-center overflow-visible">
      {/* Paper Plane Flight Active Animation Overlay */}
      {internalStatus === "pending" && (
        <ActivePlaneFlight onFlightComplete={handleComplete} duration={2.3} />
      )}

      <motion.button
        type="submit"
        disabled={
          disabled || internalStatus === "pending" || internalStatus === "success"
        }
        onClick={onClick}
        whileHover={
          internalStatus === "default" && !disabled
            ? { scale: 1.02, backgroundColor: "rgb(23, 21, 19)" }
            : {}
        }
        whileTap={
          internalStatus === "default" && !disabled ? { scale: 0.98 } : {}
        }
        animate={{
          backgroundColor:
            internalStatus === "success"
              ? "rgb(29, 122, 76)"
              : internalStatus === "error"
              ? "rgb(179, 64, 47)"
              : "rgb(15, 23, 42)",
          width:
            internalStatus === "success"
              ? 152
              : internalStatus === "pending"
              ? 152
              : 140,
        }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`relative flex items-center justify-between h-12 px-5 rounded-full text-white font-medium text-sm shadow-md transition-shadow select-none overflow-visible cursor-pointer disabled:cursor-not-allowed ${className}`}
        style={{
          boxShadow:
            internalStatus === "success"
              ? "0 8px 24px -4px rgba(29, 122, 76, 0.45)"
              : "0 8px 20px -4px rgba(15, 23, 42, 0.35)",
        }}
      >
        {/* Label Area */}
        <div className="flex items-center gap-1 min-w-[72px]">
          <AnimatePresence mode="wait">
            {internalStatus === "default" && (
              <motion.span
                key="default-label"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.18 }}
                className="tracking-wide font-semibold text-[15px] text-white"
              >
                Send
              </motion.span>
            )}

            {internalStatus === "pending" && (
              <motion.span
                key="pending-label"
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-0.5 tracking-wide font-semibold text-[15px] text-white"
              >
                Folding
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: 0 }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: 0.2 }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: 0.4 }}
                >
                  .
                </motion.span>
              </motion.span>
            )}

            {internalStatus === "success" && (
              <motion.span
                key="success-label"
                initial={{ opacity: 0, filter: "blur(4px)", y: 2 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="tracking-wide font-semibold text-[15px] text-white"
              >
                Delivered
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Icon Area */}
        <div className="relative w-5 h-5 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {internalStatus === "default" && (
              <motion.div
                key="default-plane-icon"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                whileHover={{ rotate: -12 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center text-white"
              >
                {/* Clean Paper Plane SVG */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="translate-x-0.5 -translate-y-0.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon
                    points="22 2 15 22 11 13 2 9 22 2"
                    fill="white"
                    stroke="none"
                    opacity="0.15"
                  />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </motion.div>
            )}

            {internalStatus === "success" && (
              <motion.div
                key="check-icon"
                initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                className="flex items-center justify-center text-white"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
    </div>
  );
}
