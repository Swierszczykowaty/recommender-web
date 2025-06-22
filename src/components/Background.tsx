'use client';

import React, { useMemo } from 'react'; // Krok 1: Import useMemo
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';


const colorConfig = {
  // strona główna  – przygaszony pomarańcz
  default: [
    'rgba(194, 65, 12, 0.3)',   // orange-700
    'rgba(234, 88, 12, 0.2)',   // orange-600
    'rgba(249, 115, 22, 0.3)',  // orange-500
    'rgba(202, 138, 4, 0.2)',   // amber-700
    'rgba(161, 98, 7, 0.3)',    // amber-800
  ],

  // /movies  – chłodniejsze, ciemne niebiesko-cyjanowe
  '/movies': [
    'rgba(30, 58, 138, 0.2)',   // indigo-900
    'rgba(29, 78, 216, 0.2)',   // blue-700
    'rgba(37, 99, 235, 0.2)',   // blue-600
    'rgba(6, 95, 212, 0.1)',    // blue-600 variant
    'rgba(12, 74, 110, 0.3)',   // cyan-800
  ],

  // /recommender – głęboki fiolet z domieszką magenty
'/recommender': [
  'rgba(88, 28, 135, 0.25)',   // głęboki fiolet (purple-900)
  'rgba(147, 51, 234, 0.2)',  // klasyczny fiolet (purple-600)
  'rgba(236, 72, 153, 0.2)',  // pink-500 z niższą alfą
  'rgba(244, 114, 182, 0.18)', // pink-300, bardzo subtelny
  'rgba(109, 40, 217, 0.3)',  // purple-700
],

  // /about – stonowana zieleń / teal
  '/about': [
    'rgba(22, 163, 74, 0.2)',   // green-700
    'rgba(5, 150, 105, 0.3)',   // emerald-700
    'rgba(34, 197, 94, 0.2)',   // green-500
    'rgba(3, 84, 63, 0.3)',     // teal-900
    'rgba(20, 184, 166, 0.2)',  // teal-500
  ],
} as const;

export default function AnimatedBackground() {
  const pathname = usePathname();
  const colors = useMemo(() => {
    const basePath = '/' + pathname.split('/')[1];
    type PathKey = keyof typeof colorConfig;
    return basePath in colorConfig
      ? [...colorConfig[basePath as PathKey]]
      : [...colorConfig.default];
  }, [pathname]);


  const commonClasses = 'absolute rounded-full blur-3xl';

  return (
    <>
      <motion.div
        className={`${commonClasses} top-0 left-[-10%] w-[1000px] h-[1000px]`}
        animate={{
          y: [0, -100, 0],
          x: [0, 50, 0],
          backgroundColor: colors[0],
        }}
        // Krok 3: Zdefiniowanie osobnych przejść dla każdej właściwości
        transition={{
          // Jednorazowa, płynna animacja dla zmiany koloru
          backgroundColor: { duration: 0.8, ease: 'easeInOut' },
          // Nieskończona pętla tylko dla ruchu
          x: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className={`${commonClasses} top-[30%] right-0 w-[700px] h-[700px]`}
        animate={{
          y: [0, 100, 0],
          x: [0, -50, 0],
          backgroundColor: colors[1],
        }}
        transition={{
          backgroundColor: { duration: 0.8, ease: 'easeInOut' },
          x: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className={`${commonClasses} bottom-60 left-[40%] w-[700px] h-[700px]`}
        animate={{
          y: [0, -100, 0],
          x: [0, 50, 0],
          backgroundColor: colors[2],
        }}
        transition={{
          backgroundColor: { duration: 0.8, ease: 'easeInOut' },
          x: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className={`${commonClasses} bottom-[-20%] left-[10%] w-[1000px] h-[1000px]`}
        animate={{
          y: [0, -200, 0],
          x: [0, 100, 0],
          backgroundColor: colors[3],
        }}
        transition={{
          backgroundColor: { duration: 0.8, ease: 'easeInOut' },
          x: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <motion.div
        className={`${commonClasses} top-[-20%] left-[80%] w-[800px] h-[800px]`}
        animate={{
          y: [0, -100, 0],
          x: [0, -100, 0],
          backgroundColor: colors[4],
        }}
        transition={{
          backgroundColor: { duration: 0.8, ease: 'easeInOut' },
          x: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          y: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
    </>
  );
}