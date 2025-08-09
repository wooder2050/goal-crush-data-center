'use client';

import { Section } from '@/components/ui';
import BackLink from '@/components/ui/back-link';
import Season1Results from '@/features/matches/components/Season1Results';

export default function Season1Page() {
  return (
    <main className="min-h-screen bg-white">
      <Section padding="sm">
        <div className="mb-6">
          <BackLink href="/seasons" label="시즌 목록으로 돌아가기" />
        </div>
        <Season1Results />
      </Section>
    </main>
  );
}
