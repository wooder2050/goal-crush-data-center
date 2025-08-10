'use client';

import { Section } from '@/components/ui';
import Season1Results from '@/features/matches/components/Season1Results';

export default function Season1Page() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="sm">
        <Season1Results />
      </Section>
    </main>
  );
}
