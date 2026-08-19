"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import * as THREE from "three";

// ─── YOUR PROJECT DATA (from portfolio.ts) ────────────────────────────────────
const PROJECTS = [
  {
    title: "OrbitXOS",
    fullTitle: "Real-Time Space Safety & Satellite Tracking Platform",
    category: "Machine Learning & AI",
    year: "2026",
    github: "https://github.com/Shachin-7/Orbit-xos",
    image:
      "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118555/Orbit_xos_nyxur3.mov",
  },
  {
    title: "Senior Business Analyst",
    fullTitle: "Freelance Portfolio for Senior Business Analyst",
    category: "Freelance & Web App",
    year: "2026",
    github: "https://www.suryah.pro",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1787156871/Screen_Recording_2026-08-19_at_9.46.01_PM_m92pbm.mov",
  },
  {
    title: "ABB Company Director",
    fullTitle: "Freelance Portfolio for Director of ABB Company",
    category: "Freelance & Web App",
    year: "2026",
    github: "https://babu-portfolio-it5x.vercel.app",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1787156989/Screen_Recording_2026-08-19_at_9.53.17_PM_yuxbha.mov",
  },
  {
    title: "JV Associate LLC",
    fullTitle: "Complete Frontend Website for JV Associate LLC",
    category: "Frontend Development",
    year: "2026",
    github: "https://web.jvassociatellc.com",
    image:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118465/Frontend_website_artwtp.mov",
  },
  {
    title: "Email Automation",
    fullTitle: "Lead Generation & Email Automation Platform",
    category: "Data Engineering",
    year: "2026",
    github: "https://github.com/Shachin-7/email-automation",
    image:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118304/Email_automation_nw6o9w.mov",
  },
  {
    title: "Satellite Error AI",
    fullTitle: "AI-Based Satellite Error Prediction",
    category: "Deep Learning",
    year: "2026",
    github: "https://github.com/DevSanjay09/ISRO-NAVIC",
    image:
      "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118555/Orbit_xos_nyxur3.mov",
  },
  {
    title: "Undersea Cable",
    fullTitle: "Undersea Cable Failure Detection",
    category: "Machine Learning",
    year: "2026",
    github: "https://github.com/Shachin-7/Undersea-cable-failure-detection",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118335/undersea_video_d6gnor.mp4",
  },
  {
    title: "Social Media AI",
    fullTitle: "AI-Driven Social Media Automation",
    category: "AI & Automation",
    year: "2026",
    github: "https://github.com/Shachin-7/Social-Media-Automation",
    image:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118518/social_media_automation_z5sv0t.mov",
  },
  {
    title: "Railway Crack AI",
    fullTitle: "Railway Track Crack Detection System",
    category: "Computer Vision",
    year: "2026",
    github:
      "https://github.com/Shachin-7/Indian-railway-track-crack-detection-system",
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118557/railway_crack_detection_dsjjgv.mov",
  },
  {
    title: "OD Management",
    fullTitle: "On-Duty Management System",
    category: "Web Application",
    year: "2023",
    github: "https://github.com/Shachin-7/OD-management-system",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    video:
      "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781116179/OD_MANAGEMENT_dmin_yykg4a.mp4",
  },
];

// ─── WebGL Shaders ────────────────────────────────────────────────────────────
const vertexShader = `
  uniform float uScrollSpeed;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float warpX = (uv.x - 0.5) * 2.0;
    float warpY = (uv.y - 0.5) * 2.0;
    pos.z -= abs(warpX) * 0.14 * (1.0 - abs(warpY) * 0.4);
    pos.z += sin(uv.y * 3.14159) * uScrollSpeed * 0.5;
    pos.x += (uv.y - 0.5) * uScrollSpeed * 0.2;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uDarken;
  uniform float uZoom;
  uniform float uCornerRadius;
  uniform float uReveal;
  uniform float uOpacity;
  varying vec2 vUv;
  float roundedBox(vec2 uv, vec2 halfSize, float r) {
    vec2 d = abs(uv) - halfSize + r;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
  }
  void main() {
    vec2 zUv = (vUv - 0.5) / uZoom + 0.5;
    vec4 color = texture2D(uTexture, clamp(zUv, 0.0, 1.0));
    color.rgb = mix(color.rgb, color.rgb * 0.55, uDarken);
    float reveal = clamp(uReveal, 0.0, 1.0);
    float dist = roundedBox(vUv - 0.5, vec2(0.5), uCornerRadius);
    float alpha = (1.0 - smoothstep(-0.005, 0.005, dist)) * smoothstep(0.0, 0.25, reveal);
    gl_FragColor = vec4(color.rgb, alpha * color.a * uOpacity);
  }
`;

// ─── Layout constants ─────────────────────────────────────────────────────────
const PLANE_W = 1.6,
  PLANE_H = 1.0,
  V_GAP = 0.58,
  A_GAP = 0.92;
const RADIUS = 2.0,
  Y_OFFSET = -0.8,
  CAM_FOV = 35,
  CAM_Z = 9.2;
const N_ORIG = PROJECTS.length;
const N_SLOTS = N_ORIG * 4;
const CTR_IDX = Math.floor(N_SLOTS / 2);

// ─── Spiral WebGL Canvas ──────────────────────────────────────────────────────
function SpiralCanvas({
  onHoverChange,
}: {
  onHoverChange: (idx: number | null) => void;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let W = el.offsetWidth || window.innerWidth;
    let H = el.offsetHeight || window.innerHeight;
    if (!W || !H) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAM_FOV, W / H, 0.1, 100);
    camera.position.set(0, 0, CAM_Z * Math.max(1, 1.48 / (W / H)));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const cv = renderer.domElement;
    cv.style.cssText =
      "position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;";
    el.appendChild(cv);

    const geo = new THREE.PlaneGeometry(1, 1, 8, 8);
    const PALETTE: [string, string][] = [
      ["#1a1a4e", "#6a3de8"],
      ["#0d3b2e", "#00cc88"],
      ["#3d0d2a", "#e83d7a"],
      ["#1a2e4e", "#3d8be8"],
      ["#3d2a0d", "#e89e3d"],
    ];

    function makeFallback(pi: number) {
      const c = document.createElement("canvas");
      c.width = 512;
      c.height = 302;
      const ctx = c.getContext("2d")!;
      const [c1, c2] = PALETTE[pi % PALETTE.length];
      const g = ctx.createLinearGradient(0, 0, 512, 302);
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 302);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }

    const cards = Array.from({ length: N_SLOTS }, (_, i) => {
      const pi = i % N_ORIG,
        tex = makeFallback(pi);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: tex },
          uDarken: { value: 0 },
          uZoom: { value: 1 },
          uCornerRadius: { value: 0.06 },
          uReveal: { value: 0 },
          uScrollSpeed: { value: 0 },
          uOpacity: { value: 1 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.set(PLANE_W, PLANE_H, 1);
      mesh.userData.pi = pi;
      scene.add(mesh);
      return {
        mesh,
        mat,
        tex: tex as THREE.Texture,
        pi,
        reveal: 0,
        revealStarted: false,
      };
    });

    function makeVideoTexture(src: string) {
      const vid = document.createElement("video");
      vid.src = src;
      vid.crossOrigin = "anonymous";
      vid.autoplay = true;
      vid.loop = true;
      vid.muted = true;
      vid.playsInline = true;
      vid.setAttribute("webkit-playsinline", "true");
      vid.play().catch(() => {});
      const t = new THREE.VideoTexture(vid);
      t.colorSpace = THREE.SRGBColorSpace;
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      return t;
    }

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    PROJECTS.forEach((p, pi) => {
      if (p.video) {
        const t = makeVideoTexture(p.video);
        cards
          .filter((c) => c.pi === pi)
          .forEach((c) => {
            c.mat.uniforms.uTexture.value = t;
            c.tex = t;
          });
      } else {
        loader.load(p.image, (t) => {
          t.colorSpace = THREE.SRGBColorSpace;
          cards
            .filter((c) => c.pi === pi)
            .forEach((c) => {
              c.mat.uniforms.uTexture.value = t;
              c.tex = t;
            });
        });
      }
    });

    cards.forEach((c, i) =>
      setTimeout(
        () => {
          c.revealStarted = true;
        },
        (i % 5) * 70
      )
    );

    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let scrollOff = 0,
      wheelDY = 0.0005,
      targetDY = 0.0005,
      hoveredPi = -1;
    let dragging = false,
      prevDragY = 0,
      lastTime = performance.now(),
      animId: number;

    function tick() {
      animId = requestAnimationFrame(tick);
      const now = performance.now(),
        delta = Math.min(now - lastTime, 50);
      lastTime = now;
      targetDY += (0.0005 - targetDY) * 0.025;
      wheelDY += (targetDY - wheelDY) * 0.085;
      scrollOff += wheelDY * (delta / 16.67);

      cards.forEach(({ mesh, mat }, i) => {
        const wi = ((i - scrollOff) % N_SLOTS + N_SLOTS) % N_SLOTS;
        const ci = wi - CTR_IDX;
        const angle = ci * A_GAP,
          y = ci * V_GAP + Y_OFFSET;
        const opacity =
          1.0 -
          Math.min(1.0, Math.max(0.0, (Math.abs(ci) - 6.5) / 2.5));
        mat.uniforms.uOpacity.value = opacity;
        mesh.position.set(
          Math.cos(angle) * RADIUS,
          y,
          Math.sin(angle) * RADIUS
        );
        mesh.rotation.y = -angle + Math.PI / 2;
        mesh.scale.set(PLANE_W, PLANE_H, 1);
        mat.uniforms.uScrollSpeed.value = wheelDY;
        const c = cards[i];
        if (c.revealStarted && c.reveal < 1) {
          c.reveal = Math.min(1, c.reveal + 0.035);
          mat.uniforms.uReveal.value = c.reveal;
        }
        mesh.renderOrder = Math.round(
          (20 - camera.position.distanceTo(mesh.position)) * 100
        );
      });

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(
        cards.filter((c) => c.reveal > 0.05).map((c) => c.mesh)
      );
      const nxtPi = hits.length > 0 ? hits[0].object.userData.pi : -1;
      if (nxtPi !== hoveredPi) {
        cards.forEach((c) => {
          const isHov = c.pi === nxtPi && nxtPi >= 0;
          c.mat.uniforms.uDarken.value =
            nxtPi >= 0 && !isHov ? 0.45 : 0;
          c.mat.uniforms.uZoom.value = isHov ? 1.06 : 1;
        });
        hoveredPi = nxtPi;
        onHoverChange(nxtPi >= 0 ? nxtPi : null);
      }
      renderer.render(scene, camera);
    }
    tick();

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const imp = Math.max(-0.004, Math.min(0.004, e.deltaY * 0.00006));
      targetDY += imp;
      targetDY = Math.max(-0.015, Math.min(0.015, targetDY));
      wheelDY = targetDY;
    };
    const onMouseMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      if (dragging) {
        targetDY += -(e.clientY - prevDragY) * 0.0004;
        targetDY = Math.max(-0.03, Math.min(0.03, targetDY));
        wheelDY = targetDY;
        prevDragY = e.clientY;
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      prevDragY = e.clientY;
      el.style.cursor = "grabbing";
    };
    const onMouseUp = () => {
      dragging = false;
      el.style.cursor = "grab";
    };
    const onTouchStart = (e: TouchEvent) => {
      dragging = true;
      prevDragY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragging) return;
      e.preventDefault();
      targetDY += -(e.touches[0].clientY - prevDragY) * 0.0004;
      targetDY = Math.max(-0.03, Math.min(0.03, targetDY));
      wheelDY = targetDY;
      prevDragY = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      dragging = false;
    };
    const onResize = () => {
      W = el.offsetWidth;
      H = el.offsetHeight;
      if (!W || !H) return;
      camera.aspect = W / H;
      camera.position.z = CAM_Z * Math.max(1, 1.48 / (W / H));
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };

    el.style.cursor = "grab";
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseUp);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      ro.disconnect();
      cards.forEach(({ mat, tex }) => {
        mat.dispose();
        if (tex) {
          const vid = (tex as THREE.VideoTexture).image as
            | HTMLVideoElement
            | undefined;
          if (vid?.pause) {
            vid.pause();
            vid.src = "";
            vid.load();
          }
          tex.dispose();
        }
      });
      geo.dispose();
      renderer.dispose();
      if (el.contains(cv)) el.removeChild(cv);
    };
  }, [onHoverChange]);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
      }}
    />
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  .pp * { box-sizing: border-box; }
  .view-switch {
    display: flex;
    align-items: center;
    gap: 16px;
    position: fixed;
    top: 84px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    background: rgba(10,10,10,0.6);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border-radius: 100px;
    padding: 8px 22px;
  }
  .sw {
    background: none;
    border: none;
    cursor: pointer;
    color: rgba(255,255,255,0.38);
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    padding: 0;
    transition: color 0.22s ease;
  }
  .sw.sw-on { color: #fff; }
  .sw:hover { color: rgba(255,255,255,0.72); }
  .sw-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255,255,255,0.55);
    flex-shrink: 0;
  }
  .list-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 15vh 0;
    position: relative;
    z-index: 1;
  }
  .proj-item {
    cursor: pointer;
    font-size: clamp(30px, 4.8vw, 62px);
    font-weight: 500;
    color: #fff;
    margin: 0;
    padding: 0.3em 0;
    text-decoration: none;
    display: block;
    text-align: center;
    letter-spacing: -0.03em;
    font-family: 'Inter', sans-serif;
    line-height: 1.1;
    transition: opacity 0.28s ease;
  }
  .list-view:has(.proj-item:hover) .proj-item:not(:hover) { opacity: 0.15; }
  .proj-meta {
    display: block;
    font-size: clamp(13px, 1.4vw, 18px);
    font-weight: 400;
    color: rgba(255,255,255,0.35);
    margin-top: 4px;
    letter-spacing: 0.01em;
  }

  /* ─── Expandable Navigation Menu ─── */
  .nav-menu-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 100;
    display: flex;
    align-items: center;
  }
  .menu-collapsed {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  .menu-text {
    background: #ffffff;
    color: #000000;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    padding: 10px 24px;
    border-radius: 100px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .menu-text:hover {
    background: #f0f0f0;
    transform: scale(1.02);
  }
  .menu-arrow-circle {
    width: 40px;
    height: 40px;
    background: #ffffff;
    color: #000000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .menu-arrow-circle:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }
  .menu-expanded {
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 100px;
    padding: 6px 8px 6px 6px;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.3);
    gap: 16px;
  }
  .menu-arrow-circle-back {
    width: 36px;
    height: 36px;
    background: #f5f5f5;
    color: #000000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: transform 0.2s ease, background 0.2s ease;
  }
  .menu-arrow-circle-back:hover {
    background: #e5e5e5;
    transform: scale(1.05);
  }
  .menu-links {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-right: 16px;
  }
  .menu-link-item {
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: #777777;
    text-decoration: none;
    transition: color 0.2s ease;
  }
  .menu-link-item:hover {
    color: #000000;
  }
  .menu-link-item.active {
    color: #000000;
    font-weight: 600;
  }
`;

// ─── Main Projects Component ──────────────────────────────────────────────────
export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"spiral" | "list">("spiral");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const [menuOpen, setMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    // Inject custom CSS dynamically on client-side
    const styleEl = document.createElement("style");
    styleEl.innerHTML = CSS;
    document.head.appendChild(styleEl);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);

    // Track window width safely
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      document.head.removeChild(styleEl);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const tipLeft =
    mousePos.x > windowWidth - 260
      ? mousePos.x - 240
      : mousePos.x + 22;

  return (
    <section
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#000",
        position: "relative",
        overflow: viewMode === "spiral" ? "hidden" : "visible",
      }}
    >
      {/* Top-Right Expandable Menu (Hover-activated with 3D animation) */}
      <div
        className="nav-menu-container"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        style={{ perspective: "1000px" }}
      >
        <AnimatePresence mode="wait">
          {!menuOpen ? (
            <motion.div
              key="collapsed"
              className="menu-collapsed"
              initial={{ opacity: 0, scale: 0.9, rotateY: 15, z: -50 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, z: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: -20, z: -80 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="menu-text"
                whileHover={{ scale: 1.05, rotateX: -5, boxShadow: "0 8px 25px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => setMenuOpen(true)}
              >
                Menu
              </motion.div>
              <motion.div
                className="menu-arrow-circle"
                whileHover={{ scale: 1.1, rotateZ: 45, boxShadow: "0 8px 25px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => setMenuOpen(true)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              className="menu-expanded"
              initial={{ opacity: 0, scale: 0.82, rotateY: -35, rotateX: 15, z: -100 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0, z: 0 }}
              exit={{ opacity: 0, scale: 0.85, rotateY: 25, rotateX: -10, z: -80 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="menu-arrow-circle-back"
                whileHover={{ scale: 1.12, rotateZ: -45, backgroundColor: "#e5e7eb" }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                onClick={() => setMenuOpen(false)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </motion.div>
              <div className="menu-links">
                <Link href="/">
                  <motion.span
                    className="menu-link-item"
                    whileHover={{ scale: 1.12, y: -2, color: "#000000" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    style={{ display: "inline-block", cursor: "pointer" }}
                  >
                    Home
                  </motion.span>
                </Link>
                <Link href="/about">
                  <motion.span
                    className="menu-link-item"
                    whileHover={{ scale: 1.12, y: -2, color: "#000000" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    style={{ display: "inline-block", cursor: "pointer" }}
                  >
                    About
                  </motion.span>
                </Link>
                <motion.span
                  className="menu-link-item active"
                  style={{ display: "inline-block", cursor: "default" }}
                >
                  Projects
                </motion.span>
                <Link href="/contact">
                  <motion.span
                    className="menu-link-item"
                    whileHover={{ scale: 1.12, y: -2, color: "#000000" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    style={{ display: "inline-block", cursor: "pointer" }}
                  >
                    Contact
                  </motion.span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div
        className="pp"
        style={{
          width: "100%",
          height: viewMode === "spiral" ? "100vh" : "auto",
          position: "relative",
        }}
      >
        {/* Toggle pill */}
        <div className="view-switch">
          <button
            id="view-spiral-btn"
            className={`sw ${viewMode === "spiral" ? "sw-on" : ""}`}
            onClick={() => {
              setViewMode("spiral");
              setHoveredIndex(null);
            }}
          >
            spiral
          </button>
          <span className="sw-dot" />
          <button
            id="view-list-btn"
            className={`sw ${viewMode === "list" ? "sw-on" : ""}`}
            onClick={() => {
              setViewMode("list");
              setHoveredIndex(null);
            }}
          >
            list
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Spiral view */}
          {viewMode === "spiral" && (
            <motion.div
              key="spiral"
              style={{
                position: "fixed",
                inset: 0,
                background: "#000",
                zIndex: 1,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <SpiralCanvas onHoverChange={setHoveredIndex} />
            </motion.div>
          )}

          {/* List view */}
          {viewMode === "list" && (
            <motion.div
              key="list"
              className="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {PROJECTS.map((p, i) => (
                <motion.a
                  key={i}
                  id={`project-list-item-${i}`}
                  className="proj-item"
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {p.title}
                  <span className="proj-meta">
                    {p.category} — {p.year}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip (spiral mode) */}
        <AnimatePresence>
          {viewMode === "spiral" &&
            hoveredIndex !== null &&
            PROJECTS[hoveredIndex] && (
              <motion.div
                key="tooltip"
                initial={{ opacity: 0, scale: 0.88, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.88, y: 8 }}
                transition={{ duration: 0.13 }}
                style={{
                  position: "fixed",
                  left: tipLeft,
                  top: mousePos.y - 16,
                  transform: "translateY(-100%)",
                  pointerEvents: "none",
                  zIndex: 9999,
                  width: "218px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
                }}
              >
                <img
                  src={PROJECTS[hoveredIndex].image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "115px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div style={{ padding: "12px 14px 15px" }}>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: "Inter,sans-serif",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#0a0a0a",
                    }}
                  >
                    {PROJECTS[hoveredIndex].title}
                  </p>
                  <p
                    style={{
                      margin: "5px 0 0",
                      fontFamily: "Inter,sans-serif",
                      fontSize: "11.5px",
                      color: "#555",
                    }}
                  >
                    {PROJECTS[hoveredIndex].fullTitle}
                  </p>
                  <p
                    style={{
                      margin: "3px 0 0",
                      fontFamily: "Inter,sans-serif",
                      fontSize: "11px",
                      color: "#bbb",
                    }}
                  >
                    {PROJECTS[hoveredIndex].category} ·{" "}
                    {PROJECTS[hoveredIndex].year}
                  </p>
                  <p
                    style={{
                      margin: "11px 0 0",
                      fontFamily: "Inter,sans-serif",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#0a0a0a",
                    }}
                  >
                    View on GitHub ↗
                  </p>
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Floating video preview (list mode) */}
        <AnimatePresence>
          {viewMode === "list" &&
            hoveredIndex !== null &&
            PROJECTS[hoveredIndex] && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "fixed",
                  left: mousePos.x,
                  top: mousePos.y,
                  transform: "translate(-50%,-50%)",
                  pointerEvents: "none",
                  zIndex: 2,
                  width: "300px",
                  height: "188px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
                }}
              >
                {PROJECTS[hoveredIndex].video ? (
                  <video
                    src={PROJECTS[hoveredIndex].video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={PROJECTS[hoveredIndex].image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </section>
  );
}
