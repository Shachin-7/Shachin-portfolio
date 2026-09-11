"use client";

/**
 * GalleryHeadingFrame — self-contained wrapper for the GalleryHeading effect
 * (rising-diagonal / matte variant).
 *
 * Canonical source: /landing-pages/gallery-heading.html
 * SHA-256: 8e42d2d5b4971bfc4d3c485112c3c51909e20a61b8842bc0dcd8db3ffe2d253a
 * Runtime: Canvas 2D. Twelve flat 4:3 plates in slow orbit (matte-rise / sprung).
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ── Variant configuration (rising-diagonal / matte) ──────────────── */
const PALETTE = [
  "#e9e5dd", "#20232a", "#c25a43", "#2f5b4e", "#d6cfc2", "#3a4763",
  "#dda45c", "#14161a", "#a7b3a4", "#f3f1ec", "#5a6670", "#8c4b3f",
];
const HEADLINE   = ["TWELVE WORKS", "IN SLOW ORBIT"];
const HEAD_W     = [1846, 2000];
const INK_DARK   = ["#8d949c", "#ffffff", "#20232a"];
const INK_LIGHT  = ["#6b7280", "#111827", "#e9e5dd"];
const FONT       = '"Helvetica Neue",Helvetica,"Inter",Arial,system-ui,sans-serif';

const GALLERY_HEADING_GRAIN_BLOCK =
  `    /* film grain */\n    x.save();\n    x.globalCompositeOperation = 'overlay';\n    x.globalAlpha = 0.15;\n    var p = x.createPattern(grainTile,'repeat');\n    x.fillStyle = p; x.fillRect(0,0,TS,TS);\n    x.restore();\n    front.push(c);`;

const GALLERY_HEADING_HEAD_BLOCK =
  `function buildHead(){\n  headLayer = mkc(Math.max(1,W), Math.max(1,H));\n  var x = headLayer.getContext('2d');\n  for (var i=0;i<HEAD.length;i++){\n    var h = HEAD[i];\n    fitText(x, h.s, SANS, '700', CAP*K, d2sx(1481), d2sy(h.top), h.w*K, h.fill);\n  }\n}`;
const GALLERY_HEADING_HEAD_REPLACE =
  `function buildHead(){\n  headLayer = mkc(Math.max(1,W), Math.max(1,H));\n  var x = headLayer.getContext('2d');\n  for (var i=0;i<HEAD.length;i++){\n    var h = HEAD[i];\n    fitText(x, h.s, SANS, HEAD_WEIGHT, HEAD_CAP*HEAD_SIZE*K,\n            d2sx(1481), d2sy(HEAD_MID) - (HEAD.length-1-i*2)*(HEAD_CAP*HEAD_SIZE*K*0.6),\n            h.w*HEAD_SIZE*K, h.fill);\n  }\n}`;

const GALLERY_HEADING_LABEL_BLOCK =
  `function buildLabels(){\n  labelLayer = mkc(Math.max(1,W), Math.max(1,H));\n  var x = labelLayer.getContext('2d');\n  var cap = SMALL*K, dim = '#b0b0b0', pad = 88*K;\n  /* corner marks hug the viewport so the frame reads at any aspect */\n  x.save();\n  x.fillStyle = dim; x.textBaseline = 'alphabetic'; x.textAlign = 'left';\n  var f = '400 ' + (cap/0.717) + 'px ' + SANS;\n  x.font = f;\n  if (x.letterSpacing !== undefined) x.letterSpacing = (0.03*cap)+'px';\n  x.fillText('VOID BLUE   /   GRADIENT STRIPS   /   RED AURA', pad, pad + cap);\n  x.fillText('2026', pad, H - pad);\n  x.textAlign = 'right';\n  x.fillText('GRAINIENT.SUPPLY', W - pad, H - pad);\n  x.restore();\n\n  /* the two notes flanking the headline sit with the ring */\n  var pitch = 33*K;\n  var L = ['(50+) Gradients','Backgrounds','Added,'];\n  for (var i=0;i<L.length;i++)\n    fitText(x, L[i], SANS, '500', cap, d2sx(344), d2sy(1148) + i*pitch, 0, '#ffffff', 'left');\n  var Rt = ['Gradients &','AI-Generated','Backgrounds'];\n  for (var j=0;j<Rt.length;j++)\n    fitText(x, Rt[j], SANS, '500', cap, d2sx(2310), d2sy(932) + j*32.5*K, 0, '#ffffff', 'left');\n}\n\nfunction resize`;

const GALLERY_HEADING_CLOCK_BLOCK =
  `var t0 = performance.now(), tNow = 0, playing = true;\n\nfunction frame(now){\n  if (playing){\n    tNow = ((now - t0)/1000) % DUR;\n    render(tNow);\n  }\n  requestAnimationFrame(frame);\n}\n\nwindow.addEventListener('resize', function(){ resize(); render(tNow); });\nresize();\nrequestAnimationFrame(frame);\n\nwindow.__DUR = DUR;\nwindow.__seek = function(t){\n  tNow = ((t % DUR) + DUR) % DUR;\n  playing = false;\n  render(tNow);\n};\nwindow.__play = function(){ t0 = performance.now() - tNow*1000; playing = true; };\nwindow.__pause = function(){ playing = false; };\nwindow.__time = function(){ return tNow; };`;

const GALLERY_HEADING_CLOCK_REPLACE =
  `var tNow = 0, playing = true, hovering = false, rate = 0, vel = 0, settled = false, last = performance.now();\n\nfunction setHover(state){\n  if (hovering === state) return;\n  hovering = state; settled = false;\n  if (state && window.parent !== window){\n    try { window.parent.postMessage({ threeuiPointerOver: true }, '*'); } catch (e) {}\n  }\n}\nvar root = document.documentElement;\nroot.addEventListener('pointerenter', function(){ setHover(true); });\nroot.addEventListener('pointermove',  function(){ setHover(true); });\nroot.addEventListener('pointerdown',  function(){ setHover(true); });\nroot.addEventListener('pointerleave', function(){ setHover(false); });\nroot.addEventListener('pointercancel',function(){ setHover(false); });\nwindow.addEventListener('blur', function(){ setHover(false); });\n\nfunction frame(now){\n  var dt = Math.min(0.05, Math.max(0, (now - last)/1000));\n  last = now;\n  if (playing){\n    vel += (((hovering ? 1 : 0) - rate)*26 - vel*5.7)*dt;\n    rate += vel*dt;\n    if (Math.abs(rate) > 0.0004 || Math.abs(vel) > 0.0004){\n      tNow = ((tNow + dt*rate) % DUR + DUR) % DUR;\n      render(tNow); settled = false;\n    } else if (!settled){\n      rate = 0; vel = 0; render(tNow); settled = true;\n    }\n  }\n  requestAnimationFrame(frame);\n}\n\nwindow.addEventListener('message', function(ev){\n  var r = ev.data && ev.data.threeuiRuntime;\n  if (!r) return;\n  if (typeof r.hover === 'number') setHover(r.hover > 0);\n});\n\nwindow.addEventListener('resize', function(){ resize(); settled = false; render(tNow); });\nresize();\nrender(tNow);\nrequestAnimationFrame(frame);\n\nwindow.__DUR = DUR;\nwindow.__seek = function(t){ tNow = ((t%DUR)+DUR)%DUR; playing=false; render(tNow); };\nwindow.__play = function(){ last=performance.now(); playing=true; settled=false; };`;

/* ── Transform source for the matte/rising-diagonal variant ────────── */
function applyVariant(source: string, mode: "dark" | "light"): string {
  const bg  = mode === "light" ? "#f4f7fb" : "#000000";
  const ink = mode === "light" ? INK_LIGHT : INK_DARK;

  return source
    .replace("<title>New Grainient Collection Added — motion</title>", "<title>Twelve Works in Slow Orbit — motion</title>")
    .replace("html,body{margin:0;height:100%;background:#000;overflow:hidden}", `html,body{margin:0;height:100%;background:${bg};overflow:hidden}`)
    .replace("axis: 25.5,", "axis: 25.5,")            // unchanged; already correct
    .replace("phase: 93", "phase: 93")                 // unchanged; already correct
    .replace(
      "  tile: 346,            /* tile side in ring units (R = a)               */",
      "  tile: 346,            /* tile width in ring units (R = a)              */\n"
      + "  aspect: 0.75,         /* tile height / width — a 4:3 landscape crop    */",
    )
    .replace(
      "  roundRectPath(ctx, TS, TS, TS*RING.radius);",
      "  roundRectPath(ctx, TS, TS*RING.aspect, TS*RING.aspect*RING.radius);",
    )
    .replace(
      "var CAP = 142;          /* headline cap height */\nvar SMALL = 22;         /* small-label cap height */",
      `var HEAD_CAP = 142;\nvar HEAD_MID = 1093;\nvar HEAD_SIZE = 1.15;\nvar HEAD_WEIGHT = '400';\nvar HEAD_TRACK = 0.1;\nvar PLATES = ${JSON.stringify(PALETTE)};\nvar FIELD = 'matte';\nvar EASE = 0.42;\nvar SPRING = 1, SPRING_K = 26, SPRING_D = 5.7;`,
    )
    .replace(
      `var SANS = '"Helvetica Neue",Helvetica,"Inter",Arial,system-ui,sans-serif';`,
      `var SANS = '${FONT}';`,
    )
    .replace("{ s:'NEW GRAINIENT',    top:930,  w:1370, fill:'#d0d0d0' }", `{ s:'${HEADLINE[0]}', top:930,  w:${HEAD_W[0]}, fill:'${ink[0]}' }`)
    .replace("{ s:'COLLECTION ADDED', top:1114, w:1775, fill:'#ffffff' }", `{ s:'${HEADLINE[1]}', top:1114, w:${HEAD_W[1]}, fill:'${ink[1]}' }`)
    .replace(GALLERY_HEADING_GRAIN_BLOCK, "    front.push(c);")
    .replace("y.fillStyle = 'rgba(6,8,18,0.75)';", "y.fillStyle = 'rgba(10,12,24,0.45)';")
    .replace(GALLERY_HEADING_HEAD_BLOCK, GALLERY_HEADING_HEAD_REPLACE)
    .replace(GALLERY_HEADING_LABEL_BLOCK, "function buildLabels(){\n  labelLayer = mkc(1,1);\n}\n\nfunction resize")
    .replace("var spin = (t/DUR)*Math.PI*2;", "var spin = (t/DUR)*Math.PI*2;")   // direction: 1 → unchanged
    .replace("ctx.fillStyle = '#000';\n  ctx.fillRect(0,0,W,H);", `ctx.fillStyle = '${bg}';\n  ctx.fillRect(0,0,W,H);`)
    .replace(GALLERY_HEADING_CLOCK_BLOCK, GALLERY_HEADING_CLOCK_REPLACE);
}

/* ── Sandbox wrapper ────────────────────────────────────────────────── */
function makeSrcDoc(source: string, mode: "dark" | "light"): string {
  const bg = mode === "light" ? "#f4f7fb" : "#000000";
  const transformed = applyVariant(source, mode);
  const focusStyle = `<style>
html,body{width:100%!important;height:100%!important;margin:0!important;padding:0!important;overflow:hidden!important;background:${bg}!important}
canvas{display:block;width:100%!important;height:100%!important;position:fixed!important;inset:0!important}
</style>`;
  return transformed.replace(/<\/head>/i, `${focusStyle}</head>`);
}

/* ── Component ──────────────────────────────────────────────────────── */
export interface GalleryHeadingFrameProps {
  mode?: "dark" | "light";
  className?: string;
  style?: CSSProperties;
}

export function GalleryHeadingFrame({
  mode = "dark",
  className,
  style,
}: GalleryHeadingFrameProps) {
  const frameRef  = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>("");

  /* fetch the canonical HTML from /public once */
  useEffect(() => {
    let alive = true;
    fetch("/landing-pages/gallery-heading.html")
      .then(r => r.text())
      .then(html => { if (alive) setSrcDoc(makeSrcDoc(html, mode)); })
      .catch(() => {/* noop */});
    return () => { alive = false; };
  }, [mode]);

  /* pointer-hover handshake */
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let inside = false;

    const leave = () => {
      if (!inside) return;
      inside = false;
      frame.contentWindow?.postMessage({ threeuiRuntime: { hover: 0 } }, "*");
    };
    const onMsg = (ev: MessageEvent) => {
      if (ev.source === frame.contentWindow && ev.data?.threeuiPointerOver) inside = true;
    };
    const onMove = (ev: PointerEvent) => {
      if (!inside) return;
      const r = frame.getBoundingClientRect();
      if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) leave();
    };

    window.addEventListener("message", onMsg);
    window.addEventListener("pointermove", onMove, true);
    frame.addEventListener("pointerleave", leave);
    document.addEventListener("mouseleave", leave);
    window.addEventListener("blur", leave);
    return () => {
      window.removeEventListener("message", onMsg);
      window.removeEventListener("pointermove", onMove, true);
      frame.removeEventListener("pointerleave", leave);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("blur", leave);
    };
  }, [srcDoc]);

  return (
    <iframe
      ref={frameRef}
      title="Twelve Works in Slow Orbit — canvas animation"
      srcDoc={srcDoc || undefined}
      sandbox="allow-scripts"
      loading="eager"
      className={className}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        border: 0,
        background: mode === "light" ? "#f4f7fb" : "#000",
        ...style,
      }}
    />
  );
}

export default GalleryHeadingFrame;
