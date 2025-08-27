"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface LoadingProps {
  message: string;
  slowIcon?: string; 
}

export default function Loading({ message }: LoadingProps) {
  const [isSlow, setIsSlow] = useState(false); // >5s

  useEffect(() => {
    const t1 = setTimeout(() => setIsSlow(true), 5000);
    return () => clearTimeout(t1);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center gap-4 text-white text-lg min-h-[40vh] pt-44"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeOut" }}
      role="status"
      aria-live="polite"
    >
      <div className="w-8 h-8 border-4 border-white/20 border-t-white border-r-white/10 border-b-white/40 border-l-white/70 rounded-full animate-spin" />
      <span className="text-xl font-bold">{message}</span>

      {/* płynne pojawianie się komunikatu po 5s */}
      <AnimatePresence>
        {isSlow && (
          <motion.div
            key="slow-msg"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col justify-center items-center gap-2 mt-2 text-white/80 text-center sm:text-left"
          >
            <p className="text-white/70 max-w-[48ch] text-sm md:text-md">
              To trwa dłużej niż zwykle — serwer może się wybudzać.
            </p>
            <p className="text-white/60 text-sm md:text-md">Przepraszamy za utrudnienia.</p>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
