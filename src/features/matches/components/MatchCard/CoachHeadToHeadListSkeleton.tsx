'use client';

import React from 'react';

import { Card } from '@/components/ui';

interface Props {
  className?: string;
}

export default function CoachHeadToHeadListSkeleton({ className = '' }: Props) {
  return (
    <Card className={`p-3 sm:p-4 ${className}`}>
      <div className="mb-3 text-sm font-semibold text-gray-800">
        <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            {/* 날짜 스켈레톤 */}
            <div className="text-xs text-gray-500">
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>

            {/* 감독 정보 스켈레톤 */}
            <div className="flex items-center gap-2 flex-1 justify-center">
              <div className="text-xs font-medium">
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="text-xs font-bold text-gray-800">
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
              </div>
              <div className="text-xs font-medium">
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>

            {/* 경기 타입 스켈레톤 */}
            <div className="text-xs text-gray-500">
              <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
