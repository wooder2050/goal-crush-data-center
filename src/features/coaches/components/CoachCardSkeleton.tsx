'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

const CoachCardSkeleton: React.FC = () => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* 프로필 이미지 스켈레톤 */}
          <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200 animate-pulse" />

          {/* 본문 스켈레톤 */}
          <div className="flex-1 min-w-0">
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-3" />

            {/* 트로피 배지 영역 스켈레톤 */}
            <div className="mb-2 flex flex-wrap gap-1">
              <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-5 w-24 bg-gray-200 rounded-full animate-pulse" />
            </div>

            {/* 현재 팀 정보 스켈레톤 */}
            <div className="mb-2 flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachCardSkeleton;
