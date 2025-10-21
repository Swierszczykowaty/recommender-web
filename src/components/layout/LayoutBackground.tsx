"use client";

import Background from "@/components/layout/Background";
import { usePathname } from "next/navigation";
import { useBackgroundStore } from "@/lib/backgroundStore";

export default function LayoutBackground() {
  const pathname = usePathname();
  const hideBackground = pathname.startsWith("/movies/");
  const dynamicColors = useBackgroundStore((state) => state.dynamicColors);

  if (hideBackground) return null;

  return <Background dynamicColors={dynamicColors ?? undefined} />;
}
