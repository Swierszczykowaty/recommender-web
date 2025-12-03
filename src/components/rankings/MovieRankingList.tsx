"use client";

import React from "react";
import type { Movie } from "@/types/movie";
import { RANKING_TYPES, RankingType } from "@/lib/ranking-types";
import MovieRankingCard from "./MovieRankingCard";
import Container from "@/components/layout/Container";
import Title from "@/components/global/Title";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/global/Icon";

interface Props {
  movies: Movie[];
  type: RankingType;
}

const LABELS: Record<RankingType, string> = {
  rating: "Rating",
  votes: "Vote Count",
  revenue: "Revenue (USD)",
};
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MovieRankingList({ movies, type }: Props) {
  const rankingLabel =
    RANKING_TYPES.find((r) => r.key === type)?.label || "Ranking";
  const router = useRouter();
  const handleGoBack = () => router.back();
  return (
    <section className="min-h-screen pt-32 mb-10">
      <Container>
        <div className="mb-10 text-center flex justify-center">
          <Title
            subtitle={`Based on parameter: ${LABELS[type]}`}
            gradientLight={{
              from: "from-slate-700",
              via: "via-slate-500",
              to: "to-slate-800",
              subtitleColor: "text-white",
            }}
            gradientDark={{
              from: "from-rose-400",
              via: "via-pink-400",
              to: "to-fuchsia-300",
              subtitleColor: "text-white/80",
            }}
          >
            Ranking Top 100
          </Title>
        </div>

        {/* BREADCRUMB + POWRÓT */}
        <motion.div
          className="flex justify-between items-center mb-4 z-50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-xs md:text-sm text-white/70 mt-2">
              <li>
                <Link href="/rankings" className="hover:underline">
                  Rankings
                </Link>
              </li>
              <li>
                <span>/</span>
              </li>
              <li className="text-white font-medium">{rankingLabel}</li>
            </ol>
          </nav>
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 px-4 py-1 text-sm bg-white/7 border border-white/20 rounded-lg backdrop-blur-md shadow-xl transition cursor-pointer hover:bg-white/10"
          >
            <Icon icon="keyboard_backspace" style={{ fontSize: "20px" }} />
            <span className="text-sm hidden md:inline">Back</span>
          </button>
        </motion.div>
        {/* KONIEC BREADCRUMB + POWRÓT */}

        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {movies.map((movie, idx) => (
            <motion.div key={movie.id} variants={cardVariants}>
              <MovieRankingCard movie={movie} rank={idx + 1} type={type} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
