'use client';

import { H1, Section } from '@/components/ui';

export default function SeasonsPageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <Section padding="sm">
        <div className="text-center">
          <H1 className="mb-3 sm:mb-4 text-xl sm:text-3xl">시즌 목록</H1>
          <div className="mx-auto flex max-w-xl flex-col items-center gap-3">
            <div className="h-4 w-40 rounded bg-gray-200 animate-pulse" />
            <div className="h-3 w-64 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-md border p-4">
                <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
                <div className="mt-3 h-20 rounded bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
