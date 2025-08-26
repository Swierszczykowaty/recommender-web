"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const colorConfig = {
default: [
  "rgba(56, 189, 248, 0.35)", // turkusowy błękit
  "rgba(139, 92, 246, 0.30)", // fiolet
  "rgba(236, 72, 153, 0.28)", // magenta / róż
  "rgba(14, 165, 233, 0.25)", // jasny błękit
  "rgba(30, 41, 59, 0.30)",   // ciemny granat (kontrast / tło)
],
  "/movies": [
  "rgba(14, 165, 233, 0.28)",  // sky-500
  "rgba(2, 132, 199, 0.26)",   // sky-600
  "rgba(52, 211, 153, 0.20)",  // emerald-400
  "rgba(99, 102, 241, 0.20)",  // indigo-500
  "rgba(52, 211, 153, 0.20)",  // emerald-400
  ],
  "/recommender": [
  "rgba(244, 114, 182, 0.30)", // pink-400
  "rgba(236, 72, 153, 0.28)",  // pink-500
  "rgba(236, 72, 153, 0.28)",  // pink-500
  "rgba(139, 92, 246, 0.29)",  // violet-500
  "rgba(251, 191, 36, 0.25)",  // amber-400 (ciepły błysk, kontrapunkt)
  ],
  "/about": [
  "rgba(34, 197, 94, 0.26)",   // green-500
  "rgba(20, 184, 166, 0.22)",  // teal-500
  "rgba(234, 179, 8, 0.24)",   // amber-500
  "rgba(14, 165, 233, 0.28)",  // sky-500
  "rgba(2, 6, 23, 0.34)",      // slate-950 (ciemny bind)
  ],
  "/rankings": [
  "rgba(253, 164, 175, 0.30)", // rose-300
  "rgba(251, 113, 133, 0.28)", // rose-400
  "rgba(244, 63, 94, 0.26)",   // rose-500
  "rgba(225, 29, 72, 0.24)",   // rose-600
  "rgba(139, 92, 246, 0.22)",  // violet-500
  ],
} as const;

function buildMesh() {
  return [
    `radial-gradient(60% 50% at 15% 25%, var(--c0) 0%, transparent 90%)`,
    `radial-gradient(55% 45% at 85% 30%, var(--c1) 0%, transparent 80%)`,
    `radial-gradient(70% 60% at 50% 85%, var(--c2) 0%, transparent 100%)`,
    `radial-gradient(65% 55% at 25% 80%, var(--c3) 0%, transparent 70%)`,
    `radial-gradient(55% 55% at 75% 10%, var(--c4) 0%, transparent 80%)`,
  ].join(", ");
}

export default function AnimatedBackground({ dynamicColors }: { dynamicColors?: string[] }) {
  const pathname = usePathname();

  const colors = useMemo(() => {
    if (Array.isArray(dynamicColors) && dynamicColors.length >= 5) return dynamicColors;
    const basePath = "/" + pathname.split("/")[1];
    return Array.from(colorConfig[basePath as keyof typeof colorConfig] ?? colorConfig.default);
  }, [pathname, dynamicColors]);

return (
  <AnimatePresence mode="wait">
<motion.div
  className="fixed inset-0 -z-10 pointer-events-none"
  animate={{
    "--c0": colors[0],
    "--c1": colors[1],
    "--c2": colors[2],
    "--c3": colors[3],
    "--c4": colors[4],
    backgroundPosition: ["0% 0%", "10% 5%", "0% 0%"],
  }}
  transition={{
    "--c0": { duration: 1, ease: "easeInOut" },
    "--c1": { duration: 1, ease: "easeInOut" },
    "--c2": { duration: 1, ease: "easeInOut" },
    "--c3": { duration: 1, ease: "easeInOut" },
    "--c4": { duration: 1, ease: "easeInOut" },
    backgroundPosition: { duration: 16, ease: "easeInOut", repeat: Infinity },
  }}
  style={{
    backgroundImage: buildMesh(),
    backgroundRepeat: "no-repeat",
    backgroundSize: "120% 120%",
    backgroundPosition: "0% 0%",
    backgroundAttachment: "fixed",
  }}
/>

  </AnimatePresence>
);
}