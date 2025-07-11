// src/components/rankings/RankingCard.tsx
import Link from 'next/link';
import Icon from '@/components/global/Icon';

interface RankingCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

export default function RankingCard({
  icon,
  title,
  description,
  href,
}: RankingCardProps) {
  return (
    <Link
      href={href}
      className="group min-w-[280px] bg-white/20 border border-white/30 rounded-xl backdrop-blur-md p-6 flex flex-col items-center text-center hover:bg-white/20 transition"
    >
      <Icon
        icon={icon}
        className="mb-4 text-white group-hover:scale-110 transition-transform"
        style={{ fontSize: '60px' }}
      />
      <h2 className="text-2xl font-semibold mb-2 text-white">{title}</h2>
      <p className="text-white/80 mb-6">{description}</p>
      <span className="mt-auto inline-block px-5 py-2 bg-white/20 group-hover:bg-white/30 border border-white/30 rounded text-white font-medium transition">
        Sprawdź
      </span>
    </Link>
  );
}
