"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./MeetEdithButton.css";

interface MeetEdithButtonProps {
  onClick: () => void;
  text?: string;
}

/**
 * Interactive button with eye-tracking pupil animation for EDITH AI assistant.
 */
export default function MeetEdithButton({
  onClick,
  text = "Meet Edith",
}: MeetEdithButtonProps) {
  const circleRef = useRef<HTMLDivElement>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);

  // Mouse eye-tracking logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!circleRef.current) return;
      const rect = circleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.hypot(dx, dy) / 25, 3.5);

      setPupilPos({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Natural blinking interval
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.button
      className="edith-fab"
      onClick={onClick}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      aria-label="Meet Edith AI Assistant"
    >
      <span className="edith-fab-label">{text}</span>
      <div ref={circleRef} className="edith-fab-circle">
        <div className={`edith-eye ${isBlinking ? "blinking" : ""}`}>
          <div
            className="edith-pupil"
            style={{
              transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
            }}
          />
        </div>
        <div className={`edith-eye ${isBlinking ? "blinking" : ""}`}>
          <div
            className="edith-pupil"
            style={{
              transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
            }}
          />
        </div>
      </div>
    </motion.button>
  );
}
