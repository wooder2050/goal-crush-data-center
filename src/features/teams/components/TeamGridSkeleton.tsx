'use client';

import { Card, CardContent } from '@/components/ui/card';

interface TeamGridSkeletonProps {
  items?: number;
}

export default function TeamGridSkeleton({
  items = 10,
}: TeamGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
      {Array.from({ length: items }).map((_, idx) => (
        <Card key={idx} className="overflow-hidden">
          <CardContent className="p-0">
            {/* 이미지 영역 스켈레톤 */}
            <div className="relative aspect-square w-full bg-gray-50">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gray-200 animate-pulse" />
              </div>
            </div>
            {/* 텍스트 영역 스켈레톤 */}
            <div className="p-5 space-y-3">
              <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-28 rounded bg-gray-100 animate-pulse" />
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="h-6 w-20 rounded-full bg-gray-100 animate-pulse" />
                <span className="h-6 w-24 rounded-full bg-gray-100 animate-pulse" />
                <span className="h-6 w-16 rounded-full bg-gray-100 animate-pulse" />
              </div>
              <div className="h-4 w-48 rounded bg-gray-100 animate-pulse mt-3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
