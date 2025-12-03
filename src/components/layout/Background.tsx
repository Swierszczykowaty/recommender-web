"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeMode } from "@/lib/themeStore";

const colorConfig = {
  default: [
    "rgba(56, 189, 248, 0.35)", // turkusowy błękit
    "rgba(139, 92, 246, 0.30)", // fiolet
    "rgba(236, 72, 153, 0.28)", // magenta / róż
    "rgba(14, 165, 233, 0.25)", // jasny błękit
    "rgba(30, 41, 59, 0.30)", // ciemny granat (kontrast / tło)
  ],
  "/movies": [
    "rgba(30, 58, 138, 0.30)", // indigo-900 (ciemny błękit, tło)
    "rgba(37, 99, 235, 0.28)", // blue-600
    "rgba(56, 189, 248, 0.26)", // sky-400
    "rgba(253, 224, 71, 0.28)", // yellow-300 (jasny, świecący żółty)
    "rgba(245, 158, 11, 0.25)", // amber-500 (cieplejszy złoty)
  ],
  "/recommender": [
    "rgba(244, 114, 182, 0.30)", // pink-400
    "rgba(236, 72, 153, 0.28)", // pink-500
    "rgba(236, 72, 153, 0.28)", // pink-500
    "rgba(139, 92, 246, 0.29)", // violet-500
    "rgba(251, 191, 36, 0.25)", // amber-400 (ciepły błysk, kontrapunkt)
  ],
  "/about": [
    "rgba(34, 197, 94, 0.26)", // green-500
    "rgba(20, 184, 166, 0.22)", // teal-500
    "rgba(234, 179, 8, 0.24)", // amber-500
    "rgba(14, 165, 233, 0.28)", // sky-500
    "rgba(2, 6, 23, 0.34)", // slate-950 (ciemny bind)
  ],
  "/rankings": [
    "rgba(253, 164, 175, 0.30)", // rose-300
    "rgba(251, 113, 133, 0.28)", // rose-400
    "rgba(244, 63, 94, 0.26)", // rose-500
    "rgba(225, 29, 72, 0.24)", // rose-600
    "rgba(139, 92, 246, 0.22)", // violet-500
  ],
};

type ColorConfig = typeof colorConfig;

const lightColorConfig: ColorConfig = {
  default: [
    "rgba(248, 250, 252, 1)", // slate-50
    "rgba(191, 219, 254, 1)", // sky-200
    "rgba(254, 226, 226, 1)", // rose-100
    "rgba(221, 214, 254, 1)", // indigo-100
    "rgba(148, 163, 184, 1)", // slate-400
  ],
  "/movies": [
    "rgba(236, 254, 255, 1)", // cyan-50
    "rgba(191, 219, 254, 1)", // blue-200
    "rgba(165, 243, 252, 1)", // cyan-200
    "rgba(254, 249, 195, 1)", // yellow-100
    "rgba(245, 208, 254, 1)", // fiolet pastelowy
  ],
  "/recommender": [
    "rgba(254, 240, 250, 1)", // pink-50
    "rgba(252, 231, 243, 1)", // pink-100
    "rgba(233, 213, 255, 1)", // violet-200
    "rgba(219, 234, 254, 1)", // sky-100
    "rgba(251, 213, 141, 1)", // amber pastel
  ],
  "/about": [
    "rgba(240, 253, 244, 1)", // green-50
    "rgba(236, 253, 245, 1)", // emerald-50
    "rgba(254, 252, 232, 1)", // amber-50
    "rgba(224, 245, 255, 1)", // sky-50
    "rgba(148, 163, 184, 1)", // slate-400
  ],
  "/rankings": [
    "rgba(255, 241, 242, 1)", // rose-50
    "rgba(254, 228, 226, 1)", // rose-100
    "rgba(254, 215, 226, 1)", // pink-100
    "rgba(233, 213, 255, 1)", // violet-200
    "rgba(186, 230, 253, 1)", // sky-200
  ],
};

function buildMesh() {
  return [
    `radial-gradient(60% 50% at 15% 25%, var(--c0) 0%, transparent 90%)`,
    `radial-gradient(55% 45% at 85% 30%, var(--c1) 0%, transparent 80%)`,
    `radial-gradient(70% 60% at 50% 85%, var(--c2) 0%, transparent 100%)`,
    `radial-gradient(65% 55% at 25% 80%, var(--c3) 0%, transparent 70%)`,
    `radial-gradient(55% 55% at 75% 10%, var(--c4) 0%, transparent 80%)`,
  ].join(", ");
}

export default function AnimatedBackground({
  dynamicColors,
  mode = "dark",
}: {
  dynamicColors?: string[];
  mode?: ThemeMode;
}) {
  const pathname = usePathname();

  const colors = useMemo(() => {
    if (Array.isArray(dynamicColors) && dynamicColors.length >= 5)
      return dynamicColors;
    const basePath = "/" + pathname.split("/")[1];
    const palette: ColorConfig =
      mode === "light" ? lightColorConfig : colorConfig;
    return Array.from(
      palette[basePath as keyof ColorConfig] ?? palette.default
    );
  }, [pathname, dynamicColors, mode]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        animate={{
          "--c0": colors[0],
          "--c1": colors[1],
          "--c2": colors[2],
          "--c3": colors[3],
          "--c4": colors[4],
          backgroundPosition: ["0% 0%", "18% 22%", "0% 0%"],
          backgroundSize: ["120% 120%", "135% 135%", "120% 120%"],
        }}
        transition={{
          "--c0": { duration: 1, ease: "easeInOut" },
          "--c1": { duration: 1, ease: "easeInOut" },
          "--c2": { duration: 1, ease: "easeInOut" },
          "--c3": { duration: 1, ease: "easeInOut" },
          "--c4": { duration: 1, ease: "easeInOut" },
          backgroundPosition: { duration: 22, ease: "easeInOut",  repeat: Infinity, },
          backgroundSize: { duration: 10, ease: "easeInOut", repeat: Infinity },
        }}
        style={{
          backgroundImage: buildMesh(),
          backgroundRepeat: "no-repeat",
          backgroundSize: "120% 120%",
          backgroundPosition: "0% 0%",
        }}
      />
    </AnimatePresence>
  );
}
