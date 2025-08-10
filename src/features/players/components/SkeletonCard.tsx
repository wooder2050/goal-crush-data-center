'use client';

import { Card, CardContent } from '@/components/ui';

export default function SkeletonCard({
  className = '',
}: {
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="w-full h-64 md:h-72 lg:h-80 bg-gray-100 animate-pulse" />
      <CardContent>
        <div className="h-4 w-1/2 bg-gray-200 rounded mt-2 animate-pulse" />
        <div className="h-3 w-1/3 bg-gray-200 rounded mt-2 animate-pulse" />
      </CardContent>
    </Card>
  );
}
