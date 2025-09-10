"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

export default function FadeImage(props: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      onLoadingComplete={() => setLoaded(true)}
      alt={props.alt || "Image"}
      className={`
    rounded-lg object-cover w-full
    transition-[opacity,filter] duration-700 ease-out
    ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-[2px]"}
  `}
    />
  );
}
