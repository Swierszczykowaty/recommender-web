import './globals.css';
import { ReactNode } from 'react';
import NavBar from '@/components/NavBar';


export const metadata = {
  title: 'Rekomendacje Filmowe',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className="bg-gray-900 text-white">
        <NavBar />
        {/* Main content area */}
        {children}
      </body>
    </html>
  );
}
