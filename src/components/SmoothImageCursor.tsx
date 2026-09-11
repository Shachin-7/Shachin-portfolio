"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";

interface Sticker {
  id: number;
  x: number;
  y: number;
  createdAt: number;
  size: number;
  rotation: number;
  src: string;
}

interface SmoothImageCursorProps {
  images?: string[];
  backgroundColor?: string;
  imageScale?: number;
  sizeRandomness?: number;
  rotationRandomness?: number;
  trailSpacing?: number;
  fadeOutDuration?: number;
  maxImagesOnScreen?: number;
  imageOpacity?: number;
  imageBorderRadius?: number;
  children?: React.ReactNode;
  className?: string;
}

const DEFAULT_IMAGES = [
  "/SHA.png",
  "/profile.jpeg",
  "/images/lanyard_v2.png",
  "/images/github_hero_matrix.png",
  "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11d42aa489a4399fc6521/thumbnail-1-0.png?format=auto&w=800",
  "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11bb42f578a19ae52a066/thumbnail-1-0.png?format=auto&w=800",
  "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11de2aa489a4399fc6887/thumbnail-1-0.png?format=auto&w=800",
];

export default function SmoothImageCursor({
  images = DEFAULT_IMAGES,
  backgroundColor = "transparent",
  imageScale = 140,
  sizeRandomness = 0.25,
  rotationRandomness = 25,
  trailSpacing = 40,
  fadeOutDuration = 0.95,
  maxImagesOnScreen = 20,
  imageOpacity = 0.95,
  imageBorderRadius = 14,
  children,
  className = "",
}: SmoothImageCursorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickersRef = useRef<Sticker[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<{ x: number; y: number } | null>(null);
  const idRef = useRef<number>(0);
  const imageIndexRef = useRef<number>(0);
  const [, setRenderTick] = useState(0);

  const imagePool = useMemo(() => {
    return images.filter((src) => src && src.length > 0);
  }, [images]);

  const triggerRender = useCallback(() => {
    setRenderTick((v) => v + 1);
  }, []);

  const spawnSticker = useCallback(
    (clientX: number, clientY: number) => {
      const node = containerRef.current;
      if (!node || imagePool.length === 0) return;

      const rect = node.getBoundingClientRect();
      const inside =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!inside) {
        lastSpawnRef.current = null;
        return;
      }

      const last = lastSpawnRef.current;
      if (last) {
        const dx = clientX - last.x;
        const dy = clientY - last.y;
        const distance = Math.hypot(dx, dy);
        if (distance < Math.max(1, trailSpacing)) return;
      }

      const chosenSrc = imagePool[imageIndexRef.current % imagePool.length];
      imageIndexRef.current += 1;

      const randomUnit = Math.random() * 2 - 1;
      const randomizedSize = Math.max(
        10,
        imageScale * (1 + randomUnit * sizeRandomness)
      );
      const randomizedRotation = (Math.random() * 2 - 1) * rotationRandomness;

      const sticker: Sticker = {
        id: idRef.current++,
        x: clientX - rect.left,
        y: clientY - rect.top,
        createdAt: performance.now(),
        size: randomizedSize,
        rotation: randomizedRotation,
        src: chosenSrc,
      };

      const next = [...stickersRef.current, sticker];
      const cap = Math.max(1, Math.round(maxImagesOnScreen));
      if (next.length > cap) {
        stickersRef.current = next.slice(next.length - cap);
      } else {
        stickersRef.current = next;
      }

      lastSpawnRef.current = { x: clientX, y: clientY };
      triggerRender();
    },
    [
      imagePool,
      imageScale,
      maxImagesOnScreen,
      rotationRandomness,
      sizeRandomness,
      trailSpacing,
      triggerRender,
    ]
  );

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      spawnSticker(event.clientX, event.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [spawnSticker]);

  useEffect(() => {
    const tick = () => {
      const now = performance.now();
      const lifeMs = Math.max(50, fadeOutDuration * 1000);
      const prevLength = stickersRef.current.length;
      const alive = stickersRef.current.filter(
        (item) => now - item.createdAt < lifeMs
      );

      if (alive.length !== prevLength) {
        stickersRef.current = alive;
        triggerRender();
      }

      if (alive.length > 0) {
        rafRef.current = window.requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    if (stickersRef.current.length > 0 && rafRef.current === null) {
      rafRef.current = window.requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  });

  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  const durationMs = Math.max(50, fadeOutDuration * 1000);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: backgroundColor }}
    >
      {/* Sticker layer underneath content */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {stickersRef.current.map((sticker) => {
          const age = now - sticker.createdAt;
          const progress = Math.max(0, Math.min(1, age / durationMs));
          const currentOpacity = imageOpacity * (1 - progress);
          const currentScale = 1 - progress * 0.4;

          return (
            <div
              key={sticker.id}
              style={{
                position: "absolute",
                left: sticker.x,
                top: sticker.y,
                width: sticker.size,
                height: sticker.size * 0.72,
                transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${currentScale})`,
                transformOrigin: "center",
                opacity: currentOpacity,
                willChange: "transform, opacity",
                pointerEvents: "none",
              }}
            >
              <img
                src={sticker.src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: imageBorderRadius,
                  display: "block",
                  boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Children/Content layer */}
      <div className="relative z-10 w-full h-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
