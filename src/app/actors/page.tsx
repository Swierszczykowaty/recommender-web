"use client";

import React from "react";
import Title from "@/components/global/Title";
import Container from "@/components/global/Container";

export default function AboutPage() {
  return (
    <section className="relative min-h-screen flex item-start md:items-center justify-center overflow-hidden pt-32 md:pt-0">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <Title
            subtitle="Dowiedz się więcej"
            gradientFrom="from-red-500"
            gradientVia="via-red-400"
            gradientTo="to-red-400"
          >
            Baza aktorów
          </Title>
        </div>
      </Container>
    </section>
  );
}
