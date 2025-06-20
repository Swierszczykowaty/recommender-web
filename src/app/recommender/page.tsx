import Title from '@/components/Title';
import Container from '@/components/Container';

export default function RecommenderPage() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 py-16">
    <Container>
     <div className="relative flex flex-col items-center z-10 w-full mx-auto">
        <Title subtitle="">Generowanie Rekomendacji</Title>
      </div>      
      </Container>
    </section>
  );
}