"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "@/types/movie";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}

export default function MovieModal({ isOpen, onClose, movie }: MovieModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isImgLoading, setIsImgLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      setIsImgLoading(true);
      setIsError(false);
    }
  }, [isOpen, movie?.poster_path, movie?.backdrop_path]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) closeBtnRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const html = document.documentElement;
    const body = document.body;
    const hasLenis = html.classList.contains("lenis");

    const prevOverflow = body.style.overflow;
    if (hasLenis) {
      html.classList.add("lenis-stopped");
    } else {
      body.style.overflow = "hidden";
    }
    return () => {
      if (hasLenis) {
        html.classList.remove("lenis-stopped");
      } else {
        body.style.overflow = prevOverflow;
      }
    };
  }, [isOpen]);

  const imageSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const imageAlt = movie.poster_path
    ? `Plakat filmu ${movie.title}`
    : movie.backdrop_path
    ? `Kadr z filmu ${movie.title}`
    : movie.title ?? "Preview";

  const content = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="movie-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="relative w-[92%] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.96, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="relative flex items-center justify-center">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  width={1200}
                  height={1800}
                  className="rounded-lg object-contain max-h-[60vh] sm:max-h-[80vh] mx-auto"
                  onLoadingComplete={() => setIsImgLoading(false)}
                  onError={() => {
                    setIsImgLoading(false);
                    setIsError(true);
                  }}
                  priority
                />
              ) : (
                <div className="rounded-lg bg-neutral-800/70 text-white/80 w-full min-h-[40vh] max-h-[60vh] sm:max-h-[80vh] grid place-items-center">
                  Brak obrazu
                </div>
              )}

              {isImgLoading && !isError && (
                <div className="absolute inset-0 grid place-items-center bg-black/30 rounded-lg">
                  <div className="h-12 w-12 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                </div>
              )}
            </div>

            <div className="text-center text-white mt-4">
              <h2 id="movie-modal-title" className="text-xl font-bold">
                {movie.title}
              </h2>
              {movie.release_date && (
                <p className="text-sm text-white/70">{movie.release_date.slice(0, 4)}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className="absolute top-[-50] sm:top-0 right-0 bg-white/10 border border-white/30 text-white px-4 py-2 rounded hover:bg-white/20 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (mounted) {
    return createPortal(content, document.body);
  }
  return null;
}
