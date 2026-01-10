"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  Variants,
} from "framer-motion";
import { useThemeStore } from "@/lib/themeStore";

type Props = {
  href: string;
  label: string;
  icon?: string;                
  appearAfterPx?: number;        
  hideAtBottomPercent?: number; 
};

const shellVariants: Variants = {
  hidden:  { x: 64, opacity: 0, transition: { duration: 0.25, ease: "easeOut" } },
  visible: { x: 0,  opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit:    { x: 64, opacity: 0, transition: { duration: 0.20, ease: "easeIn"  } },
};

// szerokości pastylki
const fabVariants: Variants = {
  collapsed: { width: 56, paddingRight: 12 },
  expanded:  { width: 265, paddingRight: 20 },
};
const textVariants: Variants = {
  collapsed: { x: -8, opacity: 0 },
  expanded:  { x: 0,  opacity: 1 },
};

export default function MobileScrollFABRight({
  href,
  label,
  icon = "app_registration",
  appearAfterPx = 80,
  hideAtBottomPercent = 0.9,
}: Props) {
  const { scrollY, scrollYProgress } = useScroll();
  const theme = useThemeStore((state) => state.theme);

  // wykrywanie mobile
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(pointer: coarse), (max-width: 768px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // logika widoczności na mobile
  const yRef = useRef(0);
  const pRef = useRef(0);
  const [showMobile, setShowMobile] = useState(false);
  const recompute = () => {
    const above = yRef.current >= appearAfterPx;
    const notBottom = pRef.current < hideAtBottomPercent;
    setShowMobile(above && notBottom);
  };
  useMotionValueEvent(scrollY, "change", (v) => { yRef.current = v; recompute(); });
  useMotionValueEvent(scrollYProgress, "change", (p) => { pRef.current = p; recompute(); });

  // DESKTOP: zawsze widoczny, hover = expand (z napisem)
  if (!isMobile) {
    return (
      <div
        className="fixed bottom-6 right-4 md:right-6 z-50"
        style={{ visibility: mounted ? "visible" : "hidden" }}
      >
        <Link href={href} className="block" aria-label={label}>
          <motion.div
            className={`relative flex items-center h-14 rounded-2xl border border-white/30 backdrop-blur-lg
                       overflow-hidden cursor-pointer shadow-lg hover:shadow-xl shadow-violet-500/20 ${
                         theme === "light"
                           ? "bg-gradient-to-tr from-indigo-500/20 via-fuchsia-500/35 to-purple-500/25 hover:from-indigo-500/40 hover:via-fuchsia-500/55 hover:to-purple-500/65"
                           : "bg-gradient-to-tr from-indigo-400/10 via-fuchsia-400/25 to-purple-400/15"
                       }`}
            variants={fabVariants}
            initial="collapsed"
            whileHover="expanded"
            whileFocus="expanded"
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ paddingLeft: 14 }}
          >
            <span className="material-symbols-outlined !text-2xl ml-[2px] mr-[6px] !text-white">
              {icon}
            </span>
            <motion.span
              className="font-medium whitespace-nowrap pr-2 !text-white"
              variants={textVariants}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              {label}
            </motion.span>
          </motion.div>
        </Link>
      </div>
    );
  }

  // MOBILE: pojawia się po scrollu, WJEŻDŻA z prawej, ale ZOSTAJE ZWINIĘTY (TYLKO IKONA)
  return (
    <AnimatePresence>
      {showMobile && (
        <motion.div
          className="fixed bottom-6 right-4 md:right-6 z-50"
          variants={shellVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <Link href={href} className="block" aria-label={label}>
            <motion.div
              className={`relative flex items-center h-14 rounded-2xl border border-white/30 backdrop-blur-lg
                         overflow-hidden cursor-pointer shadow-xl ${
                           theme === "light"
                             ? "bg-gradient-to-tr from-indigo-500/40 via-fuchsia-500/55 to-purple-500/45"
                             : "bg-gradient-to-tr from-indigo-400/10 via-fuchsia-400/25 to-purple-400/15"
                         }`}
              variants={fabVariants}
              initial="collapsed"
              animate="collapsed"          // ← nie rozszerzaj na mobile
              whileTap={{ scale: 0.98 }}   // tap feedback
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ paddingLeft: 14 }}
            >
              <span className="material-symbols-outlined !text-2xl ml-[2px] mr-[6px] !text-white">
                {icon}
              </span>

              {/* Tekst niewidoczny wizualnie na mobile, ale dostępny dla czytników */}
              <span className="sr-only">{label}</span>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
