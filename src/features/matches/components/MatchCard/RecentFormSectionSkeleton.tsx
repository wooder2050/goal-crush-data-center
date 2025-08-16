'use client';

import React from 'react';

import { Card } from '@/components/ui';

interface Props {
  className?: string;
}

export default function RecentFormSectionSkeleton({ className = '' }: Props) {
  return (
    <Card className={`p-3 sm:p-4 ${className}`}>
      <div className="mb-3 text-sm font-semibold text-gray-800">
        📊 최근 5경기 성적
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-600 mb-2 font-medium">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="text-[10px] text-gray-500 space-y-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-600 mb-2 font-medium">
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="text-[10px] text-gray-500 space-y-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-20 h-3 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
