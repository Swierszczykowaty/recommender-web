"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "@/components/global/Icon"; // zakładam, że tu masz swój komponent Icon

type HeroBoxProps = {
  href: string;
  icon: string; // zamiast ReactElement, używamy nazwę ikony
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: string; // dodatkowa opcjonalna ikona przycisku
};

export default function HeroBox({
  href,
  icon,
  title,
  description,
  buttonText,
  buttonIcon = "play_arrow", // domyślna ikona przycisku
}: HeroBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group flex-1 h-full flex flex-col justify-between items-center bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-6 text-center shadow-xl transition hover:bg-white/20 duration-300"
      >
        <div className="flex flex-col">
          <Icon icon={icon} className="mb-4 text-white" style={{ fontSize: '60px' }} />
          <h1 className="text-2xl font-bold mb-4 text-white">{title}</h1>
          <p className="text-white/80 text-base mb-6">{description}</p>
        </div>
        <div className="flex items-center justify-center w-full max-w-md gap-2 text-white border border-white/30 rounded-lg px-6 py-3 bg-white/10 hover:bg-white/20 transition duration-300">
          <Icon icon={buttonIcon} className="text-white text-xl " />
          {buttonText}
        </div>
      </Link>
    </motion.div>
  );
}
