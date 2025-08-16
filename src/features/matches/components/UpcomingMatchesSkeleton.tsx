'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

interface Props {
  items?: number;
  className?: string;
}

export default function UpcomingMatchesSkeleton({
  items = 1,
  className = '',
}: Props) {
  return (
    <Card
      className={`${className} border-l-4 border-[#ff4800] bg-gradient-to-b from-[#fff7f3] to-white ring-1 ring-[#ff4800]/10`}
    >
      <CardHeader className="space-y-0 p-0">
        <CardTitle className="text-base p-0 flex items-center gap-2">
          <span className="inline-block h-4 w-4 rounded-full bg-[#ff4800]/20" />
          <span className="inline-block h-4 w-28 rounded bg-gray-200" />
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0">
        <ul className="divide-y divide-gray-100">
          {Array.from({ length: items }).map((_, idx) => (
            <li key={idx} className="py-2 sm:py-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-block h-5 w-5 rounded-full bg-gray-200" />
                  <span className="inline-block h-3 w-24 rounded bg-gray-200" />
                </div>
                <span className="inline-block h-4 w-5 rounded bg-gray-200" />
                <div className="flex items-center gap-2 min-w-0">
                  <span className="inline-block h-5 w-5 rounded-full bg-gray-200" />
                  <span className="inline-block h-3 w-24 rounded bg-gray-200" />
                </div>
                <div className="ml-auto text-right">
                  <span className="block h-3 w-24 rounded bg-gray-200" />
                  <span className="mt-1 block h-3 w-16 rounded bg-gray-200" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
