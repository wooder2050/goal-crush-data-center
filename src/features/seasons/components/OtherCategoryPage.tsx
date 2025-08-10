'use client';

import OtherLeagueResults from '@/features/matches/components/OtherLeagueResults';

export default function OtherCategoryPage({
  seasonId,
  title,
}: {
  seasonId: number;
  title?: string;
}) {
  return (
    <main className="min-h-screen bg-white">
      <OtherLeagueResults seasonId={seasonId} title={title} />
    </main>
  );
}
