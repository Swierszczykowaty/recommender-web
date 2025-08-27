"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface LoadingProps {
  message: string;
}

export default function Loading({ message }: LoadingProps) {
  const [isSlow, setIsSlow] = useState(false); // >5s

  useEffect(() => {
    const t1 = setTimeout(() => setIsSlow(true), 5000);
    return () => clearTimeout(t1);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 text-white text-lg min-h-[40vh] pt-24"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeOut" }}
      role="status"
      aria-live="polite"
    >
      <div className="w-8 h-8 border-4 border-white/20 border-t-white border-r-white/10 border-b-white/40 border-l-white/70 rounded-full animate-spin" />
      <span className="text-xl font-bold">{message}</span>

      {isSlow && (
        <p className="text-white/70 text-center max-w-[42ch]">
          To trwa dłużej niż zwykle — serwer może się wybudzać (pierwsze uruchomienie zajmuje nawet do ~2 minut).
        </p>
      )}
    </motion.div>
  );
}
