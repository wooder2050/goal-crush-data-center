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
      <CardHeader>
        <CardTitle>{seasonName ?? '시즌'} 시즌 요약</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="text-center">
              <div className="mx-auto h-7 w-16 rounded bg-gray-200 animate-pulse md:w-20" />
              <div className="mx-auto mt-2 h-3 w-20 rounded bg-gray-200 animate-pulse md:w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
