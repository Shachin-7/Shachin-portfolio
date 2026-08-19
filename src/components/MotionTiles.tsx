"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface MotionTileItem {
  title: string;
  tag: string;
  color?: string;
  video: string;
  github?: string;
  description?: string;
}

interface TileVideoCardProps {
  tile: MotionTileItem;
  index: number;
  total: number;
  isActive: boolean;
  isMobile: boolean;
  onHover: (index: number | null) => void;
  onClick?: (index: number) => void;
  getCardTransform: (index: number) => { x: number; z: number; scale: number };
}

/**
 * Memoized Video Card component.
 * Keeps HTML5 video element playing continuously without restarting on parent state updates.
 */
const TileVideoCard = React.memo(function TileVideoCard({
  tile,
  index,
  total,
  isActive,
  isMobile,
  onHover,
  onClick,
  getCardTransform,
}: TileVideoCardProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);

  const transform = getCardTransform(index);
  const x = transform?.x || 0;
  const z = transform?.z || 0;
  const scale = transform?.scale || 1;

  return (
    <motion.div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => {
        if (onClick) {
          onClick(index);
        } else if (tile.github) {
          window.open(tile.github, "_blank", "noopener,noreferrer");
        }
      }}
      animate={isMobile ? {} : { x, z, scale }}
      transition={{ type: "spring", stiffness: 100, damping: 18, mass: 0.6 }}
      style={{
        ...styles.card,
        ...(isMobile ? styles.mobileCard : styles.desktopCard),
        zIndex: isActive ? 1000 : 10 + (total - 1 - index),
        boxShadow: isActive
          ? "0 30px 60px rgba(0,0,0,0.7), 0 10px 25px rgba(0,0,0,0.5)"
          : "0 20px 45px rgba(0,0,0,0.45), 0 6px 12px rgba(0,0,0,0.3)",
        border: isActive
          ? `1.8px solid ${tile.color || "#a7ff21"}`
          : "1px solid rgba(255,255,255,0.08)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Loop Video */}
      <video
        ref={videoRef}
        src={tile.video}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={styles.cardVideo}
      />

      {/* Cover overlay styling */}
      <div
        style={{
          ...styles.cardOverlay,
          background: isActive
            ? "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.88) 100%)"
            : "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.8) 100%)",
          opacity: isActive ? 1 : 0.88,
          transition: "all 0.3s ease",
        }}
      >
        <span
          style={{
            ...styles.cardTag,
            color: tile.color || "#a7ff21",
          }}
        >
          {tile.tag}
        </span>
        <h4 style={styles.cardTitle}>{tile.title}</h4>
      </div>
    </motion.div>
  );
});

interface MotionTilesProps {
  tiles?: MotionTileItem[];
  onTileClick?: (index: number) => void;
  className?: string;
}

/**
 * MotionTiles component.
 * GPU-accelerated 3D tilt via MotionValues (0 React state re-renders on mouse move).
 */
export default function MotionTiles({
  tiles = [],
  onTileClick,
  className = "",
}: MotionTilesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen size to handle responsiveness dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 810);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mouse tracking variables for cursor parallax on desktop
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Smooth springs for tracking mouse coordinates
  const springConfig = { stiffness: 90, damping: 20, mass: 0.5 };
  const smoothX = useSpring(rawMouseX, springConfig);
  const smoothY = useSpring(rawMouseY, springConfig);

  // Derived 3D rotations via MotionValues
  const tiltX = useTransform(smoothY, (v) => (isMobile ? 0 : -25 + v * 8));
  const tiltY = useTransform(smoothX, (v) => (isMobile ? 0 : 35 + v * 10));

  // Rotate container based on mouse move relative to component bounds
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isMobile || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      rawMouseX.set(nx);
      rawMouseY.set(ny);
    },
    [isMobile, rawMouseX, rawMouseY]
  );

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    rawMouseX.set(0);
    rawMouseY.set(0);
    setActiveIndex(null);
  }, [isMobile, rawMouseX, rawMouseY]);

  const handleHover = useCallback((index: number | null) => {
    setActiveIndex(index);
  }, []);

  // Symmetrical math helper coordinates for cards placement
  const getCardTransform = useCallback(
    (index: number) => {
      if (isMobile) return { x: 0, z: 0, scale: 1 };
      const count = tiles.length || 1;
      const mid = (count - 1) / 2;
      const itemOffset = index - mid;

      const xOffset = -itemOffset * 135;
      const zOffset = -itemOffset * 135;

      const isActive = activeIndex === index;
      const zFinal = isActive ? zOffset - 40 : zOffset;

      return {
        x: xOffset,
        z: zFinal,
        scale: 1,
      };
    },
    [isMobile, tiles.length, activeIndex]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={isMobile ? styles.mobileLayout : styles.desktopLayout}
    >
      {/* ── LEFT/TOP PANEL: Text Title and Tag Paragraph ── */}
      <div style={isMobile ? styles.mobileTextCol : styles.desktopTextCol}>
        <h3 style={styles.sectionSubtitle}>Selected Works</h3>
        <p style={styles.paragraph}>
          Delivering end-to-end data value, including:{" "}
          {tiles.map((tile, i) => {
            const isActive = activeIndex === i;
            const isAnyActive = activeIndex !== null;

            const itemOpacity = isAnyActive ? (isActive ? 1 : 0.3) : 1;
            const itemColor = isActive
              ? tile.color || "#a7ff21"
              : "var(--text-primary, rgba(255, 255, 255, 0.95))";

            return (
              <span
                key={i}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
                onClick={() => {
                  if (onTileClick) {
                    onTileClick(i);
                  } else if (tile.github) {
                    window.open(tile.github, "_blank", "noopener,noreferrer");
                  }
                }}
                style={{
                  opacity: itemOpacity,
                  transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  cursor: "pointer",
                  display: "inline",
                }}
              >
                <span
                  style={{
                    color: itemColor,
                    fontWeight: isActive ? "700" : "600",
                    transition: "color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    textDecorationLine: isActive ? "underline" : "none",
                    textDecorationColor: tile.color || "#a7ff21",
                    textUnderlineOffset: "4px",
                    fontFamily: "var(--font-clash-display), system-ui, sans-serif",
                  }}
                >
                  {tile.title}
                </span>
                <span
                  style={{
                    color: "var(--text-primary, rgba(255, 255, 255, 0.95))",
                    fontWeight: "600",
                    fontFamily: "var(--font-clash-display), system-ui, sans-serif",
                  }}
                >
                  {i < tiles.length - 1
                    ? i === tiles.length - 2
                      ? ", and "
                      : ", "
                    : "."}
                </span>
              </span>
            );
          })}
        </p>
      </div>

      {/* ── RIGHT/BOTTOM PANEL: 3D Depth Stack Container ── */}
      <div style={isMobile ? styles.mobileVideoCol : styles.desktopVideoCol}>
        <motion.div
          style={{
            ...styles.videoScene,
            transformStyle: isMobile ? "flat" : "preserve-3d",
            rotateX: tiltX,
            rotateY: tiltY,
            perspective: isMobile ? "none" : "5000px",
          }}
        >
          {tiles.map((tile, i) => (
            <TileVideoCard
              key={tile.title || i}
              tile={tile}
              index={i}
              total={tiles.length}
              isActive={activeIndex === i}
              isMobile={isMobile}
              onHover={handleHover}
              onClick={onTileClick}
              getCardTransform={getCardTransform}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  desktopLayout: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    width: "1200px",
    maxWidth: "100%",
    height: "480px",
    padding: "25px 0px 0px 0px",
    position: "relative",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  mobileLayout: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    width: "100%",
    padding: "0 20px",
    boxSizing: "border-box",
  },

  desktopTextCol: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    padding: "0px 0px 0px 20px",
    boxSizing: "border-box",
  },
  mobileTextCol: {
    width: "100%",
    padding: 0,
  },

  sectionSubtitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#8c8c8c",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    marginBottom: "16px",
    margin: 0,
    fontFamily: "var(--font-clash-display), system-ui, sans-serif",
  },
  paragraph: {
    fontSize: "clamp(1.4rem, 2.3vw, 2.2rem)",
    lineHeight: "1.45",
    color: "var(--text-primary, rgba(255,255,255,0.9))",
    margin: 0,
    maxWidth: "1000px",
    fontFamily: "var(--font-clash-display), system-ui, sans-serif",
    letterSpacing: "-0.035em",
    fontWeight: 600,
  },

  desktopVideoCol: {
    width: "350px",
    height: "220px",
    position: "relative",
    overflow: "visible",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mobileVideoCol: {
    width: "100%",
    overflowX: "auto",
    padding: "10px 0 30px 0",
    WebkitOverflowScrolling: "touch",
    scrollSnapType: "x mandatory",
  },

  videoScene: {
    width: "100%",
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    borderRadius: "3px", // Sharp, sleek high-tech edges
    overflow: "hidden",
    backgroundColor: "#0d0d0d",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    cursor: "pointer",
    position: "absolute",
  },
  desktopCard: {
    width: "440px",
    height: "275px",
    left: "50%",
    top: "50%",
    marginLeft: "-220px",
    marginTop: "-137px",
  },
  mobileCard: {
    width: "285px",
    height: "190px",
    position: "relative",
    flexShrink: 0,
    scrollSnapAlign: "center",
  },

  cardVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    inset: 0,
    zIndex: 1,
  },
  cardOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "20px 24px",
  },
  cardTag: {
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: "4px",
    fontFamily: "var(--font-clash-display), system-ui, sans-serif",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    margin: 0,
    lineHeight: "1.25",
    fontFamily: "var(--font-clash-display), system-ui, sans-serif",
    letterSpacing: "-0.02em",
  },
};
