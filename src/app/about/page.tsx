"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Title from "@/components/global/Title";
import Container from "@/components/layout/Container";

export default function AboutPage() {
  const [selectedSection, setSelectedSection] = useState("overall");
  return (
    <section className="relative min-h-screen flex item-start md:items-center justify-center overflow-hidden pt-32 md:pt-0 mb-10 lg:mb-0">
      <Container>
        <motion.div 
          layout
          transition={{
            layout: {
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }
          }}
          className="relative flex flex-col items-center z-10 w-full mx-auto"
        >
          <motion.div layout className="mb-6 text-center">
            <Title
              subtitle="Learn More"
              gradientLight={{
              from: "from-slate-700",
              via: "via-slate-500",
              to: "to-slate-800",
                subtitleColor: "text-white",
              }}
              gradientDark={{
                from: "from-emerald-400",
                via: "via-green-400",
                to: "to-lime-300",
                subtitleColor: "text-white/80",
              }}
            >
              About the Project
            </Title>
          </motion.div>

          <motion.div className="flex items-center justify-center gap-3 mb-6">
            <button
              onClick={() => setSelectedSection("overall")}
              className={`px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer ${
                selectedSection === "overall"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            >
              Overall
            </button>
            <button
              onClick={() => setSelectedSection("v1")}
              className={`px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer ${
                selectedSection === "v1"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            >
              Model v1
            </button>
            <button
              onClick={() => setSelectedSection("v2")}
              className={`px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer ${
                selectedSection === "v2"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            >
              Model v2
            </button>
            <button
              onClick={() => setSelectedSection("gemini")}
              className={`px-4 py-2 shadow-xl text-sm rounded-lg border backdrop-blur-md transition cursor-pointer ${
                selectedSection === "gemini"
                  ? "bg-white/20 border-white/50 text-white"
                  : "bg-white/7 border-white/30 text-white/80 hover:bg-white/10"
              }`}
            >
              Gemini (beta)
            </button>
          </motion.div>

          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 md:p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/20 text-white shadow-xl"
          >
            {selectedSection === "overall" && (
              <>
                <p className="text-sm md:text-lg leading-relaxed text-justify">
                  Movie Recommender is an engineering thesis project designed to
                  help users discover movies tailored to their specific tastes.
                  Unlike generic popularity lists, this system analyzes the
                  internal characteristics of a film to generate eight highly
                  similar recommendations.
                </p>
                <p className="text-sm md:text-lg mt-4 text-white text-justify">
                  The application is built on <strong>Next.js</strong>, leveraging
                  Server Side Rendering for performance and <strong>Tailwind CSS</strong>{" "}
                  with <strong>Framer Motion</strong> for a fluid, modern user
                  interface. Data is sourced from the TMDB and IMDB databases.
                </p>
              </>
            )}

            {selectedSection === "v1" && (
              <p className="text-sm md:text-lg leading-relaxed text-justify">
                The initial iteration of the recommendation engine focuses
                strictly on <strong>Natural Language Processing (NLP)</strong>.
                By utilizing the <strong>TF-IDF</strong> (Term Frequency-Inverse
                Document Frequency) algorithm, the model analyzes the "Overview"
                and "Tagline" of every movie in the dataset.
                This process converts text into mathematical vectors. We then
                calculate the <strong>Cosine Similarity</strong> between these
                vectors to find movies with the most semantically similar plots.
                This model excels at recommending movies based on narrative
                structure but ignores metadata like cast or genre.
              </p>
            )}

            {selectedSection === "v2" && (
              <p className="text-sm md:text-lg leading-relaxed text-justify">
                The second version introduces a "Metadata Soup" approach to
                improve accuracy. Instead of relying solely on plot descriptions,
                this model aggregates <strong>Genres, Keywords, Top 3 Cast Members,
                and Directors</strong> into a single tokenized string for each movie.
                We utilize <strong>CountVectorizer</strong> instead of TF-IDF
                here to ensure that recurring actors or directors are not
                penalized by the weighting algorithm. This results in
                recommendations that align better with the user's stylistic
                preferences, capturing the "vibe" of a movie rather than just
                its story.
              </p>
            )}

            {selectedSection === "gemini" && (
              <p className="text-sm md:text-lg leading-relaxed text-justify">
                This experimental feature bridges our local movie database with
                Google's <strong>Gemini Pro</strong> model. When triggered, the
                system constructs a detailed prompt describing the selected movie
                and asks the AI to generate a list of eight naturally similar
                titles based on its vast training data.
                The communication is handled via a secure Next.js server action
                (managing the API key and rate limits). The AI's text response
                is then parsed and cross-referenced with our internal TMDB
                catalog to display valid, clickable movie cards, offering a more
                "human-like" curation experience.
              </p>
            )}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
