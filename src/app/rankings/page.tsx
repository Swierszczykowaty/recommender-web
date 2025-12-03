import Container from "@/components/layout/Container";
import Title from "@/components/global/Title";
import RankingCard from "@/components/global/CategoryCard";

export default function RankingsIndex() {
  return (
    <section className="relative min-h-screen flex item-start lg:items-center justify-center overflow-hidden pt-32 lg:pt-0 mb-10 lg:mb-0">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <Title
            subtitle="Check out the best productions"
            gradientLight={{
              from: "from-slate-700",
              via: "via-slate-500",
              to: "to-slate-800",
              subtitleColor: "text-white",
            }}
            gradientDark={{
              from: "from-rose-400",
              via: "via-pink-400",
              to: "to-fuchsia-300",
              subtitleColor: "text-white/80",
            }}
          >
            Rankings
          </Title>
          <div className="relative z-10 flex flex-col lg:flex-none lg:grid lg:grid-cols-3 items-stretch justify-center gap-6 lg:gap-8 w-full max-w-6xl mt-8">
            <RankingCard
              href="/rankings/rating"
              icon="diamond_shine"
              title="Top Rated"
              description="View movies with the highest average rating."
              buttonText="Check"
            />
            <RankingCard
              href="/rankings/votes"
              icon="how_to_vote"
              title="Most Votes"
              description="Check which titles collected the most votes."
              buttonText="Check"
            />
            <RankingCard
              href="/rankings/revenue"
              icon="attach_money"
              title="Highest Revenue"
              description="Ranking of movies with the highest revenue."
              buttonText="Check"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}