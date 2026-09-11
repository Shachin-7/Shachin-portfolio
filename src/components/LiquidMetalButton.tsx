"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { mountLiquidMetal } from "./liquidMetalShader";

export interface LiquidMetalButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  buttonClassName?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  height?: number;
  disabled?: boolean;
}

export function DefaultMenuIcon({ className = "ico" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 115 115" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="11" strokeLinecap="round">
        <path d="M14 34.5 H101" />
        <path d="M14 57.5 H101" />
        <path d="M14 80.5 H68" />
      </g>
    </svg>
  );
}

export default function LiquidMetalButton({
  children = "Explore the work",
  icon,
  href,
  onClick,
  type = "button",
  className = "",
  buttonClassName = "",
  style,
  target,
  rel,
  ariaLabel,
  height = 54,
  disabled = false,
}: LiquidMetalButtonProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stageRef.current) return;
    const cleanup = mountLiquidMetal(stageRef.current);
    return cleanup;
  }, []);

  const content = (
    <>
      {icon !== undefined ? (
        icon ? (
          <span className="ico flex items-center justify-center shrink-0">
            {icon}
          </span>
        ) : null
      ) : (
        <DefaultMenuIcon className="ico" />
      )}
      <span className="lbl">{children}</span>
    </>
  );

  return (
    <div
      ref={stageRef}
      className={`liquid-stage ${className}`}
      style={
        {
          "--h": `${height}px`,
          ...style,
        } as React.CSSProperties
      }
      data-liquid-metal="explore"
    >
      <div className="liquid-plate" aria-hidden="true" />
      <canvas className="liquid-fx" aria-hidden="true" />

      {href ? (
        href.startsWith("http") || target === "_blank" ? (
          <a
            href={href}
            target={target}
            rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
            aria-label={ariaLabel}
            onClick={onClick}
            className={`liquid-button liquid-button--explore ${buttonClassName}`}
          >
            {content}
          </a>
        ) : (
          <Link
            href={href}
            aria-label={ariaLabel}
            onClick={onClick}
            className={`liquid-button liquid-button--explore ${buttonClassName}`}
          >
            {content}
          </Link>
        )
      ) : (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel}
          className={`liquid-button liquid-button--explore ${buttonClassName}`}
        >
          {content}
        </button>
      )}
    </div>
  );
}
