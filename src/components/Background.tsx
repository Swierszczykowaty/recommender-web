'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <>
      <motion.div
        className="absolute top-0 left-[-10%] w-[1000px] h-[1000px] bg-orange-500/70 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -100, 0], x: [0, 50, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[30%] right-0 w-[700px] h-[700px] bg-yellow-500/70 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, 100, 0], x: [0, -50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-60 left-[40%] w-[700px] h-[700px] bg-amber-500/70 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -100, 0], x: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[10%] w-[1000px] h-[1000px] bg-amber-400/40 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -200, 0], x: [0, 100, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[-20%] left-[80%] w-[800px] h-[800px] bg-orange-400/40 rounded-full blur-3xl opacity-30"
        animate={{ y: [0, -100, 0], x: [0, -100, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  );
}
