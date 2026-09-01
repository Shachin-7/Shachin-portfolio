"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProjectsError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Projects page error:", error);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "24px", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Something went wrong loading projects.</p>
      <div style={{ display: "flex", gap: "12px" }}>
        <button onClick={reset} style={{ padding: "10px 24px", background: "#fff", color: "#000", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
          Try Again
        </button>
        <Link href="/" style={{ padding: "10px 24px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
          Go Home
        </Link>
      </div>
    </div>
  );
}
