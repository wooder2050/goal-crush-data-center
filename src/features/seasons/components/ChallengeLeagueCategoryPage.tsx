'use client';

import ChallengeResults from '@/features/matches/components/ChallengeResults';

export default function ChallengeLeagueCategoryPage({
  seasonId,
  title,
}: {
  seasonId: number;
  title?: string;
}) {
  return (
    <main className="min-h-screen bg-white">
      <ChallengeResults seasonId={seasonId} title={title} />
    </main>
  );
}
