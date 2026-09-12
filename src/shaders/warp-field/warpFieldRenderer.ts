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
  satellites?: boolean;
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
  satellites: true,
};

// 4-Color Palette: Emerald Green, Electric Cyan, Neon Blue, Vibrant Purple
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

/**
 * Procedural space-grade solar panel texture with silicon wafer grid
 * and glowing neon power conduits in the satellite's assigned color.
 */
function createSolarPanelTexture(colorHex: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    // 1. Photovoltaic silicon wafer base
    ctx.fillStyle = "#060e1a";
    ctx.fillRect(0, 0, 256, 512);

    const cols = 3;
    const rows = 6;
    const cellW = 256 / cols;
    const cellH = 512 / rows;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * cellW + 3;
        const y = r * cellH + 3;
        const w = cellW - 6;
        const h = cellH - 6;

        // Dark silicon with subtle gradient
        const cellGrad = ctx.createLinearGradient(x, y, x + w, y + h);
        cellGrad.addColorStop(0, "#0e203c");
        cellGrad.addColorStop(1, "#071222");
        ctx.fillStyle = cellGrad;
        ctx.fillRect(x, y, w, h);

        // Silicon wafer borders
        ctx.strokeStyle = "#1a365d";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, w, h);

        // Micro finger gridlines
        ctx.strokeStyle = "rgba(45, 95, 170, 0.5)";
        ctx.beginPath();
        for (let i = 1; i <= 4; i++) {
          ctx.moveTo(x, y + (h / 5) * i);
          ctx.lineTo(x + w, y + (h / 5) * i);
        }
        ctx.stroke();
      }
    }

    // 2. Glowing neon busbar power conduits
    ctx.save();
    ctx.shadowColor = colorHex;
    ctx.shadowBlur = 14;
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 3.5;

    for (let c = 0; c < cols; c++) {
      const bx = c * cellW + cellW / 2;
      ctx.beginPath();
      ctx.moveTo(bx, 6);
      ctx.lineTo(bx, 506);
      ctx.stroke();
    }

    // Outer border glowing collector frame
    ctx.strokeRect(4, 4, 248, 504);
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return tex;
}

interface SatelliteInstance {
  group: THREE.Group;
  initialZ: number;
  orbitalRadius: number;
  orbitalAngle: number;
  rotSpeed: { x: number; y: number; z: number };
  plumes: THREE.Mesh[];
  baseColor: THREE.Color;
}

export function createWarpFieldRenderer(
  canvas: HTMLCanvasElement,
  getOptions: () => WarpFieldOptions
) {
  const options = getOptions();

  // 1. Scene & Deep Space Fog
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.0015);

  // 2. Camera with Authored 75 FOV
  const width = canvas.clientWidth || window.innerWidth || 800;
  const height = canvas.clientHeight || window.innerHeight || 600;
  const camera = new THREE.PerspectiveCamera(options.fov || 75, width / height, 1, 2400);
  camera.position.set(0, 0, 0);

  // 3. WebGL Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: true,
    powerPreference: "high-performance",
    stencil: false,
    depth: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // 4. Directional Sunlight & Cosmic Ambient Lighting for 3D Satellites
  const sunLight = new THREE.DirectionalLight(0xffffff, 3.2);
  sunLight.position.set(180, 280, 200);
  scene.add(sunLight);

  const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
  fillLight.position.set(-180, -140, -140);
  scene.add(fillLight);

  const ambientLight = new THREE.AmbientLight(0x1e293b, 1.8);
  scene.add(ambientLight);

  // 5. Subtle Radial Space Grid
  const gridHelper = new THREE.GridHelper(1600, 20, 0x003344, 0x001824);
  gridHelper.position.set(0, -180, -400);
  gridHelper.rotation.x = Math.PI * 0.04;
  scene.add(gridHelper);

  // 6. 400 Additive Colored Streaks (LineSegments)
  const STREAK_COUNT = 400;
  const streakPositions = new Float32Array(STREAK_COUNT * 6);
  const streakColors = new Float32Array(STREAK_COUNT * 6);

  const FAR_BOUND = -1200;
  const NEAR_BOUND = 220;
  const BOUND_SPAN = NEAR_BOUND - FAR_BOUND;

  const initStreak = (i: number, randomZ = true) => {
    const i6 = i * 6;
    const angle = Math.random() * Math.PI * 2;
    const radius = 18 + Math.random() * 420;
    const len = 22 + Math.random() * 50;
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

  // 7. 40 Luminous Plane Tiles (Pills / Capsules)
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

  // 8. 3D Procedural Satellite Models Moving Along with the 4 Colors
  const solarTextures = PALETTE_HEX.map((hex) => createSolarPanelTexture(hex));

  // Generously scaled shared geometries for crisp, bold 3D space satellites
  const satGeos = {
    boxBus: new THREE.BoxGeometry(7.2, 7.2, 13.5),
    hexBus: new THREE.CylinderGeometry(4.8, 4.8, 14.0, 6),
    goldFoil: new THREE.BoxGeometry(7.35, 5.2, 8.2),
    solarPanel: new THREE.BoxGeometry(11.5, 0.4, 6.2),
    panelTruss: new THREE.CylinderGeometry(0.42, 0.42, 3.8, 6),
    dish: new THREE.SphereGeometry(3.8, 20, 10, 0, Math.PI * 2, 0, Math.PI * 0.46),
    dishArm: new THREE.CylinderGeometry(0.3, 0.3, 3.4, 6),
    dishHorn: new THREE.CylinderGeometry(0.12, 0.12, 1.8, 6),
    boom: new THREE.CylinderGeometry(0.18, 0.18, 15.0, 6),
    sensorBall: new THREE.SphereGeometry(0.65, 8, 8),
    barrel: new THREE.CylinderGeometry(2.4, 3.0, 4.8, 16),
    lensRing: new THREE.TorusGeometry(2.7, 0.18, 8, 20),
    nozzle: new THREE.CylinderGeometry(1.1, 1.9, 2.8, 12),
    plume: new THREE.ConeGeometry(2.4, 22.0, 14, 1, true),
    beacon: new THREE.SphereGeometry(0.36, 6, 6),
  };

  // Shared reusable base materials
  const satMaterials = {
    titaniumBus: new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.90,
      roughness: 0.22,
    }),
    goldFoil: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.96,
      roughness: 0.30,
    }),
    dishReflector: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.94,
      roughness: 0.14,
      side: THREE.DoubleSide,
    }),
    darkHardware: new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.32,
    }),
  };

  const satelliteInstances: SatelliteInstance[] = [];
  const satTrackedMaterials: THREE.Material[] = [];

  // Helper to build a single 3D Satellite Group
  const buildSatellite = (
    color: THREE.Color,
    colorHex: string,
    variant: number,
    colorIdx: number
  ): SatelliteInstance => {
    const group = new THREE.Group();
    const plumes: THREE.Mesh[] = [];

    // Color-specific emissive materials
    const solarMat = new THREE.MeshStandardMaterial({
      map: solarTextures[colorIdx],
      roughness: 0.20,
      metalness: 0.85,
      emissive: color,
      emissiveIntensity: 1.15,
    });
    satTrackedMaterials.push(solarMat);

    const accentMat = new THREE.MeshBasicMaterial({ color });
    satTrackedMaterials.push(accentMat);

    // Glowing ion thruster plasma plume
    const plumeMat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.82,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    satTrackedMaterials.push(plumeMat);

    // Local point light so satellite casts a vibrant neon aura around itself
    const localLight = new THREE.PointLight(color, 2.5, 45);
    localLight.position.set(0, 0, -4);
    group.add(localLight);

    if (variant === 0) {
      // ─── VARIANT 0: Deep Space Comms Satellite ─────────────────────────────
      // Main Chassis Bus
      const busMesh = new THREE.Mesh(satGeos.boxBus, satMaterials.titaniumBus);
      group.add(busMesh);

      // Gold Thermal Insulation Blanket around central core
      const foilMesh = new THREE.Mesh(satGeos.goldFoil, satMaterials.goldFoil);
      foilMesh.position.set(0, 0, 0.6);
      group.add(foilMesh);

      // Left Solar Array (2 articulated segments)
      const leftTruss = new THREE.Mesh(satGeos.panelTruss, satMaterials.darkHardware);
      leftTruss.rotation.z = Math.PI / 2;
      leftTruss.position.set(-5.5, 0, 0);
      group.add(leftTruss);

      const leftPanel1 = new THREE.Mesh(satGeos.solarPanel, solarMat);
      leftPanel1.position.set(-11.5, 0, 0);
      group.add(leftPanel1);

      const leftPanel2 = new THREE.Mesh(satGeos.solarPanel, solarMat);
      leftPanel2.position.set(-23.0, 0, 0);
      group.add(leftPanel2);

      // Right Solar Array (2 articulated segments)
      const rightTruss = new THREE.Mesh(satGeos.panelTruss, satMaterials.darkHardware);
      rightTruss.rotation.z = -Math.PI / 2;
      rightTruss.position.set(5.5, 0, 0);
      group.add(rightTruss);

      const rightPanel1 = new THREE.Mesh(satGeos.solarPanel, solarMat);
      rightPanel1.position.set(11.5, 0, 0);
      group.add(rightPanel1);

      const rightPanel2 = new THREE.Mesh(satGeos.solarPanel, solarMat);
      rightPanel2.position.set(23.0, 0, 0);
      group.add(rightPanel2);

      // High-Gain Parabolic Communications Dish
      const dishArm = new THREE.Mesh(satGeos.dishArm, satMaterials.darkHardware);
      dishArm.position.set(0, 4.8, 2.4);
      dishArm.rotation.x = -Math.PI * 0.22;
      group.add(dishArm);

      const dish = new THREE.Mesh(satGeos.dish, satMaterials.dishReflector);
      dish.position.set(0, 6.8, 3.8);
      dish.rotation.x = -Math.PI * 0.35;
      group.add(dish);

      const horn = new THREE.Mesh(satGeos.dishHorn, accentMat);
      horn.position.set(0, 7.8, 5.0);
      horn.rotation.x = -Math.PI * 0.35;
      group.add(horn);

      // Forward Magnetometer Sensor Boom
      const boom = new THREE.Mesh(satGeos.boom, satMaterials.darkHardware);
      boom.position.set(0, -2.6, 12.5);
      boom.rotation.x = Math.PI / 2;
      group.add(boom);

      const sensorBall = new THREE.Mesh(satGeos.sensorBall, accentMat);
      sensorBall.position.set(0, -2.6, 20.0);
      group.add(sensorBall);

      // Rear Ion Engine Nozzle & Pulsing Plasma Exhaust Plume
      const nozzle = new THREE.Mesh(satGeos.nozzle, satMaterials.darkHardware);
      nozzle.position.set(0, 0, -7.8);
      nozzle.rotation.x = -Math.PI / 2;
      group.add(nozzle);

      const plume = new THREE.Mesh(satGeos.plume, plumeMat);
      plume.position.set(0, 0, -18.5);
      plume.rotation.x = -Math.PI / 2;
      group.add(plume);
      plumes.push(plume);

      // Status Beacon LEDs
      const beacon1 = new THREE.Mesh(satGeos.beacon, accentMat);
      beacon1.position.set(3.6, 3.6, 6.6);
      group.add(beacon1);

      const beacon2 = new THREE.Mesh(satGeos.beacon, accentMat);
      beacon2.position.set(-3.6, 3.6, 6.6);
      group.add(beacon2);
    } else {
      // ─── VARIANT 1: OrbitXOS Radar / Observation Satellite ─────────────────
      // Hexagonal Prism Bus oriented along Z
      const hexBus = new THREE.Mesh(satGeos.hexBus, satMaterials.titaniumBus);
      hexBus.rotation.x = Math.PI / 2;
      group.add(hexBus);

      // Optical Telescope / Radar Aperture Barrel
      const barrel = new THREE.Mesh(satGeos.barrel, satMaterials.darkHardware);
      barrel.position.set(0, 0, 8.8);
      barrel.rotation.x = Math.PI / 2;
      group.add(barrel);

      const lensRing = new THREE.Mesh(satGeos.lensRing, accentMat);
      lensRing.position.set(0, 0, 11.2);
      group.add(lensRing);

      // Dual Angled Solar Arrays
      const leftTruss = new THREE.Mesh(satGeos.panelTruss, satMaterials.darkHardware);
      leftTruss.rotation.z = Math.PI / 2;
      leftTruss.position.set(-4.5, 0, -0.8);
      group.add(leftTruss);

      const leftPanel = new THREE.Mesh(satGeos.solarPanel, solarMat);
      leftPanel.position.set(-11.5, 1.0, -0.8);
      leftPanel.rotation.z = 0.24; // Dihedral tilt
      group.add(leftPanel);

      const rightTruss = new THREE.Mesh(satGeos.panelTruss, satMaterials.darkHardware);
      rightTruss.rotation.z = -Math.PI / 2;
      rightTruss.position.set(4.5, 0, -0.8);
      group.add(rightTruss);

      const rightPanel = new THREE.Mesh(satGeos.solarPanel, solarMat);
      rightPanel.position.set(11.5, 1.0, -0.8);
      rightPanel.rotation.z = -0.24; // Dihedral tilt
      group.add(rightPanel);

      // Twin Ion Engine Thrusters with Dual Plasma Plumes
      const nozzleL = new THREE.Mesh(satGeos.nozzle, satMaterials.darkHardware);
      nozzleL.position.set(-2.0, 0, -8.0);
      nozzleL.rotation.x = -Math.PI / 2;
      group.add(nozzleL);

      const plumeL = new THREE.Mesh(satGeos.plume, plumeMat);
      plumeL.position.set(-2.0, 0, -18.5);
      plumeL.rotation.x = -Math.PI / 2;
      plumeL.scale.set(0.85, 0.85, 0.95);
      group.add(plumeL);
      plumes.push(plumeL);

      const nozzleR = new THREE.Mesh(satGeos.nozzle, satMaterials.darkHardware);
      nozzleR.position.set(2.0, 0, -8.0);
      nozzleR.rotation.x = -Math.PI / 2;
      group.add(nozzleR);

      const plumeR = new THREE.Mesh(satGeos.plume, plumeMat);
      plumeR.position.set(2.0, 0, -18.5);
      plumeR.rotation.x = -Math.PI / 2;
      plumeR.scale.set(0.85, 0.85, 0.95);
      group.add(plumeR);
      plumes.push(plumeR);

      // Telemetry whip antennas
      const ant1 = new THREE.Mesh(satGeos.boom, satMaterials.darkHardware);
      ant1.position.set(3.6, 3.6, -3.0);
      ant1.rotation.set(Math.PI * 0.3, Math.PI * 0.25, 0);
      ant1.scale.set(0.65, 0.65, 0.65);
      group.add(ant1);

      const ant2 = new THREE.Mesh(satGeos.boom, satMaterials.darkHardware);
      ant2.position.set(-3.6, 3.6, -3.0);
      ant2.rotation.set(Math.PI * 0.3, -Math.PI * 0.25, 0);
      ant2.scale.set(0.65, 0.65, 0.65);
      group.add(ant2);

      const beacon = new THREE.Mesh(satGeos.beacon, accentMat);
      beacon.position.set(0, 4.0, 4.8);
      group.add(beacon);
    }

    // Gentle rotational tumble speeds
    const rotSpeed = {
      x: (Math.random() - 0.5) * 0.012 + 0.004,
      y: (Math.random() - 0.5) * 0.016 + 0.005,
      z: (Math.random() - 0.5) * 0.008 + 0.003,
    };

    return {
      group,
      initialZ: 0,
      orbitalRadius: 0,
      orbitalAngle: 0,
      rotSpeed,
      plumes,
      baseColor: color,
    };
  };

  // Instantiate 8 Satellites (2 for each of the 4 colors) staggered along Z
  const SATELLITE_COUNT = 8;
  const initSatellitePosition = (sat: SatelliteInstance, zPos: number) => {
    // Distribute satellites nicely around the central text (100 - 280)
    const angle = Math.random() * Math.PI * 2;
    const radius = 100 + Math.random() * 200;

    sat.orbitalAngle = angle;
    sat.orbitalRadius = radius;

    sat.group.position.x = Math.cos(angle) * radius;
    sat.group.position.y = Math.sin(angle) * radius * 0.72;
    sat.group.position.z = zPos;

    // Initial orientation
    sat.group.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
  };

  for (let i = 0; i < SATELLITE_COUNT; i++) {
    const colorIdx = i % PALETTE.length;
    const color = PALETTE[colorIdx];
    const colorHex = PALETTE_HEX[colorIdx];
    const variant = i % 2; // Alternates between Variant 0 and Variant 1

    const satInstance = buildSatellite(color, colorHex, variant, colorIdx);

    // Stagger depth from -1200 up to +50
    const zStep = BOUND_SPAN / SATELLITE_COUNT;
    const initialZ = FAR_BOUND + i * zStep + (Math.random() - 0.5) * 60;

    initSatellitePosition(satInstance, initialZ);
    scene.add(satInstance.group);
    satelliteInstances.push(satInstance);
  }

  // 9. Render & Dynamic Warp Field Loop
  const render = () => {
    const currentOptions = getOptions();
    const speed = currentOptions.speed ?? 15.0;

    // Dynamically update opacities & FOV
    streakMat.opacity = currentOptions.streakOpacity ?? 0.60;
    const tileOp = currentOptions.tileOpacity ?? 0.90;
    for (let i = 0; i < tileMats.length; i++) {
      tileMats[i].opacity = tileOp;
    }

    if (camera.fov !== currentOptions.fov && currentOptions.fov) {
      camera.fov = currentOptions.fov;
      camera.updateProjectionMatrix();
    }

    // ── Advance Line Streaks ──
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

    // ── Advance Capsule Tiles ──
    if (currentOptions.variant !== "streaks") {
      for (let i = 0; i < TILE_COUNT; i++) {
        const tile = tiles[i];
        tile.position.z += speed;

        if (tile.position.z > NEAR_BOUND) {
          initTile(tile, false);
        }
      }
    }

    // ── Advance 3D Satellites Moving Along with Colors ──
    const showSatellites = currentOptions.satellites !== false;
    const time = performance.now() * 0.001;

    for (let i = 0; i < SATELLITE_COUNT; i++) {
      const sat = satelliteInstances[i];
      sat.group.visible = showSatellites;

      if (!showSatellites) continue;

      // Move forward along Z with warp speed
      sat.group.position.z += speed;

      // Continuous 3D rotation / tumbling
      sat.group.rotation.x += sat.rotSpeed.x;
      sat.group.rotation.y += sat.rotSpeed.y;
      sat.group.rotation.z += sat.rotSpeed.z;

      // Pulse and flicker ion engine plasma plume
      for (let p = 0; p < sat.plumes.length; p++) {
        const plume = sat.plumes[p];
        const pulse = Math.sin(time * 16 + i * 1.7 + p);
        plume.scale.z = 1.0 + 0.32 * pulse;
        (plume.material as THREE.MeshBasicMaterial).opacity =
          0.60 + 0.30 * Math.cos(time * 12 + i * 2.1);
      }

      // When satellite passes camera, wrap back to far bound with fresh coordinates
      if (sat.group.position.z > NEAR_BOUND) {
        initSatellitePosition(sat, FAR_BOUND - Math.random() * 200);
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

    // Dispose satellite resources
    Object.values(satGeos).forEach((g) => g.dispose());
    Object.values(satMaterials).forEach((m) => m.dispose());
    satTrackedMaterials.forEach((m) => m.dispose());
    solarTextures.forEach((t) => t.dispose());

    satelliteInstances.forEach((sat) => {
      scene.remove(sat.group);
    });

    sunLight.dispose();
    fillLight.dispose();
    ambientLight.dispose();

    renderer.dispose();
  };

  return {
    resize,
    render,
    dispose,
  };
}
