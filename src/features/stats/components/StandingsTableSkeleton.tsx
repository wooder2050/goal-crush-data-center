'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type StandingsTableSkeletonProps = {
  className?: string;
};

export default function StandingsTableSkeleton({
  className,
}: StandingsTableSkeletonProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-bold mb-2">순위표</h3>

      {/* Mobile skeleton */}
      <div className="sm:hidden space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-md border px-3 py-2 animate-pulse">
            <div className="flex items-center justify-between gap-2">
              <div className="h-4 w-16 bg-gray-200 rounded" />
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, j) => (
                <div
                  key={j}
                  className="rounded bg-gray-50 border border-gray-200 px-2 py-2 text-center"
                >
                  <div className="h-3 bg-gray-200 rounded mb-1" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop skeleton */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>순위</TableHead>
              <TableHead>팀명</TableHead>
              <TableHead>경기</TableHead>
              <TableHead>승</TableHead>
              <TableHead>패</TableHead>
              <TableHead>득점</TableHead>
              <TableHead>실점</TableHead>
              <TableHead>득실차</TableHead>
              <TableHead>승점</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                <TableCell>
                  <div className="h-4 w-12 bg-gray-200 rounded" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex-shrink-0" />
                    <div className="h-4 w-28 bg-gray-200 rounded" />
                  </div>
                </TableCell>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}>
                    <div className="h-4 w-10 bg-gray-200 rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
