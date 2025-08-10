'use client';

import { Card, CardContent } from '@/components/ui';

export default function SkeletonCard({
  className = '',
}: {
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative w-full aspect-[3/4] bg-gray-100 animate-pulse" />
      <CardContent className="p-3">
        <div className="h-4 w-1/2 bg-gray-200 rounded mt-2 animate-pulse" />
        <div className="h-3 w-1/3 bg-gray-200 rounded mt-2 animate-pulse" />
      </CardContent>
    </Card>
  );
}
