"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ThreeDPaper } from "@designcodeio/threeui";
import "@designcodeio/threeui/style.css";
import { ArrowLeft, X, ExternalLink, ShieldCheck, Sparkles, Play, Code2 } from "lucide-react";
import "./ArtOrbSphere.css";

// ─── 10 Featured Projects with Hosted Gumlet Video Embeds ─────────────────────
export interface ProjectItem {
  id: string;
  title: string;
  shortLabel: string;
  category: string;
  sector: string;
  embedId: string;
  thumb: string;
  github: string;
  tag: string;
  description: string;
  year: string;
}

export const HOSTED_PROJECTS: ProjectItem[] = [
  {
    id: "001",
    title: "OrbitXOS Space Tracking",
    shortLabel: "ORBITXOS TRACKING",
    category: "Machine Learning & AI",
    sector: "SECTOR 0 / ORBITAL SAFETY",
    embedId: "6aa11d42aa489a4399fc6521",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11d42aa489a4399fc6521/thumbnail-1-0.png?format=auto&w=800",
    github: "https://github.com/Shachin-7/Orbit-xos",
    tag: "FLAGSHIP ML",
    description: "Real-time space debris collision avoidance and orbital trajectory forecasting analyzing over 23,000 tracked objects using deep learning.",
    year: "2026",
  },
  {
    id: "002",
    title: "Senior Business Analyst Portfolio",
    shortLabel: "BUSINESS ANALYST",
    category: "Executive Web App",
    sector: "SECTOR 1 / ANALYTICS",
    embedId: "6aa11bb42f578a19ae52a066",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11bb42f578a19ae52a066/thumbnail-1-0.png?format=auto&w=800",
    github: "https://www.suryah.pro",
    tag: "ANALYTICS",
    description: "Executive freelance portfolio built for a Senior Business Analyst featuring dynamic financial visualization dashboards and interactive presentation layers.",
    year: "2026",
  },
  {
    id: "003",
    title: "Director of ABB Portfolio",
    shortLabel: "DIRECTOR OF ABB",
    category: "Corporate & Web",
    sector: "SECTOR 2 / EXECUTIVE",
    embedId: "6aa11bb4aa489a4399fc5296",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11bb4aa489a4399fc5296/thumbnail-1-0.png?format=auto&w=800",
    github: "https://babu-portfolio-it5x.vercel.app",
    tag: "CORPORATE",
    description: "High-impact executive portfolio engineered for the Director of ABB Company showcasing leadership roadmaps, patents, and global accolades.",
    year: "2026",
  },
  {
    id: "004",
    title: "JV Associate LLC Website",
    shortLabel: "JV ASSOCIATE LLC",
    category: "Frontend Development",
    sector: "SECTOR 3 / PRODUCTION",
    embedId: "6aa11de2aa489a4399fc6887",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11de2aa489a4399fc6887/thumbnail-1-0.png?format=auto&w=800",
    github: "https://web.jvassociatellc.com",
    tag: "ENTERPRISE",
    description: "Complete enterprise frontend built with modern responsive architecture, zero-latency micro-interactions, and high performance.",
    year: "2026",
  },
  {
    id: "005",
    title: "Lead Gen & Email Automation",
    shortLabel: "LEAD GEN ENGINE",
    category: "Data Engineering",
    sector: "SECTOR 4 / AUTOMATION",
    embedId: "6aa11d1daa4fda3466922ca2",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11d1daa4fda3466922ca2/thumbnail-1-0.png?format=auto&w=800",
    github: "https://github.com/Shachin-7/email-automation",
    tag: "OUTREACH",
    description: "High-throughput email automation pipeline with verification routines, sentiment categorization, and automated follow-ups.",
    year: "2026",
  },
  {
    id: "006",
    title: "Satellite Error AI (ISRO NAVIC)",
    shortLabel: "SATELLITE ERROR AI",
    category: "Deep Learning",
    sector: "SECTOR 5 / GNSS NAV",
    embedId: "6aa11e16aa4fda34669232c6",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11e16aa4fda34669232c6/thumbnail-1-0.png?format=auto&w=800",
    github: "https://github.com/DevSanjay09/ISRO-NAVIC",
    tag: "RESEARCH AI",
    description: "Hybrid LSTM and Transformer model predicting satellite ephemeris errors and ionospheric delay, improving positional accuracy by 35%.",
    year: "2026",
  },
  {
    id: "007",
    title: "Undersea Cable Failure Detection",
    shortLabel: "UNDERSEA CABLE AI",
    category: "Machine Learning",
    sector: "SECTOR 6 / TELECOM",
    embedId: "6aa11d5aaa489a4399fc65f1",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11d5aaa489a4399fc65f1/thumbnail-1-0.png?format=auto&w=800",
    github: "https://github.com/Shachin-7/Undersea-cable-failure-detection",
    tag: "ANOMALY",
    description: "Predictive failure detection system monitoring global acoustic and strain sensors along transoceanic fiber cables to avert blackouts.",
    year: "2026",
  },
  {
    id: "008",
    title: "AI Social Media Automation",
    shortLabel: "SOCIAL AUTOMATION",
    category: "LLM Agents",
    sector: "SECTOR 7 / LLM AGENTS",
    embedId: "6aa11d1daa4fda3466922c9d",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11d1daa4fda3466922c9d/thumbnail-1-0.png?format=auto&w=800",
    github: "https://github.com/Shachin-7/Social-Media-Automation",
    tag: "SYNTHETIC",
    description: "Autonomous agent system coordinating multi-modal content creation, graphics prompt synthesis, and synchronized multi-channel scheduling.",
    year: "2026",
  },
  {
    id: "009",
    title: "Railway Track Crack Detection",
    shortLabel: "RAILWAY CRACK AI",
    category: "Computer Vision",
    sector: "SECTOR 8 / VISION",
    embedId: "6aa11d5aaa489a4399fc65f1",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11d5aaa489a4399fc65f1/thumbnail-1-0.png?format=auto&w=800",
    github: "https://github.com/Shachin-7/Indian-railway-track-crack-detection-system",
    tag: "EDGE VISION",
    description: "Edge computer vision inference scanning high-speed track imagery for microscopic structural fissures under dynamic lighting.",
    year: "2026",
  },
  {
    id: "010",
    title: "On-Duty Management System",
    shortLabel: "ON-DUTY SYSTEM",
    category: "Full Stack",
    sector: "SECTOR 9 / WORKFLOW",
    embedId: "6aa11d2a2f578a19ae52b8fc",
    thumb: "https://video.gumlet.io/6aa11b61aa4fda34669220e6/6aa11d2a2f578a19ae52b8fc/thumbnail-1-0.png?format=auto&w=800",
    github: "https://github.com/Shachin-7/OD-management-system",
    tag: "WORKFLOW",
    description: "Institutional workflow platform digitizing leave tracking and multi-tier department approvals for 3,000+ university members.",
    year: "2023",
  },
];

// Optimal spatial assignment across 36 nodes guaranteeing no identical projects are neighbors (min distance 1.265)
const NODE_PROJECT_ASSIGNMENT = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  6, 7, 8, 9, 5, 3, 4, 2, 1, 0,
  5, 2, 3, 0, 1, 6, 7, 8, 9, 6,
  4, 8, 9, 1, 5, 2
];

const TOTAL_NODES = NODE_PROJECT_ASSIGNMENT.length;

// ─── Mathematical 3D Functions ─────────────────────────────────────────────
function dirToLatLon(v: [number, number, number]): { lat: number; lon: number } {
  const lat = Math.asin(Math.max(-1, Math.min(1, -v[1])));
  const lon = Math.atan2(v[0], v[2]);
  return { lat, lon };
}

function fibonacciSphereLatLon(i: number, n: number): { lat: number; lon: number } {
  if (n <= 1) return { lat: 0, lon: 0 };
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / (n - 1)) * 2;
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = goldenAngle * i;
  return dirToLatLon([Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY]);
}

function latLonToXYZ(lat: number, lon: number, r: number): [number, number, number] {
  return [
    Math.cos(lat) * Math.sin(lon) * r,
    -Math.sin(lat) * r,
    Math.cos(lat) * Math.cos(lon) * r,
  ];
}

// ─── Dodecahedron Geometry for Drag Release Shape Morph Swift Animation ───
const PHI = (1 + Math.sqrt(5)) / 2;
const IPHI = 1 / PHI;
const DODECA_VERTS: [number, number, number][] = [];
[-1, 1].forEach((a) =>
  [-1, 1].forEach((b) =>
    [-1, 1].forEach((c) => {
      DODECA_VERTS.push([a, b, c]);
    })
  )
);
[-1, 1].forEach((a) =>
  [-1, 1].forEach((b) => {
    DODECA_VERTS.push([0, a * IPHI, b * PHI]);
    DODECA_VERTS.push([a * IPHI, b * PHI, 0]);
    DODECA_VERTS.push([b * PHI, 0, a * IPHI]);
  })
);

function normalize3D(v: [number, number, number]): [number, number, number] {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

const DODECA_VERT_DIRS = DODECA_VERTS.map(normalize3D);
const DODECA_LATLON = DODECA_VERT_DIRS.map(dirToLatLon);

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function setWireTransform(
  el: HTMLDivElement,
  a: [number, number, number],
  b: [number, number, number]
) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1],
    dz = b[2] - a[2];
  const len = Math.hypot(dx, dy, dz);
  if (len < 0.0001) {
    el.style.width = "0px";
    return;
  }
  const yaw = Math.atan2(dx, dz);
  const horiz = Math.hypot(dx, dz);
  const pitch = Math.atan2(-dy, horiz);
  el.style.width = len + "px";
  el.style.transform = `translate3d(${a[0]}px, ${a[1]}px, ${a[2]}px) rotateY(${yaw}rad) rotateX(${pitch}rad)`;
}

export default function ArtOrbSphere() {
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [lightboxMode, setLightboxMode] = useState<"paper" | "flat">("paper");
  const [dragBadgeWord, setDragBadgeWord] = useState("DRAG");
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  // Modal active ref for zero-cost background pausing
  const selectedProjectRef = useRef<ProjectItem | null>(null);
  selectedProjectRef.current = selectedProject;

  // DOM Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const centerEmblemRef = useRef<HTMLImageElement>(null);
  const clockCanvasRef = useRef<HTMLCanvasElement>(null);
  const digitalClockRef = useRef<HTMLDivElement>(null);
  const lastClockSec = useRef<number>(-1);
  const trailCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragBadgeRef = useRef<HTMLDivElement>(null);

  // Physics & Transforms Refs with buttery smooth target interpolation (Lerp)
  const rotX = useRef<number>(-8);
  const rotY = useRef<number>(0);
  const rotZ = useRef<number>(0);
  const targetRotX = useRef<number>(-8);
  const targetRotY = useRef<number>(0);
  const targetRotZ = useRef<number>(0);
  const velX = useRef<number>(0);
  const velY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const hasDragged = useRef<boolean>(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const radiusRef = useRef<number>(350);

  // Morph state
  const currentShape = useRef<"sphere" | "dodeca">("sphere");
  const isMorphing = useRef<boolean>(false);

  // Node & Wire element storage
  const nodeEls = useRef<HTMLDivElement[]>([]);
  const wireEls = useRef<HTMLDivElement[]>([]);
  const wireEndpoints = useRef<Array<{ a: [number, number, number]; b: [number, number, number] }>>([]);

  // Trail state
  const mousePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const badgePos = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const trailPoints = useRef<Array<{ x: number; y: number }>>([]);
  const lastRecordedPoint = useRef<{ x: number; y: number } | null>(null);
  const orthogonalMode = useRef<boolean>(false);

  // Dynamic Radius Calculation (increased to provide open breathing room & clear inside 3D text)
  const computeRadius = useCallback(() => {
    if (typeof window === "undefined") return 350;
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const r = Math.max(280, Math.min(430, Math.round(minDim * 0.40)));
    radiusRef.current = r;
    return r;
  }, []);

  // ─── Shape Morph Swift Animation (Sphere <-> Dodecahedron) ───────────────
  const morphTo = useCallback((targetShape: "sphere" | "dodeca") => {
    if (isMorphing.current || targetShape === currentShape.current) return;
    isMorphing.current = true;
    const targetKeyLat = targetShape === "sphere" ? "sphereLat" : "dodecaLat";
    const targetKeyLon = targetShape === "sphere" ? "sphereLon" : "dodecaLon";

    const startVals = nodeEls.current.map((node) => ({
      lat: parseFloat(node.dataset.lat || "0"),
      lon: parseFloat(node.dataset.lon || "0"),
    }));

    const endVals = nodeEls.current.map((node) => ({
      lat: parseFloat(node.dataset[targetKeyLat] || "0"),
      lon: parseFloat(node.dataset[targetKeyLon] || "0"),
    }));

    const duration = 900;
    const startTime = performance.now();

    const morphFrame = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const e = easeInOutCubic(t);

      nodeEls.current.forEach((node, i) => {
        const s = startVals[i];
        const end = endVals[i];
        if (!s || !end) return;

        const lat = s.lat + (end.lat - s.lat) * e;
        let dLon = end.lon - s.lon;
        if (dLon > Math.PI) dLon -= Math.PI * 2;
        if (dLon < -Math.PI) dLon += Math.PI * 2;
        const lon = s.lon + dLon * e;

        node.dataset.lat = String(lat);
        node.dataset.lon = String(lon);
        const depth = parseFloat(node.dataset.depth || "1");
        const r = radiusRef.current;
        node.style.transform = `rotateY(${lon}rad) rotateX(${-lat}rad) translateZ(${r * depth}px)`;
      });

      // Update wire transforms during morph
      const r = radiusRef.current;
      wireEls.current.forEach((wire, i) => {
        const pair = wireEndpoints.current[i];
        if (pair) {
          setWireTransform(wire, pair.a, pair.b);
        }
      });

      if (t < 1) {
        requestAnimationFrame(morphFrame);
      } else {
        currentShape.current = targetShape;
        isMorphing.current = false;
      }
    };

    requestAnimationFrame(morphFrame);
  }, []);

  // ─── Build Sphere of Hosted Video Cards & Wires ───────────────────────────
  const buildWorld = useCallback(() => {
    if (!worldRef.current) return;
    const world = worldRef.current;
    const r = computeRadius();

    // Clean existing elements
    nodeEls.current.forEach((el) => el.remove());
    nodeEls.current = [];
    wireEls.current.forEach((el) => el.remove());
    wireEls.current = [];
    wireEndpoints.current = [];

    // Compact portrait card dimensions matching oumahi.art (116px x 154px)
    const cardWidth = 116;
    const cardHeight = 154;

    NODE_PROJECT_ASSIGNMENT.forEach((projIdx, nodeIdx) => {
      const proj = HOSTED_PROJECTS[projIdx];
      const { lat: sLat, lon: sLon } = fibonacciSphereLatLon(nodeIdx, TOTAL_NODES);
      const dVert = DODECA_LATLON[nodeIdx % DODECA_LATLON.length];

      const node = document.createElement("div");
      node.className = "orb-node";
      node.dataset.lat = String(sLat);
      node.dataset.lon = String(sLon);
      node.dataset.sphereLat = String(sLat);
      node.dataset.sphereLon = String(sLon);
      node.dataset.dodecaLat = String(dVert.lat);
      node.dataset.dodecaLon = String(dVert.lon);
      node.dataset.projectIndex = String(projIdx);

      // Subtle depth variance
      const depthSeed = Math.sin(nodeIdx * 78.23) * 12543.1;
      const depthRand = depthSeed - Math.floor(depthSeed);
      const depth = 0.94 + depthRand * 0.12;
      node.dataset.depth = String(depth);

      node.style.width = `${cardWidth}px`;
      node.style.height = `${cardHeight}px`;
      node.style.marginTop = `${-cardHeight / 2}px`;
      node.style.marginLeft = `${-cardWidth / 2}px`;

      // 3D positioning on the sphere
      node.style.transform = `rotateY(${sLon}rad) rotateX(${-sLat}rad) translateZ(${r * depth}px)`;

      // Optimized card markup: Hardware-accelerated image poster with live indicator
      node.innerHTML = `
        <div class="orb-frame">
          <div class="orb-video-wrapper">
            <img
              src="${proj.thumb}"
              alt="${proj.title}"
              class="orb-card-poster"
              loading="eager"
              draggable="false"
            />
            <div class="orb-video-badge">LIVE</div>
          </div>
          <div class="orb-tag">${proj.shortLabel}</div>
        </div>
      `;

      node.addEventListener("mouseenter", () => {
        setIsHoveringCard(true);
        setDragBadgeWord("CLICK");
        // On hover, dynamically stream the video for instant silky smooth preview
        const wrapper = node.querySelector(".orb-video-wrapper");
        if (wrapper && !wrapper.querySelector("iframe")) {
          const iframe = document.createElement("iframe");
          iframe.src = `https://play.gumlet.io/embed/${proj.embedId}?autoplay=1&loop=1&muted=1&preload=true&disable_player_controls=1`;
          iframe.className = "orb-card-iframe";
          iframe.title = proj.title;
          iframe.allow = "autoplay; encrypted-media";
          iframe.tabIndex = -1;
          wrapper.appendChild(iframe);
        }
      });

      node.addEventListener("mouseleave", () => {
        setIsHoveringCard(false);
        setDragBadgeWord("DRAG");
        // Cleanup iframe on mouseleave to free GPU compositing memory
        const iframe = node.querySelector(".orb-card-iframe");
        if (iframe) {
          iframe.remove();
        }
      });

      node.addEventListener("click", () => {
        if (hasDragged.current) return;
        setSelectedProject(proj);
      });

      world.appendChild(node);
      nodeEls.current.push(node);
    });

    // ── Build Wireframe Connecting Lines ──
    const latRings = Math.max(4, Math.round(Math.sqrt(TOTAL_NODES * 0.55)));
    const lonMeridians = Math.max(6, Math.round(Math.sqrt(TOTAL_NODES * 1.8)));
    const wirePairs: Array<{ a: [number, number, number]; b: [number, number, number] }> = [];

    // Latitude rings
    for (let ring = 1; ring < latRings; ring++) {
      const lat = Math.PI / 2 - (ring / latRings) * Math.PI;
      for (let c = 0; c < lonMeridians; c++) {
        const lonA = (c / lonMeridians) * Math.PI * 2 - Math.PI;
        const lonB = ((c + 1) / lonMeridians) * Math.PI * 2 - Math.PI;
        wirePairs.push({
          a: latLonToXYZ(lat, lonA, r),
          b: latLonToXYZ(lat, lonB, r),
        });
      }
    }

    // Longitude lines
    for (let c = 0; c < lonMeridians; c++) {
      const lon = (c / lonMeridians) * Math.PI * 2 - Math.PI;
      for (let ring = 0; ring < latRings; ring++) {
        const latA = Math.PI / 2 - (ring / latRings) * Math.PI;
        const latB = Math.PI / 2 - ((ring + 1) / latRings) * Math.PI;
        wirePairs.push({
          a: latLonToXYZ(latA, lon, r),
          b: latLonToXYZ(latB, lon, r),
        });
      }
    }

    wireEndpoints.current = wirePairs;
    wirePairs.forEach((pair) => {
      const wire = document.createElement("div");
      wire.className = "orb-wire";
      setWireTransform(wire, pair.a, pair.b);
      world.appendChild(wire);
      wireEls.current.push(wire);
    });
  }, [computeRadius]);

  // ─── Filter & Highlight Logic ────────────────────────────────────────────
  const selectProjectFilter = (projKey: string) => {
    setActiveProjectFilter(projKey);

    if (projKey === "all") {
      nodeEls.current.forEach((el) => {
        el.classList.remove("dimmed", "highlighted");
      });
      return;
    }

    const targetIdx = parseInt(projKey, 10);
    let foundFirst = false;

    nodeEls.current.forEach((el) => {
      const pIdx = parseInt(el.dataset.projectIndex || "-1", 10);
      if (pIdx === targetIdx) {
        el.classList.add("highlighted");
        el.classList.remove("dimmed");

        // Rotate sphere to face the first matching node
        if (!foundFirst) {
          foundFirst = true;
          const lat = parseFloat(el.dataset.lat || "0");
          const lon = parseFloat(el.dataset.lon || "0");
          // Target angles to face front with smooth glide
          targetRotY.current = -(lon * 180) / Math.PI;
          targetRotX.current = (lat * 180) / Math.PI;
          velX.current = 0;
          velY.current = 0;
        }
      } else {
        el.classList.remove("highlighted");
        el.classList.add("dimmed");
      }
    });
  };

  const handleResetOrb = () => {
    selectProjectFilter("all");
    targetRotX.current = 0;
    targetRotY.current = 0;
    targetRotZ.current = 0;
    velX.current = 0;
    velY.current = 1.4;
  };


  // ─── Initialize on Mount & Resize ────────────────────────────────────────
  useEffect(() => {
    buildWorld();

    if (typeof window !== "undefined") {
      const initX = Math.round(window.innerWidth * 0.72);
      const initY = Math.round(window.innerHeight * 0.44);
      badgePos.current = { x: initX, y: initY };
      if (dragBadgeRef.current) {
        dragBadgeRef.current.style.transform = `translate3d(${initX}px, ${initY}px, 0) translate(-50%, -50%)`;
      }
    }

    const handleResize = () => {
      const r = computeRadius();
      nodeEls.current.forEach((node) => {
        const lat = parseFloat(node.dataset.lat || "0");
        const lon = parseFloat(node.dataset.lon || "0");
        const depth = parseFloat(node.dataset.depth || "1");
        node.style.transform = `rotateY(${lon}rad) rotateX(${-lat}rad) translateZ(${r * depth}px)`;
      });
      wireEls.current.forEach((wire, i) => {
        const pair = wireEndpoints.current[i];
        if (pair) {
          const a = latLonToXYZ(
            Math.asin(Math.max(-1, Math.min(1, -pair.a[1] / radiusRef.current))),
            Math.atan2(pair.a[0], pair.a[2]),
            r
          );
          const b = latLonToXYZ(
            Math.asin(Math.max(-1, Math.min(1, -pair.b[1] / radiusRef.current))),
            Math.atan2(pair.b[0], pair.b[2]),
            r
          );
          setWireTransform(wire, a, b);
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [buildWorld, computeRadius]);

  // ─── Physics & Rotation Loop (Ultra-smooth 60-120fps with Delta-Time Lerp) ────
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const AUTO_SPEED = 0.08;

    const tick = (now: number) => {
      animId = requestAnimationFrame(tick);

      // Pause expensive background updates when modal is active
      if (selectedProjectRef.current) {
        lastTime = now;
        return;
      }

      // Delta time normalized to 60fps (16.67ms)
      const dt = Math.min((now - lastTime) / 16.667, 2.5);
      lastTime = now;

      if (!isDragging.current) {
        targetRotY.current += (AUTO_SPEED + velY.current) * dt;
        targetRotX.current += velX.current * dt;
        targetRotZ.current += (AUTO_SPEED * 0.62) * dt;

        // Clamp targetRotX
        targetRotX.current = Math.max(-70, Math.min(70, targetRotX.current));

        // Delta-time compensated exponential inertia decay
        const friction = Math.pow(0.945, dt);
        velX.current *= friction;
        velY.current *= friction;
        if (Math.abs(velX.current) < 0.001) velX.current = 0;
        if (Math.abs(velY.current) < 0.001) velY.current = 0;
      }

      // Buttery smooth frame-rate independent lerp dampening
      const lerp = 1 - Math.exp(-18 * (dt / 60));
      rotX.current += (targetRotX.current - rotX.current) * lerp;
      rotY.current += (targetRotY.current - rotY.current) * lerp;
      rotZ.current += (targetRotZ.current - rotZ.current) * lerp;

      // Batch DOM style updates synchronized with VSync
      if (worldRef.current) {
        worldRef.current.style.transform = `rotateX(${rotX.current.toFixed(2)}deg) rotateY(${rotY.current.toFixed(2)}deg) rotateZ(${rotZ.current.toFixed(2)}deg)`;
      }
      if (centerEmblemRef.current) {
        centerEmblemRef.current.style.transform = `translate(-50%, -50%) rotateY(${(-rotY.current).toFixed(2)}deg) rotateX(${(-rotX.current).toFixed(2)}deg)`;
      }
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // ─── Pointer Drag Handlers (Zero Layout-Thrashing) ───────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    hasDragged.current = false;
    velX.current = 0;
    velY.current = 0;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    if (sceneRef.current) sceneRef.current.classList.add("grabbing");
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!isDragging.current) return;
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;

      if (Math.abs(dx) > 1.5 || Math.abs(dy) > 1.5) {
        hasDragged.current = true;
      }

      const sensitivity = 0.26;
      const stepY = dx * sensitivity;
      const stepX = -dy * sensitivity;

      targetRotY.current += stepY;
      targetRotX.current += stepX;
      targetRotX.current = Math.max(-70, Math.min(70, targetRotX.current));

      // Ultra-smooth momentum tracking for natural inertia throw
      velY.current = velY.current * 0.65 + stepY * 0.35;
      velX.current = velX.current * 0.65 + stepX * 0.35;

      lastMousePos.current = { x: e.clientX, y: e.clientY };
      // DOM updates are left entirely to tick() to avoid layout thrashing
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      if (sceneRef.current) sceneRef.current.classList.remove("grabbing");
      velX.current = Math.max(-6, Math.min(6, velX.current));
      velY.current = Math.max(-6, Math.min(6, velY.current));

      setTimeout(() => {
        hasDragged.current = false;
      }, 60);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedProject(null);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // ─── Top-Right Live Analog Clock Canvas (Optimized Zero React Re-render) ──
  useEffect(() => {
    let animId: number;
    const canvas = clockCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const SIZE = 144;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const SC = SIZE / 500;

    const drawClock = () => {
      animId = requestAnimationFrame(drawClock);

      if (selectedProjectRef.current) return;

      const now = new Date();
      const s = now.getSeconds();

      // Only update DOM text once per second when second changes
      if (lastClockSec.current !== s) {
        lastClockSec.current = s;
        if (digitalClockRef.current) {
          const h = now.getHours();
          const m = now.getMinutes();
          digitalClockRef.current.textContent = `${String(h).padStart(2, "0")} : ${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
        }
      }

      ctx.clearRect(0, 0, SIZE, SIZE);
      const color = "#22c55e"; // Neon green accent

      // 60 tick marks
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      for (let i = 0; i < 60; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(((Math.PI * 2) / 60) * i);
        ctx.fillRect(-1 * SC, -220 * SC, 2 * SC, 16 * SC);
        ctx.restore();
      }

      // 12 hour tick marks
      ctx.fillStyle = color;
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(((Math.PI * 2) / 12) * i);
        if (i % 3 === 0) {
          ctx.fillRect(-3 * SC, -225 * SC, 6 * SC, 32 * SC);
        } else {
          ctx.fillRect(-2 * SC, -225 * SC, 4 * SC, 24 * SC);
        }
        ctx.restore();
      }

      // Hour hand
      const h = now.getHours();
      const m = now.getMinutes();
      const hourAngle = ((Math.PI * 2) / 12) * (h % 12) + ((Math.PI * 2) / 12) * (m / 60);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(hourAngle);
      ctx.fillRect(-4 * SC, -140 * SC, 8 * SC, 140 * SC);
      ctx.restore();

      // Minute hand
      const minAngle = ((Math.PI * 2) / 60) * m + ((Math.PI * 2) / 60) * (s / 60);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(minAngle);
      ctx.fillRect(-4 * SC, -190 * SC, 8 * SC, 190 * SC);
      ctx.restore();

      // Second hand
      const secAngle = ((Math.PI * 2) / 60) * s;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(secAngle);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(-1.5 * SC, -180 * SC, 3 * SC, 180 * SC);
      ctx.restore();

      // Center cap
      ctx.beginPath();
      ctx.arc(cx, cy, 6 * SC, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    animId = requestAnimationFrame(drawClock);
    return () => cancelAnimationFrame(animId);
  }, []);

  // ─── Neon Green Cursor Circuit Trail Canvas & DRAG Badge (GPU Accelerated) ─
  useEffect(() => {
    let animId: number;
    const canvas = trailCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const modeTimer = setInterval(() => {
      orthogonalMode.current = !orthogonalMode.current;
    }, 8000);

    const TRAIL_LENGTH = 1200;
    const SEGMENT_GAP = 6;
    const EASE = 0.35;

    const drawTrail = () => {
      animId = requestAnimationFrame(drawTrail);

      if (selectedProjectRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (mousePos.current.x > 0) {
        badgePos.current.x += (mousePos.current.x - badgePos.current.x) * EASE;
        badgePos.current.y += (mousePos.current.y - badgePos.current.y) * EASE;

        if (dragBadgeRef.current) {
          dragBadgeRef.current.style.transform = `translate3d(${badgePos.current.x.toFixed(1)}px, ${badgePos.current.y.toFixed(1)}px, 0) translate(-50%, -50%)`;
        }

        if (!lastRecordedPoint.current) {
          lastRecordedPoint.current = { x: badgePos.current.x, y: badgePos.current.y };
          trailPoints.current.push({ ...lastRecordedPoint.current });
        } else {
          const dx = badgePos.current.x - lastRecordedPoint.current.x;
          const dy = badgePos.current.y - lastRecordedPoint.current.y;
          const dist = Math.hypot(dx, dy);
          const gap = orthogonalMode.current ? SEGMENT_GAP * 4 : SEGMENT_GAP;

          if (dist >= gap) {
            if (orthogonalMode.current) {
              trailPoints.current.push({ x: badgePos.current.x, y: lastRecordedPoint.current.y });
            }
            trailPoints.current.push({ x: badgePos.current.x, y: badgePos.current.y });
            lastRecordedPoint.current = { x: badgePos.current.x, y: badgePos.current.y };

            if (trailPoints.current.length > 70) {
              trailPoints.current.splice(0, trailPoints.current.length - 70);
            }
          }
        }
      }

      if (trailPoints.current.length > 1) {
        let cumulative = 0;
        for (let i = trailPoints.current.length - 1; i > 0; i--) {
          const a = trailPoints.current[i];
          const b = trailPoints.current[i - 1];
          const segLen = Math.hypot(a.x - b.x, a.y - b.y);
          const startFrac = cumulative / TRAIL_LENGTH;
          cumulative += segLen;
          const endFrac = Math.min(cumulative / TRAIL_LENGTH, 1);
          const alpha = (1 - (startFrac + endFrac) / 2) * 0.75;
          if (alpha <= 0) continue;

          // GPU-native dual pass stroke (instant hardware rasterization, 0ms CPU blur)
          // Glow pass
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(34, 197, 94, ${(alpha * 0.35).toFixed(3)})`;
          ctx.lineWidth = 6;
          ctx.lineCap = "round";
          ctx.stroke();

          // Sharp core pass
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(34, 197, 94, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 2;
          ctx.lineCap = "round";
          ctx.stroke();

          if (cumulative > TRAIL_LENGTH) break;
        }
      }
    };

    animId = requestAnimationFrame(drawTrail);
    return () => {
      cancelAnimationFrame(animId);
      clearInterval(modeTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="orb-container" ref={containerRef}>
      {/* ── Top-Left Brand Logo ── */}
      <Link href="/" className="orb-top-logo" title="Back to Home">
        <span className="orb-top-logo-badge">⚡</span>
        <span>SHA / PROJECTS</span>
      </Link>

      {/* ── Left-Center Project Selection Navigation (matching Image 1) ── */}
      <nav className="orb-nav-left">
        {/* "ALL PROJECTS" pill */}
        <button
          type="button"
          className={`orb-category-pill ${activeProjectFilter === "all" ? "active" : ""}`}
          onClick={() => selectProjectFilter("all")}
        >
          {activeProjectFilter === "all" && <span className="orb-pill-target-dot" />}
          <span>ALL PROJECTS</span>
        </button>

        {/* 10 Project Name Pills */}
        {HOSTED_PROJECTS.map((proj, pIdx) => {
          const isActive = activeProjectFilter === String(pIdx);
          return (
            <button
              key={proj.id}
              type="button"
              className={`orb-category-pill ${isActive ? "active" : ""}`}
              onClick={() => selectProjectFilter(String(pIdx))}
            >
              {isActive && <span className="orb-pill-target-dot" />}
              <span>{proj.shortLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* ── Top-Right Live Analog & Digital Clock ── */}
      <div className="orb-clock-panel">
        <canvas ref={clockCanvasRef} className="orb-clock-canvas" />
        <div ref={digitalClockRef} className="orb-clock-digital">00 : 00 : 00</div>
      </div>

      {/* ── Bottom HUD Labels ── */}
      <div className="orb-hud bottom-left">DRAG TO ROTATE</div>
      <div className="orb-hud bottom-right">CLICK VIDEO CARD TO INSPECT</div>

      {/* ── Neon Green Circuit Vector Overlay (Reference Images 1 & 4) ── */}
      <svg
        className="orb-circuit-overlay"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 15,
          overflow: "visible",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="circuitGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Stepped green circuit line ascending to top-right clock (Image 4) */}
        <path
          d="M 720,460 H 940 V 380 H 1060 V 270 H 1180 V 170 H 1320 V 70"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.6"
          strokeDasharray="4 6"
          opacity="0.45"
          filter="url(#circuitGlow)"
        />

        {/* Outer elliptical orbit path & circular target reticle (Image 1) */}
        <path
          d="M 680,420 C 960,280 1280,180 1340,320 C 1400,460 1260,720 1140,780 C 1020,840 940,810 890,790"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.8"
          strokeDasharray="6 8"
          opacity="0.65"
          filter="url(#circuitGlow)"
        />
        {/* Terminal green concentric circle node from Image 1 */}
        <circle cx="1240" cy="740" r="32" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.85" filter="url(#circuitGlow)" />
        <circle cx="1240" cy="740" r="5" fill="#22c55e" opacity="1" filter="url(#circuitGlow)" />

        {/* Wireline running across the bottom footer bar (as in reference image) */}
        <path
          d="M 640,700 L 760,830 L 920,868 L 1180,872 L 1440,860"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          opacity="0.65"
          filter="url(#circuitGlow)"
        />
        <circle cx="760" cy="830" r="2.5" fill="#22c55e" opacity="0.95" filter="url(#circuitGlow)" />
        <circle cx="920" cy="868" r="2.5" fill="#22c55e" opacity="0.95" filter="url(#circuitGlow)" />
        <circle cx="1180" cy="872" r="2.5" fill="#22c55e" opacity="0.95" filter="url(#circuitGlow)" />
      </svg>

      {/* ── 3D Scene Viewport ── */}
      <div
        className="orb-scene"
        ref={sceneRef}
        onPointerDown={handlePointerDown}
      >
        <div className="orb-world" ref={worldRef}>
          {/* Inside 3D Center Emblem */}
          <img
            ref={centerEmblemRef}
            id="centerEmblem"
            className="orb-center-emblem"
            src="/assets/orb/projects.png"
            alt="PROJECTS"
            draggable={false}
          />
          {/* Nodes and Wireframe connector lines are dynamically mounted here */}
        </div>
      </div>

      {/* ── Fullscreen Neon Green Cursor Trail Canvas ── */}
      <canvas ref={trailCanvasRef} className="orb-trail-canvas" />

      {/* ── Floating Neon Green DRAG / CLICK Badge ── */}
      <div
        ref={dragBadgeRef}
        className={`orb-drag-badge ${isHoveringCard ? "clicking" : ""}`}
      >
        {dragBadgeWord}
      </div>

      {/* ── 3D Paper / Project Video Inspection Modal ── */}
      {selectedProject && (
        <div
          className="orb-lightbox open"
          onClick={() => setSelectedProject(null)}
        >
          {lightboxMode === "paper" ? (
            <div
              className="orb-paper-modal-container"
              onClick={(e) => e.stopPropagation()}
            >
              <ThreeDPaper
                variant="original"
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />

              {/* Optional switch to detailed layout */}
              <button
                type="button"
                className="orb-paper-toggle-btn"
                onClick={() => setLightboxMode("flat")}
                title="Switch to detailed layout"
              >
                <span>Full Details ↗</span>
              </button>
            </div>
          ) : (
            <div
              className="orb-lightbox-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="orb-lightbox-header-actions">
                <button
                  type="button"
                  className="orb-lightbox-mode-switch"
                  onClick={() => setLightboxMode("paper")}
                  title="Switch to 3D Paper"
                >
                  <span>← 3D PAPER EFFECT</span>
                </button>
                <button
                  type="button"
                  className="orb-lightbox-close"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close inspection"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Video Player Frame */}
              <div className="orb-lightbox-img-pane">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-2xl">
                  <iframe
                    src={`https://play.gumlet.io/embed/${selectedProject.embedId}?autoplay=1&preload=true`}
                    title={selectedProject.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Project Details Panel */}
              <div className="orb-lightbox-info-pane">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck size={14} />
                    <span>{selectedProject.sector}</span>
                    <span className="text-white/30">•</span>
                    <span className="text-white/60">{selectedProject.year}</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight text-white uppercase mb-3">
                    {selectedProject.title}
                  </h2>
                  <div className="h-px bg-white/10 w-full mb-4" />
                  <p className="text-white/75 text-sm leading-relaxed mb-6">
                    {selectedProject.description}
                  </p>
                  <div className="space-y-2 text-xs text-white/50">
                    <div>
                      <span className="text-white/30 uppercase tracking-wider mr-2">Category:</span>
                      <span className="text-white/80">{selectedProject.category}</span>
                    </div>
                    <div>
                      <span className="text-white/30 uppercase tracking-wider mr-2">Classification:</span>
                      <span className="text-emerald-400 font-semibold">{selectedProject.tag}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                  <span className="text-xs text-white/40 font-mono">FILE NO. {selectedProject.id}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                      <Code2 size={13} />
                      <span>GitHub</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Bottom Navigation Bar (HOME left, ABOUT centre, CONTACT right) ── */}
      <footer className="orb-footer-bar">
        {/* Left: HOME */}
        <div className="orb-footer-left">
          <Link href="/" className="orb-footer-link" title="Home">
            <span className="orb-footer-link-mask">
              <span className="orb-footer-link-track">
                <span>HOME</span>
                <span>HOME</span>
              </span>
            </span>
          </Link>
        </div>

        {/* Center: ABOUT */}
        <div className="orb-footer-center">
          <Link href="/about" className="orb-footer-link" title="About">
            <span className="orb-footer-link-mask">
              <span className="orb-footer-link-track">
                <span>ABOUT</span>
                <span>ABOUT</span>
              </span>
            </span>
          </Link>
        </div>

        {/* Right: CONTACT + Socials */}
        <div className="orb-footer-right">
          <Link href="/contact" className="orb-footer-link" title="Contact">
            <span className="orb-footer-link-mask">
              <span className="orb-footer-link-track">
                <span>CONTACT</span>
                <span>CONTACT</span>
              </span>
            </span>
          </Link>

          <div className="orb-footer-socials">
            <a
              className="orb-footer-instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" />
              </svg>
            </a>

            <a
              className="orb-footer-tokonoma"
              href="https://github.com/Shachin-7"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <img
                src="/assets/orb/tokonoma_logo.png"
                alt="GitHub"
                draggable="false"
              />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
