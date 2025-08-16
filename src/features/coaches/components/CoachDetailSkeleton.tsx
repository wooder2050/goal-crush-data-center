'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CoachDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 스켈레톤 */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-start md:space-x-6 space-y-4 md:space-y-0">
          {/* 프로필 이미지 스켈레톤 */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 md:w-24 md:h-24 relative rounded-full overflow-hidden bg-gray-200 animate-pulse"></div>
          </div>

          {/* 기본 정보 스켈레톤 */}
          <div className="flex-1">
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="w-24 h-5 bg-gray-200 rounded animate-pulse mb-2 md:mb-3"></div>

            {/* 트로피 스켈레톤 */}
            <div className="mb-3 md:mb-4">
              <div className="flex flex-wrap gap-2 text-sm">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>

            {/* 현재 팀 스켈레톤 */}
            <div className="mb-3 md:mb-4">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-24 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* 통계 스켈레톤 */}
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-8 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
                  <div className="w-16 h-4 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 탭 스켈레톤 */}
      <Tabs defaultValue="stats" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">시즌별 통계</TabsTrigger>
          <TabsTrigger value="timeline">감독 경력</TabsTrigger>
        </TabsList>

        <TabsContent value="stats">
          <Card>
            <CardHeader className="px-0 sm:px-0 md:px-0">
              <CardTitle>시즌별 통계</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-0 md:p-0">
              <div className="overflow-x-hidden">
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded animate-pulse"
                    >
                      <div className="w-20 h-4 bg-gray-200 rounded"></div>
                      <div className="w-16 h-4 bg-gray-200 rounded"></div>
                      <div className="w-12 h-4 bg-gray-200 rounded"></div>
                      <div className="w-8 h-4 bg-gray-200 rounded"></div>
                      <div className="w-8 h-4 bg-gray-200 rounded"></div>
                      <div className="w-8 h-4 bg-gray-200 rounded"></div>
                      <div className="w-12 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader className="px-0 sm:px-0 md:px-0">
              <CardTitle>감독 경력</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-0 md:p-0">
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 border rounded animate-pulse"
                  >
                    <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="w-32 h-5 bg-gray-200 rounded"></div>
                      <div className="w-24 h-4 bg-gray-200 rounded"></div>
                      <div className="w-40 h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
