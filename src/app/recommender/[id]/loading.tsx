"use client";

import { motion } from "framer-motion";
import Container from "@/components/layout/Container";

export default function Loading() {
  return (
    <section className="relative min-h-screen overflow-hidden pb-10 pt-32">
      <Container>
        <div className="flex flex-col items-center w-full mx-auto relative">
          <motion.div
            className="mb-4 w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-end justify-between mb-3">
              <div className="skeleton h-5 w-40 rounded-md bg-white/10"></div>
              <div className="skeleton h-8 w-32 rounded-lg bg-white/10"></div>
            </div>
            <div className="skeleton border border-white/20 rounded-lg h-[140px] sm:h-[200px] bg-white/5"></div>
          </motion.div>

          <motion.div
            className="w-full max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="skeleton h-7 w-64 mx-auto mb-6 rounded-md bg-white/10"></div>
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="skeleton h-28 rounded-xl bg-white/5 border border-white/20"
                ></div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
