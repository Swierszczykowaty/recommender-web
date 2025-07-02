"use client";

import React from "react";
import Container from "@/components/global/Container";
// Jeśli masz „name_basics_100_with_photos.json” w katalogu /data obok /app,
// ścieżka może być np.:
import actors from "@/data/name_basics_100_with_photos.json";

export default function TestPage() {
  return (
    <section className="relative min-h-screen flex items-start md:items-center justify-center overflow-hidden pt-32 md:pt-0 mt-60">
      <Container>
        <h1 className="text-3xl font-bold ">Actors</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {actors.map((actor) => (
            <div
              key={actor.nconst}
              className="bg-white text-black shadow-lg rounded-lg overflow-hidden"
            >
              {actor.photo_url ? (
                <img
                  src={actor.photo_url}
                  alt={actor.primaryName}
                  className="w-full h-56 object-cover"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">
                  {actor.primaryName}
                </h2>
                {actor.birthYear && actor.birthYear !== "\\N" && (
                  <p className="text-sm text-gray-600">
                    Born: {actor.birthYear}
                  </p>
                )}
                {actor.deathYear &&
                  actor.deathYear !== "\\N" && (
                    <p className="text-sm text-gray-600">
                      Died: {actor.deathYear}
                    </p>
                  )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
