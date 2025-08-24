'use client';

import { Container } from '@/components/ui/container';

export default function MatchDetailPageSkeleton() {
  return (
    <Container className="py-8">
      <div className="space-y-8">
        {/* 헤더 스켈레톤 */}
        <div className="flex justify-between items-center">
          <div className="animate-pulse bg-gray-200 h-8 w-64 rounded"></div>
          <div className="animate-pulse bg-gray-200 h-10 w-48 rounded"></div>
        </div>

        {/* 카드 스켈레톤 */}
        <div className="p-6 border rounded-lg shadow-sm bg-white">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-6 w-40 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-6 w-4 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-6 w-32 rounded"></div>
              </div>
            </div>
          </div>

          {/* 탭 스켈레톤 */}
          <div className="space-y-6">
            <div className="flex gap-2 border-b">
              {['스코어', '골', '어시스트', '라인업', '교체', '페널티킥'].map(
                (_tab, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 h-10 w-20 rounded-t-lg"
                  ></div>
                )
              )}
            </div>

            {/* 폼 스켈레톤 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="animate-pulse bg-gray-200 h-6 w-40 rounded"></div>
                <div className="space-y-2">
                  <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="animate-pulse bg-gray-200 h-4 w-48 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-4 w-64 rounded"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="animate-pulse bg-gray-200 h-6 w-40 rounded"></div>
                <div className="space-y-2">
                  <div className="animate-pulse bg-gray-200 h-4 w-24 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="animate-pulse bg-gray-200 h-4 w-48 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-4 w-64 rounded"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="animate-pulse bg-gray-200 h-10 w-32 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
