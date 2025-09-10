/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

type LenisType = InstanceType<typeof Lenis> | null;
const LenisContext = createContext<LenisType>(null);
export const useLenis = () => useContext(LenisContext);

const pathsToDisable = ["/asystent"]; // jak w Twoim przykładzie

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<LenisType>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // wyłącz na niektórych trasach
    if (pathsToDisable.includes(pathname ?? "")) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      smoothWheel: !reduce,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    // kliknięcia w #kotwice – przewijaj lenisem
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href")!;
      if (hash.length <= 1) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 0.6 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  // skok na górę po zmianie trasy – bez animacji
  useEffect(() => {
    if (!lenisRef.current) return;
    // duration:0 = natychmiast, bez „dygnięcia”
    lenisRef.current.scrollTo(0, { duration: 0 });
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef.current}>{children}</LenisContext.Provider>;
}
