"use client";

import { ReactNode, useEffect } from "react";
import NavBar from "@/components/global/NavBar";
import LayoutBackground from "@/components/layout/LayoutBackground";
import LenisProvider from "@/components/layout/LenisProvider";
import EngineStatusToast from "@/components/global/EngineStatusToast";
import { useEngineStore } from "@/lib/engineStore";
import { Archivo } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { isEngineReady, setEngineReady } = useEngineStore();

  useEffect(() => {
    if (!isEngineReady) {
      // Wykonaj tylko jedno zapytanie przy pierwszym wejściu
      const checkHealth = async () => {
        try {
          const res = await fetch('/api/health');
          if (res.ok) {
            const data = await res.json();
            if (data.status === 'ok') {
              setEngineReady(true);
            }
          }
        } catch (error) {
          console.error("Health check failed:", error);
        }
      };

      checkHealth();
    }
  }, [isEngineReady, setEngineReady]);

  return (
    <body
      data-nextjs-scroll-focus-boundary
      className={`${archivo.className} relative text-white min-h-dvh overflow-x-hidden`}
    >
      <NavBar />
      <LayoutBackground />
      <LenisProvider>
        <main className="relative z-10 bg-transparent">{children}</main>
        <EngineStatusToast />
      </LenisProvider>
    </body>
  );
}
