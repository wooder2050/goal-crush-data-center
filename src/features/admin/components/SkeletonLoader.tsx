'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-700/40',
        className
      )}
    />
  );
}

export function SelectSkeletonItem() {
  return (
    <div className="flex items-center gap-2 py-1.5 px-2">
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function SelectSkeleton() {
  return (
    <div className="flex flex-col space-y-1.5">
      <Skeleton className="h-4 w-20" />
      <div className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr className="border-b">
      {Array(cols)
        .fill(0)
        .map((_, i) => (
          <td key={i} className="py-2 px-4">
            <Skeleton className="h-5 w-full" />
          </td>
        ))}
    </tr>
  );
}

export function TableSkeleton({
  rows = 3,
  cols = 4,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {Array(cols)
              .fill(0)
              .map((_, i) => (
                <th key={i} className="text-left py-2 px-4">
                  <Skeleton className="h-5 w-20" />
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows)
            .fill(0)
            .map((_, i) => (
              <TableRowSkeleton key={i} cols={cols} />
            ))}
        </tbody>
      </table>
    </div>
  );
}
