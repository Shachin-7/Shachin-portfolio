"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";
import { usePathname } from "next/navigation";

export interface ScribbleTrailCursorProps {
  color?: string;
  strokeWidth?: number;
  points?: number;
  tension?: number;
  friction?: number;
  jitter?: number;
  tracking?: "global" | "hover";
  style?: React.CSSProperties;
}

interface TrailPoint {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export default function ScribbleTrailCursor({
  color = "#84cc15",
  strokeWidth = 2,
  points = 4,
  tension = 0.3,
  friction = 0.5,
  jitter = 50,
  tracking = "global",
  style,
}: ScribbleTrailCursorProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isMovingRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clear canvas utility
  const clear = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
  }, []);

  const resizeCanvas = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr =
      typeof window !== "undefined"
        ? Math.max(1, Math.min(3, window.devicePixelRatio || 1))
        : 1;
    const targetW = Math.round(w * dpr);
    const targetH = Math.round(h * dpr);
    if (c.width !== targetW || c.height !== targetH) {
      c.width = targetW;
      c.height = targetH;
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      const ctx = c.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  const updateMouse = useCallback(
    (clientX: number, clientY: number) => {
      // Initialize points to mouse on first move
      if (trailRef.current.length === 0) {
        for (let i = 0; i < Math.max(2, points); i++) {
          trailRef.current.push({ x: clientX, y: clientY, dx: 0, dy: 0 });
        }
      }
      mouseRef.current = { x: clientX, y: clientY };
      isMovingRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        isMovingRef.current = false;
      }, 100);
    },
    [points]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      updateMouse(e.clientX, e.clientY);
    },
    [updateMouse]
  );

  const onPointerLeave = useCallback(() => {
    isMovingRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    clear();
  }, [clear]);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    if (isMovingRef.current && trailRef.current.length > 0) {
      ctx.clearRect(0, 0, c.width, c.height);
      const trail = trailRef.current;
      const mouse = mouseRef.current;

      // Update physics (Spring interpolation logic exactly like Blimp.gr)
      trail.forEach((p, i) => {
        const target = i === 0 ? mouse : trail[i - 1];
        p.dx += tension * (target.x - p.x) + 2 * Math.random();
        p.dy += tension * (target.y - p.y) + 2 * Math.random();
        p.dx *= friction;
        p.dy *= friction;
        p.x += p.dx;
        p.y += p.dy;
      });

      ctx.beginPath();
      ctx.moveTo(trail[0].x + Math.random() * 2, trail[0].y + Math.random() * 2);

      // Replicate the Blimp continuous drawing loop
      for (let i = 0; i < trail.length - 1; i++) {
        const mx = 0.5 * (trail[i].x + trail[i + 1].x + Math.random() * 2);
        const my = 0.5 * (trail[i].y + trail[i + 1].y + Math.random() * 2);
        ctx.quadraticCurveTo(
          trail[i].x + Math.random() * jitter - jitter / 2,
          trail[i].y + Math.random() * jitter - jitter / 2,
          mx,
          my
        );
        ctx.strokeStyle = color;
        ctx.lineWidth = strokeWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke(); // Overdraw segments like the original code
      }
      ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
      ctx.stroke();
    } else {
      ctx.clearRect(0, 0, c.width, c.height);
    }
  }, [color, strokeWidth, tension, friction, jitter]);

  const loop = useCallback(() => {
    rafRef.current = null;
    draw();
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  // Mount setup
  useEffect(() => {
    if (!mounted || pathname?.startsWith("/projects")) return;
    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mounted, pathname, resizeCanvas]);

  // Global tracking setup
  useEffect(() => {
    if (!mounted || pathname?.startsWith("/projects")) return;
    if (tracking !== "global") return;

    const onMove = (e: PointerEvent) => {
      // Exclude project section if cursor is over one
      const target = e.target as HTMLElement | null;
      if (
        target?.closest?.(
          "[data-project-section], #featured-projects, .project-card, [data-exclude-cursor]"
        )
      ) {
        isMovingRef.current = false;
        clear();
        return;
      }
      updateMouse(e.clientX, e.clientY);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mounted, pathname, tracking, updateMouse, clear]);

  // Raf loop setup
  useEffect(() => {
    if (!mounted || pathname?.startsWith("/projects")) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [mounted, pathname, loop]);

  // Trail length dynamic update
  useEffect(() => {
    const targetLen = Math.max(2, points);
    if (trailRef.current.length < targetLen) {
      const last =
        trailRef.current[trailRef.current.length - 1] || mouseRef.current;
      while (trailRef.current.length < targetLen) {
        trailRef.current.push({ x: last.x, y: last.y, dx: 0, dy: 0 });
      }
    } else if (trailRef.current.length > targetLen) {
      trailRef.current.length = targetLen;
    }
  }, [points]);

  // Do not render anything on projects page
  if (!mounted || pathname?.startsWith("/projects")) {
    return null;
  }

  const canvasElement = (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 99999,
      }}
    />
  );

  return (
    <div
      ref={rootRef}
      style={{
        ...style,
        pointerEvents: tracking === "global" ? "none" : "auto",
      }}
      onPointerMove={tracking === "hover" ? onPointerMove : undefined}
      onPointerDown={tracking === "hover" ? onPointerMove : undefined}
      onPointerLeave={tracking === "hover" ? onPointerLeave : undefined}
      onPointerCancel={tracking === "hover" ? onPointerLeave : undefined}
    >
      {typeof document !== "undefined"
        ? ReactDOM.createPortal(canvasElement, document.body)
        : null}
    </div>
  );
}
