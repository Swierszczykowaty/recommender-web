"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Movie } from "@/types/movie";

interface MovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}

export default function MovieModal({ isOpen, onClose, movie }: MovieModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative w-[90%] mt-[68px]"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
              alt={movie.title}
              width={1000}
              height={1500}
              className="rounded-lg object-contain max-h-[60vh] sm:max-h-[80vh] mx-auto"
            />
            <div className="text-center text-white mt-4">
              <h2 className="text-xl font-bold">{movie.title}</h2>
              <p className="text-sm text-white/70">
                {movie.release_date?.slice(0, 4)}
              </p>
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
}
