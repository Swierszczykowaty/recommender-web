import './globals.css';
import { ReactNode } from 'react';
import NavBar from '@/components/NavBar';
import { Archivo } from 'next/font/google';
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300','400', '500', '600', '700'], // dodaj więcej jeśli potrzebujesz
  display: 'swap',
});



export const metadata = {
  title: 'Rekomendacje Filmowe',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={`${archivo.className} relative text-white min-h-screen overflow-x-hidden`}>
        {/* ANIMOWANE TŁO */}
        {/* <div className="fixed inset-0 -z-10 bg-gray-950">
          <div className="blur-3xl opacity-30 absolute top-0 left-0 w-[600px] h-[600px] md:w-[900px] md:h-[900px] lg:w-[1200px] lg:h-[1200px] bg-orange-500/70 rounded-full" />
          <div className="blur-3xl opacity-30 absolute top-[30%] right-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] bg-yellow-500/90 rounded-full" />
          <div className="blur-3xl opacity-30 absolute bottom-60 left-[30%] w-[500px] h-[500px] md:w-[700px] md:h-[700px] lg:w-[900px] lg:h-[900px] bg-amber-500/80 rounded-full" />
        </div> */}

        {/* UI */}
        <NavBar />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
