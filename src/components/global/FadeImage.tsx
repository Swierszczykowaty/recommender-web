"use client";
import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type FadeImageProps = ImageProps & {
  fadeDurationMs?: number;
};

export default function FadeImage({ alt, className, fadeDurationMs = 700, ...props }: FadeImageProps) {
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Upewnij się, że mamy co najmniej jeden paint z opacity-0 po hydratacji
  useEffect(() => {
    // kolejka do następnej klatki
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Image
      {...props}
      alt={alt}
      // Dla obrazów z cache: opóźnij ustawienie loaded o 2 klatki, żeby transition miało „start”
      onLoadingComplete={() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => setLoaded(true));
        });
      }}
      className={[
        className ?? "",
        "rounded-lg object-cover w-full",
        "ease-out", // możesz dodać "will-change-[opacity,filter]" jeśli chcesz
        `transition-[opacity,filter] duration-${fadeDurationMs}`,
        mounted && loaded ? "opacity-100 blur-0" : "opacity-0 blur-[2px]",
      ].join(" ")}
    />
  );
}
