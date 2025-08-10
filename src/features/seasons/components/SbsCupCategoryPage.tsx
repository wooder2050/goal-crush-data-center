'use client';

import SbsCupResults from '@/features/matches/components/SbsCupResults';

export default function SbsCupCategoryPage({
  seasonId,
  title,
}: {
  seasonId: number;
  title?: string;
}) {
  return (
    <main className="min-h-screen bg-white">
      <SbsCupResults seasonId={seasonId} title={title} />
    </main>
  );
}
