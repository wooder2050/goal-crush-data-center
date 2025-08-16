'use client';

import React from 'react';

import { Card } from '@/components/ui';

interface Props {
  className?: string;
}

export default function CoachHeadToHeadSectionSkeleton({
  className = '',
}: Props) {
  return (
    <Card className={`p-3 sm:p-4 ${className}`}>
      <div className="mb-3 text-sm font-semibold text-gray-800">
        <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        {/* 홈팀 감독 스켈레톤 */}
        <div>
          <div className="text-xs text-gray-600 mb-2">
            <div className="h-3 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            <div className="h-8 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
          </div>
          <div className="text-xs text-gray-500">
            <div className="h-3 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* 무승부 스켈레톤 */}
        <div>
          <div className="text-xs text-gray-600 mb-2">
            <div className="h-3 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            <div className="h-8 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
          </div>
          <div className="text-xs text-gray-500">
            <div className="h-3 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
          </div>
        </div>

        {/* 원정팀 감독 스켈레톤 */}
        <div>
          <div className="text-xs text-gray-600 mb-2">
            <div className="h-3 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
          </div>
          <div className="text-2xl font-bold text-gray-800 mb-1">
            <div className="h-8 bg-gray-200 rounded w-12 mx-auto animate-pulse"></div>
          </div>
          <div className="text-xs text-gray-500">
            <div className="h-3 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
