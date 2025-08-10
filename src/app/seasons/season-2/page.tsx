'use client';

import { Section } from '@/components/ui';
import Season2Results from '@/features/matches/components/Season2Results';

export default function Season2Page() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="sm">
        <Season2Results />
      </Section>
    </main>
  );
}
