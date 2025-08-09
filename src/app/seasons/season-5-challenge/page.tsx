'use client';

import { Section } from '@/components/ui';
import BackLink from '@/components/ui/back-link';
import { Season5ChallengeResults } from '@/features/matches';

export default function Season5ChallengePage() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="sm">
        <div className="mb-6">
          <BackLink href="/seasons" label="시즌 목록으로 돌아가기" />
        </div>
        <Season5ChallengeResults />
      </Section>
    </main>
  );
}
