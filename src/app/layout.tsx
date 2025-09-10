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
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
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
        className={`${archivo.className} relative text-white min-h-dvh overflow-x-hidden`}
      >
        <NavBar />
        <LayoutBackground />
        <main className="relative z-10 bg-transparent">
          {children}
        </main>
      </body>
    </html>
  );
}

