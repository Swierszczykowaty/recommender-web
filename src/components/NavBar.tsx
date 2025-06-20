'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + nazwa */}
        <Link href="/" className="flex items-center text-white text-xl font-bold gap-2">
          <span className="material-icons">blur_on</span>
          Rekomender Filmowy
        </Link>

        {/* Desktop menu */}
        <div className="hidden md:flex space-x-6 text-white">
          <Link href="/">Start</Link>
          <Link href="/movies">Baza filmów</Link>
          <Link href="/recommender">Rekomender</Link>
          <Link href="/recommender">O Projekcie</Link>
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
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 text-white space-y-2">
          <Link href="/" onClick={() => setMenuOpen(false)}>Start</Link>
          <Link href="/movies" onClick={() => setMenuOpen(false)}>Baza filmów</Link>
          <Link href="/recommender" onClick={() => setMenuOpen(false)}>Rekomender</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>O Projekcie</Link>
        </div>
      )}
    </nav>
  );
}
