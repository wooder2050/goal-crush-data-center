'use client';

import { Suspense } from 'react';

import Season2Results from '@/features/matches/components/Season2Results';

export default function Season2Page() {
  return (
    <div className="container mx-auto">
      <Suspense fallback={<div className="text-center py-8">데이터를 불러오는 중...</div>}>
        <Season2Results />
      </Suspense>
    </div>
  );
}
