"use client";

import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";

// Built-in assets stored locally for instant zero-latency rendering
const DEFAULT_ASSETS = {
  frontImg: "/assets/willow/front.png",
  backImg: "/assets/willow/back.png",
  bottomImg: "/assets/willow/bottom.png",
  capImg: "/assets/willow/cap.png",
  willowStl: "/assets/willow/willow.stl",
  breakSound: "/assets/willow/break.mp3",
};

// Minimal STL parser (binary + ASCII)
function parseSTL(buffer: ArrayBuffer): THREE.BufferGeometry {
  const isBinary = (() => {
    if (buffer.byteLength < 84) return false;
    const view = new DataView(buffer);
    const nFaces = view.getUint32(80, true);
    if (84 + nFaces * 50 === buffer.byteLength) return true;
    const head = new TextDecoder()
      .decode(new Uint8Array(buffer, 0, Math.min(5, buffer.byteLength)))
      .toLowerCase();
    return head !== "solid";
  })();

  const geo = new THREE.BufferGeometry();
  if (isBinary) {
    const view = new DataView(buffer);
    const nFaces = view.getUint32(80, true);
    const positions = new Float32Array(nFaces * 9);
    const normals = new Float32Array(nFaces * 9);
    for (let f = 0; f < nFaces; f++) {
      const off = 84 + f * 50;
      const nx = view.getFloat32(off, true);
      const ny = view.getFloat32(off + 4, true);
      const nz = view.getFloat32(off + 8, true);
      for (let v = 0; v < 3; v++) {
        const vo = off + 12 + v * 12;
        const i = f * 9 + v * 3;
        positions[i] = view.getFloat32(vo, true);
        positions[i + 1] = view.getFloat32(vo + 4, true);
        positions[i + 2] = view.getFloat32(vo + 8, true);
        normals[i] = nx;
        normals[i + 1] = ny;
        normals[i + 2] = nz;
      }
    }
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
    return geo;
  }

  const text = new TextDecoder().decode(buffer);
  const positions: number[] = [];
  const vertexRe = /vertex\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/g;
  let m: RegExpExecArray | null;
  while ((m = vertexRe.exec(text))) {
    positions.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }
  geo.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3)
  );
  geo.computeVertexNormals();
  return geo;
}

async function loadSTL(url: string): Promise<THREE.BufferGeometry> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  return parseSTL(buf);
}

function applyFit(tex: THREE.Texture, geoAspect: number, fit: string) {
  const img = tex.image as { width?: number; height?: number } | undefined;
  if (!img || !img.width || !img.height) return;
  const imgAspect = img.width / img.height;
  tex.matrixAutoUpdate = false;
  if (fit === "cover") {
    if (imgAspect > geoAspect) {
      tex.repeat.set(geoAspect / imgAspect, 1);
      tex.offset.set((1 - geoAspect / imgAspect) / 2, 0);
    } else {
      tex.repeat.set(1, imgAspect / geoAspect);
      tex.offset.set(0, (1 - imgAspect / geoAspect) / 2);
    }
  } else if (fit === "contain") {
    if (imgAspect > geoAspect) {
      tex.repeat.set(1, geoAspect / imgAspect);
      tex.offset.set(0, (1 - geoAspect / imgAspect) / 2);
    } else {
      tex.repeat.set(imgAspect / geoAspect, 1);
      tex.offset.set((1 - imgAspect / geoAspect) / 2, 0);
    }
  } else {
    tex.repeat.set(1, 1);
    tex.offset.set(0, 0);
  }
  tex.updateMatrix();
}

const h = Math.sqrt(3) / 2;

interface WillowSceneProps {
  state: "initial" | "opened" | "broken" | "used";
  boxFit?: string;
  boxScale?: number;
  willowColor?: string;
  stlSrc?: string;
  frontSrc?: string;
  backSrc?: string;
  bottomSrc?: string;
  capSrc?: string;
  willowImgSrc?: string;
  willowBreakImgSrc?: string;
  onBoxClick?: () => void;
  onBoxDoubleClick?: () => void;
  onWillowClick?: () => void;
  onWebGlError?: () => void;
}

function WillowScene({
  state,
  boxFit = "contain",
  boxScale = 1,
  willowColor = "#5c4033",
  stlSrc,
  frontSrc,
  backSrc,
  bottomSrc,
  capSrc,
  willowImgSrc,
  willowBreakImgSrc,
  onBoxClick,
  onBoxDoubleClick,
  onWillowClick,
  onWebGlError,
}: WillowSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  const handlersRef = useRef<{
    onBoxClick?: () => void;
    onBoxDoubleClick?: () => void;
    onWillowClick?: () => void;
  }>({});

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  handlersRef.current = { onBoxClick, onBoxDoubleClick, onWillowClick };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let dead = false;
    const disposables: { dispose?: () => void }[] = [];

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.warn("WebGL not available, falling back to 2D:", e);
      onWebGlError?.();
      return;
    }
    renderer.localClippingEnabled = true;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(2.1, 2.25, 3.9);

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.45);
    dirLight.position.set(10, 10, 5);
    scene.add(dirLight);

    const texLoader = new THREE.TextureLoader();

    // ---- Gift box: 3 rectangular faces + 2 triangular caps
    const boxGroup = new THREE.Group();
    scene.add(boxGroup);

    const addFace = (
      geo: THREE.BufferGeometry,
      pos: [number, number, number],
      rot: [number, number, number],
      src?: string,
      geoAspect: number = 1
    ) => {
      const mat = new THREE.MeshStandardMaterial({
        color: 0xcc0000,
        roughness: 0.55,
        side: THREE.DoubleSide,
        transparent: true,
        alphaTest: 0.05,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.set(rot[0], rot[1], rot[2]);
      boxGroup.add(mesh);
      disposables.push(geo, mat);

      if (src) {
        texLoader.load(src, (tex) => {
          if (dead) return;
          tex.colorSpace = THREE.SRGBColorSpace;
          applyFit(tex, geoAspect, boxFit);
          mat.map = tex;
          mat.color.set(0xffffff);
          mat.needsUpdate = true;
          disposables.push(tex);
        });
      }
    };

    addFace(new THREE.PlaneGeometry(4, 1), [0, h / 6, 0.25], [-Math.PI / 6, 0, 0], frontSrc, 4);
    addFace(new THREE.PlaneGeometry(4, 1), [0, h / 6, -0.25], [Math.PI / 6, Math.PI, 0], backSrc, 4);
    addFace(new THREE.PlaneGeometry(4, 1), [0, -h / 3, 0], [Math.PI / 2, 0, 0], bottomSrc, 4);
    addFace(new THREE.CircleGeometry(1 / Math.sqrt(3), 3, Math.PI / 2), [-2, 0, 0], [0, -Math.PI / 2, 0], capSrc, 1);
    addFace(new THREE.CircleGeometry(1 / Math.sqrt(3), 3, Math.PI / 2), [2, 0, 0], [0, Math.PI / 2, 0], capSrc, 1);

    // ---- Willow stick: splits into two when broken
    const willowGroup = new THREE.Group();
    willowGroup.rotation.z = Math.PI / 2;
    scene.add(willowGroup);

    const baseMatProps = {
      color: new THREE.Color(willowColor || "#5c4033"),
      transparent: true,
      alphaTest: 0.05,
      side: THREE.DoubleSide,
    };

    const intactMat = new THREE.MeshStandardMaterial(baseMatProps);
    const topMat = new THREE.MeshStandardMaterial(baseMatProps);
    const botMat = new THREE.MeshStandardMaterial(baseMatProps);

    const localClipTop = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const localClipBottom = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const clipTop = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
    const clipBottom = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    const intactMesh = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(
      new THREE.CylinderGeometry(0.15, 0.15, 3.5, 16),
      intactMat
    );
    const topHalf = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(
      new THREE.CylinderGeometry(0.15, 0.15, 1.75, 16),
      topMat
    );
    const bottomHalf = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(
      new THREE.CylinderGeometry(0.15, 0.15, 1.75, 16),
      botMat
    );

    topHalf.position.y = 0.875;
    bottomHalf.position.y = -0.875;
    willowGroup.add(intactMesh, topHalf, bottomHalf);
    disposables.push(intactMat, topMat, botMat, intactMesh.geometry, topHalf.geometry, bottomHalf.geometry);

    let usingStl = false;
    if (stlSrc) {
      loadSTL(stlSrc)
        .then((geometry) => {
          if (dead) return;
          geometry.center();
          geometry.computeBoundingBox();
          const size = new THREE.Vector3();
          geometry.boundingBox?.getSize(size);
          if (size.x > size.y && size.x > size.z) {
            geometry.rotateZ(Math.PI / 2);
          } else if (size.z > size.x && size.z > size.y) {
            geometry.rotateX(Math.PI / 2);
          }
          geometry.computeBoundingBox();
          geometry.boundingBox?.getSize(size);
          const s = 3.5 / (size.y || 1);
          geometry.scale(s, s, s);
          usingStl = true;
          intactMesh.geometry = geometry;
          topHalf.geometry = geometry;
          bottomHalf.geometry = geometry;
          topHalf.position.set(0, 0, 0);
          bottomHalf.position.set(0, 0, 0);
          intactMat.map = null;
          intactMat.color.set(willowColor || "#5c4033");
          topMat.map = null;
          topMat.color.set(willowColor || "#5c4033");
          botMat.map = null;
          botMat.color.set(willowColor || "#5c4033");
          topMat.clippingPlanes = [clipTop];
          botMat.clippingPlanes = [clipBottom];
          intactMat.needsUpdate = true;
          topMat.needsUpdate = true;
          botMat.needsUpdate = true;
          disposables.push(geometry);
        })
        .catch(() => {});
    }

    if (willowImgSrc) {
      texLoader.load(willowImgSrc, (tex) => {
        if (dead || usingStl) return;
        tex.colorSpace = THREE.SRGBColorSpace;
        intactMat.map = tex;
        intactMat.color.set(0xffffff);
        intactMat.needsUpdate = true;
        disposables.push(tex);
      });
    }

    const breakTexSrc = willowBreakImgSrc || willowImgSrc;
    if (breakTexSrc) {
      texLoader.load(breakTexSrc, (texTop) => {
        if (dead || usingStl) return;
        texTop.colorSpace = THREE.SRGBColorSpace;
        texTop.matrixAutoUpdate = false;
        texTop.repeat.set(1, 0.5);
        texTop.offset.set(0, 0.5);
        texTop.updateMatrix();
        topMat.map = texTop;
        topMat.color.set(0xffffff);
        topMat.needsUpdate = true;
        const texBottom = texTop.clone();
        texBottom.offset.set(0, 0);
        texBottom.updateMatrix();
        botMat.map = texBottom;
        botMat.color.set(0xffffff);
        botMat.needsUpdate = true;
        disposables.push(texTop, texBottom);
      });
    }

    // ---- Pointer interaction: raycast clicks, hover cursor, camera parallax
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pointer = { x: 0, y: 0 };
    let downPos: { x: number; y: number } | null = null;

    const setNdc = (ev: MouseEvent | PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((ev.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      ndc.y = -(((ev.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
    };

    const pick = (ev: MouseEvent | PointerEvent, group: THREE.Group) => {
      setNdc(ev);
      raycaster.setFromCamera(ndc, camera);
      return raycaster.intersectObject(group, true).length > 0;
    };

    const onPointerMove = (ev: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
      pointer.y = -(((ev.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
      const st = stateRef.current;
      const active = st === "opened" || st === "broken" ? willowGroup : boxGroup;
      container.style.cursor = pick(ev, active) ? "pointer" : "auto";
    };

    const onPointerDown = (ev: PointerEvent) => {
      downPos = { x: ev.clientX, y: ev.clientY };
    };

    const onClick = (ev: MouseEvent) => {
      if (downPos && Math.hypot(ev.clientX - downPos.x, ev.clientY - downPos.y) > 2) return;
      const st = stateRef.current;
      if (st === "initial" && pick(ev, boxGroup)) {
        handlersRef.current.onBoxClick?.();
      } else if (st === "opened" && pick(ev, willowGroup)) {
        handlersRef.current.onWillowClick?.();
      }
    };

    const onDblClick = (ev: MouseEvent) => {
      if (stateRef.current === "used" && pick(ev, boxGroup)) {
        handlersRef.current.onBoxDoubleClick?.();
      }
    };

    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("click", onClick);
    renderer.domElement.addEventListener("dblclick", onDblClick);

    // ---- Sizing
    let responsiveScale = 1;
    const resize = () => {
      const w = container.clientWidth || 1;
      const ht = container.clientHeight || 1;
      renderer.setSize(w, ht, false);
      camera.aspect = w / ht;
      camera.updateProjectionMatrix();
      const dist = camera.position.length() || 5;
      const viewH = 2 * Math.tan((45 * Math.PI) / 360) * dist;
      const viewW = viewH * camera.aspect;
      responsiveScale = Math.min(1, viewW / 4.5);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ---- Render loop
    let raf = 0;
    const animate = () => {
      if (dead) return;
      raf = requestAnimationFrame(animate);

      const st = stateRef.current;
      const finalScale = (boxScale ?? 1) * responsiveScale;
      boxGroup.scale.setScalar(finalScale);
      willowGroup.scale.setScalar(finalScale);

      boxGroup.visible = st === "initial" || st === "used";
      willowGroup.visible = st === "opened" || st === "broken";

      const broken = st === "broken";
      intactMesh.visible = !broken;
      topHalf.visible = broken;
      bottomHalf.visible = broken;

      if (broken) {
        const startYTop = usingStl ? 0 : 0.875;
        const startYBottom = usingStl ? 0 : -0.875;
        topHalf.position.y = THREE.MathUtils.lerp(topHalf.position.y, startYTop + 1.5, 0.05);
        topHalf.position.x = THREE.MathUtils.lerp(topHalf.position.x, 0.8, 0.05);
        topHalf.rotation.z = THREE.MathUtils.lerp(topHalf.rotation.z, 0.6, 0.05);

        bottomHalf.position.y = THREE.MathUtils.lerp(bottomHalf.position.y, startYBottom - 1.5, 0.05);
        bottomHalf.position.x = THREE.MathUtils.lerp(bottomHalf.position.x, -0.8, 0.05);
        bottomHalf.rotation.z = THREE.MathUtils.lerp(bottomHalf.rotation.z, -0.6, 0.05);

        if (usingStl) {
          topHalf.updateMatrixWorld(true);
          bottomHalf.updateMatrixWorld(true);
          clipTop.copy(localClipTop).applyMatrix4(topHalf.matrixWorld);
          clipBottom.copy(localClipBottom).applyMatrix4(bottomHalf.matrixWorld);
        }
      }

      // Camera parallax
      const radius = 5;
      const baseTheta = 0.5;
      const basePhi = 1.1;
      const theta = baseTheta + pointer.x * Math.PI * 0.7;
      let phi = basePhi - pointer.y * Math.PI * 0.3;
      phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi));

      const tx = radius * Math.sin(phi) * Math.sin(theta);
      const ty = radius * Math.cos(phi);
      const tz = radius * Math.sin(phi) * Math.cos(theta);

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, tx, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, ty, 0.05);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, tz, 0.05);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("click", onClick);
      renderer.domElement.removeEventListener("dblclick", onDblClick);
      container.style.cursor = "auto";
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
      disposables.forEach((d) => d.dispose && d.dispose());
      renderer.dispose();
    };
  }, [boxFit, boxScale, willowColor, stlSrc, frontSrc, backSrc, bottomSrc, capSrc, willowImgSrc, willowBreakImgSrc]);

  return <div ref={containerRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }} />;
}

export interface OneWishWillowProps {
  onWillowBreak?: () => void;
  boxScale?: number;
  willowColor?: string;
  className?: string;
  onResetReady?: (resetFn: () => void) => void;
}

export default function OneWishWillow({
  onWillowBreak,
  boxScale = 1.1,
  willowColor = "#5c4033",
  className = "",
  onResetReady,
}: OneWishWillowProps) {
  const [state, setState] = useState<"initial" | "opened" | "broken" | "used">("initial");
  const [showUsedText, setShowUsedText] = useState(false);
  const [webGlFailed, setWebGlFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const frontSrc = DEFAULT_ASSETS.frontImg;
  const backSrc = DEFAULT_ASSETS.backImg;
  const bottomSrc = DEFAULT_ASSETS.bottomImg;
  const capSrc = DEFAULT_ASSETS.capImg;
  const stlSrc = DEFAULT_ASSETS.willowStl;
  const soundSrc = DEFAULT_ASSETS.breakSound;

  const resetWillow = () => {
    setState("initial");
    setShowUsedText(false);
  };

  useEffect(() => {
    if (onResetReady) {
      onResetReady(resetWillow);
    }
  }, [onResetReady]);

  const handleBoxClick = () => {
    if (state === "initial") setState("opened");
  };

  const handleBoxDoubleClick = () => {
    if (state === "used") setShowUsedText(true);
  };

  const handleWillowClick = () => {
    if (state !== "opened") return;
    setState("broken");
    if (audioRef.current && soundSrc) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => console.log("Audio play prevented:", err));
    }

    // Trigger broken callback to pop up the email contact form
    if (onWillowBreak) {
      setTimeout(() => {
        onWillowBreak();
      }, 700);
    }

    setTimeout(() => {
      setState("used");
      setShowUsedText(false);
    }, 2500);
  };

  const showClickToOpen = state === "initial";
  const showMakeWish = state === "opened";
  const showBroken = state === "broken";
  const showOneWish = state === "used" && showUsedText;

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{ minHeight: "420px" }}
    >
      {soundSrc && <audio ref={audioRef} src={soundSrc} preload="auto" />}

      {webGlFailed ? (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 cursor-pointer select-none z-0"
          onClick={() => {
            if (state === "initial") handleBoxClick();
            else if (state === "opened") handleWillowClick();
          }}
        >
          {state === "initial" || state === "used" ? (
            <div className="relative group transition-transform duration-500 hover:scale-105">
              <img
                src={frontSrc}
                alt="One Wish Willow Gift Box"
                className="max-w-md w-full object-contain drop-shadow-2xl"
                style={{ transform: "perspective(600px) rotateX(10deg)" }}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 group">
              <div
                className={`relative w-80 h-10 bg-amber-900/90 rounded-full flex items-center justify-center shadow-2xl border border-amber-600/40 transition-all duration-300 ${
                  state === "broken" ? "scale-90 opacity-40" : "hover:scale-105"
                }`}
              >
                <span className="text-xs uppercase font-mono tracking-widest text-amber-200">
                  {state === "broken" ? "— BROKEN —" : "WILLOW STICK"}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <WillowScene
          state={state}
          boxFit="contain"
          boxScale={boxScale}
          willowColor={willowColor}
          stlSrc={stlSrc}
          frontSrc={frontSrc}
          backSrc={backSrc}
          bottomSrc={bottomSrc}
          capSrc={capSrc}
          onBoxClick={handleBoxClick}
          onBoxDoubleClick={handleBoxDoubleClick}
          onWillowClick={handleWillowClick}
          onWebGlError={() => setWebGlFailed(true)}
        />
      )}

      {/* Dynamic Animated Status / Instruction Badges */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-6 z-10">
        <div className="transition-all duration-400">
          {showClickToOpen && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-white/15 text-white/90 text-sm font-medium tracking-wide shadow-xl backdrop-blur-md animate-bounce">
              <span>🎁 Click the box to open</span>
            </div>
          )}

          {showMakeWish && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-sm font-medium tracking-wide shadow-xl backdrop-blur-md animate-pulse">
              <span>🎋 Make a wish and click the willow stick to break it</span>
            </div>
          )}

          {showBroken && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-semibold tracking-wide shadow-xl backdrop-blur-md">
              <span>⚡ Snap! Wish Granted — Opening email...</span>
            </div>
          )}

          {showOneWish && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/70 border border-white/15 text-white/80 text-sm font-medium shadow-xl backdrop-blur-md">
              <span>You only get one wish ;)</span>
            </div>
          )}
        </div>

        {/* State Indicators at the bottom */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {state === "used" && (
            <button
              type="button"
              onClick={resetWillow}
              className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium transition-all backdrop-blur-md shadow-lg"
            >
              🔄 Make Another Wish (Reset Box)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
