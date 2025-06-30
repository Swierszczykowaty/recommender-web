'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + nazwa */}
        <Link href="/" className="flex items-center text-white text-xl font-bold gap-2">
          <span className="material-icons !text-[35px]">blur_on</span>
          Rekomender WWSI
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-8 xl:space-x-16 text-white">
          <Link className='hover:text-orange-200 active:text-orange-400 duration-100' href="/">Start</Link>
          <Link className='hover:text-violet-200 active:text-violet-400 duration-100' href="/recommender">Rekomender</Link>
          <Link className='hover:text-sky-200 active:text-sky-400 duration-100' href="/movies">Baza filmów</Link>
          <Link className='hover:text-emerald-200 active:text-emerald-400 duration-100' href="/about">O Projekcie</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="material-icons">
            {menuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
<AnimatePresence>
  {menuOpen && (
<motion.div
  key="mobileMenu"
  initial={{ opacity: 0, maxHeight: 0 }}
  animate={{ opacity: 1, maxHeight: 500 }}
  exit={{ opacity: 0, maxHeight: 0 }}
  transition={{ duration: 0.3, ease: 'easeInOut' }}
  className="md:hidden overflow-hidden flex flex-col px-6 pb-4 text-white space-y-2"
>
  <Link href="/" onClick={() => setMenuOpen(false)}>Start</Link>
  <Link href="/recommender" onClick={() => setMenuOpen(false)}>Rekomender</Link>
  <Link href="/movies" onClick={() => setMenuOpen(false)}>Baza filmów</Link>
  <Link href="/about" onClick={() => setMenuOpen(false)}>O Projekcie</Link>
</motion.div>
  )}
</AnimatePresence>
    </nav>
  );
}
