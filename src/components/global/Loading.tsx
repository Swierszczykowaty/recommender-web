// src/components/global/LoadingMovies.tsx
"use client";

import { motion } from "framer-motion";
interface LoadingProps {
  message: string;
}
export default function Loading({ message }: LoadingProps) {
  return (
        <>
          <motion.div
            className="flex items-center justify-center gap-4 text-white text-lg pt-24"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeOut" }}
          >
            <div className="w-8 h-8 border-4 border-white/20 border-t-white border-r-white/10 border-b-white/40 border-l-white/70 rounded-full animate-spin" />
            <span className="text-xl font-bold">{message}</span>
          </motion.div>
        </>
  );
}
