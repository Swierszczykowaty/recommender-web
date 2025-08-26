import Container from "@/components/global/Container";
import Title from "@/components/global/Title";
import RankingCard from "@/components/rankings/RankingCard";

export default function RankingsIndex() {
  return (
    <section className="relative min-h-screen flex item-start lg:items-center justify-center overflow-hidden pt-32 lg:pt-0 mb-10 lg:mb-0">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <Title
            subtitle="Sprawdź najlepsze produkcje"
            gradientFrom="from-rose-500"
            gradientVia="via-pink-400"
            gradientTo="to-fuchsia-300"
          >
            Baza rankingów
          </Title>
          <div className="relative z-10 flex flex-col lg:flex-none lg:grid lg:grid-cols-3 items-stretch justify-center gap-6 lg:gap-8 w-full max-w-6xl mt-8">
            <RankingCard
              href="/rankings/rating"
              icon="diamond_shine"
              title="Najlepiej oceniane"
              description="Zobacz filmy z najwyższą średnią oceną."
              buttonText="Sprawdź"
            />
            <RankingCard
              href="/rankings/votes"
              icon="how_to_vote"
              title="Najwięcej głosów"
              description="Sprawdź, które tytuły zebrały najwięcej opinii."
              buttonText="Sprawdź"
            />
            <RankingCard
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