"use client";

import React from "react";
import LiquidMetalButton from "@/components/LiquidMetalButton";

interface BookCallButtonProps {
  text?: string;
  href?: string;
  className?: string;
}

export default function BookCallButton({
  text = "Book a 15-min talk",
  href = "/contact",
  className = "",
}: BookCallButtonProps) {
  return (
    <LiquidMetalButton
      href={href}
      ariaLabel={text}
      height={54}
      className={className}
    >
      {text}
    </LiquidMetalButton>
  );
}
