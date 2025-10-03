"use client";

import { useEngineStore } from '@/lib/engineStore';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Icon from './Icon';

export default function EngineStatusToast() {
  const { isEngineReady, wasNavigationAttempted, reset, lastRecommendationUrl } = useEngineStore();

  return (
    <AnimatePresence>
      {isEngineReady && wasNavigationAttempted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.div
            initial={{ y: 50, scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl shadow-violet-500/10 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon icon="recommend" className="!text-2xl" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-white">Silnik jest gotowy!</p>
                  <p className="text-sm text-white/70">Możesz teraz wrócić, aby zobaczyć swoje rekomendacje.</p>
                </div>
                <button onClick={() => reset()} className="text-white/50 hover:text-white transition-colors -mr-2 -mt-2 p-2">
                  <Icon icon="close" className="!text-xl" />
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <Link href={lastRecommendationUrl || "/recommender"} onClick={() => reset()} className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-white/90">
                    Wróć do Rekomendacji
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
