'use client';

import BackLink from '@/components/ui/back-link';
import { Season3SuperResults } from '@/features/matches';

export default function Season3SuperPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="pt-6 pb-4">
          <BackLink href="/seasons" label="시즌 목록으로 돌아가기" />
        </div>
        <Season3SuperResults />
      </div>
    </main>
  );
}
