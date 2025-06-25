'use client';

import Background from '@/components/global/Background';
import { usePathname } from 'next/navigation';

export default function LayoutBackground() {
  const pathname = usePathname();

  // Nie pokazuj tła na dynamicznych podstronach filmów
  const hideBackground = pathname.startsWith('/movies/');

  if (hideBackground) return null;

  return <Background />;
}
