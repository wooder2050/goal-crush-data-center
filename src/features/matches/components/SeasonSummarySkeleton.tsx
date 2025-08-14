'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SeasonSummarySkeletonProps = {
  seasonName: string;
  className?: string;
};

export default function SeasonSummarySkeleton({
  seasonName,
  className,
}: SeasonSummarySkeletonProps) {
  return (
    <Card className={className}>
      <CardHeader className="px-0 sm:px-6 py-3 sm:py-6">
        <CardTitle className="sm:hidden text-sm leading-tight whitespace-nowrap">
          {(seasonName || '시즌')
            .replace(/\s*골\s*때리는\s*그녀들\s*/g, '')
            .trim()}{' '}
          시즌 요약
        </CardTitle>
        <CardTitle className="hidden sm:block">
          {seasonName ?? '시즌'} 시즌 요약
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto h-6 w-14 rounded bg-gray-200 animate-pulse sm:h-7 sm:w-20" />
              <div className="mx-auto mt-2 h-2.5 w-16 rounded bg-gray-200 animate-pulse sm:h-3 sm:w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
