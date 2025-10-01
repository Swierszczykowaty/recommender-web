"use client";
import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/global/Icon";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-white/7 backdrop-blur-md border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + nazwa */}
        <Link
          href="/"
          className="flex items-center  text-xl font-bold gap-2"
        >
          <Icon icon="blur_on" className=" !text-3xl cursor-pointer" />
          Movie Recommender
        </Link>

        {/* Desktop menu */}
        <div className="hidden text-sm lg:text-base lg:flex space-x-6 lg:space-x-8 xl:space-x-16 ">
          <Link
            className="hover:text-orange-200 active:text-orange-400 duration-100"
            href="/"
          >
            Home
          </Link>
          <Link
            className="hover:text-violet-200 active:text-violet-400 duration-100"
            href="/recommender"
          >
            Recommender
          </Link>
          <Link
            className="hover:text-sky-200 active:text-sky-400 duration-100"
            href="/movies"
          >
            Movie Database
          </Link>
          <Link
            className="hover:text-rose-200 active:text-rose-400 duration-100"
            href="/rankings"
          >
            Rankings
          </Link>
          <Link
            className="hover:text-emerald-200 active:text-emerald-400 duration-100"
            href="/about"
          >
            About
          </Link>
        </div>
        {/* Mobile hamburger */}
        <button
          className="lg:hidden  flex text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon
            icon={menuOpen ? "close" : "menu"}
            className="text-3xl "
          />
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
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden flex flex-col px-6 pb-4  space-y-2"
          >
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link href="/recommender" onClick={() => setMenuOpen(false)}>
              Recommender
            </Link>
            <Link href="/movies" onClick={() => setMenuOpen(false)}>
              Movie Database
            </Link>
            <Link href="/rankings" onClick={() => setMenuOpen(false)}>
              Rankings
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
