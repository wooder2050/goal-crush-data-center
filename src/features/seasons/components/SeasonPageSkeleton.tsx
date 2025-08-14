'use client';

import { Section } from '@/components/ui';

export default function SeasonPageSkeleton() {
  return (
    <Section padding="sm" className="pt-2 sm:pt-3">
      <div className="h-6 w-40 rounded bg-gray-200 animate-pulse mb-4" />
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-48 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </Section>
  );
}
