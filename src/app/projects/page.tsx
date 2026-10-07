"use client";

import React from "react";
import ArtOrbSphere from "@/components/ArtOrbSphere";

export default function ProjectsPage() {
  return (
    <div
      role="region"
      aria-label="3D Projects Sphere Showcase"
      className="w-full h-screen overflow-hidden"
    >
      <ArtOrbSphere />
    </div>
  );
}
