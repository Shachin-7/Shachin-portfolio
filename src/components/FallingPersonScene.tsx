"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FallingPersonScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Scene & Camera ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 7.2);

    // --- Renderer ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // --- Studio Clean Lighting for High-Fidelity Monochrome Subject ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 1.0);
    fillLight.position.set(-5, -3, 4);
    scene.add(fillLight);

    // Interactive mouse point light for specular sheen
    const mouseLight = new THREE.PointLight(0xffffff, 2.0, 12, 1.2);
    mouseLight.position.set(0, 0, 4);
    scene.add(mouseLight);

    // --- 3D Falling Person Mesh ---
    let personMesh: THREE.Mesh | null = null;
    let personMaterial: THREE.MeshStandardMaterial | null = null;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "/images/falling-person-cropped.png",
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;

        // Aspect ratio of cropped cutout is 1415 / 838 ≈ 1.6885
        const width = 4.6;
        const height = width / 1.6885; // ~2.72

        // Subdivided geometry for smooth 3D organic depth curvature
        const geometry = new THREE.PlaneGeometry(width, height, 48, 28);
        const posAttr = geometry.attributes.position;

        for (let i = 0; i < posAttr.count; i++) {
          const u = posAttr.getX(i) / (width * 0.5); // -1 to 1
          const v = posAttr.getY(i) / (height * 0.5); // -1 to 1

          // Physical body curvature: torso curves forward, limbs drape back
          const curvature =
            Math.cos(u * Math.PI * 0.45) * 0.22 -
            Math.sin(v * Math.PI * 0.5) * 0.12;
          posAttr.setZ(i, curvature);
        }
        geometry.computeVertexNormals();

        personMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.002,
          roughness: 0.38,
          metalness: 0.08,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        personMesh = new THREE.Mesh(geometry, personMaterial);
        // Initial setup
        personMesh.position.set(0.65, 3.5, 0);
        personMesh.rotation.set(0.06, -0.02, -0.05);
        scene.add(personMesh);
      },
      undefined,
      (err) => {
        console.error("Error loading falling person texture:", err);
      }
    );

    // --- Mouse Parallax State ---
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- Global Scroll Progress (0.0 at top → 1.0 at footer) ---
    let targetProgress = 0;
    let currentProgress = 0;

    const updateScrollProgress = () => {
      const docH = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );
      const windowH = window.innerHeight;
      const maxScroll = Math.max(docH - windowH, 1);
      const scrollY = window.scrollY || window.pageYOffset;
      targetProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1.0);
    };

    window.addEventListener("scroll", updateScrollProgress, { passive: true });
    updateScrollProgress();

    // --- Window Resize ---
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      updateScrollProgress();
    };

    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();
    let startTime: number | null = null;
    const ENTRANCE_DURATION = 1.6; // seconds for person to fall into initial hero view

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      if (startTime === null) startTime = elapsedTime;
      const timeSinceStart = elapsedTime - startTime;

      // Calculate hero entrance animation (falls into view on load)
      const entranceProgress = Math.min(1.0, timeSinceStart / ENTRANCE_DURATION);
      // Cubic ease out
      const easeEntrance = 1 - Math.pow(1 - entranceProgress, 3);
      const entranceYOffset = (1 - easeEntrance) * 3.8;
      const entranceRotZOffset = (1 - easeEntrance) * 0.22;

      // Smooth interpolation for mouse parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Smooth interpolation for scroll progress (physics inertia)
      currentProgress += (targetProgress - currentProgress) * 0.06;
      const p = currentProgress;

      // Update interactive mouse point light
      mouseLight.position.x = currentMouseX * 3.5;
      mouseLight.position.y = currentMouseY * 2.5;

      // --- 3D Continuous Motion Path from Hero to Footer ---
      if (personMesh && personMaterial) {
        // Zero-gravity idle breathing bobbing
        const idleY = Math.sin(elapsedTime * 1.3) * 0.05;
        const idleRotZ = Math.sin(elapsedTime * 0.9) * 0.02;

        // Base Hero Coordinates (matching the exact position in the reference image):
        // Positioned slightly right of center, hand reaching upward towards title text
        const baseHeroX = 0.65;
        const baseHeroY = -0.15;
        const baseHeroZ = 0.0;

        const baseRotX = 0.06;
        const baseRotY = -0.02;
        const baseRotZ = -0.05;

        // Scroll Drift down through the entire page till the footer:
        // As p goes from 0 → 1:
        // - Drifts downward by ~10 units
        // - Continues rotating slightly in 3D perspective
        // - Sways gently in lateral X
        // - Pushes slightly back in Z depth
        const scrollYDrift = -p * 10.5;
        const scrollXDrift = Math.sin(p * Math.PI * 1.8) * 0.75;
        const scrollZDrift = -p * 1.8;

        const scrollRotZ = -p * 1.4 + Math.sin(p * Math.PI) * 0.15;
        const scrollRotY = Math.sin(p * Math.PI * 1.5) * 0.35;
        const scrollRotX = p * 0.35;

        // Apply Position:
        personMesh.position.x =
          baseHeroX +
          scrollXDrift +
          currentMouseX * 0.25;

        personMesh.position.y =
          baseHeroY +
          entranceYOffset +
          scrollYDrift +
          idleY +
          currentMouseY * 0.2;

        personMesh.position.z =
          baseHeroZ +
          scrollZDrift;

        // Apply Rotation:
        personMesh.rotation.x =
          baseRotX +
          scrollRotX -
          currentMouseY * 0.2;

        personMesh.rotation.y =
          baseRotY +
          scrollRotY +
          currentMouseX * 0.25;

        personMesh.rotation.z =
          baseRotZ +
          entranceRotZOffset +
          scrollRotZ +
          idleRotZ +
          currentMouseX * 0.08;

        // Maintain scale with subtle perspective depth
        personMesh.scale.setScalar(1.05 - p * 0.15);

        // Opacity is 1.0 (behind everything as backward layer)
        personMaterial.opacity = 1.0;
      }

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", handleResize);

      if (personMesh) {
        personMesh.geometry.dispose();
        if (Array.isArray(personMesh.material)) {
          personMesh.material.forEach((m) => m.dispose());
        } else {
          personMesh.material.dispose();
        }
      }
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ display: "block" }}
    />
  );
}
