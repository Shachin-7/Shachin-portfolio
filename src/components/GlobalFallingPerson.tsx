"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import * as THREE from "three";

export default function GlobalFallingPerson() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathname = usePathname();
  const isHome = Boolean(
    pathname && (pathname === "/" || pathname === "")
  );
  const isHomeRef = useRef(isHome);

  useEffect(() => {
    isHomeRef.current = isHome;
  }, [isHome]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- 1. SCENE & PERSPECTIVE CAMERA ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.2);

    // --- 2. RENDERER (Transparent WebGL, Fixed behind content) ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- 3. STUDIO LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
    fillLight.position.set(-5, -3, 4);
    scene.add(fillLight);

    const mouseLight = new THREE.PointLight(0xffffff, 2.2, 14, 1.2);
    mouseLight.position.set(0, 0, 4);
    scene.add(mouseLight);

    // --- 4. 3D FALLING PERSON MESH ---
    let personMesh: THREE.Mesh | null = null;
    let personMaterial: THREE.MeshStandardMaterial | null = null;

    let startTime: number | null = null;
    const ENTRANCE_DURATION = 1.4;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/images/falling-person-cropped.png",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        // Aspect ratio 1405 / 835 ≈ 1.6826
        const width = 4.6;
        const height = width / 1.6826;

        const geometry = new THREE.PlaneGeometry(width, height, 32, 20);
        const pos = geometry.attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i) / (width * 0.5);
          const v = pos.getY(i) / (height * 0.5);
          // Elegant static body curvature
          const curvature =
            Math.cos(u * Math.PI * 0.45) * 0.20 -
            Math.sin(v * Math.PI * 0.5) * 0.10;
          pos.setZ(i, curvature);
        }
        geometry.computeVertexNormals();

        personMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.005,
          roughness: 0.35,
          metalness: 0.08,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        personMesh = new THREE.Mesh(geometry, personMaterial);
        personMesh.position.set(0.65, -0.15, 0);
        personMesh.rotation.set(0.06, -0.02, -0.05);
        scene.add(personMesh);

        // Start entrance animation right as texture is ready
        startTime = clock.getElapsedTime();
        renderer.render(scene, camera);
      },
      undefined,
      (err) => {
        console.error("Error loading falling person texture:", err);
      }
    );

    // --- 5. 3D FLOATING LIGHT GREEN DOTTED PARTICLES ---
    // Gentle glowing emerald/light green particles floating around the character
    const PARTICLE_COUNT = 65;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleSpeeds = new Float32Array(PARTICLE_COUNT);
    const particleBaseX = new Float32Array(PARTICLE_COUNT);
    const particlePhase = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const px = (Math.random() - 0.5) * 5.0 + 0.35;
      const py = (Math.random() - 0.5) * 5.5;
      const pz = (Math.random() - 0.5) * 2.0;
      particlePositions[i * 3 + 0] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;
      particleBaseX[i] = px;
      particleSpeeds[i] = 0.8 + Math.random() * 1.2;
      particlePhase[i] = Math.random() * Math.PI * 2;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Glow canvas texture for luminous light green dotted motes
    const pCanvas = document.createElement("canvas");
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext("2d");
    if (pCtx) {
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(220, 252, 231, 1.0)");    // soft light green core (#dcfce7)
      grad.addColorStop(0.25, "rgba(134, 239, 172, 0.95)"); // luminous light green (#86efac)
      grad.addColorStop(0.55, "rgba(74, 222, 128, 0.45)");  // radiant emerald halo (#4ade80)
      grad.addColorStop(1, "rgba(34, 197, 94, 0)");
      pCtx.fillStyle = grad;
      pCtx.fillRect(0, 0, 64, 64);
    }
    const pTex = new THREE.CanvasTexture(pCanvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.09,
      map: pTex,
      color: 0x86efac,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleMesh = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleMesh);

    // --- 6. INTERACTIVE MOUSE STATE ---
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- 7. CRITICALLY DAMPED ULTRA-SMOOTH SCROLL PHYSICS ---
    let targetScrollY = typeof window !== "undefined" ? window.scrollY || 0 : 0;
    let currentSmoothScrollY = targetScrollY;
    let smoothVelocityY = 0;
    let docMaxScroll = 1;

    const updateMaxScroll = () => {
      const docH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );
      const windowH = window.innerHeight;
      docMaxScroll = Math.max(docH - windowH, 1);
      targetScrollY = window.scrollY || window.pageYOffset || 0;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset || 0;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateMaxScroll();

    const timer1 = setTimeout(updateMaxScroll, 200);
    const timer2 = setTimeout(updateMaxScroll, 800);

    // --- 8. CONTINUOUS MONOTONIC DESCENDING TRAJECTORY KEYFRAMES ---
    // Zero yo-yo bobbing: y descends smoothly from top to footer without reversals.
    // Horizontal position x sways organically around content cards.
    interface Keyframe {
      p: number;
      x: number;
      y: number;
      z: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      scale: number;
    }

    const TRAJECTORY_KEYFRAMES: Keyframe[] = [
      // 0: Hero Section (Top - exact match with user reference image)
      { p: 0.00, x: 0.65, y: -0.12, z: 0.0,   rotX: 0.06, rotY: -0.02, rotZ: -0.05, scale: 1.05 },
      // 1: Hero descent into Work History transition
      { p: 0.12, x: 0.58, y: -0.26, z: -0.06, rotX: 0.09, rotY: 0.03,  rotZ: -0.08, scale: 1.03 },
      // 2: Experience / Work History (Gliding behind the experience list)
      { p: 0.26, x: 0.46, y: -0.44, z: -0.12, rotX: 0.12, rotY: 0.07,  rotZ: -0.12, scale: 1.00 },
      // 3: Tech Stack & Clothesline Gallery (Swaying gracefully across center-left)
      { p: 0.42, x: 0.20, y: -0.60, z: -0.10, rotX: 0.08, rotY: 0.12,  rotZ: -0.07, scale: 0.97 },
      // 4: Community Work (Gliding behind 4 cards & active tech stats)
      { p: 0.58, x: 0.44, y: -0.76, z: -0.15, rotX: 0.13, rotY: 0.04,  rotZ: -0.13, scale: 0.96 },
      // 5: Community Work to My Approach transition
      { p: 0.72, x: 0.36, y: -0.90, z: -0.12, rotX: 0.10, rotY: 0.08,  rotZ: -0.09, scale: 0.95 },
      // 6: My Approach (Gliding smoothly across the curved path)
      { p: 0.85, x: 0.28, y: -1.04, z: -0.10, rotX: 0.08, rotY: 0.05,  rotZ: -0.06, scale: 0.93 },
      // 7: Approaching Footer
      { p: 0.93, x: 0.24, y: -1.14, z: -0.08, rotX: 0.06, rotY: 0.01,  rotZ: -0.04, scale: 0.91 },
      // 8: Footer Bottom (Settling beautifully into view behind footer CTA)
      { p: 1.00, x: 0.20, y: -1.22, z: -0.06, rotX: 0.04, rotY: -0.02, rotZ: -0.03, scale: 0.90 },
    ];

    const sampleTrajectory = (p: number, isMobile: boolean): Keyframe => {
      const clampedP = Math.max(0, Math.min(1, p));
      const kfs = TRAJECTORY_KEYFRAMES;

      let i = 0;
      while (i < kfs.length - 1 && kfs[i + 1].p < clampedP) {
        i++;
      }
      const k0 = kfs[i];
      const k1 = kfs[Math.min(i + 1, kfs.length - 1)];

      const span = k1.p - k0.p;
      const tRaw = span > 0 ? (clampedP - k0.p) / span : 0;
      // Smooth cubic Hermite interpolation for C1 mathematical continuity
      const t = tRaw * tRaw * (3 - 2 * tRaw);

      const lerp = (a: number, b: number) => a + (b - a) * t;
      const xOffset = isMobile ? -0.32 : 0;

      return {
        p: clampedP,
        x: lerp(k0.x, k1.x) + xOffset,
        y: lerp(k0.y, k1.y),
        z: lerp(k0.z, k1.z),
        rotX: lerp(k0.rotX, k1.rotX),
        rotY: lerp(k0.rotY, k1.rotY),
        rotZ: lerp(k0.rotZ, k1.rotZ),
        scale: lerp(k0.scale, k1.scale) * (isMobile ? 0.72 : 1.0),
      };
    };

    // --- 9. WINDOW RESIZE ---
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      updateMaxScroll();
    };
    window.addEventListener("resize", handleResize);

    // --- 10. BUTTER-SMOOTH ANIMATION & PHYSICS LOOP (60/120 FPS LOCKED) ---
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let lastFrameTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Only render if currently on Home page
      if (!isHomeRef.current) return;

      const now = performance.now();
      const dt = Math.min(Math.max((now - lastFrameTime) / 1000, 0.001), 0.05); // seconds, robust clamp
      lastFrameTime = now;

      const elapsedTime = clock.getElapsedTime();
      if (startTime === null) startTime = elapsedTime;
      const timeSinceStart = elapsedTime - startTime;

      // ── 1. Silky Smooth Exponential Scroll Filter ──
      // Uses relaxed constant (4.6) for liquid-smooth momentum, eliminating all notch jitters
      const prevScrollY = currentSmoothScrollY;
      currentSmoothScrollY += (targetScrollY - currentSmoothScrollY) * (1 - Math.exp(-4.6 * dt));
      const p = Math.min(Math.max(currentSmoothScrollY / docMaxScroll, 0), 1.0);

      // ── 2. Mathematically Continuous Velocity (Zero Noise) ──
      const rawVelocityY = (currentSmoothScrollY - prevScrollY) / dt;
      smoothVelocityY += (rawVelocityY - smoothVelocityY) * (1 - Math.exp(-5.5 * dt));



      // ── 3. Smooth Entrance Animation on Initial Page Load ──
      let entranceYOffset = 0;
      let entranceRotZOffset = 0;
      if (timeSinceStart < ENTRANCE_DURATION + 0.2) {
        const entranceProgress = Math.min(1.0, timeSinceStart / ENTRANCE_DURATION);
        const easeEntrance = 1 - Math.pow(1 - entranceProgress, 3);
        const fadeWithScroll = Math.max(0, 1 - p * 8.0);
        entranceYOffset = (1 - easeEntrance) * 3.0 * fadeWithScroll;
        entranceRotZOffset = (1 - easeEntrance) * 0.16 * fadeWithScroll;
      }

      // ── 4. Mouse Parallax Smoothing ──
      currentMouseX += (targetMouseX - currentMouseX) * (1 - Math.exp(-5.0 * dt));
      currentMouseY += (targetMouseY - currentMouseY) * (1 - Math.exp(-5.0 * dt));

      // Steady studio mouse light follow (constant intensity to prevent any throbbing)
      mouseLight.position.x = currentMouseX * 3.5;
      mouseLight.position.y = currentMouseY * 2.5;
      mouseLight.intensity = 2.2;

      // ── 5. Upward Drifting Light Green Dotted Particles ──
      if (particleMesh) {
        const pAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
        const upwardSpeed = (0.50 + Math.max(0, smoothVelocityY / 1400) * 1.8) * dt;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
          let py = pAttr.getY(i) + upwardSpeed * particleSpeeds[i];
          const px = particleBaseX[i] + Math.sin(elapsedTime * 0.8 + particlePhase[i]) * 0.06;
          pAttr.setX(i, px);

          if (py > 3.4) {
            py = -3.4;
          } else if (py < -3.4) {
            py = 3.4;
          }
          pAttr.setY(i, py);
        }
        pAttr.needsUpdate = true;
      }

      // ── 6. 3D Person Kinematics: Stay Still with Silky Smooth Scroll ──
      if (personMesh && personMaterial) {
        const isMobile = window.innerWidth < 768;

        // Sample smooth, monotonically descending section trajectory
        const traj = sampleTrajectory(p, isMobile);

        // Position: strictly stable, smooth trajectory translation without vibration
        personMesh.position.x = traj.x + currentMouseX * 0.12;
        personMesh.position.y = traj.y + entranceYOffset + currentMouseY * 0.08;
        personMesh.position.z = traj.z;

        // Rotation: calm, still pose without pitch/roll throbbing
        personMesh.rotation.x = traj.rotX - currentMouseY * 0.06;
        personMesh.rotation.y = traj.rotY + currentMouseX * 0.08;
        personMesh.rotation.z = traj.rotZ + entranceRotZOffset + currentMouseX * 0.02;

        personMesh.scale.setScalar(traj.scale);
        personMaterial.opacity = 1.0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (personMesh) {
        personMesh.geometry.dispose();
        if (Array.isArray(personMesh.material)) {
          personMesh.material.forEach((m) => m.dispose());
        } else {
          personMesh.material.dispose();
        }
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      pTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="global-falling-person-canvas"
      className="fixed inset-0 pointer-events-none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 5,
        display: isHome ? "block" : "none",
      }}
    />
  );
}
