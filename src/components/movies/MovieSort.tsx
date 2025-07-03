"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react"; // ikona strzałki

const sortOptions = [
  { label: "Domyślne", value: "" },
  { label: "Tytuł A–Z", value: "title-asc" },
  { label: "Tytuł Z–A", value: "title-desc" },
  { label: "Ocena (malejąco)", value: "rating-desc" },
  { label: "Ocena (rosnąco)", value: "rating-asc" },
  { label: "Rok (najnowsze)", value: "year-desc" },
  { label: "Rok (najstarsze)", value: "year-asc" },
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
    sortOptions.find((opt) => opt.value === selected)?.label || "Domyślne";

  return (
    <div className="relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col">
        <div
          ref={dropdownRef}
          className="relative flex items-center gap-2 cursor-default"
        >
          <span className="text-white text-sm font-semibold text-nowrap">
            Sortuj po:
          </span>
          <button
            onClick={() => setOpen((o) => !o)}
            className="text-white/90 text-sm font-medium flex items-center gap-1 cursor-pointer"
          >
            {selectedLabel}
            <ChevronDown
              size={16}
              className={`transition-transform ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          {open && (
            <div className="absolute top-full mt-2 left-0 w-40 md:w-60 bg-gray-900/30 backdrop-blur rounded-xl shadow-lg p-2 z-50 border border-white/30 ">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-3 mt-1 py-1 rounded text-sm text-white ${
                    selected === opt.value
                      ? "bg-white/30 font-semibold"
                      : "hover:bg-white/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
