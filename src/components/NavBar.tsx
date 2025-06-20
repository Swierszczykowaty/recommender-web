'use client';
import React from 'react';
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">Movie Recommender</h1>
        <div>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
}
