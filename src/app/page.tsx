import Title from "@/components/global/Title";
import Container from "@/components/layout/Container";
import HeroCard from "@/components/global/CategoryCard";

export default function Home() {
  return (
    <section className="relative min-h-screen flex item-start md:items-center justify-center overflow-hidden pt-32 lg:pt-0 mb-10 lg:mb-0">
      <Container>
        <div className="relative flex flex-col items-center z-10 w-full mx-auto">
          <div className="relative z-10 w-full max-w-4xl text-center">
            <Title
              subtitle="Choose what interests you"
              gradientLight={{
              from: "from-pink-300",
              via: "via-purple-300",
              to: "to-sky-300",
              subtitleColor: "text-white",
            }}
            gradientDark={{
              from: "from-pink-300",
              via: "via-purple-400",
              to: "to-sky-400",
              subtitleColor: "text-white/80",
            }}
            >
              Movie Recommender
            </Title>
          </div>
          <div className="relative z-10 flex flex-col lg:flex-none lg:grid lg:grid-cols-3 items-stretch justify-center gap-6 lg:gap-8 w-full max-w-6xl mt-8">
            <HeroCard
              href="/recommender"
              icon="insights"
              title="Try Recommendations"
              description="Discover movies tailored just for you."
              buttonText="Start"
            />
            <HeroCard
              href="/movies"
              icon="database"
              title="Browse Movie Database"
              description="Browse all available movies."
              buttonText="View Movies"
            />
            <HeroCard
              href="/rankings"
              icon="leaderboard"
              title="Explore Movie Rankings"
              description="Check out the highest rated movies."
              buttonText="Open Rankings"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}