'use client';

import { Suspense } from 'react';
import MoviesPage from './MoviesPage';

export default function MoviesPageWrapper() {
  return (
    <Suspense fallback={<div className="text-white text-center py-10">Ładowanie filmów...</div>}>
      <MoviesPage />
    </Suspense>
  );
}
