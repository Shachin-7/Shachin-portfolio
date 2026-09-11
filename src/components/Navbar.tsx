"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import { socialLinks } from "@/data/portfolio";
import LiquidMetalButton from "@/components/LiquidMetalButton";

/**
 * Isolated Interactive Dock Navigation Bar
 * - Long left-to-right filled navbar when at the top.
 * - Minimizes into a centered floating dock capsule when scrolled.
 * - Displays "SHA" brand mark tile instead of the tree icon.
 * - Magnetic proximity magnification and dynamic specular rim conic lighting.
 */
export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/projects") {
    return null;
  }

  return <InteractiveDockNav pathname={pathname} />;
}

function InteractiveDockNav({ pathname }: { pathname: string }) {
  const dockRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const root = dockRef.current;
    if (!root) return;

    let animId = 0;
    let lastTick = 0;

    const isReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function clamp01(x: number) {
      return x < 0 ? 0 : x > 1 ? 1 : x;
    }
    function fineHover() {
      return (
        !isReduced &&
        typeof window !== "undefined" &&
        window.matchMedia("(hover:hover) and (pointer:fine)").matches
      );
    }

    interface DockItemState {
      el: HTMLElement;
      w: number;
      h: number;
      v: number;
      vel: number;
      target: number;
    }

    interface SpecItemState {
      el: HTMLElement;
      ang: number;
      tAng: number;
      br: number;
      tBr: number;
      focused: boolean;
      reach: number;
    }

    const DOCK: {
      root: HTMLElement | null;
      items: DockItemState[];
      on: boolean;
      live: boolean;
      key: boolean;
      dirty: boolean;
      u: number;
    } = {
      root,
      items: [],
      on: false,
      live: false,
      key: false,
      dirty: false,
      u: 1,
    };

    const SPEC: {
      items: SpecItemState[];
      on: boolean;
      dirty: boolean;
    } = {
      items: [],
      on: false,
      dirty: false,
    };

    let aimX = 0,
      aimY = 0,
      aimSeen = false,
      aimMoved = false;

    function measureDock() {
      if (!DOCK.root) return;
      DOCK.on = fineHover();
      const stageW = window.innerWidth;
      const isNarrow = stageW <= 900;
      DOCK.u = Math.min(1.2, Math.max(0.7, stageW / (isNarrow ? 760 : 1600)));

      for (let i = 0; i < DOCK.items.length; i++) {
        const st = DOCK.items[i];
        st.el.style.width = st.el.style.height = st.el.style.transform = "";
        st.el.dataset.near = "false";
        st.v = st.vel = st.target = 0;
      }
      for (let i = 0; i < DOCK.items.length; i++) {
        const r = DOCK.items[i].el.getBoundingClientRect();
        DOCK.items[i].w = r.width;
        DOCK.items[i].h = r.height;
      }
      DOCK.live = false;
      DOCK.dirty = true;
      aimMoved = aimSeen;
    }

    function dockRest() {
      DOCK.live = false;
      DOCK.dirty = true;
      for (let i = 0; i < DOCK.items.length; i++) {
        DOCK.items[i].target = 0;
        DOCK.items[i].el.dataset.near = "false";
        DOCK.items[i].el.style.width = "";
        DOCK.items[i].el.style.height = "";
        DOCK.items[i].el.style.transform = "";
      }
    }

    function drawDock(dt: number) {
      if (!DOCK.root || !DOCK.on) return;

      if (aimSeen && aimMoved && !DOCK.key) {
        const rr = DOCK.root.getBoundingClientRect();
        if (
          aimX > rr.left - 48 &&
          aimX < rr.right + 48 &&
          aimY > rr.top - 44 &&
          aimY < rr.bottom + 104
        ) {
          for (let i = 0; i < DOCK.items.length; i++) {
            const st = DOCK.items[i],
              r = st.el.getBoundingClientRect();
            const prox = clamp01(
              1 - Math.abs(aimX - (r.left + r.width * 0.5)) / (128 * DOCK.u)
            );
            st.target = prox * prox * (3 - 2 * prox);
            st.el.dataset.near = st.target > 0.08 ? "true" : "false";
          }
          DOCK.live = true;
          DOCK.dirty = true;
        } else if (DOCK.live) dockRest();
      }

      if (!DOCK.dirty) return;
      let moving = false;
      for (let i = 0; i < DOCK.items.length; i++) {
        const st = DOCK.items[i];
        st.vel += (st.target - st.v) * 190 * dt;
        st.vel *= Math.exp(-23 * dt);
        st.v += st.vel * dt;
        if (Math.abs(st.target - st.v) < 0.001 && Math.abs(st.vel) < 0.004) {
          st.v = st.target;
          st.vel = 0;
        } else moving = true;

        const v = Math.min(Math.max(st.v, 0), 1.08);
        if (v > 0.005) {
          const isMark = st.el.classList.contains("dock-brand");
          const ew = isMark ? 14 * DOCK.u : Math.min(18 * DOCK.u, st.w * 0.24);
          const eh = isMark ? 14 * DOCK.u : 16 * DOCK.u;
          st.el.style.width = (st.w + ew * v).toFixed(2) + "px";
          st.el.style.height = (st.h + eh * v).toFixed(2) + "px";
          st.el.style.transform =
            "translateY(" + (v * 3.5 * DOCK.u).toFixed(2) + "px)";
        } else {
          st.el.style.width = "";
          st.el.style.height = "";
          st.el.style.transform = "";
        }
      }
      if (!moving) DOCK.dirty = false;
    }

    function drawSpec(dt: number) {
      if (!SPEC.on) return;

      if (aimSeen && aimMoved) {
        for (let i = 0; i < SPEC.items.length; i++) {
          const st = SPEC.items[i],
            r = st.el.getBoundingClientRect();
          const cx = r.left + r.width * 0.5,
            cy = r.top + r.height * 0.5;
          const dx = Math.max(r.left - aimX, 0, aimX - r.right);
          const dy = Math.max(r.top - aimY, 0, aimY - r.bottom);
          const d = Math.sqrt(dx * dx + dy * dy);

          st.tAng =
            d === 0
              ? Math.atan2(2 / Math.max(r.height, 1), -2 / Math.max(r.width, 1)) +
                ((aimX - cx) / Math.max(r.width * 0.5, 1)) * 0.3 +
                ((cy - aimY) / Math.max(r.height * 0.5, 1)) * 0.15
              : Math.atan2(cy - aimY, aimX - cx);
          const raw = clamp01(1 - d / (st.reach * DOCK.u));
          st.tBr = Math.max(raw * raw * (3 - 2 * raw), st.focused ? 0.9 : 0);
        }
        SPEC.dirty = true;
      }

      if (!SPEC.dirty) return;
      let moving = false;
      for (let i = 0; i < SPEC.items.length; i++) {
        const st = SPEC.items[i];
        const diff =
          ((st.tAng - st.ang + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        st.ang += diff * (1 - Math.exp(-dt * 8));
        st.br += (st.tBr - st.br) * (1 - Math.exp(-dt * 9));
        if (Math.abs(diff) < 0.001 && Math.abs(st.tBr - st.br) < 0.002) {
          st.ang = st.tAng;
          st.br = st.tBr;
        } else moving = true;
        st.el.style.setProperty("--spec-angle", st.ang.toFixed(4) + "rad");
        st.el.style.setProperty(
          "--spec-bright",
          (clamp01(st.br) * 0.92).toFixed(3)
        );
      }
      if (!moving) SPEC.dirty = false;
    }

    DOCK.items = Array.from(root.querySelectorAll<HTMLElement>("[data-dock]")).map(
      (el) => ({ el, w: 0, h: 0, v: 0, vel: 0, target: 0 })
    );

    const specElements = Array.from(
      root.parentElement?.querySelectorAll<HTMLElement>("[data-spec]") || []
    );
    SPEC.items = specElements.map((el) => ({
      el,
      ang: 2.4,
      tAng: 2.4,
      br: 0,
      tBr: 0,
      focused: false,
      reach: el.classList.contains("dock-bar") ? 250 : 185,
    }));
    SPEC.on = fineHover();

    measureDock();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measureDock);
    }

    window.addEventListener("resize", measureDock);

    const onPointerMove = (e: PointerEvent) => {
      aimX = e.clientX;
      aimY = e.clientY;
      aimSeen = true;
      aimMoved = true;
    };
    const onPointerLeave = () => {
      aimSeen = false;
      dockRest();
      for (let i = 0; i < SPEC.items.length; i++) {
        if (!SPEC.items[i].focused) SPEC.items[i].tBr = 0;
      }
      SPEC.dirty = true;
    };
    const onFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !DOCK.on) return;
      const idx = DOCK.items.findIndex((item) => item.el === target);
      if (idx === -1) return;
      DOCK.items.forEach((item, i) => {
        item.target = i === idx ? 1 : 0;
        item.el.dataset.near = i === idx ? "true" : "false";
      });
      DOCK.live = false;
      DOCK.key = true;
      DOCK.dirty = true;
    };
    const onFocusOut = () => {
      requestAnimationFrame(() => {
        if (!root.contains(document.activeElement)) {
          DOCK.key = false;
          dockRest();
        }
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);
    root.addEventListener("focusin", onFocusIn);
    root.addEventListener("focusout", onFocusOut);

    const specListeners: {
      el: HTMLElement;
      onIn: () => void;
      onOut: () => void;
    }[] = [];
    for (let i = 0; i < SPEC.items.length; i++) {
      const st = SPEC.items[i];
      const onIn = () => {
        st.focused = true;
        SPEC.dirty = true;
      };
      const onOut = () => {
        st.focused = false;
        SPEC.dirty = true;
      };
      st.el.addEventListener("focusin", onIn);
      st.el.addEventListener("focusout", onOut);
      specListeners.push({ el: st.el, onIn, onOut });
    }

    function tick(now: number) {
      const dtUI = lastTick ? Math.min((now - lastTick) / 1000, 0.05) : 0.016;
      lastTick = now;

      drawDock(dtUI);
      drawSpec(dtUI);
      aimMoved = false;

      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);

    const settleTimer = setTimeout(() => {
      measureDock();
    }, 520);

    return () => {
      clearTimeout(settleTimer);
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", measureDock);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      root.removeEventListener("focusin", onFocusIn);
      root.removeEventListener("focusout", onFocusOut);
      specListeners.forEach(({ el, onIn, onOut }) => {
        el.removeEventListener("focusin", onIn);
        el.removeEventListener("focusout", onOut);
      });
    };
  }, [pathname, scrolled]);

  return (
    <header className="dock-header-wrap" aria-label="Main Navigation">
      <nav
        ref={dockRef}
        className={`dock-bar ${scrolled ? "is-scrolled" : "is-top"}`}
        data-spec
        aria-label="Primary"
      >
        {/* Left: Brand / SHA Mark */}
        <Link
          href="/"
          className={`dock-brand ${scrolled ? "as-dock-tile" : "as-logo"}`}
          data-dock
          data-spec
          aria-label="Home"
        >
          <span>SHA</span>
        </Link>

        {/* Left Spring Spacer */}
        <div className="dock-spring-spacer" aria-hidden="true" />

        {/* Center: Main Nav Links */}
        <div className="dock-nav-group">
          {/* Home */}
          <Link
            href="/"
            className={`dock-item ${pathname === "/" ? "is-active" : ""}`}
            data-dock
            data-spec
          >
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M2.5 7.5L8 3l5.5 4.5V13a1 1 0 0 1-1 1h-3.5v-3.5h-2V14H3.5a1 1 0 0 1-1-1V7.5z" />
              </svg>
            </span>
            <span>Home</span>
          </Link>

          {/* About */}
          <Link
            href="/about"
            className={`dock-item ${pathname === "/about" ? "is-active" : ""}`}
            data-dock
            data-spec
          >
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M8 14V9" />
                <path d="M8 9c0-2.4 1.7-4.3 4-4.3.2 2.6-1.6 4.6-4 4.3Z" />
                <path d="M8 10.5C7.9 8.4 6.4 6.8 4.4 6.8 4.3 8.9 5.9 10.6 8 10.5Z" />
              </svg>
            </span>
            <span>About</span>
          </Link>

          {/* Projects */}
          <Link
            href="/projects"
            className={`dock-item ${pathname === "/projects" ? "is-active" : ""}`}
            data-dock
            data-spec
          >
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M1.6 12.4c2.4-3.4 4.3-5.1 5.7-5.1 2 0 3 3.6 5 3.6 1.1 0 1.9-.5 2.4-1.4" />
                <path d="M4.3 6.2C5.5 4.4 6.6 3.5 7.6 3.5c1.5 0 2.2 2.4 3.7 2.4" />
              </svg>
            </span>
            <span>Projects</span>
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className={`dock-item ${pathname === "/contact" ? "is-active" : ""}`}
            data-dock
            data-spec
          >
            <span className="glyph" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="M6.6 2.5h5.1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6.6" />
                <path d="M2.6 8h6.6" />
                <path d="m7 5.6 2.4 2.4L7 10.4" />
              </svg>
            </span>
            <span>Contact</span>
          </Link>
        </div>

        {/* Right Spring Spacer */}
        <div className="dock-spring-spacer" aria-hidden="true" />

        {/* Right: Resume Action */}
        <a
          href={socialLinks.resume}
          target="_blank"
          rel="noopener noreferrer"
          className={`dock-resume ${scrolled ? "as-dock-tile" : "as-button"}`}
          data-dock
          data-spec
          aria-label="Resume"
        >
          <span className="glyph" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="M4 2.5h5.5l3.5 3.5V13.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1z" />
              <path d="M9.5 2.5v3.5h3.5" />
              <path d="M5.5 8h5" />
              <path d="M5.5 10.5h5" />
            </svg>
          </span>
          <span>Resume</span>
        </a>
      </nav>
    </header>
  );
}
