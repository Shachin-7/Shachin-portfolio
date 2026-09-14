"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── TYPES ───────────────────────────────────────────────────────────────────

export interface DeskItemData {
  id: string;
  label: string;
  detail: string;
  image: string;
  initialX: number;
  initialY: number;
  width: number;
  height: number;
  zIndex: number;
  rotate?: number;
}

interface ArrangeDeskContextType {
  activeItem: DeskItemData | null;
  selectItem: (item: DeskItemData) => void;
  clearActiveItem: () => void;
  playGrab: () => void;
  playDrop: () => void;
  unlockAudio: () => void;
  wobbleEnabled: boolean;
}

const ArrangeDeskContext = createContext<ArrangeDeskContextType | null>(null);

// ─── AUDIO HOOK ─────────────────────────────────────────────────────────────

function useDragSounds() {
  const grabRef = useRef<HTMLAudioElement | null>(null);
  const dropRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  useEffect(() => {
    if (typeof Audio === "undefined") return;
    try {
      const grab = new Audio("/assets/desk/grab.MP3");
      const drop = new Audio("/assets/desk/drop.MP3");
      grab.preload = "auto";
      drop.preload = "auto";
      grab.volume = 0.35;
      drop.volume = 0.35;
      grabRef.current = grab;
      dropRef.current = drop;
    } catch {
      // Audio not supported or blocked
    }

    return () => {
      grabRef.current = null;
      dropRef.current = null;
    };
  }, []);

  const unlockAudio = useCallback(() => {
    if (unlockedRef.current) return;
    unlockedRef.current = true;
    if (grabRef.current) {
      grabRef.current.load();
    }
  }, []);

  const playGrab = useCallback(() => {
    if (!grabRef.current) return;
    try {
      grabRef.current.currentTime = 0;
      grabRef.current.play().catch(() => {});
    } catch {}
  }, []);

  const playDrop = useCallback(() => {
    if (!dropRef.current) return;
    try {
      dropRef.current.currentTime = 0;
      dropRef.current.play().catch(() => {});
    } catch {}
  }, []);

  return { unlockAudio, playGrab, playDrop };
}

// ─── DRAGGABLE DESK / SHELF OBJECT ──────────────────────────────────────────

interface DraggableObjectProps {
  item: DeskItemData;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function DraggableObject({ item, containerRef }: DraggableObjectProps) {
  const ctx = useContext(ArrangeDeskContext);
  const [isDragging, setIsDragging] = useState(false);
  const [currentZ, setCurrentZ] = useState(item.zIndex);

  // Pseudo-random wobble based on ID
  const seed = item.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const wobbleX = ((seed % 5) - 2) * 1.2;
  const wobbleY = (((seed + 3) % 5) - 2) * 1.2;
  const wobbleRotate = (((seed + 7) % 5) - 2) * 0.6;
  const duration = 4 + (seed % 4) * 0.5;

  const shouldWobble = (ctx?.wobbleEnabled ?? true) && !isDragging;

  return (
    <motion.div
      drag
      dragConstraints={containerRef}
      dragElastic={0.08}
      dragMomentum={false}
      initial={{ x: item.initialX, y: item.initialY }}
      onPointerDown={() => {
        ctx?.unlockAudio();
        setCurrentZ(50);
        ctx?.selectItem(item);
      }}
      onDragStart={() => {
        setIsDragging(true);
        setCurrentZ(60);
        ctx?.playGrab();
      }}
      onDragEnd={() => {
        setIsDragging(false);
        ctx?.playDrop();
      }}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: item.width,
        height: item.height,
        zIndex: currentZ,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
      title={item.label}
    >
      <motion.div
        animate={
          shouldWobble
            ? {
                x: [0, wobbleX, 0, -wobbleX, 0],
                y: [0, -wobbleY, 0, wobbleY, 0],
                rotate: [
                  item.rotate ?? 0,
                  (item.rotate ?? 0) + wobbleRotate,
                  item.rotate ?? 0,
                  (item.rotate ?? 0) - wobbleRotate,
                  item.rotate ?? 0,
                ],
              }
            : { x: 0, y: 0, rotate: item.rotate ?? 0 }
        }
        transition={
          shouldWobble
            ? { duration, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.15, ease: "easeOut" }
        }
        className="w-full h-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.label}
          draggable={false}
          className="w-full h-full object-contain pointer-events-none drop-shadow-md select-none"
        />
      </motion.div>
    </motion.div>
  );
}

// ─── INFO PANEL (REMOVED PER USER REQUEST) ──────────────────────────────────

function DeskInfoPanel() {
  return null;
}

// ─── DATA ITEMS DEFINITIONS ─────────────────────────────────────────────────

const SHELF_ITEMS: DeskItemData[] = [
  {
    id: "mushroom-light",
    label: "Mushroom Light",
    detail: "A soft lamp that gives the desk scene a playful focal point.",
    image: "/assets/desk/mushroom-light.png",
    initialX: 14,
    initialY: 52,
    width: 60,
    height: 60,
    zIndex: 5,
  },
  {
    id: "plant",
    label: "Plant",
    detail: "A small desk plant for adding color and calm to the workspace.",
    image: "/assets/desk/plant.png",
    initialX: 80,
    initialY: 14,
    width: 86,
    height: 100,
    zIndex: 4,
  },
  {
    id: "duck",
    label: "Rubber Duck",
    detail: "A tiny desk companion for debugging and keeping things light.",
    image: "/assets/desk/duck.png",
    initialX: 176,
    initialY: 82,
    width: 26,
    height: 26,
    zIndex: 5,
  },
];

const DESK_ITEMS: DeskItemData[] = [
  {
    id: "laptop",
    label: "Laptop",
    detail: "The main work surface for code, writing, and creative projects.",
    image: "/assets/desk/laptop.png",
    initialX: 108,
    initialY: 22,
    width: 140,
    height: 122,
    zIndex: 3,
  },
  {
    id: "keyboard",
    label: "Keyboard",
    detail: "A compact keyboard item that can anchor the lower desk layout.",
    image: "/assets/desk/keyboard.png",
    initialX: 118,
    initialY: 108,
    width: 120,
    height: 48,
    zIndex: 6,
  },
  {
    id: "headphone",
    label: "Headphones",
    detail: "Headphones for deep work, calls, and a focused desk setup.",
    image: "/assets/desk/headphone.png",
    initialX: 38,
    initialY: 62,
    width: 66,
    height: 66,
    zIndex: 4,
  },
  {
    id: "penholder",
    label: "Penholder",
    detail: "A holder for pens, pencils, and the small tools within reach.",
    image: "/assets/desk/penholder.png",
    initialX: 8,
    initialY: 52,
    width: 52,
    height: 76,
    zIndex: 5,
  },
  {
    id: "matcha",
    label: "Matcha Latte",
    detail: "A drink item for adding personality and balance to the scene.",
    image: "/assets/desk/matcha.png",
    initialX: 254,
    initialY: 68,
    width: 60,
    height: 60,
    zIndex: 4,
  },
];

// ─── EXPORTED COMPONENTS ────────────────────────────────────────────────────

/**
 * Top-Left Floating Shelf (Image 3)
 * Mounted at the top-left corner of the contact page with space from the top.
 */
export function ArrangeDeskShelf({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className={`absolute top-[108px] sm:top-[118px] md:top-[122px] left-0 z-20 w-[240px] sm:w-[260px] h-[145px] pointer-events-auto select-none overflow-visible ${className}`}
      style={{ touchAction: "none" }}
    >
      {/* Wooden Floating Shelf Wall Mount */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/desk/shelf.png"
        alt="Shelf"
        draggable={false}
        className="absolute left-0 bottom-5 w-[220px] sm:w-[240px] h-auto object-contain pointer-events-none select-none drop-shadow-md z-0"
      />

      {/* Shelf Items: Mushroom light, Plant, Duck */}
      {SHELF_ITEMS.map((item) => (
        <DraggableObject key={item.id} item={item} containerRef={containerRef} />
      ))}
    </div>
  );
}

/**
 * Main Desk Station (Image 2)
 * Replaces the "Let's build something MEANINGFUL AND MEMORABLE" banner in the left column.
 */
export function ArrangeDeskStation() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[390px] sm:max-w-[410px] h-[215px] sm:h-[230px] mt-1 sm:mt-2 pointer-events-auto select-none overflow-visible"
      style={{ touchAction: "none" }}
    >
      {/* Standing Desk Surface */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/desk/desk.png"
        alt="Desk"
        draggable={false}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[340px] sm:w-[370px] max-w-full h-auto object-contain pointer-events-none select-none z-0"
      />

      {/* Desk Items: Laptop, Keyboard, Headphones, Penholder, Matcha */}
      {DESK_ITEMS.map((item) => (
        <DraggableObject key={item.id} item={item} containerRef={containerRef} />
      ))}
    </div>
  );
}

/**
 * Provider that coordinates shared sound effects and info panel state
 * between the top-left shelf and the main desk station.
 */
export function ArrangeDeskProvider({ children }: { children: React.ReactNode }) {
  const [activeItem, setActiveItem] = useState<DeskItemData | null>(null);
  const { unlockAudio, playGrab, playDrop } = useDragSounds();

  const selectItem = useCallback((item: DeskItemData) => {
    setActiveItem(item);
  }, []);

  const clearActiveItem = useCallback(() => {
    setActiveItem(null);
  }, []);

  return (
    <ArrangeDeskContext.Provider
      value={{
        activeItem,
        selectItem,
        clearActiveItem,
        playGrab,
        playDrop,
        unlockAudio,
        wobbleEnabled: true,
      }}
    >
      {children}
    </ArrangeDeskContext.Provider>
  );
}
