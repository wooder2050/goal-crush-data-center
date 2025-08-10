'use client';

import { Section } from '@/components/ui';
import SbsCup1Results from '@/features/matches/components/SbsCup1Results';

export default function SbsCup1Page() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="sm">
        <SbsCup1Results />
      </Section>
    </main>
  );
}
