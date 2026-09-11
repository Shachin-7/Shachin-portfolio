import { useEffect, useRef, useState, type CSSProperties } from "react";

import {
  threeDPaperSource,
  certificateSource,
  japaneseSource,
  siteOfTheYearSource,
} from "./sources";

export type ThreeDPaperVariant = "original" | "site-of-the-year" | "japanese" | "certificate";

export type ProjectData = {
  id?: string;
  title?: string;
  shortLabel?: string;
  category?: string;
  sector?: string;
  embedId?: string;
  thumb?: string;
  videoUrl?: string;
  github?: string;
  tag?: string;
  description?: string;
  year?: string;
};

export type ThreeDPaperProps = {
  className?: string;
  style?: CSSProperties;
  variant?: ThreeDPaperVariant;
  project?: ProjectData | null;
  onClose?: () => void;
};

const sources: Record<ThreeDPaperVariant, string> = {
  original: threeDPaperSource,
  "site-of-the-year": siteOfTheYearSource,
  japanese: japaneseSource,
  certificate: certificateSource,
};

const titles: Record<ThreeDPaperVariant, string> = {
  original: "3D Paper",
  "site-of-the-year": "3D Paper — Site of the Year",
  japanese: "3D Paper — 認定証",
  certificate: "3D Paper — Certificate",
};

export function ThreeDPaper({
  className = "",
  style,
  variant = "original",
  project = null,
  onClose,
}: ThreeDPaperProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [documentVisible, setDocumentVisible] = useState(() => (
    typeof document === "undefined" || !document.hidden
  ));
  const [hostVisible, setHostVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      setHostVisible(entry?.isIntersecting ?? true);
    }, { rootMargin: "80px" });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const update = () => setDocumentVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    if (!onClose) return undefined;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Listen for backdrop close message from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "THREED_PAPER_CLOSE" && onClose) {
        onClose();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onClose]);

  const toggleAudio = () => {
    try {
      const win = iframeRef.current?.contentWindow as any;
      if (win && win.__sheet && typeof win.__sheet.toggleMute === "function") {
        const muted = win.__sheet.toggleMute();
        setIsMuted(muted);
      }
    } catch (e) {
      console.log("Audio toggle:", e);
    }
  };

  const mounted = hostVisible && documentVisible;

  useEffect(() => {
    setReady(false);
  }, [mounted, variant, project]);

  // Prepare source document with injected project data if present
  const baseSource = sources[variant];
  const renderedSource = project
    ? `<script>window.__PROJECT_DATA__ = ${JSON.stringify(project)};</script>\n` + baseSource
    : baseSource;

  return (
    <div
      ref={hostRef}
      className={`threeui-background three-d-paper${className ? ` ${className}` : ""}`}
      role="group"
      aria-label="Interactive translucent 3D paper certificate"
      data-state={!mounted ? "paused" : ready ? "ready" : "loading"}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#08080a",
        pointerEvents: "auto",
        width: "100%",
        height: "100%",
        ...style,
      }}
    >
      {mounted ? (
        <iframe
          ref={iframeRef}
          title={project ? `${project.title} — 3D Paper` : titles[variant]}
          srcDoc={renderedSource}
          sandbox="allow-scripts allow-same-origin"
          loading="eager"
          onLoad={() => setReady(true)}
          style={{
            position: "absolute",
            inset: 0,
            display: "block",
            width: "100%",
            height: "100%",
            border: 0,
            background: "#08080a",
            opacity: ready ? 1 : 0,
            pointerEvents: ready ? "auto" : "none",
            transition: "opacity 240ms ease-out",
          }}
        />
      ) : null}

      {/* Floating HUD overlay when displayed as an interactive project modal */}
      {project && (
        <>
          {/* Top Bar: Sector badge, Title, and Close Button */}
          <div
            style={{
              position: "absolute",
              top: "24px",
              left: "28px",
              right: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: "rgba(12, 13, 16, 0.72)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "32px",
                padding: "8px 18px",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)",
                pointerEvents: "auto",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#34d399",
                }}
              >
                {project.sector || "PROJECT"}
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.25)" }}>|</span>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "rgba(255, 255, 255, 0.92)",
                  letterSpacing: "-0.01em",
                }}
              >
                {project.title}
              </span>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: "rgba(18, 19, 24, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: 500,
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  pointerEvents: "auto",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)";
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.16)";
                  e.currentTarget.style.background = "rgba(18, 19, 24, 0.8)";
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Bottom Bar: Drag hint, Audio control, and External Link */}
          <div
            style={{
              position: "absolute",
              bottom: "24px",
              left: "28px",
              right: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(12, 13, 16, 0.65)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "24px",
                padding: "6px 14px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.45)",
                pointerEvents: "auto",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>Drag</span> to turn ·{" "}
              <span style={{ color: "rgba(255, 255, 255, 0.85)" }}>Hover</span> to light
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                pointerEvents: "auto",
              }}
            >
              {/* Sound toggle button */}
              <button
                type="button"
                onClick={toggleAudio}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  background: "rgba(18, 19, 24, 0.75)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  color: isMuted ? "rgba(255, 255, 255, 0.55)" : "#34d399",
                  padding: "7px 14px",
                  borderRadius: "24px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{isMuted ? "🔇 SOUND OFF" : "🔊 SOUND ON"}</span>
              </button>

              {/* GitHub / Live Link */}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "rgba(255, 255, 255, 0.95)",
                    color: "#08080a",
                    padding: "7px 18px",
                    borderRadius: "24px",
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    boxShadow: "0 4px 18px rgba(255, 255, 255, 0.2)",
                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.04)";
                    e.currentTarget.style.background = "#ffffff";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(255, 255, 255, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
                    e.currentTarget.style.boxShadow = "0 4px 18px rgba(255, 255, 255, 0.2)";
                  }}
                >
                  <span>GITHUB / REPO</span>
                  <span style={{ fontSize: "13px" }}>↗</span>
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
