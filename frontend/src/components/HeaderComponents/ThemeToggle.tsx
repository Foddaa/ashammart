// src/components/ThemeToggle.tsx

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme" className="centering w-10 h-10 rounded-full hover:bg-hover">
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}