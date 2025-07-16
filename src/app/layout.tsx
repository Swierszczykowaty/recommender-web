import "./globals.css";
import { ReactNode } from "react";
import NavBar from "@/components/global/NavBar";
import LayoutBackground from "@/components/global/LayoutBackground";

import { Archivo } from "next/font/google";
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Rekomendacje Filmowe",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="System rekomendacji filmów oparty na analizie treści. Przeglądaj rankingi, odkrywaj nowe tytuły i wybieraj filmy dopasowane do Twojego gustu."
        />
      </head>
      <body
        data-nextjs-scroll-focus-boundary
        className={`${archivo.className} relative text-white min-h-screen overflow-x-hidden`}
      >
        <NavBar />
        <main className="relative z-10 overflow-hidden bg-gray-950">
          <LayoutBackground />
          {children}
        </main>
      </body>
    </html>
  );
}

