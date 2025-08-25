"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import Icon from "@/components/global/Icon";

interface HeroCardProps {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  href?: string;
  onButtonClick?: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  href,
  onButtonClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const backgroundContentVariants: Variants = {
    rest: { filter: "blur(0px)", scale: 1 },
    hover: { filter: "blur(8px)", scale: 0.95 },
  };

  const foregroundContentVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.1 } },
  };

  const ButtonElement = href
    ? ({ children }: { children: React.ReactNode }) => (
        <Link
          href={href}
          className="flex items-center justify-center w-full gap-3 px-4 py-3 font-semibold text-white transition-colors duration-300 border border-white/40 rounded-lg hover:bg-white/10"
          onClick={onButtonClick}
        >
          <span>▶</span>
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <button
          onClick={onButtonClick}
          className="flex items-center justify-center w-full gap-3 px-4 py-3 font-semibold text-white transition-colors duration-300 border border-white/40 rounded-lg hover:bg-white/10"
        >
          <span>▶</span>
          {children}
        </button>
      );

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w- p-8 overflow-hidden text-center text-white transition-colors duration-300 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-gray-950/20"
      style={{ height: "320px" }}
    >
      {/* Tło: ikona i tytuł */}
      <motion.div
        className="flex flex-col items-center justify-center h-full"
        variants={backgroundContentVariants}
        animate={isHovered ? "hover" : "rest"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Icon
          icon={icon}
          className="mb-4 text-white"
          style={{ fontSize: "60px" }}
        />
        <h2 className="text-3xl font-bold">{title}</h2>
      </motion.div>

      {/* Warstwa na wierzchu: opis i przycisk */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
            variants={foregroundContentVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <p className="mb-6">{description}</p>
            <ButtonElement>{buttonText}</ButtonElement>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HeroCard;
