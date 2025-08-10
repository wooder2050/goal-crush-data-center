'use client';

import { Section } from '@/components/ui';
import Season2SuperResults from '@/features/matches/components/Season2SuperResults';

export default function Season2SuperPage() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="sm">
        <Season2SuperResults />
      </Section>
    </main>
  );
}
