"use client";

import { useEngineStore } from '@/lib/engineStore';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Icon from './Icon';
import { useEffect, useState } from 'react';

export default function EngineStatusToast() {
  const { isEngineReady, wasNavigationAttempted, reset, lastRecommendationUrl } = useEngineStore();
  const [isVisible, setIsVisible] = useState(false);

  const showToast = false; // zmień na false aby ukryć

  useEffect(() => {
    if (showToast || (isEngineReady && wasNavigationAttempted)) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showToast, isEngineReady, wasNavigationAttempted]);

  const handleReset = () => {
    setIsVisible(false);
    reset();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Desktop Version */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-24 right-6 z-50 hidden sm:block"
          >
            <motion.div
              initial={{ x: 50, opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0.9 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-violet-500/10 overflow-hidden w-96"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon icon="recommend" className="!text-2xl" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-white text-lg mb-2">Silnik jest gotowy!</p>
                    <p className="text-sm text-white/70 leading-relaxed">
                      Możesz teraz wrócić, aby zobaczyć swoje rekomendacje.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="absolute top-1 right-1 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10 cursor-pointer"
                  >
                    <Icon icon="close" className="!text-xl" />
                  </button>
                </div>
                <div className="mt-6 flex justify-center">
                  <Link 
                    href={lastRecommendationUrl || "/recommender"} 
                    onClick={handleReset} 
                    className="px-12 py-3 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white/90 border border-white/20 hover:border-white/30 font-medium"
                  >
                    Wróć do Rekomendacji
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile Version */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed bottom-2 left-4 right-4 z-50 sm:hidden"
          >
            <motion.div
              initial={{ y: 20, opacity: 0.9 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0.9 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-violet-500/10 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon icon="recommend" className="!text-xl" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-bold text-white text-base">Silnik jest gotowy!</p>
                  </div>
                  <button 
                    onClick={handleReset} 
                    className="absolute top-1 right-1 text-white/70 hover:text-white transition-colors p-1.5 rounded-lg"
                  >
                    <Icon icon="close" className="!text-lg" />
                  </button>
                </div>
                <div className="mt-3 flex justify-center">
                  <Link 
                    href={lastRecommendationUrl || "/recommender"} 
                    onClick={handleReset} 
                    className="px-4 py-2.5 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white/90 border border-white/20 font-medium w-full text-center"
                  >
                    Wróć do Rekomendacji
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
