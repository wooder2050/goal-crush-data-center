'use client';

import { Section } from '@/components/ui';
import PilotSeasonResults from '@/features/matches/components/PilotSeasonResults';

export default function PilotSeasonPage() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="lg">
        <PilotSeasonResults />
      </Section>
    </main>
  );
}
