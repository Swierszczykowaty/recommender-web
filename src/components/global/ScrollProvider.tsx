"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type LocomotiveScroll from "locomotive-scroll";

export default function ScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const locoRef = useRef<LocomotiveScroll | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { default: Loco } = await import("locomotive-scroll");
      if (!mounted || !containerRef.current) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const instance = new Loco({
        el: containerRef.current!,
        smooth: !reduceMotion,
        lerp: 0.08, // „bezwładność” – zmniejsz, by było „sztywniej”
        multiplier: 1.0, // szybkość scrolla
        smartphone: { smooth: false }, // często lepiej bez wygładzania na fonach
        tablet: { smooth: true, breakpoint: 1024 },
      });

      locoRef.current = instance;

      // Gdy zmienia się rozmiar okna/układ – przelicz
      const onResize = () => instance.update();
      window.addEventListener("resize", onResize);

      // Jeśli używasz obrazów, które doładowują wysokość po czasie – możesz ręcznie wołać update()
      // np. w onLoadingComplete next/image: window.dispatchEvent(new Event("resize"))

      return () => {
        window.removeEventListener("resize", onResize);
      };
    })();

    return () => {
      mounted = false;
      locoRef.current?.destroy();
      locoRef.current = null;
    };
  }, []);

  // Reset/aktualizacja przy zmianie route (App Router)
  useEffect(() => {
    // przewiń na górę przy zmianie strony i zaktualizuj układ
    const id = requestAnimationFrame(() => {
      locoRef.current?.scrollTo(0, { duration: 0, disableLerp: true });
      locoRef.current?.update();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  // Obsłuż anchor linki (#sekcja) tak, by korzystały z Locomotive
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(
        "a[href^='#']"
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const hash = target.getAttribute("href")!;
      if (hash.length <= 1) return;
      const node = document.querySelector(hash);
      if (!node) return;

      e.preventDefault();
locoRef.current?.scrollTo(hash, { offset: -80 });
    };

    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, []);

  return (
    <div id="scroll-container" data-scroll-container ref={containerRef}>
      {children}
    </div>
  );
}
