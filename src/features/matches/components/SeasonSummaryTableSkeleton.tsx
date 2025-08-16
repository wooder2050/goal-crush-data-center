'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SeasonSummaryTableSkeleton() {
  return (
    <Card>
      <CardHeader className="px-0 py-3 sm:px-6 sm:py-6">
        <CardTitle className="text-sm leading-tight sm:text-base">
          시즌별 통계 요약
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        {/* Mobile cards skeleton */}
        <div className="sm:hidden space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-md border px-3 py-2 animate-pulse"
            >
              <div className="flex items-baseline justify-between gap-2">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
                {Array.from({ length: 5 }).map((_, statIndex) => (
                  <React.Fragment key={statIndex}>
                    <div className="w-16 h-3 bg-gray-200 rounded"></div>
                    <div className="w-12 h-3 bg-gray-200 rounded ml-auto"></div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table skeleton */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full border text-center">
            <thead>
              <tr>
                {Array.from({ length: 6 }).map((_, index) => (
                  <th
                    key={index}
                    className="border px-1.5 py-1 bg-gray-100 text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
                  >
                    <div className="w-16 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {Array.from({ length: 6 }).map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="border px-1.5 py-1 text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
                    >
                      <div className="w-12 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
