'use client';

import BackLink from '@/components/ui/back-link';
import { Season6ChallengeResults } from '@/features/matches';

export default function Season6ChallengePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="pt-6 pb-4">
          <BackLink href="/seasons" label="시즌 목록으로 돌아가기" />
        </div>
        <Season6ChallengeResults />
      </div>
    </main>
  );
}
