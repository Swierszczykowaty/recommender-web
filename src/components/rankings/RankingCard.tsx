"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "@/components/global/Icon";

type HeroBoxProps = {
  href: string;
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: string;
};

export default function HeroBox({
  href,
  icon,
  title,
  description,
  buttonText,
  buttonIcon = "play_arrow",
}: HeroBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link
        href={href}
        className="group flex-1 h-full flex flex-col justify-between items-center bg-white/7 backdrop-blur-lg border border-white/20 rounded-xl px-4 py-6 text-center shadow-xl transition hover:bg-white/10 duration-300"
      >
        <div className="flex flex-col">
          <Icon
            icon={icon}
            className="mb-4 text-white !text-5xl !md:text-6xl"
          />
          <h1 className="text-xl md:text-2xl font-bold mb-4 text-white">{title}</h1>
          <p className="text-white/80 text-sm md:text-md mb-6">{description}</p>
        </div>
        <div className="flex items-center justify-center w-full max-w-md gap-2 text-white border border-white/20 rounded-lg px-4 py-1 md:py-2 bg-white/10 hover:bg-white/20 transition duration-300 text-sm md:text-md">
          <Icon icon={buttonIcon} className="text-white !text-2xl " />
          {buttonText}
        </div>
      </Link>
    </motion.div>
  );
}
