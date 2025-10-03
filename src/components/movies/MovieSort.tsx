"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import Icon from "@/components/global/Icon";
import { motion, AnimatePresence } from "framer-motion";

const sortOptions = [
  { label: "Default", value: "" },
  { label: "Title A–Z", value: "title-asc" },
  { label: "Title Z–A", value: "title-desc" },
  { label: "Rating (descending)", value: "rating-desc" },
  { label: "Rating (ascending)", value: "rating-asc" },
  { label: "Year (newest)", value: "year-desc" },
  { label: "Year (oldest)", value: "year-asc" },
];

export default function MovieSort() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const current = searchParams.get("sort") || "";
  const [selected, setSelected] = useState(current);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    setOpen(false);

    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("sort", value);
    else params.delete("sort");
    params.set("page", "1");
    router.push(`/movies?${params.toString()}`);
  };

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const selectedLabel =
    sortOptions.find((opt) => opt.value === selected)?.label || "Default";

  return (
    <div
      ref={dropdownRef}
      className="relative flex items-center gap-2 cursor-default"
    >
      <span className="hidden md:inline text-white font-semibold whitespace-nowrap">
        Sort by:
      </span>

      <button
        onClick={() => setOpen((o) => !o)}
        className="text-white/90 text-sm font-medium flex items-center gap-1 cursor-pointer"
      >
        <span className="inline md:hidden">Sort</span>
        <span className="hidden md:inline">{selectedLabel}</span>
        <Icon
          icon="keyboard_arrow_up"
          className={`transition-transform ${open ? "rotate-0" : "rotate-180"}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            className="absolute top-full mt-2 right-0 md:left-0 w-40 md:w-60 bg-gray-950/20 backdrop-blur-md rounded-lg shadow-lg p-2 z-50 border border-white/30"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {sortOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-3 mt-1 py-1 rounded text-sm text-white ${
                  selected === opt.value
                    ? "bg-white/20 font-semibold border border-white/30"
                    : "hover:bg-white/20"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
