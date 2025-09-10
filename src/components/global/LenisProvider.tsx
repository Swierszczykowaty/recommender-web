"use client";

import { useEffect, useRef, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

type LenisInstance = InstanceType<typeof Lenis> | null;

const LenisContext = createContext<LenisInstance>(null);
export const useLenis = () => useContext(LenisContext);

const DISABLED_PATHS = ["/asystent"];

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<LenisInstance>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (DISABLED_PATHS.includes(pathname ?? "")) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      smoothWheel: !reduce,
      syncTouch: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      syncTouchLerp: 0.075,
      touchInertiaExponent: 2,
    });

    lenisRef.current = lenis;

    const raf = (t: number) => {
      lenis.raf(t);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    // #anchor – płynne przewijanie
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href")!;
      if (hash.length <= 1) return;
      const el = document.querySelector(hash);
      if (!(el instanceof HTMLElement)) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -80, duration: 0.6 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [pathname]);

  // na zmianę trasy – skok na górę bez animacji
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { duration: 0 });
  }, [pathname]);

  return <LenisContext.Provider value={lenisRef.current}>{children}</LenisContext.Provider>;
}
