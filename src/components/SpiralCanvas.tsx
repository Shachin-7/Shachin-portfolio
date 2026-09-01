"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const SPIRAL_PROJECTS = [
  { title: "OrbitXOS", video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118555/Orbit_xos_nyxur3.mov", image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=80", github: "https://github.com/Shachin-7/Orbit-xos" },
  { title: "Senior Business Analyst", video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1787156871/Screen_Recording_2026-08-19_at_9.46.01_PM_m92pbm.mov", image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80", github: "https://www.suryah.pro" },
  { title: "ABB Company Director", video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1787156989/Screen_Recording_2026-08-19_at_9.53.17_PM_yuxbha.mov", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80", github: "https://babu-portfolio-it5x.vercel.app" },
  { title: "JV Associate LLC", video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118555/jv_associate_dcejaz.mov", image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80", github: "https://web.jvassociatellc.com" },
  { title: "AI GNSS Satellite", video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118555/gnss_satellite_zgvcqm.mov", image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=800&q=80", github: "https://github.com/Shachin-7/AI-GNSS-satellite-error-prediction" },
  { title: "Railway Crack Detection", video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781118557/railway_crack_detection_dsjjgv.mov", image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80", github: "https://github.com/Shachin-7/Indian-railway-track-crack-detection-system" },
  { title: "OD Management", video: "https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto,w_600/v1781116179/OD_MANAGEMENT_dmin_yykg4a.mp4", image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80", github: "https://github.com/Shachin-7/OD-management-system" },
];

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

const PLANE_W = 1.6, PLANE_H = 1.0, V_GAP = 0.58, A_GAP = 0.92;
const RADIUS = 2.0, Y_OFFSET = -0.8, CAM_FOV = 35, CAM_Z = 9.2;
const N_ORIG = SPIRAL_PROJECTS.length;
const N_SLOTS = N_ORIG * 4;
const CTR_IDX = Math.floor(N_SLOTS / 2);

export default function SpiralCanvas({ onHoverChange }: { onHoverChange: (idx: number | null) => void }) {
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
    cv.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;";
    el.appendChild(cv);

    let contextLost = false;
    let animId: number;

    const onContextLost = (e: Event) => { e.preventDefault(); contextLost = true; cancelAnimationFrame(animId); };
    const onContextRestored = () => { contextLost = false; tick(); };
    cv.addEventListener("webglcontextlost", onContextLost);
    cv.addEventListener("webglcontextrestored", onContextRestored);

    const geo = new THREE.PlaneGeometry(1, 1, 8, 8);
    const PALETTE: [string, string][] = [["#1a1a4e","#6a3de8"],["#0d3b2e","#00cc88"],["#3d0d2a","#e83d7a"],["#1a2e4e","#3d8be8"],["#3d2a0d","#e89e3d"]];

    function makeFallback(pi: number) {
      const c = document.createElement("canvas"); c.width = 512; c.height = 302;
      const ctx = c.getContext("2d")!;
      const [c1, c2] = PALETTE[pi % PALETTE.length];
      const g = ctx.createLinearGradient(0, 0, 512, 302);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 302);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }

    const cards = Array.from({ length: N_SLOTS }, (_, i) => {
      const pi = i % N_ORIG, tex = makeFallback(pi);
      const mat = new THREE.ShaderMaterial({ uniforms: { uTexture: { value: tex }, uDarken: { value: 0 }, uZoom: { value: 1 }, uCornerRadius: { value: 0.06 }, uReveal: { value: 0 }, uScrollSpeed: { value: 0 }, uOpacity: { value: 1 } }, vertexShader, fragmentShader, transparent: true, side: THREE.DoubleSide, depthWrite: false });
      const mesh = new THREE.Mesh(geo, mat); mesh.scale.set(PLANE_W, PLANE_H, 1); mesh.userData.pi = pi; scene.add(mesh);
      return { mesh, mat, tex: tex as THREE.Texture, pi, reveal: 0, revealStarted: false };
    });

    function makeVideoTexture(src: string) {
      const vid = document.createElement("video"); vid.src = src; vid.crossOrigin = "anonymous"; vid.autoplay = true; vid.loop = true; vid.muted = true; vid.playsInline = true; vid.setAttribute("webkit-playsinline", "true"); vid.play().catch(() => {});
      const t = new THREE.VideoTexture(vid); t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; return t;
    }

    const loader = new THREE.TextureLoader(); loader.setCrossOrigin("anonymous");
    SPIRAL_PROJECTS.forEach((p, pi) => {
      if (p.video) { const t = makeVideoTexture(p.video); cards.filter((c) => c.pi === pi).forEach((c) => { c.mat.uniforms.uTexture.value = t; c.tex = t; }); }
      else { loader.load(p.image, (t) => { t.colorSpace = THREE.SRGBColorSpace; cards.filter((c) => c.pi === pi).forEach((c) => { c.mat.uniforms.uTexture.value = t; c.tex = t; }); }); }
    });

    cards.forEach((c, i) => setTimeout(() => { c.revealStarted = true; }, (i % 5) * 70));

    const mouse = new THREE.Vector2(); const raycaster = new THREE.Raycaster();
    let scrollOff = 0, wheelDY = 0.0005, targetDY = 0.0005, hoveredPi = -1;
    let dragging = false, prevDragY = 0, lastTime = performance.now();

    function tick() {
      if (contextLost) return;
      animId = requestAnimationFrame(tick);
      const now = performance.now(), delta = Math.min(now - lastTime, 50); lastTime = now;
      targetDY += (0.0005 - targetDY) * 0.025; wheelDY += (targetDY - wheelDY) * 0.085; scrollOff += wheelDY * (delta / 16.67);
      cards.forEach(({ mesh, mat }, i) => {
        const wi = ((i - scrollOff) % N_SLOTS + N_SLOTS) % N_SLOTS; const ci = wi - CTR_IDX;
        const angle = ci * A_GAP, y = ci * V_GAP + Y_OFFSET;
        mat.uniforms.uOpacity.value = 1.0 - Math.min(1.0, Math.max(0.0, (Math.abs(ci) - 6.5) / 2.5));
        mesh.position.set(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS);
        mesh.rotation.y = -angle + Math.PI / 2; mesh.scale.set(PLANE_W, PLANE_H, 1);
        mat.uniforms.uScrollSpeed.value = wheelDY;
        const c = cards[i]; if (c.revealStarted && c.reveal < 1) { c.reveal = Math.min(1, c.reveal + 0.035); mat.uniforms.uReveal.value = c.reveal; }
        mesh.renderOrder = Math.round((20 - camera.position.distanceTo(mesh.position)) * 100);
      });
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(cards.filter((c) => c.reveal > 0.05).map((c) => c.mesh));
      const nxtPi = hits.length > 0 ? hits[0].object.userData.pi : -1;
      if (nxtPi !== hoveredPi) {
        cards.forEach((c) => { const isHov = c.pi === nxtPi && nxtPi >= 0; c.mat.uniforms.uDarken.value = nxtPi >= 0 && !isHov ? 0.45 : 0; c.mat.uniforms.uZoom.value = isHov ? 1.06 : 1; });
        hoveredPi = nxtPi; onHoverChange(nxtPi >= 0 ? nxtPi : null);
      }
      try { renderer.render(scene, camera); } catch (_) {}
    }
    tick();

    const onWheel = (e: WheelEvent) => { e.preventDefault(); const imp = Math.max(-0.004, Math.min(0.004, e.deltaY * 0.00006)); targetDY += imp; targetDY = Math.max(-0.015, Math.min(0.015, targetDY)); wheelDY = targetDY; };
    const onMouseMove = (e: MouseEvent) => { const r = el.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1; if (dragging) { targetDY += -(e.clientY - prevDragY) * 0.0004; targetDY = Math.max(-0.03, Math.min(0.03, targetDY)); wheelDY = targetDY; prevDragY = e.clientY; } };
    let startX = 0, startY = 0;
    const onMouseDown = (e: MouseEvent) => { dragging = true; startX = e.clientX; startY = e.clientY; prevDragY = e.clientY; el.style.cursor = "grabbing"; };
    const onMouseUp = (e: MouseEvent) => { dragging = false; el.style.cursor = "grab"; const dist = Math.hypot(e.clientX - startX, e.clientY - startY); if (dist < 6 && hoveredPi >= 0 && SPIRAL_PROJECTS[hoveredPi]?.github) window.open(SPIRAL_PROJECTS[hoveredPi].github, "_blank", "noopener,noreferrer"); };
    const onTouchStart = (e: TouchEvent) => { dragging = true; prevDragY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => { if (!dragging) return; e.preventDefault(); targetDY += -(e.touches[0].clientY - prevDragY) * 0.0004; targetDY = Math.max(-0.03, Math.min(0.03, targetDY)); wheelDY = targetDY; prevDragY = e.touches[0].clientY; };
    const onTouchEnd = () => { dragging = false; };
    const onResize = () => { W = el.offsetWidth; H = el.offsetHeight; if (!W || !H) return; camera.aspect = W / H; camera.position.z = CAM_Z * Math.max(1, 1.48 / (W / H)); camera.updateProjectionMatrix(); renderer.setSize(W, H); };

    el.style.cursor = "grab";
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseUp);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    const ro = new ResizeObserver(onResize); ro.observe(el);

    return () => {
      contextLost = true;
      cancelAnimationFrame(animId);
      cv.removeEventListener("webglcontextlost", onContextLost);
      cv.removeEventListener("webglcontextrestored", onContextRestored);
      el.removeEventListener("wheel", onWheel); el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mousedown", onMouseDown); el.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseUp); el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove); el.removeEventListener("touchend", onTouchEnd);
      ro.disconnect();
      const disposedTextures = new Set<THREE.Texture>();
      cards.forEach(({ mat, tex }) => {
        try { mat.dispose(); } catch (_) {}
        if (tex && !disposedTextures.has(tex)) {
          disposedTextures.add(tex);
          const vid = (tex as THREE.VideoTexture).image as HTMLVideoElement | undefined;
          if (vid?.pause) { try { vid.pause(); vid.removeAttribute("src"); vid.load(); } catch (_) {} }
          try { tex.dispose(); } catch (_) {}
        }
      });
      try { geo.dispose(); renderer.dispose(); if (cv && el.contains(cv)) el.removeChild(cv); } catch (_) {}
    };
  }, [onHoverChange]);

  return (
    <div ref={mountRef} style={{ position: "absolute", inset: 0, overflow: "hidden", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)" }} />
  );
}
