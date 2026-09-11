"use client";

import React, { useRef, useEffect, useMemo, useCallback } from "react";

export interface AsciiPixelsProps {
  videoFile?: string;
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  contrast?: number;
  charSet?: string;
  backgroundColor?: string;
  textColor?: string;
  useCustomTextColor?: boolean;
  resolutionWidth?: number;
  resolutionHeight?: number;
  fitMode?: "cover" | "contain" | "fill" | "scale-down" | "none";
  className?: string;
}

export default function AsciiPixels({
  videoFile = "",
  muted = true,
  loop = true,
  autoPlay = true,
  contrast = 2.4,
  charSet = " .:-=+*#%@0123456789us?!",
  backgroundColor = "#ffffff",
  textColor = "#111111",
  useCustomTextColor = false,
  resolutionWidth = 150,
  resolutionHeight = 85,
  fitMode = "cover",
  className = "",
}: AsciiPixelsProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const visibleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Mouse interaction state
  const mouseRef = useRef({ x: 0.65, y: 0.45, targetX: 0.65, targetY: 0.45 });

  const chars = useMemo(() => charSet.split(""), [charSet]);

  const colorCache = useMemo(() => {
    const cache = new Array(256);
    for (let i = 0; i < 256; i++) {
      // For white background: map high brightness to dark characters, low brightness to empty/light
      const val = Math.floor((1 - i / 255) * 230);
      cache[i] = `rgb(${val},${val},${val})`;
    }
    return cache;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseRef.current.targetX = Math.max(0.1, Math.min(0.9, x));
    mouseRef.current.targetY = Math.max(0.1, Math.min(0.9, y));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const video = videoRef.current;
    const hiddenCanvas = hiddenCanvasRef.current;
    const visibleCanvas = visibleCanvasRef.current;
    const container = containerRef.current;

    if (!hiddenCanvas || !visibleCanvas || !container) return;

    const hCtx = hiddenCanvas.getContext("2d", { willReadFrequently: true });
    const vCtx = visibleCanvas.getContext("2d");
    if (!hCtx || !vCtx) return;

    hiddenCanvas.width = resolutionWidth;
    hiddenCanvas.height = resolutionHeight;

    const resizeVisibleCanvas = () => {
      const rect = container.getBoundingClientRect();
      visibleCanvas.width = Math.floor(rect.width);
      visibleCanvas.height = Math.floor(rect.height);
    };

    resizeVisibleCanvas();
    const resizeObserver = new ResizeObserver(() => resizeVisibleCanvas());
    resizeObserver.observe(container);

    let time = 0;

    const renderAscii = () => {
      time += 0.025;

      // Smooth lerp mouse position
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      vCtx.fillStyle = backgroundColor;
      vCtx.fillRect(0, 0, visibleCanvas.width, visibleCanvas.height);

      let renderWidth = visibleCanvas.width;
      let renderHeight = visibleCanvas.height;
      let renderX = 0;
      let renderY = 0;

      const hasVideo = video && videoFile && video.readyState >= 2;

      if (hasVideo && video) {
        const vWidth = video.videoWidth || resolutionWidth;
        const vHeight = video.videoHeight || resolutionHeight;
        const containerRatio = visibleCanvas.width / visibleCanvas.height;
        const videoRatio = vWidth / vHeight;

        if (fitMode === "cover") {
          if (videoRatio > containerRatio) {
            renderWidth = visibleCanvas.height * videoRatio;
            renderX = (visibleCanvas.width - renderWidth) / 2;
          } else {
            renderHeight = visibleCanvas.width / videoRatio;
            renderY = (visibleCanvas.height - renderHeight) / 2;
          }
        }
        hCtx.drawImage(video, 0, 0, resolutionWidth, resolutionHeight);
      } else {
        // Render Interactive Sunflower/Daisy Texture (Matching Image 2)
        const w = resolutionWidth;
        const h = resolutionHeight;

        // Clear offscreen canvas with white background
        hCtx.fillStyle = "#ffffff";
        hCtx.fillRect(0, 0, w, h);

        // 1. Left side vertical ASCII columns (matching Image 2 left grid)
        for (let col = 0; col < Math.floor(w * 0.4); col += 2) {
          const colIntensity = Math.sin(col * 0.2 + time) * 30 + 40;
          hCtx.fillStyle = `rgb(${255 - colIntensity},${255 - colIntensity},${255 - colIntensity})`;
          hCtx.fillRect(col, 0, 1.2, h);
        }

        // 2. Interactive Flower Placement
        // Flower center responds smoothly to mouse X & Y
        const mouseX = mouseRef.current.x;
        const mouseY = mouseRef.current.y;

        const baseCx = w * 0.65;
        const baseCy = h * 0.44;
        const cx = baseCx + (mouseX - 0.5) * (w * 0.25);
        const cy = baseCy + (mouseY - 0.5) * (h * 0.2);

        const stemSway = (mouseX - 0.5) * 30;
        const headAngle = (mouseX - 0.5) * 0.4 + Math.sin(time * 0.8) * 0.05;

        // 3. Draw Stem
        hCtx.beginPath();
        hCtx.moveTo(cx - 2, cy + 12);
        hCtx.quadraticCurveTo(cx - 15 + stemSway, cy + h * 0.4, cx - 8 + stemSway * 0.5, h);
        hCtx.strokeStyle = "#000000";
        hCtx.lineWidth = 4;
        hCtx.stroke();

        // 4. Draw Leaves along Stem
        const leafY1 = cy + 26;
        const leafY2 = cy + 38;

        // Right Leaf
        hCtx.beginPath();
        hCtx.ellipse(cx + 8 + stemSway * 0.3, leafY1, 16, 6, Math.PI / 4, 0, Math.PI * 2);
        hCtx.fillStyle = "#222222";
        hCtx.fill();

        // Left Leaf
        hCtx.beginPath();
        hCtx.ellipse(cx - 18 + stemSway * 0.4, leafY2, 14, 5, -Math.PI / 3, 0, Math.PI * 2);
        hCtx.fillStyle = "#222222";
        hCtx.fill();

        // 5. Draw Sunflower Petals (Matching Image 2 daisy/sunflower petals)
        const numPetals = 20;
        const petalLength = 28 + Math.sin(time * 1.2) * 2;
        const petalWidth = 9;

        hCtx.save();
        hCtx.translate(cx, cy);
        hCtx.rotate(headAngle);

        for (let i = 0; i < numPetals; i++) {
          const angle = (i / numPetals) * Math.PI * 2 + Math.sin(time * 0.5) * 0.03;
          const currentLength = petalLength * (1 + 0.15 * Math.sin(angle * 4 + time * 0.8));

          hCtx.save();
          hCtx.rotate(angle);

          // Petal shape
          hCtx.beginPath();
          hCtx.moveTo(0, 0);
          hCtx.bezierCurveTo(
            currentLength * 0.3,
            -petalWidth * 0.6,
            currentLength * 0.7,
            -petalWidth * 0.5,
            currentLength,
            0
          );
          hCtx.bezierCurveTo(
            currentLength * 0.7,
            petalWidth * 0.5,
            currentLength * 0.3,
            petalWidth * 0.6,
            0,
            0
          );

          const grad = hCtx.createLinearGradient(0, 0, currentLength, 0);
          grad.addColorStop(0, "#000000");
          grad.addColorStop(0.65, "#1a1a1a");
          grad.addColorStop(1, "rgba(255, 255, 255, 0)");

          hCtx.fillStyle = grad;
          hCtx.fill();

          // Petal inner contour lines
          hCtx.strokeStyle = "#444444";
          hCtx.lineWidth = 1;
          hCtx.stroke();

          hCtx.restore();
        }

        // Inner Core / Pistil of Sunflower
        const coreGrad = hCtx.createRadialGradient(0, 0, 0, 0, 0, 11);
        coreGrad.addColorStop(0, "#000000");
        coreGrad.addColorStop(0.7, "#222222");
        coreGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

        hCtx.beginPath();
        hCtx.arc(0, 0, 11, 0, Math.PI * 2);
        hCtx.fillStyle = coreGrad;
        hCtx.fill();

        hCtx.restore();
      }

      try {
        const imgData = hCtx.getImageData(
          0,
          0,
          resolutionWidth,
          resolutionHeight
        );
        const data = imgData.data;

        const cellWidth = renderWidth / resolutionWidth;
        const cellHeight = renderHeight / resolutionHeight;
        const fontSize = Math.min(cellWidth * 1.5, cellHeight * 1.5);

        vCtx.font = `bold ${fontSize}px 'Courier New', Courier, monospace`;
        vCtx.textAlign = "center";
        vCtx.textBaseline = "middle";

        const charsLenMinusOne = chars.length - 1;
        const vCanvasWidth = visibleCanvas.width;
        const vCanvasHeight = visibleCanvas.height;

        for (let y = 0; y < resolutionHeight; y++) {
          const posY = renderY + y * cellHeight + cellHeight / 2;
          if (posY < 0 || posY > vCanvasHeight) continue;

          const rowOffset = y * resolutionWidth;

          for (let x = 0; x < resolutionWidth; x++) {
            const posX = renderX + x * cellWidth + cellWidth / 2;
            if (posX < 0 || posX > vCanvasWidth) continue;

            const idx = (rowOffset + x) * 4;
            // Dark pixels on white background = high darkness = dense ASCII character
            let lightness =
              0.2126 * data[idx] +
              0.7152 * data[idx + 1] +
              0.0722 * data[idx + 2];

            // Invert lightness so dark pixels map to high character index
            let darkness = 255 - lightness;

            if (contrast !== 1) {
              darkness = ((darkness / 255 - 0.5) * contrast + 0.5) * 255;
              if (darkness < 0) darkness = 0;
              if (darkness > 255) darkness = 255;
            }

            const charIdx = Math.floor((darkness / 255) * charsLenMinusOne);
            const char = chars[charIdx] || " ";

            if (char !== " ") {
              vCtx.fillStyle = useCustomTextColor
                ? textColor
                : colorCache[Math.floor(darkness)] || textColor;
              vCtx.fillText(char, posX, posY);
            }
          }
        }
      } catch (e) {
        console.error("Frame processing error:", e);
      }

      requestRef.current = requestAnimationFrame(renderAscii);
    };

    requestRef.current = requestAnimationFrame(renderAscii);

    return () => {
      resizeObserver.disconnect();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [
    resolutionWidth,
    resolutionHeight,
    chars,
    contrast,
    videoFile,
    backgroundColor,
    textColor,
    useCustomTextColor,
    fitMode,
    colorCache,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      {videoFile ? (
        <video
          ref={videoRef}
          src={videoFile}
          muted={muted}
          loop={loop}
          autoPlay={autoPlay}
          playsInline
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            opacity: 0,
            pointerEvents: "none",
          }}
        />
      ) : null}
      <canvas
        ref={hiddenCanvasRef}
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          opacity: 0,
          pointerEvents: "none",
        }}
      />
      <canvas
        ref={visibleCanvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
