"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/global/Icon";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 7000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-white px-4">
      <div className="mb-2">
        <Icon icon="smart_toy" className="!text-6xl animate-bounce" />
      </div>
      <h1 className="text-4xl text-center font-bold mb-4">Ups… ta strona nie istnieje.</h1>
      <p className="mb-6">Za chwilę przekierujemy Cię na stronę główną.</p>
      <Link href="/">
        <button className="px-6 py-3 bg-white/7 border border-white/30 hover:bg-white/10 text-white rounded-lg transition">
          Powrót na stronę główną
        </button>
      </Link>
    </div>
  );
}
