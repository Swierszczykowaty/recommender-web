// src/app/rankings/page.tsx
import Container from "@/components/global/Container";
import Title from "@/components/global/Title";
import HeroBox from "@/components/hero/Hero_box";

export const RANKING_TYPES = [
  { key: "rating", label: "Najlepiej oceniane" },
  { key: "votes", label: "Najwięcej głosów" },
  { key: "revenue", label: "Największy zysk" },
] as const;

export type RankingType = (typeof RANKING_TYPES)[number]["key"];

export default function RankingsIndex() {
  return (
    <section className="relative min-h-screen flex item-start md:items-center justify-center overflow-hidden pt-32 md:pt-0 mb-10 md:mb-0">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <Title
            subtitle="Sprawdź najlepsze produkcje"
            gradientFrom="from-pink-700"
            gradientVia="via-rose-600"
            gradientTo="to-red-600"
          >
            Baza rankingów
          </Title>

          <div className="relative z-10 flex flex-col md:flex-row items-stretch justify-center gap-6 md:gap-8 w-full max-w-6xl mt-8">
            <HeroBox
              href="/rankings/rating"
              icon="diamond_shine"
              title="Najlepiej oceniane"
              description="Zobacz filmy z najwyższą średnią oceną."
              buttonText="Sprawdź"
            />
            <HeroBox
              href="/rankings/votes"
              icon="how_to_vote"
              title="Najwięcej głosów"
              description="Sprawdź, które tytuły zebrały najwięcej opinii."
              buttonText="Sprawdź"
            />
            <HeroBox
              href="/rankings/revenue"
              icon="attach_money"
              title="Największy zysk"
              description="Ranking filmów o największych przychodach."
              buttonText="Sprawdź"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
