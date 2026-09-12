"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";

interface HeroTunnelProps {
  isDarkMode?: boolean;
  customImages?: string[];
  className?: string;
  transparent?: boolean;
}

const PORTFOLIO_TUNNEL_IMAGES = [
  "/assets/footer.webp",
  "/images/lanyard.png",
  "/3.png",
  "/SHA.png",
  "/assets/card-Socrates-light.svg",
  "/assets/metrics.isocalendar.svg",
  "/assets/metrics.languages.svg",
  "/assets/radar-langs-light.svg",
  "/assets/radar-light.svg",
  "/assets/radar-langs-dark.svg",
  "/assets/card-Satellite_error_github-light.svg",
  "/assets/card-Shachin-portfolio-light.svg",
  "/assets/card-stats-light.svg",
  "/images/hero.webp.png",
];

export default function HeroTunnel({
  isDarkMode = false,
  customImages,
  className = "",
  transparent = false,
}: HeroTunnelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // ── Three.js Scene & Setup ──
    const scene = new THREE.Scene();
    const bgHex = isDarkMode ? 0x050505 : 0xffffff;
    if (!transparent) {
      scene.background = new THREE.Color(bgHex);
      scene.fog = new THREE.FogExp2(bgHex, 0.032);
    }

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(68, width / height, 0.1, 800);
    camera.position.set(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: transparent,
      powerPreference: "high-performance",
      precision: "mediump",
      stencil: false,
      depth: true,
    });

    if (transparent) {
      renderer.setClearColor(0x000000, 0);
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    // ── Tunnel Dimensions & Segment Ring ──
    const TUNNEL_WIDTH = 24;
    const TUNNEL_HEIGHT = 16;
    const SEGMENT_DEPTH = 6;
    const NUM_SEGMENTS = 14;
    const TUNNEL_LENGTH = NUM_SEGMENTS * SEGMENT_DEPTH;
    const FLOOR_COLS = 6;
    const WALL_ROWS = 4;
    const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS;
    const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS;

    // ── Shared Reusable Geometries with Natural Card Proportions ──
    // Cards look like sleek floating GitHub stats and repo cards
    const floorGeo = new THREE.PlaneGeometry(3.6, 2.3);
    const wallGeo = new THREE.PlaneGeometry(3.6, 2.3);

    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDarkMode ? 0x444444 : 0xb5b5b5,
      transparent: true,
      opacity: isDarkMode ? 0.35 : 0.55,
      depthWrite: false,
    });

    // Generate wireframe segment line buffer geometry (shared across all segments)
    const lineVertices: number[] = [];
    const halfW = TUNNEL_WIDTH / 2;
    const halfH = TUNNEL_HEIGHT / 2;
    const d = SEGMENT_DEPTH;

    for (let i = 0; i <= FLOOR_COLS; i++) {
      const x = -halfW + i * COL_WIDTH;
      lineVertices.push(x, -halfH, 0, x, -halfH, -d);
      lineVertices.push(x, halfH, 0, x, halfH, -d);
    }
    for (let i = 1; i < WALL_ROWS; i++) {
      const y = -halfH + i * ROW_HEIGHT;
      lineVertices.push(-halfW, y, 0, -halfW, y, -d);
      lineVertices.push(halfW, y, 0, halfW, y, -d);
    }
    lineVertices.push(-halfW, -halfH, 0, halfW, -halfH, 0);
    lineVertices.push(-halfW, halfH, 0, halfW, halfH, 0);
    lineVertices.push(-halfW, -halfH, 0, -halfW, halfH, 0);
    lineVertices.push(halfW, -halfH, 0, halfW, halfH, 0);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineVertices, 3));

    // ── Curated Texture Pool (14 User-Specified Portfolio Assets) ──
    const imagePool = (customImages && customImages.length > 0) ? customImages : PORTFOLIO_TUNNEL_IMAGES;
    const textureLoader = new THREE.TextureLoader();
    const textures = new Map<number, THREE.Texture>();
    const allMaterials: THREE.MeshBasicMaterial[] = [];

    imagePool.forEach((url, idx) => {
      textureLoader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = false;
          tex.minFilter = THREE.LinearFilter;
          tex.magFilter = THREE.LinearFilter;
          textures.set(idx, tex);

          // Immediately update all materials mapped to this asset index
          for (let k = 0; k < allMaterials.length; k++) {
            const mat = allMaterials[k];
            if (mat.userData?.imageIndex === idx) {
              mat.map = tex;
              mat.opacity = 0.92;
              mat.needsUpdate = true;
            }
          }
        },
        undefined,
        () => {
          // Texture fallback if asset fails to load
        }
      );
    });

    let cardCounter = 0;
    const createCardMaterial = (): THREE.MeshBasicMaterial => {
      const assignedIndex = (cardCounter++) % imagePool.length;
      const cachedTex = textures.get(assignedIndex);

      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: cachedTex ? 0.92 : 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
        map: cachedTex || null,
      });

      mat.userData = { imageIndex: assignedIndex };
      allMaterials.push(mat);
      return mat;
    };

    // ── Build Segments Once (Zero Reallocations during Scroll) ──
    const segments: THREE.Group[] = [];

    const createSegmentGroup = (zPos: number, segIndex: number) => {
      const group = new THREE.Group();
      group.position.z = zPos;

      // Add shared wireframe grid lines
      const lines = new THREE.LineSegments(lineGeo, lineMaterial);
      group.add(lines);

      // Add persistent decorative art slab cards on floor, ceiling, and walls
      // Pseudo-random deterministic placement per segment index
      const seed = segIndex * 1337;

      // Floor cards
      for (let i = 0; i < FLOOR_COLS; i++) {
        if (((seed + i * 17) % 100) > 65) {
          const m = new THREE.Mesh(floorGeo, createCardMaterial());
          m.position.set(-halfW + i * COL_WIDTH + COL_WIDTH / 2, -halfH, -d / 2);
          m.rotation.set(-Math.PI / 2, 0, 0);
          group.add(m);
        }
      }

      // Ceiling cards
      for (let i = 0; i < FLOOR_COLS; i++) {
        if (((seed + i * 29 + 13) % 100) > 78) {
          const m = new THREE.Mesh(floorGeo, createCardMaterial());
          m.position.set(-halfW + i * COL_WIDTH + COL_WIDTH / 2, halfH, -d / 2);
          m.rotation.set(Math.PI / 2, 0, 0);
          group.add(m);
        }
      }

      // Left Wall cards
      for (let i = 0; i < WALL_ROWS; i++) {
        if (((seed + i * 31 + 23) % 100) > 68) {
          const m = new THREE.Mesh(wallGeo, createCardMaterial());
          m.position.set(-halfW, -halfH + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2);
          m.rotation.set(0, Math.PI / 2, 0);
          group.add(m);
        }
      }

      // Right Wall cards
      for (let i = 0; i < WALL_ROWS; i++) {
        if (((seed + i * 47 + 37) % 100) > 68) {
          const m = new THREE.Mesh(wallGeo, createCardMaterial());
          m.position.set(halfW, -halfH + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2);
          m.rotation.set(0, -Math.PI / 2, 0);
          group.add(m);
        }
      }

      return group;
    };

    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const z = -i * SEGMENT_DEPTH;
      const seg = createSegmentGroup(z, i);
      scene.add(seg);
      segments.push(seg);
    }

    // ── Mouse & Scroll Interaction Physics ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let isVisible = true;
    let frameId: number;
    let lastTime = performance.now();

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;
      lastScrollY = currentY;

      // Add gentle momentum boost proportional to user scroll speed
      scrollVelocity += delta * 0.015;
    };

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.targetX = Math.max(-1, Math.min(1, nx));
      mouse.targetY = Math.max(-1, Math.min(1, ny));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // ── Ultra-Smooth 60/120 FPS Animation Loop (Zero Allocation, Instant Ring Wrapping) ──
    const animate = (now: number) => {
      if (!isVisible) return;
      frameId = requestAnimationFrame(animate);

      const dt = Math.min((now - lastTime) / 1000, 0.06);
      lastTime = now;
      const fpsCoeff = dt * 60;

      // Smooth decay of scroll velocity (friction damping)
      scrollVelocity *= Math.pow(0.86, fpsCoeff);

      // Constant gentle idle flight so the tunnel is ALWAYS fluid, dreamy and breathing
      const baseIdleSpeed = 0.024;
      const totalSpeed = (baseIdleSpeed + Math.max(-1.2, Math.min(1.2, scrollVelocity))) * fpsCoeff;

      // Advance camera through tunnel
      camera.position.z -= totalSpeed;

      // Instantaneous Ring Buffer Wrapping (Zero Allocations, 0.0001ms execution)
      const camZ = camera.position.z;
      const wrapThreshold = camZ + SEGMENT_DEPTH;
      const recycleThreshold = camZ - TUNNEL_LENGTH;

      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (seg.position.z > wrapThreshold) {
          seg.position.z -= TUNNEL_LENGTH;
        } else if (seg.position.z < recycleThreshold) {
          seg.position.z += TUNNEL_LENGTH;
        }
      }

      // Smooth mouse cursor parallax steering
      mouse.x += (mouse.targetX - mouse.x) * 0.06 * fpsCoeff;
      mouse.y += (mouse.targetY - mouse.y) * 0.06 * fpsCoeff;

      camera.rotation.y = -mouse.x * 0.12;
      camera.rotation.x = mouse.y * 0.09;

      renderer.render(scene, camera);
    };

    // ── Pre-warm IntersectionObserver ──
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          lastTime = performance.now();
          lastScrollY = window.scrollY;
          cancelAnimationFrame(frameId);
          animate(performance.now());
        } else {
          cancelAnimationFrame(frameId);
        }
      },
      { rootMargin: "250px" } // Pre-warm 250px before entering viewport for seamless instant render
    );

    observer.observe(container);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Kickstart animation
    animate(performance.now());

    // ── Cleanup ──
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);

      // Cleanly dispose textures, geometries and renderer
      textures.forEach((t) => t.dispose());
      floorGeo.dispose();
      wallGeo.dispose();
      lineGeo.dispose();
      lineMaterial.dispose();
      renderer.dispose();
    };
  }, [isDarkMode, transparent, customImages]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{
        backgroundColor: transparent ? "transparent" : (isDarkMode ? "#050505" : "#ffffff"),
        touchAction: "pan-y",
        transform: "translateZ(0)",
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
