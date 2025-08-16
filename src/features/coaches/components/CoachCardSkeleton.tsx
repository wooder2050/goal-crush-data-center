'use client';

import React from 'react';

import { Card, CardContent } from '@/components/ui/card';

export default function CoachCardSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* 프로필 이미지 스켈레톤 */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 relative rounded-full overflow-hidden bg-gray-200 animate-pulse"></div>
          </div>

          {/* 정보 스켈레톤 */}
          <div className="flex-1 min-w-0">
            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse mb-2"></div>

            {/* 트로피 스켈레톤 */}
            <div className="mb-2">
              <div className="mt-1 flex flex-wrap gap-1">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-16 h-5 bg-gray-200 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* 현재 팀 스켈레톤 */}
            <div className="mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* 통계 스켈레톤 */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <span>팀</span>
                <div className="w-6 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center space-x-1">
                <span>승률</span>
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                <span>%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
