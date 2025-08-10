'use client';

import PlayoffResults from '@/features/matches/components/PlayoffResults';

export default function PlayoffCategoryPage({
  seasonId,
  title,
}: {
  seasonId: number;
  title?: string;
}) {
  return (
    <main className="min-h-screen bg-white">
      <PlayoffResults seasonId={seasonId} title={title} />
    </main>
  );
}
