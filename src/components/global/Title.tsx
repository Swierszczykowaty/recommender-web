"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type TitleProps = {
  children: React.ReactNode;
  subtitle?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  subtitleColor?: string;
  link?: string;
};

export default function Title({
  children,
  subtitle,
  gradientFrom ,
  gradientVia,
  gradientTo,
  subtitleColor = "text-white/80",
  link,
}: TitleProps) {
  const content = (
    <motion.div
      className="relative z-10 w-full text-center cursor-pointer flex flex-col items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1
        className={`text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r pb-2 w-fit ${gradientFrom} ${
          gradientVia ? gradientVia : ""
        } ${gradientTo} drop-shadow-lg`}
      >
        {children}
      </h1>
      {subtitle && <p className={`text-md ${subtitleColor}`}>{subtitle}</p>}
    </motion.div>
  );
  if (link) {
    return (
      <Link href={link} passHref>
        {content}
      </Link>
    );
  }
  return content;
}
