"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

const colorConfig = {
  default: [
    "rgba(194, 65, 12, 0.40)",
    "rgba(234, 88, 12, 0.35)",
    "rgba(234, 88, 12, 0.30)",
    "rgba(202, 138, 4, 0.35)",
    "rgba(161, 98, 7, 0.30)",
  ],
  "/movies": [
    "rgba(30, 58, 138, 0.30)",
    "rgba(29, 78, 216, 0.20)",
    "rgba(37, 99, 235, 0.20)",
    "rgba(6, 95, 212, 0.30)",
    "rgba(12, 74, 110, 0.30)",
  ],
  "/recommender": [
    "rgba(88, 28, 135, 0.25)",
    "rgba(147, 51, 234, 0.20)",
    "rgba(236, 72, 153, 0.20)",
    "rgba(244, 114, 182, 0.18)",
    "rgba(109, 40, 217, 0.30)",
  ],
  "/about": [
    "rgba(22, 163, 74, 0.20)",
    "rgba(5, 150, 105, 0.30)",
    "rgba(34, 197, 94, 0.20)",
    "rgba(3, 84, 63, 0.30)",
    "rgba(20, 184, 166, 0.20)",
  ],
  "/rankings": [
    "rgba(220, 38, 38, 0.30)",
    "rgba(239, 68, 68, 0.25)",
    "rgba(235, 88, 115, 0.20)",
    "rgba(225, 120, 145, 0.22)",
    "rgba(202, 44, 44, 0.30)",
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