"use client";
import Link from "next/link";
import { motion } from "framer-motion";

type HeroBoxProps = {
  href: string;
  icon: string;
  title: string;
  description: string;
  buttonText: string;
};

export default function HeroBox({
  href,
  icon,
  title,
  description,
  buttonText,
}: HeroBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <Link
        href={href}
        className="group flex-1 min-h-[300px] flex flex-col justify-between bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-6 py-12 text-center shadow-xl transition hover:bg-white/20"
      >
        <div>
          <span className="material-icons text-6xl md-60 mb-6 text-white">
            {icon}
          </span>
          <h1 className="text-3xl font-bold mb-4 text-white">{title}</h1>
          <p className="text-white/80 text-base mb-6">{description}</p>
        </div>
        <div className="inline-flex items-center justify-center gap-2 text-white border border-white/30 rounded-lg px-6 py-3 bg-white/10 group-hover:bg-white/20 transition">
          <span className="material-icons">play_arrow</span>
          {buttonText}
        </div>
      </Link>
    </motion.div>
  );
}
