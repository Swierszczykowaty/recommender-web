"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/global/Icon";
import { useThemeStore } from "@/lib/themeStore";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const pathname = usePathname();
  const isLight = theme === "light";
  const isMovieDetailPage = /^\/movies\/\d+$/.test(pathname);
  
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/recommender", label: "Recommender" },
    { href: "/movies", label: "Movie Database" },
    { href: "/rankings", label: "Rankings" },
    { href: "/about", label: "About" },
  ];

  // Dla strony filmu w light mode używamy stylów jak w dark mode
  const useDarkStyle = !isLight || (isMovieDetailPage && isLight);

  const navThemeClasses = useDarkStyle
    ? "bg-white/7 text-white border-white/20 shadow-sm"
    : "bg-white/70 text-slate-900 border-slate-200 shadow-md";

  const buttonThemeClasses = useDarkStyle
    ? "bg-white/10 border-white/30 text-white hover:bg-white/20"
    : "bg-slate-900/5 border-slate-200 text-slate-900 hover:bg-slate-900/10";

  const linkThemeClasses = useDarkStyle
    ? "text-white hover:text-white/70 active:text-white/60"
    : "text-slate-700 hover:text-slate-900 active:text-slate-950";

  const brandThemeClasses = useDarkStyle
    ? "text-white"
    : "text-transparent bg-clip-text bg-gradient-to-tr from-slate-900 via-slate-600 to-slate-800";

  return (
    <nav
      {...(isMovieDetailPage && isLight ? { "data-force-white": true } : {})}
      className={`fixed top-0 left-0 w-full z-40 backdrop-blur-md border-b transition-colors duration-300 ${navThemeClasses}`}
      style={isMovieDetailPage && isLight ? {
        backgroundColor: 'rgba(255, 255, 255, 0.07)',
        borderColor: 'rgba(255, 255, 255, 0.2)'
      } : undefined}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center lg:pr-24">
        {/* Logo + nazwa */}
        <Link
          href="/"
          className={`flex items-center text-xl font-bold gap-2 ${brandThemeClasses}`}
        >
          <Icon icon="blur_on" className="!text-3xl cursor-pointer" />
          Movie Recommender
        </Link>

        {/* Desktop menu */}
        <div className="hidden text-sm lg:text-base lg:flex items-center space-x-4 lg:space-x-6 xl:space-x-10">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              className={`transition-colors duration-150 ${linkThemeClasses}`}
              href={href}
            >
              {label}
            </Link>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button
          className="lg:hidden cursor-pointer flex text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon
            icon={menuOpen ? "close" : "menu"}
            className="text-3xl "
          />
        </button>
      </div>
      <button
        type="button"
        aria-label={isLight ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
        aria-pressed={isLight}
        onClick={toggleTheme}
        className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 right-6 w-10 h-10 items-center justify-center rounded-full border shadow-lg transition ${buttonThemeClasses}`}
      >
        <Icon icon={isLight ? "light_mode" : "dark_mode"} className="!text-xl" />
      </button>
      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobileMenu"
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ opacity: 1, maxHeight: 500 }}
            exit={{ opacity: 0, maxHeight: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden flex flex-col px-6 pb-4 space-y-3"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`text-base ${linkThemeClasses}`}
              >
                {label}
              </Link>
            ))}
            <button
              type="button"
              aria-label={isLight ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className={`mt-2 flex items-center justify-center rounded-full border p-3 text-lg transition ${buttonThemeClasses}`}
            >
              <Icon icon={isLight ? "light_mode" : "dark_mode"} className="!text-2xl" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
