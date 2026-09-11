"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import * as THREE from "three";

interface HeroTunnelProps {
  isDarkMode?: boolean;
  customImages?: string[];
  className?: string;
  transparent?: boolean;
}

const DEFAULT_IMAGES = [
  "/SHA.png",
  "/SHA-2.png",
  "/images/IMG_8761.jpg",
  "/images/IMG_3975.jpg",
  "/images/IMG_3978.jpg",
  "/assets/orb/projects.png",
  "/landing-pages/inner-green-assets/card-ethos.jpg",
  "/landing-pages/inner-green-assets/card-ecostove.jpg",
  "/assets/orb/1-img-tb.jpeg",
  "/assets/orb/2-img-tb.jpeg",
  "/assets/orb/3-img-tb.jpeg",
  "/assets/orb/6-img-tb.jpeg",
  "/assets/orb/12-img-tb.jpeg",
  "/assets/orb/16-img-tb.jpeg",
  "/assets/orb/21-img-tb.jpeg",
  "/assets/orb/25-img-tb.jpeg",
  "/assets/orb/30-img-tb.jpeg",
  "/assets/orb/35-img-tb.jpeg",
];

export default function HeroTunnel({
  isDarkMode = false,
  customImages = DEFAULT_IMAGES,
  className = "",
  transparent = false,
}: HeroTunnelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const segmentsRef = useRef<THREE.Group[]>([]);
  const scrollPosRef = useRef(0);
  const [imageUrls, setImageUrls] = useState<string[]>(customImages);

  const TUNNEL_WIDTH = 24;
  const TUNNEL_HEIGHT = 16;
  const SEGMENT_DEPTH = 6;
  const NUM_SEGMENTS = 14;
  const FLOOR_COLS = 6;
  const WALL_ROWS = 4;
  const COL_WIDTH = TUNNEL_WIDTH / FLOOR_COLS;
  const ROW_HEIGHT = TUNNEL_HEIGHT / WALL_ROWS;

  const populateImages = (
    group: THREE.Group,
    w: number,
    h: number,
    d: number,
    customPool: string[] = imageUrls
  ) => {
    const textureLoader = new THREE.TextureLoader();
    const cellMargin = 0.4;
    const activePool = customPool.length > 0 ? customPool : imageUrls;

    const addImg = (pos: THREE.Vector3, rot: THREE.Euler, wd: number, ht: number) => {
      const url = activePool[Math.floor(Math.random() * activePool.length)];
      const geom = new THREE.PlaneGeometry(wd - cellMargin, ht - cellMargin);
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });

      textureLoader.load(
        url,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.minFilter = THREE.LinearFilter;
          mat.map = tex;
          mat.needsUpdate = true;
          gsap.to(mat, { opacity: 0.85, duration: 1 });
        },
        undefined,
        () => {
          // Fallback if texture fails to load
        }
      );

      const m = new THREE.Mesh(geom, mat);
      m.position.copy(pos);
      m.rotation.copy(rot);
      m.name = "slab_image";
      group.add(m);
    };

    let lastFloorIdx = -999;
    for (let i = 0; i < FLOOR_COLS; i++) {
      if (i > lastFloorIdx + 1 && Math.random() > 0.8) {
        addImg(
          new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, -h, -d / 2),
          new THREE.Euler(-Math.PI / 2, 0, 0),
          COL_WIDTH,
          d
        );
        lastFloorIdx = i;
      }
    }

    let lastCeilIdx = -999;
    for (let i = 0; i < FLOOR_COLS; i++) {
      if (i > lastCeilIdx + 1 && Math.random() > 0.88) {
        addImg(
          new THREE.Vector3(-w + i * COL_WIDTH + COL_WIDTH / 2, h, -d / 2),
          new THREE.Euler(Math.PI / 2, 0, 0),
          COL_WIDTH,
          d
        );
        lastCeilIdx = i;
      }
    }

    let lastLeftIdx = -999;
    for (let i = 0; i < WALL_ROWS; i++) {
      if (i > lastLeftIdx + 1 && Math.random() > 0.8) {
        addImg(
          new THREE.Vector3(-w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
          new THREE.Euler(0, Math.PI / 2, 0),
          d,
          ROW_HEIGHT
        );
        lastLeftIdx = i;
      }
    }

    let lastRightIdx = -999;
    for (let i = 0; i < WALL_ROWS; i++) {
      if (i > lastRightIdx + 1 && Math.random() > 0.8) {
        addImg(
          new THREE.Vector3(w, -h + i * ROW_HEIGHT + ROW_HEIGHT / 2, -d / 2),
          new THREE.Euler(0, -Math.PI / 2, 0),
          d,
          ROW_HEIGHT
        );
        lastRightIdx = i;
      }
    }
  };

  const createSegment = (zPos: number) => {
    const group = new THREE.Group();
    group.position.z = zPos;
    const w = TUNNEL_WIDTH / 2;
    const h = TUNNEL_HEIGHT / 2;
    const d = SEGMENT_DEPTH;

    // Line color: #B0B0B0 (11579568) for light mode, #555555 (5592405) for dark mode
    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDarkMode ? 0x555555 : 0xb0b0b0,
      transparent: true,
      opacity: isDarkMode ? 0.35 : 0.5,
    });

    const lineGeo = new THREE.BufferGeometry();
    const vertices: number[] = [];

    for (let i = 0; i <= FLOOR_COLS; i++) {
      const x = -w + i * COL_WIDTH;
      vertices.push(x, -h, 0, x, -h, -d);
      vertices.push(x, h, 0, x, h, -d);
    }
    for (let i = 1; i < WALL_ROWS; i++) {
      const y = -h + i * ROW_HEIGHT;
      vertices.push(-w, y, 0, -w, y, -d);
      vertices.push(w, y, 0, w, y, -d);
    }

    vertices.push(-w, -h, 0, w, -h, 0);
    vertices.push(-w, h, 0, w, h, 0);
    vertices.push(-w, -h, 0, -w, h, 0);
    vertices.push(w, -h, 0, w, h, 0);

    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    const lines = new THREE.LineSegments(lineGeo, lineMaterial);
    group.add(lines);

    populateImages(group, w, h, d);
    return group;
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const scene = new THREE.Scene();
    const bgHex = isDarkMode ? 0x050505 : 0xffffff;
    if (!transparent) {
      scene.background = new THREE.Color(bgHex);
      scene.fog = new THREE.FogExp2(bgHex, 0.035);
    }
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: transparent,
      powerPreference: "high-performance",
    });
    if (transparent) {
      renderer.setClearColor(0x000000, 0);
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const segments: THREE.Group[] = [];
    for (let i = 0; i < NUM_SEGMENTS; i++) {
      const z = -i * SEGMENT_DEPTH;
      const segment = createSegment(z);
      scene.add(segment);
      segments.push(segment);
    }
    segmentsRef.current = segments;

    let frameId: number;
    let isVisible = true;

    const animate = () => {
      if (!isVisible) return;
      frameId = requestAnimationFrame(animate);
      if (!cameraRef.current || !sceneRef.current || !rendererRef.current) return;

      const targetZ = -scrollPosRef.current * 0.05;
      const currentZ = cameraRef.current.position.z;
      cameraRef.current.position.z += (targetZ - currentZ) * 0.1;

      const tunnelLength = NUM_SEGMENTS * SEGMENT_DEPTH;
      const camZ = cameraRef.current.position.z;

      segmentsRef.current.forEach((segment) => {
        if (segment.position.z > camZ + SEGMENT_DEPTH) {
          let minZ = 0;
          segmentsRef.current.forEach((s) => (minZ = Math.min(minZ, s.position.z)));
          segment.position.z = minZ - SEGMENT_DEPTH;

          const toRemove: THREE.Object3D[] = [];
          segment.traverse((c) => {
            if (c.name === "slab_image") toRemove.push(c);
          });
          toRemove.forEach((c) => {
            segment.remove(c);
            if (c instanceof THREE.Mesh) {
              c.geometry.dispose();
              if (c.material.map) c.material.map.dispose();
              c.material.dispose();
            }
          });
          populateImages(segment, TUNNEL_WIDTH / 2, TUNNEL_HEIGHT / 2, SEGMENT_DEPTH);
        }

        if (segment.position.z < camZ - tunnelLength - SEGMENT_DEPTH) {
          let maxZ = -999999;
          segmentsRef.current.forEach((s) => (maxZ = Math.max(maxZ, s.position.z)));
          segment.position.z = maxZ + SEGMENT_DEPTH;

          const toRemove: THREE.Object3D[] = [];
          segment.traverse((c) => {
            if (c.name === "slab_image") toRemove.push(c);
          });
          toRemove.forEach((c) => {
            segment.remove(c);
            if (c instanceof THREE.Mesh) {
              c.geometry.dispose();
              if (c.material.map) c.material.map.dispose();
              c.material.dispose();
            }
          });
          populateImages(segment, TUNNEL_WIDTH / 2, TUNNEL_HEIGHT / 2, SEGMENT_DEPTH);
        }
      });

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(frameId);
          animate();
        } else {
          cancelAnimationFrame(frameId);
        }
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const onScroll = () => {
      scrollPosRef.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [isDarkMode, transparent]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none ${className}`}
      style={{
        backgroundColor: transparent ? "transparent" : (isDarkMode ? "#050505" : "#ffffff"),
        transition: "background-color 0.7s ease",
      }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
