# 🃏 Selected Works (MotionTiles 3D Depth Stack) — Copy Guide

A self-contained **3D depth-stacked video tile carousel** with mouse parallax, video card memoization (no restarts), and active text highlighting. Built with **Framer Motion** & **React**.

---

## 📦 Step 1 — Install Dependencies

```bash
npm install framer-motion
```

---

## 🤖 Step 2 — AI Prompt to Implement It

Copy and paste this prompt into any AI coding assistant (Cursor, Claude, ChatGPT, Gemini):

---

> **PROMPT:**
>
> Create a React component called `MotionTiles` for showcasing "Selected Works". It consists of a two-column layout:
>
> 1. **Left Panel (Interactive Paragraph)**:
>    - Shows a section title "SELECTED WORKS" in small uppercase tracking.
>    - Displays a paragraph of text dynamically mapping through project titles.
>    - Hovering over a project title highlights its color to match the project's accent color (and dims non-hovered titles), while simultaneously bringing the corresponding 3D video card to the front of the depth stack.
>    - Clicking a title triggers an `onTileClick(index)` callback.
>
> 2. **Right Panel (GPU-Accelerated 3D Tile Stack)**:
>    - Displays a stack of video cards positioned in 3D space with perspective depth (`transformStyle: preserve-3d`).
>    - Cards are placed along the X and Z axes relative to the center (`xOffset = -itemOffset * 110`, `zOffset = -itemOffset * 120`).
>    - Hovering over a card brings it forward (`zFinal = zOffset - 40`) and gives it a active glow border matching its accent color.
>    - The entire stack performs a smooth 3D tilt responsive to cursor mouse position (`rotateX`, `rotateY`) using Framer Motion `useMotionValue`, `useSpring`, and `useTransform` for 0 React state re-renders on mouse movement.
>    - Video elements are wrapped in `React.memo` with HTML5 `videoRef` persistence so hovering/clicking never restarts playback or unmounts the video element.
>
> 3. **Data Props Structure**:
>    Accepts `tiles` array:
>    ```javascript
>    [
>      {
>        title: "Project Title",
>        tag: "Category · Tech",
>        color: "#6ee7b7",
>        video: "https://res.cloudinary.com/YOUR_CLOUD/video/upload/f_auto,q_auto:eco/v12345/video.mp4"
>      }
>    ]
>    ```
>
> Make the component fully responsive (falling back to a horizontal scrollable row on mobile screens `< 810px`).

---

## 📄 Step 3 — Complete Source Code (`MotionTiles.jsx`)

Save this file as `src/components/MotionTiles.jsx`:

```jsx
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Memoized Video Card component.
 * Keeps HTML5 video element playing continuously without restarting on parent state updates.
 */
const TileVideoCard = React.memo(function TileVideoCard({
  tile,
  index,
  total,
  isActive,
  isMobile,
  onHover,
  onClick,
  getCardTransform,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, []);

  const transform = getCardTransform(index);
  const x = transform?.x || 0;
  const z = transform?.z || 0;
  const scale = transform?.scale || 1;

  return (
    <motion.div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick?.(index)}
      animate={isMobile ? {} : { x, z, scale }}
      transition={{ type: 'spring', stiffness: 100, damping: 18, mass: 0.6 }}
      style={{
        ...styles.card,
        ...(isMobile ? styles.mobileCard : styles.desktopCard),
        zIndex: isActive ? 1000 : 10 + (total - 1 - index),
        boxShadow: isActive
          ? '0 30px 60px rgba(0,0,0,0.65), 0 10px 20px rgba(0,0,0,0.45)'
          : '0 20px 45px rgba(0,0,0,0.4), 0 6px 12px rgba(0,0,0,0.25)',
        border: isActive ? `1.5px solid ${tile.color || '#ffffff'}66` : '1px solid rgba(255,255,255,0.06)',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Loop Video */}
      <video
        ref={videoRef}
        src={tile.video}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        style={styles.cardVideo}
      />

      {/* Cover overlay styling */}
      <div
        style={{
          ...styles.cardOverlay,
          background: isActive
            ? 'linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.85) 100%)'
            : 'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.78) 100%)',
          opacity: isActive ? 1 : 0.85,
          transition: 'all 0.3s ease',
        }}
      >
        <span
          style={{
            ...styles.cardTag,
            color: tile.color || '#ffffff',
          }}
        >
          {tile.tag}
        </span>
        <h4 style={styles.cardTitle}>{tile.title}</h4>
      </div>
    </motion.div>
  );
});

/**
 * MotionTiles component.
 * GPU-accelerated 3D tilt via MotionValues (0 React state re-renders on mouse move).
 */
export default function MotionTiles({ tiles = [], onTileClick }) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Monitor screen size to handle responsiveness dynamically
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 810);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse tracking variables for cursor parallax on desktop
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Smooth springs for tracking mouse coordinates
  const springConfig = { stiffness: 90, damping: 20, mass: 0.5 };
  const smoothX = useSpring(rawMouseX, springConfig);
  const smoothY = useSpring(rawMouseY, springConfig);

  // Derived 3D rotations via MotionValues
  const tiltX = useTransform(smoothY, (v) => (isMobile ? 0 : -30 + v * 8));
  const tiltY = useTransform(smoothX, (v) => (isMobile ? 0 : 40 + v * 10));

  // Rotate container based on mouse move relative to component bounds
  const handleMouseMove = useCallback((e) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    rawMouseX.set(nx);
    rawMouseY.set(ny);
  }, [isMobile, rawMouseX, rawMouseY]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    rawMouseX.set(0);
    rawMouseY.set(0);
    setActiveIndex(null);
  }, [isMobile, rawMouseX, rawMouseY]);

  const handleHover = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  // Symmetrical math helper coordinates for cards placement
  const getCardTransform = useCallback((index) => {
    if (isMobile) return { x: 0, z: 0, scale: 1 };
    const count = tiles.length || 1;
    const mid = (count - 1) / 2;
    const itemOffset = index - mid;

    const xOffset = -itemOffset * 110; 
    const zOffset = -itemOffset * 120; 

    const isActive = activeIndex === index;
    const zFinal = isActive ? zOffset - 40 : zOffset;

    return {
      x: xOffset,
      z: zFinal,
      scale: 1,
    };
  }, [isMobile, tiles.length, activeIndex]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isMobile ? styles.mobileLayout : styles.desktopLayout}
    >
      {/* ── LEFT/TOP PANEL: Text Title and Tag Paragraph ── */}
      <div style={isMobile ? styles.mobileTextCol : styles.desktopTextCol}>
        <h3 style={styles.sectionSubtitle}>Selected Works</h3>
        <p style={styles.paragraph}>
          Delivering end-to-end data value, including:{' '}
          {tiles.map((tile, i) => {
            const isActive = activeIndex === i;
            const isAnyActive = activeIndex !== null;

            // Highlight color transitions
            let textColor = 'rgba(255, 255, 255, 0.4)';
            if (!isAnyActive) {
              textColor = 'rgba(255, 255, 255, 0.85)';
            } else if (isActive) {
              textColor = tile.color || '#ffffff';
            }

            return (
              <React.Fragment key={i}>
                <span
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={() => onTileClick?.(i)}
                  style={{
                    color: textColor,
                    cursor: 'pointer',
                    fontWeight: isActive ? '700' : '600',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    textDecoration: isActive ? 'underline' : 'none',
                    textDecorationColor: tile.color || '#ffffff',
                    textUnderlineOffset: '4px',
                    display: 'inline',
                    fontFamily: 'var(--font-sans, system-ui)',
                  }}
                >
                  {tile.title}
                </span>
                {i < tiles.length - 1 ? (i === tiles.length - 2 ? ', and ' : ', ') : '.'}
              </React.Fragment>
            );
          })}
        </p>
      </div>

      {/* ── RIGHT/BOTTOM PANEL: 3D Depth Stack Container ── */}
      <div style={isMobile ? styles.mobileVideoCol : styles.desktopVideoCol}>
        <motion.div
          style={{
            ...styles.videoScene,
            transformStyle: isMobile ? 'flat' : 'preserve-3d',
            rotateX: tiltX,
            rotateY: tiltY,
            perspective: isMobile ? 'none' : '5000px',
          }}
        >
          {tiles.map((tile, i) => (
            <TileVideoCard
              key={tile.title || i}
              tile={tile}
              index={i}
              total={tiles.length}
              isActive={activeIndex === i}
              isMobile={isMobile}
              onHover={handleHover}
              onClick={onTileClick}
              getCardTransform={getCardTransform}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  desktopLayout: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '1200px',
    maxWidth: '100%',
    height: '680px',
    padding: '25px 0px 0px 0px',
    position: 'relative',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  mobileLayout: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    width: '100%',
    padding: '0 20px',
    boxSizing: 'border-box',
  },

  desktopTextCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    padding: '0px 0px 0px 40px',
    boxSizing: 'border-box',
  },
  mobileTextCol: {
    width: '100%',
    padding: 0,
  },

  sectionSubtitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#8c8c8c',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    marginBottom: '16px',
    margin: 0,
    fontFamily: 'var(--font-sans, system-ui)',
  },
  paragraph: {
    fontSize: 'clamp(1.4rem, 2.3vw, 2.3rem)',
    lineHeight: '1.45',
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
    maxWidth: '1000px',
    fontFamily: 'var(--font-sans, system-ui)',
    letterSpacing: '-0.035em',
    fontWeight: 600,
  },

  desktopVideoCol: {
    width: '350px',
    height: '240px',
    position: 'relative',
    overflow: 'visible',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileVideoCol: {
    width: '100%',
    overflowX: 'auto',
    padding: '10px 0 30px 0',
    WebkitOverflowScrolling: 'touch',
    scrollSnapType: 'x mandatory',
  },

  videoScene: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#111111',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    cursor: 'pointer',
    position: 'absolute',
  },
  desktopCard: {
    width: '460px',
    height: '290px',
    left: '50%',
    top: '50%',
    marginLeft: '-230px',
    marginTop: '-145px',
  },
  mobileCard: {
    width: '285px',
    height: '190px',
    position: 'relative',
    flexShrink: 0,
    scrollSnapAlign: 'center',
  },

  cardVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
  cardOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '24px 28px',
  },
  cardTag: {
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '6px',
    fontFamily: 'var(--font-sans, system-ui)',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
    lineHeight: '1.25',
    fontFamily: 'var(--font-heading, var(--font-sans, system-ui))',
    letterSpacing: '-0.02em',
  },
};
```

---

## ⚡ Step 4 — Example Usage

```jsx
import MotionTiles from './components/MotionTiles';

const sampleTiles = [
  {
    video: 'https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto:eco/v1786970042/Email_automation_epvjww.mp4',
    title: 'SENTRY Network Threat Detection',
    tag: 'Security · ML',
    color: '#6ee7b7',
  },
  {
    video: 'https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto:eco/v1786970151/Threads_20of_20truth_screenrecording_erw4gd.mp4',
    title: 'Threads of Truth Unstructured Data Insights',
    tag: 'NLP · Python',
    color: '#93c5fd',
  },
  {
    video: 'https://res.cloudinary.com/dtvnohrha/video/upload/f_auto,q_auto:eco/v1786970082/Ipayment_run_h71b9w.mp4',
    title: 'Payments & Cashflow Analytics',
    tag: 'Capital One · SQL',
    color: '#fbbf24',
  },
];

export default function App() {
  return (
    <div style={{ backgroundColor: '#000', padding: '100px 0' }}>
      <MotionTiles tiles={sampleTiles} onTileClick={(i) => console.log('Clicked tile:', i)} />
    </div>
  );
}
```
