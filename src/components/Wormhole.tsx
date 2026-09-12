"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Search, PenTool, Code, Zap, Database, FlaskConical, Rocket } from "lucide-react";
import SectionBadge from "@/components/SectionBadge";

export interface WormholeCardData {
  caption?: string;
  title: string;
  description: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export interface WormholeProps {
  scrollLength?: number;
  backgroundColor?: string;
  gridColor?: string;
  tunnelSpeed?: number;
  textColor?: string;
  badgeLabel?: string;
  headingTitle?: React.ReactNode;
  headingSubtitle?: string;
  cardStyles?: {
    cardBorderRadius?: number;
    cardBackgroundBlur?: number;
    cardBackgroundColor?: string;
  };
  cards?: WormholeCardData[];
}

const DEFAULT_CARDS: WormholeCardData[] = [
  {
    caption: "01 / FORMULATION & SCOPING",
    title: "1. Latency & Objective Scoping",
    description:
      "Deconstructing complex product bottlenecks into mathematical objective functions. Before authoring pipelines, I establish baseline performance, false-positive thresholds, and strict P99 latency budgets.",
    icon: Search,
  },
  {
    caption: "02 / SIGNAL ARCHITECTURE",
    title: "2. Signal Maximization & Feature Stores",
    description:
      "Data quality governs the model ceiling. I engineer automated ETL pipelines with temporal splitting (eradicating lookahead bias), outlier neutralization, and high-entropy feature store embeddings.",
    icon: Database,
  },
  {
    caption: "03 / EXPERIMENTATION MATRIX",
    title: "3. Neural Architecture & Hybrid Modeling",
    description:
      "Structured benchmarking across gradient-boosted trees, custom Transformers, LSTMs, and GANs. Every iteration is tracked via MLflow with Bayesian hyperparameter tuning and ablation studies.",
    icon: FlaskConical,
  },
  {
    caption: "04 / PRODUCTION TELEMETRY",
    title: "4. Edge Quantization & Drift Telemetry",
    description:
      "Compiling model weights via ONNX & TensorRT for sub-10ms edge inference. Deploying containerized FastAPI microservices with continuous Kolmogorov-Smirnov monitors for real-time concept drift.",
    icon: Rocket,
  },
];

/* ── Liquid Glass Retina Shader Material with Chromatic Gradient Animation ── */
function createLiquidGlassMaterial(
  colors: { c1: number; c2: number; c3: number; c4: number },
  options?: { distortion?: number; fresnelPower?: number; speed?: number; opacity?: number }
) {
  const { distortion = 0.04, fresnelPower = 2.0, speed = 1.15, opacity = 0.86 } = options || {};

  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(colors.c1) },
      uColor2: { value: new THREE.Color(colors.c2) },
      uColor3: { value: new THREE.Color(colors.c3) },
      uColor4: { value: new THREE.Color(colors.c4) },
      uDistortion: { value: distortion },
      uFresnelPower: { value: fresnelPower },
      uSpeed: { value: speed },
      uOpacity: { value: opacity },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uDistortion;
      uniform float uSpeed;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        
        // Organic liquid glass vertex displacement
        float t = uTime * uSpeed;
        float wave1 = sin(position.x * 3.5 + t * 2.2) * cos(position.y * 3.2 + t * 1.8);
        float wave2 = sin(position.z * 4.0 - t * 2.0) * cos(position.x * 2.8 + t * 1.2);
        float wave = (wave1 + wave2) * 0.5;
        
        vec3 displaced = position + normal * (wave * uDistortion);
        
        vec4 worldPos = modelMatrix * vec4(displaced, 1.0);
        vWorldPosition = worldPos.xyz;
        
        vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
        vViewPosition = -mvPosition.xyz;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uSpeed;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uColor4;
      uniform float uFresnelPower;
      uniform float uOpacity;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;

      void main() {
        vec3 viewDir = normalize(vViewPosition);
        vec3 norm = normalize(vNormal);
        
        // Edge Fresnel reflection & rim intensity
        float NdotV = clamp(dot(viewDir, norm), 0.0, 1.0);
        float fresnel = pow(1.0 - NdotV, uFresnelPower);
        
        // Liquid chromatic gradient wave
        float t = uTime * uSpeed * 0.75;
        float f1 = sin(vWorldPosition.x * 2.2 + vWorldPosition.y * 1.8 + t);
        float f2 = cos(vWorldPosition.y * 2.4 - vWorldPosition.z * 2.0 + t * 1.2);
        float f3 = sin(vWorldPosition.z * 1.9 + vWorldPosition.x * 2.5 - t * 0.9);
        
        float m1 = smoothstep(-0.8, 0.8, f1 + f2 * 0.5);
        float m2 = smoothstep(-0.8, 0.8, f2 + f3 * 0.5);
        
        vec3 gradA = mix(uColor1, uColor2, m1);
        vec3 gradB = mix(uColor3, uColor4, m2);
        vec3 liquidColor = mix(gradA, gradB, 0.5 + 0.5 * sin(t * 0.6 + vUv.x * 3.1415));
        
        // Dynamic specular lighting highlights (crisp gloss gleams on glass surface)
        vec3 light1 = normalize(vec3(0.7, 1.2, 0.9));
        vec3 light2 = normalize(vec3(-0.8, -0.4, -0.6));
        
        vec3 half1 = normalize(light1 + viewDir);
        vec3 half2 = normalize(light2 + viewDir);
        
        float spec1 = pow(max(0.0, dot(norm, half1)), 44.0);
        float spec2 = pow(max(0.0, dot(norm, half2)), 22.0);
        
        // Chromatic dispersion shimmer along refraction edge
        float rimR = pow(1.0 - clamp(dot(viewDir, normalize(norm + vec3(0.03, 0.0, 0.0))), 0.0, 1.0), uFresnelPower);
        float rimG = fresnel;
        float rimB = pow(1.0 - clamp(dot(viewDir, normalize(norm - vec3(0.03, 0.0, 0.0))), 0.0, 1.0), uFresnelPower);
        vec3 chromaticRim = vec3(rimR, rimG, rimB);
        
        // For white theme:
        // Rich retina color transmission with optical depth
        vec3 bodyColor = liquidColor * mix(0.85, 1.15, fresnel);
        vec3 rimColor = mix(liquidColor, chromaticRim, 0.5) * 1.25;
        vec3 specularGlint = vec3(1.0) * (spec1 * 1.1 + spec2 * 0.45);
        
        // Crisp glass contour definition on white canvas
        float edgeContour = smoothstep(0.0, 0.25, NdotV);
        bodyColor *= mix(0.78, 1.0, edgeContour);
        
        vec3 finalRgb = mix(bodyColor, rimColor, fresnel * 0.65) + specularGlint;
        
        // Opacity: pops vividly on white, translucent enough to see wormhole grid through it
        float alpha = clamp(uOpacity * (0.62 + fresnel * 0.35 + spec1 * 0.25), 0.0, 0.96);
        
        gl_FragColor = vec4(finalRgb, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.NormalBlending,
  });
}

/* ── 3D Procedural Liquid Glass Retina Space Objects (White Theme Compatible) ── */

// 1. Liquid Glass Orbital Satellite (Sapphire / Royal Indigo / Magenta / Ocean Azure)
function createSatellite(materialsList: THREE.ShaderMaterial[]) {
  const group = new THREE.Group();

  const glassMat = createLiquidGlassMaterial(
    { c1: 0x4338ca, c2: 0x7c3aed, c3: 0xdb2777, c4: 0x0284c7 },
    { distortion: 0.04, fresnelPower: 2.1, speed: 1.2, opacity: 0.88 }
  );
  materialsList.push(glassMat);

  const solarMat = createLiquidGlassMaterial(
    { c1: 0x1d4ed8, c2: 0x6366f1, c3: 0xa855f7, c4: 0x06b6d4 },
    { distortion: 0.02, fresnelPower: 1.9, speed: 0.95, opacity: 0.82 }
  );
  materialsList.push(solarMat);

  // Central chassis - faceted liquid glass cylinder
  const bodyGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.95, 24, 8);
  const body = new THREE.Mesh(bodyGeo, glassMat);
  group.add(body);

  // Inner luminous retina gem visible through the glass body (Ruby / Rose crystal)
  const coreGeo = new THREE.IcosahedronGeometry(0.20, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.1,
    metalness: 0.2,
    emissive: 0xbe123c,
    emissiveIntensity: 0.6,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Holographic crystalline solar wings (pure liquid glass panels)
  const wingGeo = new THREE.BoxGeometry(1.05, 0.46, 0.04, 6, 4);
  const leftWing = new THREE.Mesh(wingGeo, solarMat);
  leftWing.position.x = -1.0;
  group.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeo, solarMat);
  rightWing.position.x = 1.0;
  group.add(rightWing);

  // Polished chrome/violet support struts
  const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.95);
  const strutMat = new THREE.MeshStandardMaterial({ color: 0x818cf8, roughness: 0.2, metalness: 0.8 });
  const leftStrut = new THREE.Mesh(strutGeo, strutMat);
  leftStrut.rotation.z = Math.PI / 2;
  leftStrut.position.x = -0.5;
  group.add(leftStrut);

  const rightStrut = new THREE.Mesh(strutGeo, strutMat);
  rightStrut.rotation.z = Math.PI / 2;
  rightStrut.position.x = 0.5;
  group.add(rightStrut);

  // Curved liquid glass communications dish
  const dishGeo = new THREE.SphereGeometry(0.38, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.2);
  const dish = new THREE.Mesh(dishGeo, glassMat);
  dish.rotation.x = -Math.PI / 2;
  dish.position.set(0, 0.45, 0.28);
  group.add(dish);

  // Concentric liquid glass antenna ring
  const ringGeo = new THREE.TorusGeometry(0.26, 0.02, 16, 32);
  const ring = new THREE.Mesh(ringGeo, solarMat);
  ring.position.set(0, 0.45, 0.4);
  group.add(ring);

  // Feed horn with glowing beacon
  const feed = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25), glassMat);
  feed.rotation.x = Math.PI / 2;
  feed.position.set(0, 0.45, 0.45);
  group.add(feed);

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    })
  );
  beacon.position.set(0, 0.45, 0.58);
  group.add(beacon);

  return { group, beacon, core };
}

// 2. Liquid Glass Deep Space Probe (Hyperion Gold / Amber Quartz / Magenta / Ocean Azure)
function createDeepSpaceProbe(materialsList: THREE.ShaderMaterial[]) {
  const group = new THREE.Group();

  const probeMat = createLiquidGlassMaterial(
    { c1: 0xd97706, c2: 0xe11d48, c3: 0x7c3aed, c4: 0x0284c7 },
    { distortion: 0.045, fresnelPower: 2.1, speed: 1.3, opacity: 0.88 }
  );
  materialsList.push(probeMat);

  const crystalMat = createLiquidGlassMaterial(
    { c1: 0xf59e0b, c2: 0xf43f5e, c3: 0x6366f1, c4: 0x0ea5e9 },
    { distortion: 0.03, fresnelPower: 1.8, speed: 1.1, opacity: 0.84 }
  );
  materialsList.push(crystalMat);

  // Giant parabolic liquid glass dish
  const dishGeo = new THREE.SphereGeometry(0.65, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
  const dish = new THREE.Mesh(dishGeo, probeMat);
  dish.rotation.x = -Math.PI / 2;
  dish.position.set(0, 0, 0.35);
  group.add(dish);

  // Concentric liquid glass ribs on dish
  const rib1 = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.022, 12, 36), crystalMat);
  rib1.position.set(0, 0, 0.45);
  group.add(rib1);

  const rib2 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.02, 12, 28), crystalMat);
  rib2.position.set(0, 0, 0.52);
  group.add(rib2);

  // Central golden glass feed horn
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.35, 16), probeMat);
  horn.rotation.x = -Math.PI / 2;
  horn.position.set(0, 0, 0.65);
  group.add(horn);

  // Cylindrical glass avionics housing behind dish
  const bodyGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.7, 24);
  const body = new THREE.Mesh(bodyGeo, probeMat);
  body.rotation.x = Math.PI / 2;
  body.position.set(0, 0, -0.2);
  group.add(body);

  // Floating glass stabilizer gyro ring around body
  const gyroGeo = new THREE.TorusGeometry(0.55, 0.028, 16, 40);
  const gyro = new THREE.Mesh(gyroGeo, crystalMat);
  gyro.position.set(0, 0, -0.2);
  group.add(gyro);

  // Magnetometer boom with jewel lens
  const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.5, 8), probeMat);
  boom.rotation.z = Math.PI / 3;
  boom.position.set(0.65, 0.35, -0.2);
  group.add(boom);

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    })
  );
  beacon.position.set(1.3, 0.72, -0.2);
  group.add(beacon);

  return { group, beacon, gyro };
}

// 3. Liquid Glass Quantum Core / Dyson Orb (Emerald Matrix / Jade / Azure / Amethyst)
function createQuantumCore(materialsList: THREE.ShaderMaterial[]) {
  const group = new THREE.Group();

  const coreMat = createLiquidGlassMaterial(
    { c1: 0x059669, c2: 0x10b981, c3: 0x0284c7, c4: 0x7c3aed },
    { distortion: 0.065, fresnelPower: 2.0, speed: 1.4, opacity: 0.88 }
  );
  materialsList.push(coreMat);

  const shellMat = createLiquidGlassMaterial(
    { c1: 0x0ea5e9, c2: 0x6366f1, c3: 0x10b981, c4: 0x8b5cf6 },
    { distortion: 0.035, fresnelPower: 1.8, speed: 1.0, opacity: 0.75 }
  );
  materialsList.push(shellMat);

  // Central morphing liquid glass icosahedron
  const innerGeo = new THREE.IcosahedronGeometry(0.38, 3);
  const inner = new THREE.Mesh(innerGeo, coreMat);
  group.add(inner);

  // Outer faceted refraction crystal shell (translucent glass)
  const shellGeo = new THREE.IcosahedronGeometry(0.50, 1);
  const shell = new THREE.Mesh(shellGeo, shellMat);
  group.add(shell);

  // Dual counter-rotating gyroscopic liquid glass rings
  const ring1Geo = new THREE.TorusGeometry(0.70, 0.03, 16, 48);
  const ring1 = new THREE.Mesh(ring1Geo, coreMat);
  group.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(0.88, 0.03, 16, 48);
  const ring2 = new THREE.Mesh(ring2Geo, shellMat);
  ring2.rotation.x = Math.PI / 3;
  group.add(ring2);

  // Third equatorial refraction halo
  const ring3Geo = new THREE.TorusGeometry(1.02, 0.024, 14, 48);
  const ring3 = new THREE.Mesh(ring3Geo, coreMat);
  ring3.rotation.y = Math.PI / 2.5;
  group.add(ring3);

  // Central glowing emerald node
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.9,
      roughness: 0.1,
    })
  );
  beacon.position.set(0, 0, 0);
  group.add(beacon);

  return { group, beacon, ring1, ring2, ring3, inner, wire: shell };
}

// 4. Liquid Glass Warp Spacecraft / Capsule (Sunset Crimson / Magenta / Purple / Sky)
function createSpaceCapsule(materialsList: THREE.ShaderMaterial[]) {
  const group = new THREE.Group();

  const craftMat = createLiquidGlassMaterial(
    { c1: 0xe11d48, c2: 0xdb2777, c3: 0x7c3aed, c4: 0x0284c7 },
    { distortion: 0.045, fresnelPower: 2.0, speed: 1.25, opacity: 0.88 }
  );
  materialsList.push(craftMat);

  const wingMat = createLiquidGlassMaterial(
    { c1: 0xf43f5e, c2: 0x8b5cf6, c3: 0x0ea5e9, c4: 0xec4899 },
    { distortion: 0.03, fresnelPower: 1.8, speed: 1.1, opacity: 0.82 }
  );
  materialsList.push(wingMat);

  // Aerodynamic faceted liquid glass command module
  const noseGeo = new THREE.ConeGeometry(0.48, 0.85, 20);
  const nose = new THREE.Mesh(noseGeo, craftMat);
  nose.rotation.x = -Math.PI / 2;
  group.add(nose);

  // Service module (beveled glass cylinder)
  const smGeo = new THREE.CylinderGeometry(0.48, 0.44, 0.55, 20);
  const sm = new THREE.Mesh(smGeo, craftMat);
  sm.rotation.x = -Math.PI / 2;
  sm.position.z = -0.65;
  group.add(sm);

  // Swept liquid glass warp wings
  const wingGeo = new THREE.BoxGeometry(0.95, 0.28, 0.04, 8, 4);
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.set(-0.92, 0, -0.65);
  leftWing.rotation.y = 0.25;
  group.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.set(0.92, 0, -0.65);
  rightWing.rotation.y = -0.25;
  group.add(rightWing);

  // Twin liquid glass plasma thruster bells
  const engineGeo = new THREE.CylinderGeometry(0.14, 0.22, 0.25, 16);
  const engine1 = new THREE.Mesh(engineGeo, craftMat);
  engine1.rotation.x = -Math.PI / 2;
  engine1.position.set(-0.2, 0, -1.0);
  group.add(engine1);

  const engine2 = new THREE.Mesh(engineGeo, craftMat);
  engine2.rotation.x = -Math.PI / 2;
  engine2.position.set(0.2, 0, -1.0);
  group.add(engine2);

  // Soft iridescent exhaust plumes (translucent violet/sky glass cone)
  const plumeGeo = new THREE.ConeGeometry(0.12, 0.45, 16);
  const plumeMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    emissive: 0x6366f1,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.45,
    roughness: 0.2,
  });
  const plume1 = new THREE.Mesh(plumeGeo, plumeMat);
  plume1.rotation.x = Math.PI / 2;
  plume1.position.set(-0.2, 0, -1.25);
  group.add(plume1);

  const plume2 = new THREE.Mesh(plumeGeo, plumeMat);
  plume2.rotation.x = Math.PI / 2;
  plume2.position.set(0.2, 0, -1.25);
  group.add(plume2);

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    })
  );
  beacon.position.set(0, 0.35, -0.2);
  group.add(beacon);

  return { group, beacon };
}

export default function Wormhole({
  scrollLength = 380,
  backgroundColor = "#ffffff",
  gridColor = "rgba(0, 0, 0, 0.85)",
  tunnelSpeed = 0.0008,
  textColor = "#FFFFFF",
  badgeLabel = "My Approach",
  headingTitle,
  headingSubtitle = "A structured, iterative approach to every project — scroll down to explore the engineering pipeline.",
  cardStyles,
  cards = DEFAULT_CARDS,
}: WormholeProps) {
  const {
    cardBorderRadius = 26,
    cardBackgroundBlur = 28,
    cardBackgroundColor = "rgba(18, 22, 30, 0.65)",
  } = cardStyles || {};

  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [webGlFailed, setWebGlFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !overlayRef.current || !trackRef.current) return;
    const container = containerRef.current;
    let width = container.offsetWidth || window.innerWidth;
    let height = container.offsetHeight || window.innerHeight;

    // --- 1. INITIALIZE SCENE & CAMERA ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    // No fog — let the full wireframe tunnel depth be visible

    // 72° FOV — wide enough to show tube walls at screen edges, immersive wormhole depth
    const camera = new THREE.PerspectiveCamera(72, width / height, 0.05, 200);
    camera.far = 200;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch (e) {
      console.warn("WebGL renderer creation failed in Wormhole:", e);
      setWebGlFailed(true);
      return;
    }

    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    // --- 2. MULTI-TIER LIGHTING FOR GLOSSY REFLECTIONS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.6);
    dirLight1.position.set(8, 12, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe0e7ff, 1.2);
    dirLight2.position.set(-8, -8, -20);
    scene.add(dirLight2);

    // --- 3. GENERATE WORMHOLE TUBE GEOMETRY & WIREFRAME GRID ---
    // 14-point deeply winding curve — extends to Z=-120 for long receding tunnel perspective.
    // Bends are proportional to tube radius (2.2) so walls are always visible around the camera.
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3( 0.0,   0.0,    0),
      new THREE.Vector3( 2.0,   1.2,   -8),
      new THREE.Vector3(-2.4,  -1.6,  -17),
      new THREE.Vector3( 2.6,   0.8,  -27),
      new THREE.Vector3(-2.0,  -2.2,  -37),
      new THREE.Vector3( 1.8,   1.8,  -47),
      new THREE.Vector3(-2.8,  -1.0,  -57),
      new THREE.Vector3( 2.2,   2.4,  -67),
      new THREE.Vector3(-1.6,  -1.4,  -77),
      new THREE.Vector3( 2.4,   1.0,  -87),
      new THREE.Vector3(-2.0,  -1.8,  -97),
      new THREE.Vector3( 1.4,   2.0, -107),
      new THREE.Vector3(-1.0,  -1.0, -115),
      new THREE.Vector3( 0.0,   0.0, -120),
    ]);

    const texCanvas = document.createElement("canvas");
    texCanvas.width = 512;
    texCanvas.height = 512;
    const ctx = texCanvas.getContext("2d");
    if (ctx) {
      // Pure white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 512, 512);

      // Black grid lines on white background
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1.4;

      // 10×10 grid per tile — finer lines look sharp when repeated 24×7 over the long tube
      const step = 512 / 10;
      for (let i = 0; i <= 512; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(texCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    // 24 rings lengthwise (matches ~120 units of curve depth), 7 around circumference
    // This gives the dense grid-with-perspective look from the reference
    texture.repeat.set(24, 7);

    // radius 2.2 — fills screen edges at 72° FOV, shows deep perspective toward vanishing point
    const tubeGeo = new THREE.TubeGeometry(curve, 250, 2.2, 24, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      transparent: false,
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tubeMesh);

    // --- 4. 3D LIQUID GLASS SPACE OBJECTS (particles removed — clean white wormhole) ---
    const liquidGlassMaterials: THREE.ShaderMaterial[] = [];

    const spaceObjects = [
      { obj: createSatellite(liquidGlassMaterials), progress: 0.20, angle: 0.5 + Math.PI * 0.95, offset: 0.9 },
      { obj: createDeepSpaceProbe(liquidGlassMaterials), progress: 0.44, angle: 2.7 + Math.PI * 0.95, offset: 1.0 },
      { obj: createQuantumCore(liquidGlassMaterials), progress: 0.68, angle: 4.8 + Math.PI * 0.95, offset: 0.9 },
      { obj: createSpaceCapsule(liquidGlassMaterials), progress: 0.90, angle: 1.4 + Math.PI * 0.95, offset: 0.9 },
    ];

    spaceObjects.forEach((item) => {
      item.obj.group.scale.setScalar(0.60); // fit the 2.2-radius tube
      scene.add(item.obj.group);
    });

    // --- 6. CARD INSTANTIATION CONFIGURATION ---
    const cardsData = [
      { id: "c1", progress: 0.20, angle: 0.5, el: null as HTMLElement | null },
      { id: "c2", progress: 0.44, angle: 2.7, el: null as HTMLElement | null },
      { id: "c3", progress: 0.68, angle: 4.8, el: null as HTMLElement | null },
      { id: "c4", progress: 0.90, angle: 1.4, el: null as HTMLElement | null },
    ];

    // --- 7. MOUSE PARALLAX INTERACTION ---
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // --- 8. ENGINE RUNTIME INTERACTION ---
    let scrollPercent = 0;
    let targetScrollPercent = 0;

    const handleScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const totalScrollableDistance = rect.height - window.innerHeight;
      if (totalScrollableDistance <= 0) return;
      const relativeProgress = -rect.top / totalScrollableDistance;
      targetScrollPercent = Math.min(Math.max(relativeProgress, 0), 1);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    let frameId = 0;
    const animate = () => {
      scrollPercent += (targetScrollPercent - scrollPercent) * 0.08;

      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      const time = performance.now() * 0.001;

      // Camera is CENTERED inside the tube — this is what creates the "inside the tunnel" look.
      // No Y-elevation, no downward look. The camera just follows the curve forward.
      const cameraEval = Math.min(Math.max(scrollPercent, 0), 0.97);
      const lookAtEval = Math.min(Math.max(scrollPercent + 0.04, 0), 1);
      const camPos = curve.getPointAt(cameraEval);
      const lookPos = curve.getPointAt(lookAtEval);

      camera.position.copy(camPos);
      camera.lookAt(lookPos);

      // Subtle mouse tilt — gives a feeling of swaying inside the tunnel
      camera.rotation.z += currentMouseX * 0.06 + Math.sin(time * 0.5) * 0.015;
      camera.rotation.x += -currentMouseY * 0.04;

      // Texture offset: scroll drives forward motion through the tube rings
      texture.offset.x = -(scrollPercent * 18.0 + time * tunnelSpeed * 60);
      // Slight circumferential swirl for a spiraling wormhole feel
      texture.offset.y = time * 0.008;

      // Update liquid glass shader animations
      liquidGlassMaterials.forEach((mat) => {
        mat.uniforms.uTime.value = time;
      });

      // Animate 3D Space Objects (Satellite, Probe, Core, Capsule)
      spaceObjects.forEach((item, i) => {
        const p3d = curve.getPointAt(item.progress);
        p3d.x += Math.cos(item.angle) * item.offset;
        p3d.y += Math.sin(item.angle) * item.offset;
        p3d.y += Math.sin(time * 1.2 + i * 1.3) * 0.05; // gentle floating wave

        item.obj.group.position.copy(p3d);
        item.obj.group.rotation.y += 0.012;
        item.obj.group.rotation.x += 0.008;

        // Specific rotations for quantum core & probe gyros
        const qObj = item.obj as ReturnType<typeof createQuantumCore>;
        if (qObj.ring1 && qObj.ring2) {
          qObj.ring1.rotation.z += 0.025;
          qObj.ring2.rotation.y += 0.02;
          if (qObj.ring3) qObj.ring3.rotation.x += 0.015;
          if (qObj.wire) qObj.wire.rotation.y -= 0.015;
        }

        const probeObj = item.obj as ReturnType<typeof createDeepSpaceProbe>;
        if (probeObj.gyro) {
          probeObj.gyro.rotation.z += 0.02;
        }

        // Pulse beacon LED
        if (item.obj.beacon && item.obj.beacon.material) {
          const mat = item.obj.beacon.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 0.5 + Math.sin(time * 5 + i * 1.5) * 0.4;
        }
      });

      // ── Sequential card visibility ──────────────────────────────────────────
      // A card is "fully gone" once it's passed the camera (distance too large or
      // wp.z ≥ 1 meaning it's behind).  Card N is only allowed to show once all
      // cards 0..N-1 are fully gone, preventing two cards from overlapping.
      //
      // We track each card's "gone" state: gone = not in the close-approach window.
      // SHOW_DISTANCE: how close the camera must be before a card can appear.
      // GONE_DISTANCE:  how far the camera must be before a card is considered gone.
      const SHOW_DISTANCE = 14;   // card starts fading in inside this radius
      const GONE_DISTANCE = 16;   // card considered fully gone beyond this radius

      const cardDistances = cardsData.map((card) => {
        const pos = curve.getPointAt(card.progress);
        pos.x += Math.cos(card.angle) * 1.1;
        pos.y += Math.sin(card.angle) * 1.1;
        return camera.position.distanceTo(pos);
      });

      const isGone = cardsData.map((card, idx) => {
        const d = cardDistances[idx];
        const pos = curve.getPointAt(card.progress);
        pos.x += Math.cos(card.angle) * 1.1;
        pos.y += Math.sin(card.angle) * 1.1;
        const wp4 = pos.clone();
        wp4.project(camera);
        return wp4.z >= 1.0 || d > GONE_DISTANCE;
      });

      cardsData.forEach((card, idx) => {
        if (!card.el) {
          card.el = document.getElementById(`wh-card-${idx + 1}`);
          if (!card.el) return;
        }

        // All previous cards must be fully gone before this card can appear
        const prevAllGone = idx === 0 || isGone.slice(0, idx).every(Boolean);

        const cardPos3D = curve.getPointAt(card.progress);
        const wallDistance = 1.1;
        cardPos3D.x += Math.cos(card.angle) * wallDistance;
        cardPos3D.y += Math.sin(card.angle) * wallDistance;

        const wp = cardPos3D.clone();
        wp.project(camera);
        const distance = camera.position.distanceTo(cardPos3D);

        if (prevAllGone && wp.z < 1 && distance < SHOW_DISTANCE && distance > 0.5) {
          const currentContainer = containerRef.current;
          const currentWidth = currentContainer ? currentContainer.offsetWidth : width;
          const currentHeight = currentContainer ? currentContainer.offsetHeight : height;
          const x = (wp.x * 0.5 + 0.5) * currentWidth;
          const rawY = (-(wp.y * 0.5) + 0.5) * currentHeight;
          // Clamp Y so the card never covers the top header
          const y = Math.max(220, Math.min(currentHeight - 150, rawY));

          // Smooth fade: ramp up as card approaches, ramp down as it passes
          const approachFraction = Math.min(1, Math.max(0, (SHOW_DISTANCE - distance) / (SHOW_DISTANCE * 0.5)));
          const scale = Math.min(1.15, Math.max(0, (1 - distance / SHOW_DISTANCE) * 1.3));

          card.el.style.opacity = (approachFraction * Math.min(1, scale * 1.8)).toString();
          card.el.style.transform = `translate3d(-50%, -50%, 0px) translate3d(${x}px, ${y}px, 0px) scale(${scale})`;
          card.el.style.zIndex = Math.round((1 - wp.z) * 100).toString();
        } else {
          card.el.style.opacity = "0";
        }
      });

      try {
        renderer.render(scene, camera);
      } catch (_) {}
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.offsetWidth || window.innerWidth;
      height = containerRef.current.offsetHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      tubeGeo.dispose();
      tubeMat.dispose();
      texture.dispose();
      liquidGlassMaterials.forEach((m) => m.dispose());
      renderer.dispose();
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [backgroundColor, gridColor, tunnelSpeed]);

  return (
    <div
      ref={trackRef}
      className="relative w-full"
      style={{
        height: `${scrollLength}vh`,
        background: "#ffffff",
        backgroundColor: "#ffffff",
      }}
    >
      {/* Fallback for non-WebGL environments */}
      {webGlFailed ? (
        <div className="max-screen py-24 bg-white text-gray-900">
          <div className="mb-12 text-center">
            <SectionBadge label={badgeLabel} />
            <h2
              className="text-4xl sm:text-5xl font-semibold mt-4 mb-3 text-gray-900"
              style={{ fontFamily: "var(--font-clash-display), system-ui" }}
            >
              {headingTitle || (
                <>
                  How I <span className="text-highlight">Approach a Project</span>
                </>
              )}
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
              {headingSubtitle}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-500">
                      {card.caption || `0${i + 1} / STEP`}
                    </span>
                    {Icon && (
                      <div className="w-8 h-8 rounded-lg bg-gray-200/60 flex items-center justify-center text-gray-800">
                        <Icon size={16} />
                      </div>
                    )}
                  </div>
                  <h3
                    className="text-lg font-bold text-gray-900 mb-3"
                    style={{ fontFamily: "var(--font-clash-display), system-ui" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Sticky Viewport Container - white theme */
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-white">
          {/* Three.js Canvas Container */}
          <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full pointer-events-none bg-white"
          />

          {/* Centered Header - positioned lower with ample top breathing room */}
          <div className="absolute top-0 left-0 right-0 pt-16 sm:pt-24 md:pt-28 px-6 z-20 pointer-events-none flex flex-col items-center text-center">
            <SectionBadge label={badgeLabel} />
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-4 mb-2.5 text-[#0a0a0a] tracking-tight"
              style={{ fontFamily: "var(--font-clash-display), system-ui" }}
            >
              {headingTitle || (
                <>
                  How I <span className="text-highlight">Approach a Project</span>
                </>
              )}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm max-w-lg leading-relaxed font-normal">
              {headingSubtitle}
            </p>
          </div>

          {/* 3D Projected Cards Layer */}
          <div
            ref={overlayRef}
            id="wh-overlay-layer"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              perspective: "1000px",
            }}
          >
            {cards.map((card, idx) => {
              const num = idx + 1;
              const Icon = card.icon;

              return (
                <div
                  id={`wh-card-${num}`}
                  key={num}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    fontFamily: '"Inter", sans-serif',
                    background: cardBackgroundColor,
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    borderRadius: `${cardBorderRadius}px`,
                    backdropFilter: `blur(${cardBackgroundBlur}px) saturate(190%)`,
                    WebkitBackdropFilter: `blur(${cardBackgroundBlur}px) saturate(190%)`,
                    padding: "24px 28px",
                    width: "min(390px, calc(100vw - 36px))",
                    minHeight: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    color: textColor,
                    boxShadow:
                      "0 24px 60px 0 rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.25)",
                    opacity: 0,
                    pointerEvents: "auto",
                    willChange: "transform, opacity",
                  }}
                >
                  {/* Card Top: Caption & Icon */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        color: "#38bdf8",
                      }}
                    >
                      {card.caption || `0${num} / APPROACH`}
                    </span>
                    {Icon && (
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          backgroundColor: "rgba(255, 255, 255, 0.12)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#FFFFFF",
                        }}
                      >
                        <Icon size={18} />
                      </div>
                    )}
                  </div>

                  {/* Card Title */}
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "22px",
                      fontWeight: 700,
                      letterSpacing: "-0.4px",
                      lineHeight: 1.3,
                      color: textColor,
                      fontFamily: "var(--font-clash-display), system-ui",
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Subtle separator line */}
                  <div style={{ height: "1px", width: "100%", backgroundColor: "rgba(255, 255, 255, 0.12)" }} />

                  {/* Card Bottom: Description */}
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13.5px",
                      fontWeight: 400,
                      lineHeight: "1.6",
                      color: "rgba(255, 255, 255, 0.85)",
                    }}
                  >
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
