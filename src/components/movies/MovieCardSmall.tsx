'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Movie } from '@/types/movie';
import Icon from '@/components/global/Icon';
import { motion, AnimatePresence } from 'framer-motion';

type MovieCardSmallProps = {
  movie: Movie;
  onClick: () => void;
};

const arrowVariants = {
  enter: { x: -50, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit:  { x: 50, opacity: 0 },
};

const MovieCardSmall = ({ movie, onClick }: MovieCardSmallProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Brak daty';

  return (
    <div
      className="relative w-full h-full bg-white/10 border border-white/20 rounded-lg overflow-hidden shadow-xl cursor-pointer duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full h-40">
        {movie.poster_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`}
            alt={`Plakat filmu ${movie.title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700 text-white text-center p-4">
            Brak plakatu
          </div>
        )}

        {/* gradient */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* tytuł + rok */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-base font-bold truncate drop-shadow-xl">{movie.title}</h3>
          <p className="text-sm text-white/80 mt-1 drop-shadow-xl">{releaseYear}</p>
        </div>

        {/* overlay */}
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur bg-black/40 bg-opacity-60 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col items-center space-y-1">
            {/* AnimatePresence + motion.span dla strzałki */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  key="arrow"
                  variants={arrowVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center mb-1"
                >
                  <Icon
                    icon="arrow_warm_up"
                    className="text-white rotate-90"
                    style={{ fontSize: '40px' }}
                  />
                </motion.span>
              )}
            </AnimatePresence>

            <span className="text-sm font-semibold text-white">
              Generuj rekomendacje dla
            </span>
            <span className="text-xs font-semibold text-white">
              {movie.title}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCardSmall;
