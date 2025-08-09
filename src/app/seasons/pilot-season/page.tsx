'use client';

import { Section } from '@/components/ui';
import BackLink from '@/components/ui/back-link';
import PilotSeasonResults from '@/features/matches/components/PilotSeasonResults';

export default function PilotSeasonPage() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="lg">
        <div className="mb-6">
          <BackLink href="/seasons" label="시즌 목록으로 돌아가기" />
        </div>
        <PilotSeasonResults />
      </Section>
    </main>
  );
}
