'use client';

import { Section } from '@/components/ui';
import BackLink from '@/components/ui/back-link';
import { SbsCup2Results } from '@/features/matches';

export default function SbsCup2Page() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="lg">
        <div className="mb-6">
          <BackLink href="/seasons" label="시즌 목록으로 돌아가기" />
        </div>
        <SbsCup2Results />
      </Section>
    </main>
  );
}
