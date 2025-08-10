'use client';

import { Section } from '@/components/ui';
import SbsCup2Results from '@/features/matches/components/SbsCup2Results';

export default function SbsCup2Page() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="sm">
        <SbsCup2Results />
      </Section>
    </main>
  );
}
