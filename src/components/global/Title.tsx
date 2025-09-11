"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Gradient = {
  from: string;
  via?: string;
  to: string;
  subtitleColor?: string;
};

type Props = {
  children: React.ReactNode;
  subtitle?: string;
  gradientLight: Gradient;
  gradientDark: Gradient;
  link?: string;
};

function Heading({
  children,
  subtitle,
  grad,
}: {
  children: React.ReactNode;
  subtitle?: string;
  grad: Gradient;
}) {
  return (
    <motion.div
      className="relative z-10 w-full text-center flex flex-col items-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1
        className={[
          "text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r pb-2 w-fit drop-shadow-lg",
          grad.from,
          grad.via ?? "",
          grad.to,
        ].join(" ")}
      >
        {children}
      </h1>
      {subtitle && (
        <p
          className={`text-sm md:text-lg ${
            grad.subtitleColor ?? "text-white/80"
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default function Title({
  children,
  subtitle,
  gradientLight,
  gradientDark,
  link,
}: Props) {
  const Light = (
    <Heading grad={gradientLight} subtitle={subtitle}>
      {children}
    </Heading>
  );
  const Dark = (
    <Heading grad={gradientDark} subtitle={subtitle}>
      {children}
    </Heading>
  );

  return (
    <>
      <div className="dark:hidden">
        {link ? <Link href={link}>{Light}</Link> : Light}
      </div>
      <div className="hidden dark:block">
        {link ? <Link href={link}>{Dark}</Link> : Dark}
      </div>
    </>
  );
}
