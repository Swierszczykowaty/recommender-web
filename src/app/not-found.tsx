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
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-white px-4">
      <div className="mb-8">
        <Icon icon="smart_toy" style={{ fontSize: 120 }} />
      </div>
      <h1 className="text-4xl font-bold mb-4">Ups… ta strona nie istnieje.</h1>
      <p className="mb-6">Za chwilę przekierujemy Cię na stronę główną.</p>
      <Link href="/">
        <button className="px-6 py-3 bg-white/20 border border-white/30 hover:bg-white/30 text-white rounded-lg transition">
          Powrót na stronę główną
        </button>
      </Link>
    </div>
  );
}
