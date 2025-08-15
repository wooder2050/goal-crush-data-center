'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CoachDetailSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 스켈레톤: 실제 레이아웃 크기 맞춤 */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-start md:space-x-6 space-y-4 md:space-y-0">
          {/* 프로필 이미지 */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 rounded-full animate-pulse" />
          </div>

          {/* 텍스트 블록 */}
          <div className="flex-1">
            <div className="h-7 md:h-9 bg-gray-200 rounded animate-pulse mb-2 w-40 md:w-56" />
            <div className="h-4 md:h-5 bg-gray-200 rounded animate-pulse mb-2 md:mb-3 w-28 md:w-32" />
            <div className="mb-3 md:mb-4">
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 스켈레톤 */}
      <div className="mb-4 md:mb-6">
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="-mb-px flex space-x-4 md:space-x-8 whitespace-nowrap px-1">
            <div className="h-8 md:h-10 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-8 md:h-10 bg-gray-200 rounded animate-pulse w-24" />
          </div>
        </div>
      </div>

      {/* 탭 컨텐츠 스켈레톤: 시즌별 통계 테이블 형태 */}
      <Card>
        <CardHeader className="px-0 sm:px-0 md:px-0">
          <CardTitle>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-28" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-0 md:p-0">
          <div className="divide-y">
            <div className="grid grid-cols-6 md:grid-cols-11 gap-2 px-4 py-3 text-xs md:text-sm">
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-4 bg-gray-200 rounded w-12" />
              <div className="h-4 bg-gray-200 rounded w-10" />
              <div className="hidden sm:block h-4 bg-gray-200 rounded w-10" />
              <div className="h-4 bg-gray-200 rounded w-10" />
              <div className="h-4 bg-gray-200 rounded w-12" />
              <div className="h-4 bg-gray-200 rounded w-12" />
              <div className="hidden sm:block h-4 bg-gray-200 rounded w-12" />
              <div className="hidden sm:block h-4 bg-gray-200 rounded w-12" />
              <div className="hidden sm:block h-4 bg-gray-200 rounded w-12" />
              <div className="hidden sm:block h-4 bg-gray-200 rounded w-28" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-6 md:grid-cols-11 gap-2 px-4 py-2"
              >
                <div className="h-4 bg-gray-100 rounded w-20 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-10 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-8 animate-pulse" />
                <div className="hidden sm:block h-4 bg-gray-100 rounded w-8 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-8 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-10 animate-pulse" />
                <div className="h-4 bg-gray-100 rounded w-10 animate-pulse" />
                <div className="hidden sm:block h-4 bg-gray-100 rounded w-10 animate-pulse" />
                <div className="hidden sm:block h-4 bg-gray-100 rounded w-10 animate-pulse" />
                <div className="hidden sm:block h-4 bg-gray-100 rounded w-10 animate-pulse" />
                <div className="hidden sm:block h-4 bg-gray-100 rounded w-28 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachDetailSkeleton;
