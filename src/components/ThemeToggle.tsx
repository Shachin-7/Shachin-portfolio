"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

/**
 * Interactive theme toggle component for switching between light and dark modes.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-bg-800 border border-bg-700 text-text-secondary hover:text-highlight hover:border-highlight/30 transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-highlight/40"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <Sun size={18} className="transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon size={18} className="transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
