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
  expanded:  { width: 220, paddingRight: 20 },
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
            className="relative flex items-center h-14 rounded-2xl border border-white/30 backdrop-blur-lg
                       bg-gradient-to-tr from-indigo-400/10 via-fuchsia-400/25 to-purple-400/15
                       overflow-hidden cursor-pointer shadow-lg hover:shadow-xl shadow-violet-500/20"
            variants={fabVariants}
            initial="collapsed"
            whileHover="expanded"
            whileFocus="expanded"
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{ paddingLeft: 14 }}
          >
            <span className="material-symbols-outlined text-white !text-2xl ml-[2px] mr-[6px]">
              {icon}
            </span>
            <motion.span
              className="text-white font-medium whitespace-nowrap pr-2"
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
              className="relative flex items-center h-14 rounded-2xl border border-white/30 backdrop-blur-lg
                         bg-gradient-to-tr from-indigo-400/10 via-fuchsia-400/25 to-purple-400/15
                         overflow-hidden cursor-pointer shadow-xl"
              variants={fabVariants}
              initial="collapsed"
              animate="collapsed"          // ← nie rozszerzaj na mobile
              whileTap={{ scale: 0.98 }}   // tap feedback
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ paddingLeft: 14 }}
            >
              <span className="material-symbols-outlined text-white !text-2xl ml-[2px] mr-[6px]">
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
