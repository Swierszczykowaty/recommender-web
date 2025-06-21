'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Title from '@/components/Title';
import Container from '@/components/Container';


export default function AboutPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 py-16">
    <Container>
     <div className="relative flex flex-col items-center z-10 w-full mx-auto">
        <motion.div
          className=""
          initial={{ opacity: 0, y:-20}} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          >
          <Title subtitle="">O Projekcie</Title>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 p-8 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 text-white shadow-xl"
        >
          <p className="text-lg leading-relaxed">
            Projekt powstał jako narzędzie rekomendujące filmy dopasowane do Twoich preferencji. Wykorzystuje techniki uczenia maszynowego oraz przyjazny interfejs użytkownika.
          </p>
          <p className="mt-4 text-white/80">
            Znajdziesz tu bazę filmów, które możesz przeglądać i dodawać do ulubionych, a także system rekomendacji, który uczy się Twoich wyborów.
          </p>
        </motion.div>
      </div>
      </Container>
    </section>
  );
}