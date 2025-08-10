'use client';

import SuperResults from '@/features/matches/components/SuperResults';

export default function SuperLeagueCategoryPage({
  seasonId,
  title,
}: {
  seasonId: number;
  title?: string;
}) {
  return (
    <main className="min-h-screen bg-white">
      <SuperResults seasonId={seasonId} title={title} />
    </main>
  );
}
