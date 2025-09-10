"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Szukaj filmu...",
}: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchTerm.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full flex items-center gap-2 mb-4"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full text-sm shadow-xl md:text-md px-4 py-2 rounded-lg bg-white/7 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-white/40 hover:bg-white/10 transition duration-300"
        />
        <button
          type="submit"
          className="px-4 py-2 text-sm shadow-xl bg-white/7 border border-white/30 rounded-lg text-white hover:bg-white/10 transition"
        >
          Szukaj
        </button>
      </form>
    </motion.div>
  );
}
