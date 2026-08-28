# 🌀 Projects Section — Copy Guide

A self-contained **3D spiral carousel + list view** for showcasing projects. Built with Three.js WebGL, Framer Motion, and React.

---

## 📦 Step 1 — Install Dependencies

```bash
npm install three framer-motion
```

---

## 🤖 Step 2 — AI Prompt to Implement It

Copy and paste this prompt into any AI coding assistant (Cursor, Claude, ChatGPT, Gemini):

---

> **PROMPT:**
>
> Build me a React component called `Projects` for my portfolio. It should be a full-screen black-background section with two views: a **3D spiral carousel** (default) and a **list view**, toggled by a pill switcher at the top.
>
> **Spiral view** — use Three.js WebGL to render project cards arranged in a 3D cylindrical spiral (like pacomepertant's "spiroll"). Each card is a `THREE.ShaderMaterial` plane with:
> - A custom vertex shader that adds a concave warp and scroll-speed stretch effect
> - A custom fragment shader with rounded corners, darken-on-hover, zoom-on-hover, and a reveal animation
> - Video textures loaded from Cloudinary CDN URLs (use `crossOrigin = 'anonymous'` on the video element)
> - Fallback gradient textures while videos load
> - Infinite seamless loop (N_SLOTS = N_ORIG × 4)
> - Mouse wheel scroll, click-drag scroll, and touch drag to spin the carousel
> - Raycaster hover detection: hovered card zooms in (uZoom=1.06), others darken (uDarken=0.45)
> - A floating tooltip near the cursor showing the project image, title, description, and "View on GitHub ↗"
> - Cards fade out at extreme edges to avoid pop-in
> - Camera Z adjusts dynamically for aspect ratio
>
> **List view** — a centered column of project titles in large type (clamp 30px–62px), each a link to GitHub. On hover: hovered item stays full opacity, others fade to 15% opacity. A floating video preview card follows the cursor showing the project video or image.
>
> **Pill toggle** — fixed at top center, glassmorphism style (`backdrop-filter: blur`), buttons labeled "spiral" and "list".
>
> **"View Footer" button** — fixed bottom-left in spiral mode, clicking it slides up a full-screen footer overlay from the bottom with a spring animation. An "×" button closes it.
>
> **Project data shape:**
> ```js
> { title, fullTitle, category, year, github, image, video }
> ```
>
> Use `framer-motion` for AnimatePresence transitions between spiral/list views (opacity fade 0.4s) and tooltip animations.
>
> Clean up all Three.js resources (renderer, geometry, materials, textures, video elements) on unmount.
>
> Style everything with a CSS string injected via `<style>` tag inside the component. Use Inter font from Google Fonts. Background is pure black `#000`.
>
> Make it fully self-contained in one file with no external CSS imports needed.

---

## 📄 Step 3 — Full Source Code

Paste this file as `src/sections/Projects.jsx` (replace the `PROJECTS` array with your own data):

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// ─── YOUR PROJECT DATA — edit this ───────────────────────────────────────────
const PROJECTS = [
  {
    title: 'Project One',
    fullTitle: 'Full Project One Title',
    category: 'Machine Learning & AI',
    year: '2024',
    github: 'https://github.com/yourname/project-one',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    video: 'https://res.cloudinary.com/YOUR_CLOUD/video/upload/f_auto,q_auto:eco/YOUR_VIDEO.mp4',
  },
  {
    title: 'Project Two',
    fullTitle: 'Full Project Two Title',
    category: 'Data Engineering',
    year: '2024',
    github: 'https://github.com/yourname/project-two',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    video: 'https://res.cloudinary.com/YOUR_CLOUD/video/upload/f_auto,q_auto:eco/YOUR_VIDEO2.mp4',
  },
  // Add more projects...
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
const PLANE_W = 1.6, PLANE_H = 1.0, V_GAP = 0.58, A_GAP = 0.92;
const RADIUS = 2.0, Y_OFFSET = -0.8, CAM_FOV = 35, CAM_Z = 9.2;
const N_ORIG = PROJECTS.length;
const N_SLOTS = N_ORIG * 4;
const CTR_IDX = Math.floor(N_SLOTS / 2);

// ─── Spiral WebGL Canvas ──────────────────────────────────────────────────────
function SpiralCanvas({ onHoverChange }) {
  const mountRef = useRef(null);

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
    cv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;touch-action:none;';
    el.appendChild(cv);

    const geo = new THREE.PlaneGeometry(1, 1, 8, 8);
    const PALETTE = [['#1a1a4e','#6a3de8'],['#0d3b2e','#00cc88'],['#3d0d2a','#e83d7a'],['#1a2e4e','#3d8be8'],['#3d2a0d','#e89e3d']];

    function makeFallback(pi) {
      const c = document.createElement('canvas'); c.width = 512; c.height = 302;
      const ctx = c.getContext('2d'); const [c1, c2] = PALETTE[pi % PALETTE.length];
      const g = ctx.createLinearGradient(0, 0, 512, 302);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, 512, 302);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }

    const cards = Array.from({ length: N_SLOTS }, (_, i) => {
      const pi = i % N_ORIG, tex = makeFallback(pi);
      const mat = new THREE.ShaderMaterial({
        uniforms: { uTexture:{value:tex}, uDarken:{value:0}, uZoom:{value:1}, uCornerRadius:{value:0.06}, uReveal:{value:0}, uScrollSpeed:{value:0}, uOpacity:{value:1} },
        vertexShader, fragmentShader, transparent: true, side: THREE.DoubleSide, depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.set(PLANE_W, PLANE_H, 1); mesh.userData.pi = pi; scene.add(mesh);
      return { mesh, mat, tex, pi, reveal: 0, revealStarted: false };
    });

    function makeVideoTexture(src) {
      const vid = document.createElement('video');
      vid.src = src; vid.crossOrigin = 'anonymous'; vid.autoplay = true;
      vid.loop = true; vid.muted = true; vid.playsInline = true;
      vid.setAttribute('webkit-playsinline', 'true');
      vid.play().catch(() => {});
      const t = new THREE.VideoTexture(vid);
      t.colorSpace = THREE.SRGBColorSpace; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter;
      return t;
    }

    const loader = new THREE.TextureLoader(); loader.setCrossOrigin('anonymous');
    PROJECTS.forEach((p, pi) => {
      if (p.video) {
        const t = makeVideoTexture(p.video);
        cards.filter(c => c.pi === pi).forEach(c => { c.mat.uniforms.uTexture.value = t; c.tex = t; });
      } else {
        loader.load(p.image, t => {
          t.colorSpace = THREE.SRGBColorSpace;
          cards.filter(c => c.pi === pi).forEach(c => { c.mat.uniforms.uTexture.value = t; c.tex = t; });
        });
      }
    });

    cards.forEach((c, i) => setTimeout(() => { c.revealStarted = true; }, (i % 5) * 70));

    const mouse = new THREE.Vector2(); const raycaster = new THREE.Raycaster();
    let scrollOff = 0, wheelDY = 0.0005, targetDY = 0.0005, hoveredPi = -1;
    let dragging = false, prevDragY = 0, lastTime = performance.now(), animId;

    function tick() {
      animId = requestAnimationFrame(tick);
      const now = performance.now(), delta = Math.min(now - lastTime, 50); lastTime = now;
      targetDY += (0.0005 - targetDY) * 0.025;
      wheelDY += (targetDY - wheelDY) * 0.085;
      scrollOff += wheelDY * (delta / 16.67);

      cards.forEach(({ mesh, mat }, i) => {
        let wi = ((i - scrollOff) % N_SLOTS + N_SLOTS) % N_SLOTS;
        const ci = wi - CTR_IDX;
        const angle = ci * A_GAP, y = ci * V_GAP + Y_OFFSET;
        const opacity = 1.0 - Math.min(1.0, Math.max(0.0, (Math.abs(ci) - 6.5) / 2.5));
        mat.uniforms.uOpacity.value = opacity;
        mesh.position.set(Math.cos(angle) * RADIUS, y, Math.sin(angle) * RADIUS);
        mesh.rotation.y = -angle + Math.PI / 2;
        mesh.scale.set(PLANE_W, PLANE_H, 1);
        mat.uniforms.uScrollSpeed.value = wheelDY;
        const c = cards[i];
        if (c.revealStarted && c.reveal < 1) { c.reveal = Math.min(1, c.reveal + 0.035); mat.uniforms.uReveal.value = c.reveal; }
        mesh.renderOrder = Math.round((20 - camera.position.distanceTo(mesh.position)) * 100);
      });

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(cards.filter(c => c.reveal > 0.05).map(c => c.mesh));
      const nxtPi = hits.length > 0 ? hits[0].object.userData.pi : -1;
      if (nxtPi !== hoveredPi) {
        cards.forEach(c => {
          const isHov = c.pi === nxtPi && nxtPi >= 0;
          c.mat.uniforms.uDarken.value = (nxtPi >= 0 && !isHov) ? 0.45 : 0;
          c.mat.uniforms.uZoom.value = isHov ? 1.06 : 1;
        });
        hoveredPi = nxtPi; onHoverChange(nxtPi >= 0 ? nxtPi : null);
      }
      renderer.render(scene, camera);
    }
    tick();

    const onWheel = e => { e.preventDefault(); const imp = Math.max(-0.004, Math.min(0.004, e.deltaY * 0.00006)); targetDY += imp; targetDY = Math.max(-0.015, Math.min(0.015, targetDY)); wheelDY = targetDY; };
    const onMouseMove = e => { const r = el.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1; mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1; if (dragging) { targetDY += -(e.clientY - prevDragY) * 0.0004; targetDY = Math.max(-0.03, Math.min(0.03, targetDY)); wheelDY = targetDY; prevDragY = e.clientY; } };
    const onMouseDown = e => { dragging = true; prevDragY = e.clientY; el.style.cursor = 'grabbing'; };
    const onMouseUp = () => { dragging = false; el.style.cursor = 'grab'; };
    const onTouchStart = e => { dragging = true; prevDragY = e.touches[0].clientY; };
    const onTouchMove = e => { if (!dragging) return; e.preventDefault(); targetDY += -(e.touches[0].clientY - prevDragY) * 0.0004; targetDY = Math.max(-0.03, Math.min(0.03, targetDY)); wheelDY = targetDY; prevDragY = e.touches[0].clientY; };
    const onTouchEnd = () => { dragging = false; };
    const onResize = () => { W = el.offsetWidth; H = el.offsetHeight; if (!W || !H) return; camera.aspect = W / H; camera.position.z = CAM_Z * Math.max(1, 1.48 / (W / H)); camera.updateProjectionMatrix(); renderer.setSize(W, H); };

    el.style.cursor = 'grab';
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('mousemove', onMouseMove); el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mouseup', onMouseUp); el.addEventListener('mouseleave', onMouseUp);
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    const ro = new ResizeObserver(onResize); ro.observe(el);

    return () => {
      cancelAnimationFrame(animId);
      ['wheel','mousemove','mousedown','mouseup','mouseleave','touchstart','touchmove','touchend'].forEach(ev => el.removeEventListener(ev, ev === 'wheel' ? onWheel : ev === 'mousemove' ? onMouseMove : ev === 'mousedown' ? onMouseDown : ev === 'mouseup' || ev === 'mouseleave' ? onMouseUp : ev === 'touchstart' ? onTouchStart : ev === 'touchmove' ? onTouchMove : onTouchEnd));
      ro.disconnect();
      cards.forEach(({ mat, tex }) => { mat.dispose(); if (tex) { if (tex.image?.pause) { tex.image.pause(); tex.image.src = ''; tex.image.load(); } tex.dispose(); } });
      geo.dispose(); renderer.dispose(); if (el.contains(cv)) el.removeChild(cv);
    };
  }, []);

  return <div ref={mountRef} style={{ position:'absolute', inset:0, overflow:'hidden', WebkitMaskImage:'linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)', maskImage:'linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)' }} />;
}

// ─── Main Projects Component ──────────────────────────────────────────────────
export default function Projects({ onNavigate }) {
  const [viewMode, setViewMode] = useState('spiral');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const h = e => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  const tipLeft = mousePos.x > window.innerWidth - 260 ? mousePos.x - 240 : mousePos.x + 22;

  return (
    <section style={{ width:'100%', minHeight:'100vh', backgroundColor:'#000', position:'relative', overflow: viewMode === 'spiral' ? 'hidden' : 'visible' }}>
      <style>{CSS}</style>
      <div className="pp" style={{ width:'100%', height: viewMode === 'spiral' ? '100vh' : 'auto', position:'relative' }}>

        {/* Toggle pill */}
        <div className="view-switch">
          <button className={`sw ${viewMode==='spiral'?'sw-on':''}`} onClick={() => { setViewMode('spiral'); setHoveredIndex(null); }}>spiral</button>
          <span className="sw-dot" />
          <button className={`sw ${viewMode==='list'?'sw-on':''}`} onClick={() => { setViewMode('list'); setHoveredIndex(null); }}>list</button>
        </div>

        <AnimatePresence mode="wait">
          {/* Spiral view */}
          {viewMode === 'spiral' && (
            <motion.div key="spiral" style={{ position:'fixed', inset:0, background:'#000', zIndex:1 }} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}>
              <SpiralCanvas onHoverChange={setHoveredIndex} />
            </motion.div>
          )}

          {/* List view */}
          {viewMode === 'list' && (
            <motion.div key="list" className="list-view" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.4 }}>
              {PROJECTS.map((p, i) => (
                <motion.a key={i} className="proj-item" href={p.github} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45, delay: i * 0.08 }}
                  onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                  {p.title}<span className="proj-meta">{p.category} — {p.year}</span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tooltip (spiral mode) */}
        <AnimatePresence>
          {viewMode === 'spiral' && hoveredIndex !== null && PROJECTS[hoveredIndex] && (
            <motion.div key="tooltip" initial={{ opacity:0, scale:0.88, y:8 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.88, y:8 }} transition={{ duration:0.13 }}
              style={{ position:'fixed', left:tipLeft, top:mousePos.y-16, transform:'translateY(-100%)', pointerEvents:'none', zIndex:9999, width:'218px', borderRadius:'18px', overflow:'hidden', background:'#fff', boxShadow:'0 24px 64px rgba(0,0,0,0.6)' }}>
              <img src={PROJECTS[hoveredIndex].image} alt="" style={{ width:'100%', height:'115px', objectFit:'cover', display:'block' }} />
              <div style={{ padding:'12px 14px 15px' }}>
                <p style={{ margin:0, fontFamily:'Inter,sans-serif', fontSize:'15px', fontWeight:700, color:'#0a0a0a' }}>{PROJECTS[hoveredIndex].title}</p>
                <p style={{ margin:'5px 0 0', fontFamily:'Inter,sans-serif', fontSize:'11.5px', color:'#555' }}>{PROJECTS[hoveredIndex].fullTitle}</p>
                <p style={{ margin:'3px 0 0', fontFamily:'Inter,sans-serif', fontSize:'11px', color:'#bbb' }}>{PROJECTS[hoveredIndex].category} · {PROJECTS[hoveredIndex].year}</p>
                <p style={{ margin:'11px 0 0', fontFamily:'Inter,sans-serif', fontSize:'12.5px', fontWeight:600, color:'#0a0a0a' }}>View on GitHub ↗</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating video preview (list mode) */}
        <AnimatePresence>
          {viewMode === 'list' && hoveredIndex !== null && PROJECTS[hoveredIndex] && (
            <motion.div initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }} transition={{ duration:0.3 }}
              style={{ position:'fixed', left:mousePos.x, top:mousePos.y, transform:'translate(-50%,-50%)', pointerEvents:'none', zIndex:2, width:'300px', height:'188px', borderRadius:'14px', overflow:'hidden', boxShadow:'0 20px 50px rgba(0,0,0,0.5)' }}>
              {PROJECTS[hoveredIndex].video
                ? <video src={PROJECTS[hoveredIndex].video} autoPlay loop muted playsInline preload="auto" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <img src={PROJECTS[hoveredIndex].image} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  .pp * { box-sizing: border-box; }
  .view-switch { display:flex; align-items:center; gap:16px; position:fixed; top:84px; left:50%; transform:translateX(-50%); z-index:50; background:rgba(10,10,10,0.6); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-radius:100px; padding:8px 22px; }
  .sw { background:none; border:none; cursor:pointer; color:rgba(255,255,255,0.38); font-family:'Inter',sans-serif; font-size:14px; font-weight:500; padding:0; transition:color 0.22s ease; }
  .sw.sw-on { color:#fff; }
  .sw:hover { color:rgba(255,255,255,0.72); }
  .sw-dot { width:4px; height:4px; border-radius:50%; background:rgba(255,255,255,0.55); flex-shrink:0; }
  .list-view { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:100vh; padding:15vh 0; position:relative; z-index:1; }
  .proj-item { cursor:pointer; font-size:clamp(30px,4.8vw,62px); font-weight:500; color:#fff; margin:0; padding:0.3em 0; text-decoration:none; display:block; text-align:center; letter-spacing:-0.03em; font-family:'Inter',sans-serif; line-height:1.1; transition:opacity 0.28s ease; }
  .list-view:has(.proj-item:hover) .proj-item:not(:hover) { opacity:0.15; }
  .proj-meta { display:block; font-size:clamp(13px,1.4vw,18px); font-weight:400; color:rgba(255,255,255,0.35); margin-top:4px; letter-spacing:0.01em; }
`;
```

---

## ⚙️ Step 4 — Video Hosting (Cloudinary)

Upload your videos to [Cloudinary](https://cloudinary.com) and use this URL format for fast delivery:

```
https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/f_auto,q_auto:eco/v.../your_video.mp4
```

- `f_auto` — auto-selects WebM (Chrome) or MP4 (Safari) for fastest load
- `q_auto:eco` — reduces file size by ~40% with minimal quality loss

---

## 🔑 Key Technical Notes for the AI

- **`crossOrigin = 'anonymous'`** on video elements is **MANDATORY** for WebGL `VideoTexture` — without it all cards appear black
- Use `N_SLOTS = N_ORIG * 4` for a seamless infinite loop with no visible popping
- Always clean up Three.js resources in the `useEffect` return function (cancel animation frame, dispose renderer/geo/materials/textures, pause video elements)
- `depthWrite: false` on the shader material prevents z-fighting between overlapping cards
- Use `mesh.renderOrder` based on camera distance for correct depth sorting
