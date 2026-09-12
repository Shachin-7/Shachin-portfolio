import * as THREE from "three";

export interface WarpFieldOptions {
  variant?: "streaks" | "letters" | "keycaps" | "hyperspace";
  speed: number;
  streakOpacity: number;
  tileOpacity: number;
  fov: number;
  hue: number;
  saturation: number;
  brightness: number;
}

export const WARP_FIELD_DEFAULTS: WarpFieldOptions = {
  variant: "hyperspace",
  speed: 15.0,
  streakOpacity: 0.60,
  tileOpacity: 0.90,
  fov: 75,
  hue: 0,
  saturation: 1.00,
  brightness: 1.00,
};

// 4-Color Palette: Emerald Green, Electric Cyan, Neon Blue, Vibrant Purple/Magenta
const PALETTE = [
  new THREE.Color(0x22c55e), // Emerald Green
  new THREE.Color(0x00f0ff), // Electric Cyan
  new THREE.Color(0x3b82f6), // Neon Blue
  new THREE.Color(0xa855f7), // Vibrant Purple
];

const PALETTE_HEX = ["#22c55e", "#00f0ff", "#3b82f6", "#a855f7"];

function createCapsuleTexture(colorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 384;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const w = 128;
    const h = 384;
    const r = 54;
    ctx.clearRect(0, 0, w, h);

    // Glowing capsule body with vertical linear dissipation
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0.0, colorHex);
    grad.addColorStop(0.35, colorHex);
    grad.addColorStop(0.75, `${colorHex}88`);
    grad.addColorStop(1.0, "rgba(0,0,0,0)");

    ctx.save();
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 28;

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(14, 14, w - 28, h - 28, r);
    ctx.fill();
    ctx.restore();

    // Inner bright specular core
    ctx.fillStyle = "rgba(255, 255, 255, 0.48)";
    ctx.beginPath();
    ctx.roundRect(26, 26, w - 52, (h - 52) * 0.7, r - 12);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

export function createWarpFieldRenderer(
  canvas: HTMLCanvasElement,
  getOptions: () => WarpFieldOptions
) {
  const options = getOptions();

  // 1. Scene & Deep Space Exponential Fog
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.0018);

  // 2. Camera with Authored 75 FOV
  const width = canvas.clientWidth || window.innerWidth || 800;
  const height = canvas.clientHeight || window.innerHeight || 600;
  const camera = new THREE.PerspectiveCamera(options.fov || 75, width / height, 1, 2000);
  camera.position.set(0, 0, 0);

  // 3. WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: false,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // 4. Subtle Radial Space Grid
  const gridHelper = new THREE.GridHelper(1600, 20, 0x003344, 0x001824);
  gridHelper.position.set(0, -180, -400);
  gridHelper.rotation.x = Math.PI * 0.04;
  scene.add(gridHelper);

  // 5. 400 Additive Colored Streaks (LineSegments)
  const STREAK_COUNT = 400;
  const streakPositions = new Float32Array(STREAK_COUNT * 6);
  const streakColors = new Float32Array(STREAK_COUNT * 6);

  const FAR_BOUND = -1200;
  const NEAR_BOUND = 200;
  const BOUND_SPAN = NEAR_BOUND - FAR_BOUND;

  const initStreak = (i: number, randomZ = true) => {
    const i6 = i * 6;
    const angle = Math.random() * Math.PI * 2;
    const radius = 18 + Math.random() * 420;
    const len = 20 + Math.random() * 45;
    const z = randomZ ? FAR_BOUND + Math.random() * BOUND_SPAN : FAR_BOUND - Math.random() * 80;

    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // Endpoint 1 (front)
    streakPositions[i6 + 0] = x;
    streakPositions[i6 + 1] = y;
    streakPositions[i6 + 2] = z;

    // Endpoint 2 (trailing back)
    streakPositions[i6 + 3] = x;
    streakPositions[i6 + 4] = y;
    streakPositions[i6 + 5] = z - len;

    // Color from 4-color palette
    const col = PALETTE[i % PALETTE.length];
    streakColors[i6 + 0] = col.r;
    streakColors[i6 + 1] = col.g;
    streakColors[i6 + 2] = col.b;
    streakColors[i6 + 3] = col.r;
    streakColors[i6 + 4] = col.g;
    streakColors[i6 + 5] = col.b;
  };

  for (let i = 0; i < STREAK_COUNT; i++) {
    initStreak(i, true);
  }

  const streakGeo = new THREE.BufferGeometry();
  streakGeo.setAttribute("position", new THREE.BufferAttribute(streakPositions, 3));
  streakGeo.setAttribute("color", new THREE.BufferAttribute(streakColors, 3));

  const streakMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: options.streakOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const streakMesh = new THREE.LineSegments(streakGeo, streakMat);
  scene.add(streakMesh);

  // 6. 40 Luminous Plane Tiles (Pills / Capsules)
  const TILE_COUNT = 40;
  const tileTextures = PALETTE_HEX.map((hex) => createCapsuleTexture(hex));
  const tileGeos: THREE.PlaneGeometry[] = [];
  const tileMats: THREE.MeshBasicMaterial[] = [];
  const tiles: THREE.Mesh[] = [];

  const initTile = (tile: THREE.Mesh, randomZ = true) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 65 + Math.random() * 340;
    const z = randomZ ? FAR_BOUND + Math.random() * BOUND_SPAN : FAR_BOUND - Math.random() * 120;

    tile.position.x = Math.cos(angle) * radius;
    tile.position.y = Math.sin(angle) * radius;
    tile.position.z = z;

    // Point radially outward from screen center
    tile.rotation.z = angle - Math.PI / 2;
  };

  for (let i = 0; i < TILE_COUNT; i++) {
    const colorIdx = i % tileTextures.length;
    const tileW = 28 + (i % 5) * 8;
    const tileH = tileW * 2.8;

    const geo = new THREE.PlaneGeometry(tileW, tileH);
    tileGeos.push(geo);

    const mat = new THREE.MeshBasicMaterial({
      map: tileTextures[colorIdx],
      transparent: true,
      opacity: options.tileOpacity,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    tileMats.push(mat);

    const mesh = new THREE.Mesh(geo, mat);
    initTile(mesh, true);
    scene.add(mesh);
    tiles.push(mesh);
  }

  // 7. Render & Advance Logic
  const render = () => {
    const currentOptions = getOptions();
    const speed = currentOptions.speed ?? 15.0;

    // Dynamically update opacities & FOV if options changed
    streakMat.opacity = currentOptions.streakOpacity ?? 0.60;
    const tileOp = currentOptions.tileOpacity ?? 0.90;
    for (let i = 0; i < tileMats.length; i++) {
      tileMats[i].opacity = tileOp;
    }

    if (camera.fov !== currentOptions.fov && currentOptions.fov) {
      camera.fov = currentOptions.fov;
      camera.updateProjectionMatrix();
    }

    // Advance line streaks
    const posAttr = streakGeo.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < STREAK_COUNT; i++) {
      const i6 = i * 6;
      posArray[i6 + 2] += speed;
      posArray[i6 + 5] += speed;

      if (posArray[i6 + 2] > NEAR_BOUND) {
        initStreak(i, false);
      }
    }
    posAttr.needsUpdate = true;

    // Advance tiles
    if (currentOptions.variant !== "streaks") {
      for (let i = 0; i < TILE_COUNT; i++) {
        const tile = tiles[i];
        tile.position.z += speed;

        if (tile.position.z > NEAR_BOUND) {
          initTile(tile, false);
        }
      }
    }

    renderer.render(scene, camera);
  };

  const resize = (newWidth: number, newHeight: number) => {
    if (!newWidth || !newHeight) return;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  };

  const dispose = () => {
    streakGeo.dispose();
    streakMat.dispose();

    tileGeos.forEach((g) => g.dispose());
    tileMats.forEach((m) => m.dispose());
    tileTextures.forEach((t) => t.dispose());

    gridHelper.geometry.dispose();
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach((m) => m.dispose());
    } else {
      gridHelper.material.dispose();
    }

    renderer.dispose();
  };

  return {
    resize,
    render,
    dispose,
  };
}
