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
                from: "from-emerald-300",
                via: "via-green-300",
                to: "to-lime-300",
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
          </motion.div>

          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="p-8 rounded-xl bg-white/5 backdrop-blur-lg border border-white/20 text-white shadow-xl"
          >
            {selectedSection === "overall" && (
              <>
                <p className="text-sm md:text-lg leading-relaxed text-justify">
                  Movie Recommender is a platform that makes it easy to find
                  movies tailored to your tastes. Simply select one title, and
                  the system will generate eight of the most similar recommendations
                  based on content analysis. Additionally, you can browse
                  the complete movie database, check detailed descriptions, and explore
                  rankings: top 100 by ratings, revenue, and vote count.
                </p>
                <p className="text-sm md:text-lg mt-4 text-white text-justify">
                  The site uses Content Based Filtering and data from TMDB. Everything
                  runs on Next.js with dynamic components, modern
                  animations (Framer Motion), and responsive styles (Tailwind CSS),
                  ensuring fast and convenient use on any device.
                </p>
              </>
            )}

            {selectedSection === "v1" && (
              <p className="text-sm md:text-lg leading-relaxed text-justify">
                Model v1 in progress Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis, delectus officiis, similique non assumenda nostrum eaque, perferendis at sint ullam dicta quas. Fuga reprehenderit quod animi sint est dolores et. Dolor ducimus consequuntur minus, fugiat reprehenderit sit quae accusantium doloremque inventore libero, voluptatem possimus. Reiciendis vero saepe nam quo sequi assumenda, doloribus mollitia dicta odio, corrupti deserunt est! Suscipit, doloremque. Voluptatem tempora illum eum, assumenda nobis, eaque perspiciatis autem fugiat placeat animi labore aperiam dolores libero magni et. At, aliquam.
              </p>
            )}

            {selectedSection === "v2" && (
              <p className="text-sm md:text-lg leading-relaxed text-justify">
                Model v2 in progress Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tempora voluptas ullam fugiat laborum amet neque sunt maxime aliquam perferendis nostrum, consequatur qui quos mollitia eaque odio culpa laudantium alias aut laboriosam, eius pariatur rem sint? Vel ipsum architecto et ut nisi dolores vero suscipit veritatis, ab reiciendis nesciunt illo beatae quibusdam cumque obcaecati dignissimos alias necessitatibus. Eligendi laboriosam corporis autem saepe animi ipsam? Enim illo natus velit officiis sed voluptatibus facilis nulla ullam nesciunt laudantium iusto, molestiae earum, quam minus, modi iste quibusdam. Neque, facilis! Dicta pariatur porro dolorem recusandae nesciunt, tempore velit, cupiditate reiciendis dolore placeat, totam modi accusantium?
              </p>
            )}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
