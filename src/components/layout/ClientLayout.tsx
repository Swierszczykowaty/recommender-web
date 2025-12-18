"use client";

import { ReactNode, useEffect } from "react";
import NavBar from "@/components/global/NavBar";
import LayoutBackground from "@/components/layout/LayoutBackground";
import LenisProvider from "@/components/layout/LenisProvider";
import EngineStatusToast from "@/components/global/EngineStatusToast";
import { useEngineStore } from "@/lib/engineStore";
import { useThemeStore } from "@/lib/themeStore";
import { Archivo } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function ClientLayout({ children }: { children: ReactNode }) {
  const { isEngineReady, setEngineReady } = useEngineStore();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (!isEngineReady) {
      // Wykonaj tylko jedno zapytanie przy pierwszym wejściu
      const checkHealth = async (retryCount = 0) => {
        try {
          console.log(`Starting health check... (attempt ${retryCount + 1})`);
          // Upewnij się, że jesteśmy w przeglądarce
          if (typeof window === 'undefined') {
            console.log('Not in browser, skipping');
            return;
          }
          
          const url = `${window.location.origin}/api/health`;
          console.log('Fetching:', url);
          
          const controller = new AbortController();
          // Timeout 30s per próba
          const timeoutId = setTimeout(() => controller.abort(), 30000);
          
          const res = await fetch(url, { 
            cache: 'no-store',
            signal: controller.signal 
          });
          
          clearTimeout(timeoutId);
          console.log('Response status:', res.status, res.ok);
          
          if (res.ok) {
            const data = await res.json();
            console.log('Health data:', data);
            if (data.status === 'ok') {
              setEngineReady(true);
            }
          } else if (retryCount < 2) {
            // Retry po 5 sekundach
            console.log('Retrying in 5 seconds...');
            setTimeout(() => checkHealth(retryCount + 1), 5000);
          }
        } catch (error) {
          console.error("Health check failed:", error);
          if (retryCount < 2) {
            // Retry po 5 sekundach
            console.log('Retrying in 5 seconds...');
            setTimeout(() => checkHealth(retryCount + 1), 5000);
          }
        }
      };

      // Małe opóźnienie, żeby dać czas Next.js na załadowanie routera
      const timer = setTimeout(() => checkHealth(0), 100);
      return () => clearTimeout(timer);
    }
  }, [isEngineReady, setEngineReady]);

  return (
    <body
      data-nextjs-scroll-focus-boundary
      data-theme={theme}
      className={`${archivo.className} relative min-h-dvh overflow-x-hidden transition-colors duration-300`}
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
