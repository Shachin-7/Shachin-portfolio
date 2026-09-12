"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

// ─── FAB icon set (Lucide SVG shapes, built-in) ────────
const FAB_ICONS: Record<string, React.ReactNode> = {
  Plus: (
    <>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </>
  ),
  Share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
      <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
    </>
  ),
  Send: (
    <>
      <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <path d="m21.854 2.147-10.94 10.939" />
    </>
  ),
  Link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  ExternalLink: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  Copy: (
    <>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </>
  ),
  Heart: (
    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
  ),
  Star: (
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  ),
  Bookmark: (
    <path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />
  ),
  ThumbsUp: (
    <>
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      <path d="M7 10v12" />
    </>
  ),
  Smile: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </>
  ),
  Gift: (
    <>
      <path d="M12 7v14" />
      <path d="M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
      <path d="M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5" />
      <rect x="3" y="7" width="18" height="4" rx="1" />
    </>
  ),
  Message: (
    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
  ),
  Mail: (
    <>
      <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <rect x="2" y="4" width="20" height="16" rx="2" />
    </>
  ),
  AtSign: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
    </>
  ),
  Hash: (
    <>
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </>
  ),
  Megaphone: (
    <>
      <path d="M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" />
      <path d="M8 6v8" />
    </>
  ),
  Bell: (
    <>
      <path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </>
  ),
  Rss: (
    <>
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </>
  ),
  Users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <circle cx="9" cy="7" r="4" />
    </>
  ),
  Globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </>
  ),
  Sparkles: (
    <>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </>
  ),
  Zap: (
    <path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z" />
  ),
  Menu: (
    <>
      <path d="M4 5h16" />
      <path d="M4 12h16" />
      <path d="M4 19h16" />
    </>
  ),
  Dots: (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
};

function FabGlyph({
  name,
  size,
  weight,
}: {
  name: string;
  size: number;
  weight: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {FAB_ICONS[name] || FAB_ICONS.Plus}
    </svg>
  );
}

const FAB_ICON_LAYER: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

// Social platform config
interface PlatformConfig {
  label: string;
  icon: (size: number, copied?: boolean) => React.ReactNode;
  color: string;
  getUrl: (
    url: string,
    text?: string,
    emailSubject?: string,
    resumeUrl?: string
  ) => string;
}

const PLATFORMS: Record<string, PlatformConfig> = {
  resume: {
    label: "Resume",
    icon: (size) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M6.5 4h6a4.5 4.5 0 0 1 3.2 7.6L18 20h-3.3l-2.1-7.2H9.5V20H6.5V4zm3 2.6v4.4h3a2.2 2.2 0 0 0 0-4.4h-3z" />
      </svg>
    ),
    color: "#000000",
    getUrl: (_url, _text, _subject, resumeUrl) =>
      resumeUrl ||
      "https://drive.google.com/file/d/1u89mWJA3SIVcM_bGSncmhk87Xsph-m3V/view?usp=sharing",
  },
  twitter: {
    label: "X / Twitter",
    icon: (size) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "#000000",
    getUrl: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text || "")}`,
  },
  linkedin: {
    label: "LinkedIn",
    icon: (size) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "#0A66C2",
    getUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  facebook: {
    label: "Facebook",
    icon: (size) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: "#1877F2",
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  whatsapp: {
    label: "WhatsApp",
    icon: (size) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
    color: "#25D366",
    getUrl: (url, text) =>
      `https://wa.me/?text=${encodeURIComponent((text ? text + " " : "") + url)}`,
  },
  email: {
    label: "Email",
    icon: (size) => (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    color: "#6366F1",
    getUrl: (url, text, emailSubject) =>
      `mailto:?subject=${encodeURIComponent(emailSubject || "Check this out")}&body=${encodeURIComponent((text ? text + "\n\n" : "") + url)}`,
  },
  instagram: {
    label: "Instagram",
    icon: (size) => (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.6" />
        <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
    color: "#E1306C",
    getUrl: () => "https://instagram.com",
  },
  github: {
    label: "GitHub",
    icon: (size) => (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    color: "#181717",
    getUrl: () => "https://github.com/Shachin-7",
  },
  copy: {
    label: "Copy Link",
    icon: (size, copied) =>
      copied ? (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      ),
    color: "#64748B",
    getUrl: () => "",
  },
};

interface NavItemProps {
  platformKey: string;
  index: number;
  total: number;
  isOpen: boolean;
  spread: number;
  itemSize: number;
  iconSize: number;
  startAngle: number;
  angleSpread?: number;
  useCustomColors: boolean;
  customColor: string;
  iconColor: string;
  depth: number;
  parallaxStrength: number;
  springX: MotionValue<number>;
  springY: MotionValue<number>;
  shareUrl: string;
  shareText: string;
  emailSubject: string;
  resumeUrl?: string;
  tooltipEnabled: boolean;
  tooltipFontSize: number;
  tooltipColor: string;
  tooltipBg: string;
  glowEnabled: boolean;
  glowIntensity: number;
  copied: boolean;
  onCopy: () => void;
  isOtherHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
}

function NavItem({
  platformKey,
  index,
  total,
  isOpen,
  spread,
  itemSize,
  iconSize,
  startAngle,
  angleSpread,
  useCustomColors,
  customColor,
  iconColor,
  depth,
  parallaxStrength,
  springX,
  springY,
  shareUrl,
  shareText,
  emailSubject,
  resumeUrl,
  tooltipEnabled,
  tooltipFontSize,
  tooltipColor,
  tooltipBg,
  glowEnabled,
  glowIntensity,
  copied,
  onCopy,
  isOtherHovered,
  onHover,
  onHoverEnd,
}: NavItemProps) {
  const platform = PLATFORMS[platformKey];
  if (!platform) return null;

  const color = useCustomColors ? customColor : platform.color;

  // Orbit position — semicircle or custom arc: icons spread over angleSpread (default 180°)
  const angleSpreadDeg = angleSpread ?? 180;
  const angleStep = total > 1 ? angleSpreadDeg / (total - 1) : 0;
  const angle = startAngle + angleStep * index;
  const rad = (angle * Math.PI) / 180;
  const targetX = Math.cos(rad) * spread;
  const targetY = Math.sin(rad) * spread;

  // Attraction parallax: icon moves TOWARD the mouse from its orbit position
  const parallaxX = useTransform(
    springX,
    (mx) => (mx - targetX) * depth * parallaxStrength * 0.12
  );
  const parallaxY = useTransform(
    springY,
    (my) => (my - targetY) * depth * parallaxStrength * 0.12
  );

  // Perspective scale: depth=1 = full size, depth=0.1 = slightly smaller
  const perspectiveScale = 0.88 + depth * 0.12;

  // Depth-based shadow
  const shadowBlur = 8 + depth * 20;
  const shadowOpacity = 0.15 + depth * 0.25;
  const shadow = `0 ${Math.round(depth * 12)}px ${shadowBlur}px rgba(0,0,0,${shadowOpacity})`;

  // Glow
  const glowShadow = glowEnabled
    ? `, 0 0 ${Math.round(glowIntensity * depth * 20)}px ${color}60`
    : "";

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (platformKey === "copy") {
      onCopy();
    } else {
      const url = platform.getUrl(shareUrl, shareText, emailSubject, resumeUrl);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key={platformKey}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: -(itemSize / 2),
            marginTop: -(itemSize / 2),
            zIndex: Math.round(depth * 10) + 1,
            pointerEvents: "auto",
          }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{
            x: targetX,
            y: targetY,
            scale: perspectiveScale,
            opacity: 1,
          }}
          exit={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 0,
            transition: {
              type: "spring",
              stiffness: 350,
              damping: 24,
              delay: (total - 1 - index) * 0.04,
            },
          }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 24,
            delay: index * 0.07,
          }}
        >
          <motion.div
            style={{ x: parallaxX, y: parallaxY }}
            animate={{
              filter: isOtherHovered
                ? "blur(1.5px) brightness(0.55)"
                : "blur(0px) brightness(1)",
              opacity: isOtherHovered ? 0.65 : 1,
            }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
          >
            {tooltipEnabled && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                whileHover={{ opacity: 1, y: 0 }}
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: tooltipBg,
                  color: tooltipColor,
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: tooltipFontSize,
                  whiteSpace: "nowrap",
                  pointerEvents: "none",
                  userSelect: "none",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  fontWeight: 500,
                  lineHeight: 1.4,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {platformKey === "copy" && copied ? "Copied!" : platform.label}
              </motion.div>
            )}

            <motion.button
              type="button"
              onClick={handleClick}
              onMouseEnter={onHover}
              onMouseLeave={onHoverEnd}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: itemSize,
                height: itemSize,
                borderRadius: "50%",
                background: platformKey === "copy" && copied ? "#22C55E" : color,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: iconColor,
                boxShadow: shadow + glowShadow,
                transition: "background 0.3s ease",
                flexShrink: 0,
              }}
              title={platform.label}
            >
              {platform.icon(iconSize, platformKey === "copy" ? copied : false)}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export interface ParallaxSocialFABProps {
  style?: React.CSSProperties;
  className?: string;
  shareUrl?: string;
  shareText?: string;
  emailSubject?: string;
  showTwitter?: boolean;
  showResume?: boolean;
  resumeUrl?: string;
  showLinkedin?: boolean;
  showFacebook?: boolean;
  showWhatsapp?: boolean;
  showEmail?: boolean;
  showCopy?: boolean;
  showInstagram?: boolean;
  showGithub?: boolean;
  depthTwitter?: number;
  depthResume?: number;
  depthLinkedin?: number;
  depthFacebook?: number;
  depthWhatsapp?: number;
  depthEmail?: number;
  depthCopy?: number;
  depthInstagram?: number;
  depthGithub?: number;
  fabSize?: number;
  fabColor?: string;
  fabIconColor?: string;
  fabIcon?: string;
  fabIconWeight?: number;
  fabShadow?: string;
  fabOpenOnHover?: boolean;
  itemSize?: number;
  iconSizeRatio?: number;
  spread?: number;
  startAngle?: number;
  angleSpread?: number;
  useCustomColors?: boolean;
  customItemColor?: string;
  iconColor?: string;
  parallaxStrength?: number;
  parallaxSmoothing?: number;
  tooltipEnabled?: boolean;
  tooltipFontSize?: number;
  tooltipColor?: string;
  tooltipBg?: string;
  glowEnabled?: boolean;
  glowIntensity?: number;
  pulseEnabled?: boolean;
  liquidGlass?: boolean;
}

export default function ParallaxSocialFAB({
  style,
  className = "",
  shareUrl = "",
  shareText = "Check out Shachin's AI Engineer & ML Developer Portfolio:",
  emailSubject = "Connecting via Shachin's Portfolio",
  showTwitter = true,
  showResume = false,
  resumeUrl = "https://drive.google.com/file/d/1u89mWJA3SIVcM_bGSncmhk87Xsph-m3V/view?usp=sharing",
  showLinkedin = true,
  showFacebook = false,
  showWhatsapp = true,
  showEmail = false,
  showCopy = true,
  showInstagram = false,
  showGithub = false,
  depthTwitter = 1,
  depthResume = 1,
  depthLinkedin = 0.75,
  depthFacebook = 0.55,
  depthWhatsapp = 0.9,
  depthEmail = 0.65,
  depthCopy = 0.8,
  depthInstagram = 0.85,
  depthGithub = 0.95,
  fabSize = 54,
  fabColor = "#111827",
  fabIconColor = "#ffffff",
  fabIcon = "Share",
  fabIconWeight = 2.2,
  fabShadow = "0 8px 24px rgba(0,0,0,0.25)",
  fabOpenOnHover = false,
  itemSize = 44,
  iconSizeRatio = 0.45,
  spread = 115,
  startAngle = -180,
  angleSpread = 180,
  useCustomColors = false,
  customItemColor = "#333333",
  iconColor = "#ffffff",
  parallaxStrength = 1,
  parallaxSmoothing = 0.6,
  tooltipEnabled = true,
  tooltipFontSize = 12,
  tooltipColor = "#ffffff",
  tooltipBg = "rgba(17,24,39,0.88)",
  glowEnabled = false,
  glowIntensity = 0.5,
  pulseEnabled = true,
  liquidGlass = false,
}: ParallaxSocialFABProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  const springStiffness = 30 + (1 - parallaxSmoothing) * 120;
  const springDamping = 15 + parallaxSmoothing * 25;
  const springX = useSpring(rawMouseX, {
    stiffness: springStiffness,
    damping: springDamping,
  });
  const springY = useSpring(rawMouseY, {
    stiffness: springStiffness,
    damping: springDamping,
  });

  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = useCallback(() => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    if (fabOpenOnHover) {
      setIsOpen(true);
    }
  }, [fabOpenOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (fabOpenOnHover) {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = setTimeout(() => {
        setIsOpen(false);
        setHoveredKey(null);
      }, 250);
    } else {
      setIsOpen(false);
      setHoveredKey(null);
    }
  }, [fabOpenOnHover]);

  // Track mouse relative to FAB center
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawMouseX.set(e.clientX - cx);
    rawMouseY.set(e.clientY - cy);
  }, [rawMouseX, rawMouseY]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  const handleCopy = useCallback(async () => {
    const textToCopy =
      shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    try {
      await navigator.clipboard.writeText(textToCopy);
    } catch {
      const el = document.createElement("textarea");
      el.value = textToCopy;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [shareUrl]);

  // Build active platform list
  const platformEntries: { key: string; depth: number }[] = [];
  if (showGithub) platformEntries.push({ key: "github", depth: depthGithub });
  if (showResume) platformEntries.push({ key: "resume", depth: depthResume });
  if (showTwitter) platformEntries.push({ key: "twitter", depth: depthTwitter });
  if (showLinkedin) platformEntries.push({ key: "linkedin", depth: depthLinkedin });
  if (showInstagram) platformEntries.push({ key: "instagram", depth: depthInstagram });
  if (showFacebook) platformEntries.push({ key: "facebook", depth: depthFacebook });
  if (showWhatsapp) platformEntries.push({ key: "whatsapp", depth: depthWhatsapp });
  if (showEmail) platformEntries.push({ key: "email", depth: depthEmail });
  if (showCopy) platformEntries.push({ key: "copy", depth: depthCopy });

  const calculatedIconSize = Math.round(itemSize * iconSizeRatio);
  const fabIconPx = fabSize * 0.45;
  const isDefaultPlus = fabIcon === "Plus";
  const fabGlow = glowEnabled
    ? `, 0 0 ${Math.round(glowIntensity * 24)}px ${fabColor}80`
    : "";

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Semicircle orbit items */}
      {platformEntries.map(({ key, depth }, i) => (
        <NavItem
          key={key}
          platformKey={key}
          index={i}
          total={platformEntries.length}
          isOpen={isOpen}
          spread={spread}
          itemSize={itemSize}
          iconSize={calculatedIconSize}
          startAngle={startAngle}
          angleSpread={angleSpread}
          useCustomColors={useCustomColors}
          customColor={customItemColor}
          iconColor={iconColor}
          depth={depth}
          parallaxStrength={parallaxStrength}
          springX={springX}
          springY={springY}
          shareUrl={
            shareUrl ||
            (typeof window !== "undefined" ? window.location.href : "")
          }
          shareText={shareText}
          emailSubject={emailSubject}
          resumeUrl={resumeUrl}
          tooltipEnabled={tooltipEnabled}
          tooltipFontSize={tooltipFontSize}
          tooltipColor={tooltipColor}
          tooltipBg={tooltipBg}
          glowEnabled={glowEnabled}
          glowIntensity={glowIntensity}
          copied={copied}
          onCopy={handleCopy}
          isOtherHovered={hoveredKey !== null && hoveredKey !== key}
          onHover={() => {
            handleMouseEnter();
            setHoveredKey(key);
          }}
          onHoverEnd={() => setHoveredKey(null)}
        />
      ))}

      {/* Main trigger button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onMouseEnter={fabOpenOnHover ? () => setIsOpen(true) : undefined}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.93 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          position: "relative",
          width: liquidGlass ? fabSize + 18 : fabSize,
          height: liquidGlass ? fabSize + 18 : fabSize,
          borderRadius: "50%",
          background: liquidGlass
            ? "linear-gradient(135deg, rgba(255, 255, 255, 0.82) 0%, rgba(240, 243, 248, 0.48) 100%)"
            : fabColor,
          backdropFilter: liquidGlass ? "blur(14px)" : undefined,
          WebkitBackdropFilter: liquidGlass ? "blur(14px)" : undefined,
          border: liquidGlass
            ? "1.5px solid rgba(255, 255, 255, 0.95)"
            : "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: fabIconColor,
          zIndex: 20,
          boxShadow: liquidGlass
            ? "0 10px 28px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03), inset 0 1.5px 2px rgba(255, 255, 255, 0.95), inset 0 -1.5px 2px rgba(0, 0, 0, 0.04)"
            : fabShadow + fabGlow,
          outline: "none",
          padding: 0,
        }}
        title={isOpen ? "Close" : "Share"}
        aria-label="Social Share Menu"
      >
        {liquidGlass ? (
          <div
            style={{
              width: fabSize,
              height: fabSize,
              borderRadius: "50%",
              background: fabColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 3px 10px rgba(0, 0, 0, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.16)",
            }}
          >
            <div
              style={{
                position: "relative",
                width: fabIconPx,
                height: fabIconPx,
              }}
            >
              {!isDefaultPlus && (
                <motion.div
                  animate={{ rotate: isOpen ? 45 : 0, opacity: isOpen ? 0 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  style={FAB_ICON_LAYER}
                >
                  <FabGlyph
                    name={fabIcon}
                    size={fabIconPx}
                    weight={fabIconWeight}
                  />
                </motion.div>
              )}
              <motion.div
                animate={{
                  rotate: isOpen ? 45 : 0,
                  opacity: isDefaultPlus ? 1 : isOpen ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={FAB_ICON_LAYER}
              >
                <FabGlyph
                  name="Plus"
                  size={fabIconPx}
                  weight={fabIconWeight}
                />
              </motion.div>
            </div>
          </div>
        ) : (
          <div
            style={{
              position: "relative",
              width: fabIconPx,
              height: fabIconPx,
            }}
          >
            {!isDefaultPlus && (
              <motion.div
                animate={{ rotate: isOpen ? 45 : 0, opacity: isOpen ? 0 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                style={FAB_ICON_LAYER}
              >
                <FabGlyph
                  name={fabIcon}
                  size={fabIconPx}
                  weight={fabIconWeight}
                />
              </motion.div>
            )}
            <motion.div
              animate={{
                rotate: isOpen ? 45 : 0,
                opacity: isDefaultPlus ? 1 : isOpen ? 1 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={FAB_ICON_LAYER}
            >
              <FabGlyph
                name="Plus"
                size={fabIconPx}
                weight={fabIconWeight}
              />
            </motion.div>
          </div>
        )}
      </motion.button>

      {/* Animated Pulse Ring when closed */}
      {pulseEnabled && !isOpen && (
        <motion.div
          animate={{ scale: [1, 1.5, 1.9], opacity: [0.55, 0.25, 0] }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeOut",
            times: [0, 0.25, 1],
          }}
          style={{
            position: "absolute",
            width: liquidGlass ? fabSize + 18 : fabSize,
            height: liquidGlass ? fabSize + 18 : fabSize,
            borderRadius: "50%",
            background: "transparent",
            border: liquidGlass
              ? "1.5px solid rgba(255, 255, 255, 0.85)"
              : `1.5px solid ${fabColor}`,
            boxShadow: liquidGlass
              ? "0 0 12px rgba(255, 255, 255, 0.6)"
              : undefined,
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
}
