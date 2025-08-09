'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LineupsSkeletonProps {
  className?: string;
}

export default function LineupsSkeleton({ className }: LineupsSkeletonProps) {
  return (
    <div className={cn('mt-4 pt-3 border-t border-gray-200', className)}>
      <div className="text-sm font-medium text-gray-700 mb-3">👥 출전 선수</div>
      <div className="grid grid-cols-1 gap-4">
        {[0, 1].map((i) => (
          <Card key={i} className="bg-gray-50">
            <CardContent className="p-3">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 rounded-full mr-2 bg-gray-300" />
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
              </div>
              {/* 선발 */}
              <div className="mb-3">
                <div className="h-3 w-10 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="space-y-1">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="h-5 w-9 rounded border bg-gray-100 animate-pulse" />
                        <div className="flex min-w-0 flex-1 items-center">
                          <div className="h-5 w-5 rounded border bg-gray-100 mr-1 animate-pulse" />
                          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
                          <div className="flex gap-1 ml-2">
                            <div className="h-5 w-8 rounded bg-gray-100 animate-pulse" />
                            <div className="h-5 w-8 rounded bg-gray-100 animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* 교체 */}
              <div>
                <div className="h-3 w-14 bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="space-y-1">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <div className="h-5 w-9 rounded border bg-gray-100 opacity-80 animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
