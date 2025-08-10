'use client';

import GLeagueResults from '@/features/matches/components/GLeagueResults';

export default function GLeagueCategoryPage({
  seasonId,
  title,
}: {
  seasonId: number;
  title?: string;
}) {
  return (
    <main className="min-h-screen bg-white">
      <GLeagueResults seasonId={seasonId} title={title} />
    </main>
  );
}
