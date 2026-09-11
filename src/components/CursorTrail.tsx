"use client";

import React, { useRef, useEffect, useState, startTransition } from "react";

export interface CursorTrailProps {
  squareSize?: number;
  fadeDuration?: number;
  color?: string;
  maxSquares?: number;
  shape?: "square" | "circle";
  className?: string;
  style?: React.CSSProperties;
}

interface Square {
  x: number;
  y: number;
  key: number;
  created: number;
}

/**
 * CursorTrail — Mouse grid tail effect with fading shapes following the mouse.
 * Snaps to an invisible grid with user-controllable size, color, shape, and fade duration.
 */
export default function CursorTrail({
  squareSize = 32,
  fadeDuration = 750,
  color = "rgba(255, 255, 255, 0.18)",
  maxSquares = 30,
  shape = "square",
  className = "",
  style = {},
}: CursorTrailProps) {
  const [squares, setSquares] = useState<Square[]>([]);
  const keyRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  // Mouse move handler
  useEffect(() => {
    function handle(e: MouseEvent) {
      const x = Math.floor(e.clientX / squareSize) * squareSize;
      const y = Math.floor(e.clientY / squareSize) * squareSize;
      const now = Date.now();

      startTransition(() => {
        setSquares((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            if (last.x === x && last.y === y) return prev;
          }
          const next = [...prev, { x, y, key: keyRef.current++, created: now }];
          return next.slice(-maxSquares);
        });
      });
    }

    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [squareSize, maxSquares]);

  // Remove old squares
  useEffect(() => {
    function clean() {
      const now = Date.now();
      startTransition(() => {
        setSquares((prev) => prev.filter((sq) => now - sq.created < fadeDuration));
      });
      rafRef.current = requestAnimationFrame(clean);
    }
    rafRef.current = requestAnimationFrame(clean);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [fadeDuration]);

  return (
    <div
      className={className}
      style={{
        ...style,
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 35,
      }}
    >
      {squares.map((sq) => {
        const age = Date.now() - sq.created;
        const opacity = 1 - Math.min(1, age / fadeDuration);
        return (
          <div
            key={sq.key}
            style={{
              position: "absolute",
              left: sq.x,
              top: sq.y,
              width: squareSize,
              height: squareSize,
              background: color,
              opacity,
              borderRadius: shape === "circle" ? "50%" : "4px",
              pointerEvents: "none",
              transition: "opacity 0.2s linear",
              willChange: "opacity",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.08)",
            }}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
