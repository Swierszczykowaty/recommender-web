"use client";
import React from "react";
import { motion } from "framer-motion";

type TitleProps = {
  children: React.ReactNode;
  subtitle?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  subtitleColor?: string;
};

export default function Title({
  children,
  subtitle,
  gradientFrom = "from-orange-600",
  gradientVia,
  gradientTo = "to-amber-600",
  subtitleColor = "text-white/80",
}: TitleProps) {
  return (
    <motion.div
      className="relative z-10 w-full max-w-4xl text-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2
        className={`text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r pb-2 ${gradientFrom} ${
          gradientVia ? gradientVia : ""
        } ${gradientTo} drop-shadow-lg`}
      >
        {children}
      </h2>
      {subtitle && (
        <p className={`text-md ${subtitleColor}`}>{subtitle}</p>
      )}
    </motion.div>
  );
}
