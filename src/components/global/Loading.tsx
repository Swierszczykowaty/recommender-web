"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useEngineStore } from "@/lib/engineStore";
import Link from "next/link";
import { useThemeStore } from "@/lib/themeStore";

interface LoadingProps {
  message: string;
  slowIcon?: string; 
}

export default function Loading({ message }: LoadingProps) {
  const [isSlow, setIsSlow] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const setNavigationAttempted = useEngineStore((state) => state.setNavigationAttempted);
  const theme = useThemeStore((state) => state.theme);
  const isLight = theme === "light";

  const palette = isLight
    ? {
        containerText: "text-slate-700",
        spinner:
          "border-slate-200 border-t-slate-500 border-r-slate-200 border-b-slate-100 border-l-slate-600",
        infoPrimary: "text-slate-600",
        infoSecondary: "text-slate-500",
        button:
          "bg-slate-900/5 border-slate-200 text-slate-900 hover:bg-slate-900/10",
      }
    : {
        containerText: "text-white",
        spinner:
          "border-white/20 border-t-white border-r-white/10 border-b-white/40 border-l-white/70",
        infoPrimary: "text-white/70",
        infoSecondary: "text-white/60",
        button:
          "bg-white/10 border-white/30 text-white hover:bg-white/20",
      };

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
      className={`flex flex-col items-center justify-center gap-4 ${palette.containerText} text-base md:text-lg min-h-[40vh] pt-32 md:pt-44 px-4`}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ease: "easeOut" }}
      role="status"
      aria-live="polite"
    >
      <div className={`w-6 h-6 md:w-8 md:h-8 border-4 rounded-full animate-spin ${palette.spinner}`} />
      <span className="text-base md:text-xl font-bold text-center">{message}</span>

      <AnimatePresence>
        {isSlow && (
          <motion.div
            key="slow-msg"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="flex flex-col justify-center items-center gap-2 mt-2 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className={`${palette.infoPrimary} max-w-[48ch] text-xs md:text-sm`}
            >
              On the first load, it may take up to few minutes. Don&#39;t worry - the server is starting in the background.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2}}
              className={`${palette.infoSecondary} text-xs md:text-sm mb-2`}>
                Once it&#39;s ready, you&#39;ll get a notification. In the meantime, feel free to check out the movies or rankings.
            </motion.p>
            <AnimatePresence>
            {showButton && (
              <motion.div
                key="button"
                initial={{ opacity: 0,  scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none sm:justify-center"
              >
                <Link href="/movies" onClick={handleNavigation} className="w-full sm:w-auto">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className={`w-full px-4 sm:px-6 py-2 text-sm md:text-base cursor-pointer rounded-lg transition duration-300 border ${palette.button}`}
                  >
                    Browse Movies
                  </motion.button>
                </Link>
                <Link href="/rankings" onClick={handleNavigation} className="w-full sm:w-auto">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    className={`w-full px-4 sm:px-6 py-2 text-sm md:text-base cursor-pointer rounded-lg transition duration-300 border ${palette.button}`}
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
