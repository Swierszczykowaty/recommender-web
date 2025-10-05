"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEngineStore } from "@/lib/engineStore";
import Link from "next/link";

interface LoadingProps {
  message: string;
  slowIcon?: string; 
}

export default function Loading({ message }: LoadingProps) {
  const [isSlow, setIsSlow] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const setNavigationAttempted = useEngineStore((state) => state.setNavigationAttempted);

  const handleNavigation = () => {
    setNavigationAttempted(true);
  };

  useEffect(() => {
    const t1 = setTimeout(() => setIsSlow(true), 5000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (isSlow) {
      const t2 = setTimeout(() => setShowButton(true), 0);
      return () => clearTimeout(t2);
    }
  }, [isSlow]);

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
      <span className="text-xl font-bold text-center">{message}</span>

      <AnimatePresence>
        {isSlow && (
          <motion.div
            key="slow-msg"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col justify-center items-center gap-2 mt-2 text-white/80 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="text-white/70 max-w-[48ch] text-sm md:text-md"
            >
              On the first load, it may take up to few minutes. Don’t worry - the server is starting in the background.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2}}
              className="text-white/60 text-sm md:text-md mb-2">
                Once it’s ready, you’ll get a notification. In the meantime, feel free to check out the movies or rankings.
            </motion.p>
            <AnimatePresence>
            {showButton && (
              <motion.div
                key="button"
                initial={{ opacity: 0,  scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-row gap-4"
              >
                <Link href="/movies" onClick={handleNavigation}>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 text-base bg-white/10 border border-white/30 hover:bg-white/20 text-white cursor-pointer rounded-lg transition duration-300"
                  >
                    Browse Movies
                  </motion.button>
                </Link>
                <Link href="/rankings" onClick={handleNavigation}>
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 text-base bg-white/10 border border-white/30 hover:bg-white/20 text-white cursor-pointer rounded-lg transition duration-300"
                  >
                    Browse Rankings
                  </motion.button>
                </Link>
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
