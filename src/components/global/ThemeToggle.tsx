"use client";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    setTheme(theme === "light" ? "dark" : theme === "dark" ? "system" : "light");
  };

  const label =
    theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System";

  const icon =
    theme === "light" ? "light_mode" : theme === "dark" ? "dark_mode" : "settings_brightness";

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${label}`}
      title={`Motyw: ${label} (kliknij, aby zmienić)`}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur cursor-pointer"
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="text-sm">{label}</span>
    </button>
  );
}
