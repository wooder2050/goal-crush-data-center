'use client';

import Image from 'next/image';
import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import type { CoachWithHistory } from '@/lib/types/database';

interface CoachTimelineProps {
  history: CoachWithHistory['team_coach_history'];
  hasCurrent: boolean;
}

const CoachTimeline: React.FC<CoachTimelineProps> = ({
  history,
  hasCurrent,
}) => {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500 text-center">팀 이력이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  // 날짜순으로 정렬 (최신순)
  const sortedHistory = [...history].sort(
    (a, b) =>
      new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedHistory.map((item, index) => (
        <Card key={item.id} className="relative">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              {/* 타임라인 점 */}
              <div className="flex-shrink-0">
                <div
                  className={`w-3 h-3 rounded-full ${
                    item.is_current === true ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
                {index < sortedHistory.length - 1 && (
                  <div className="w-0.5 h-8 bg-gray-200 mx-auto mt-2" />
                )}
              </div>

              {/* 내용 */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  {item.team.logo && (
                    <div className="w-6 h-6 relative rounded-full overflow-hidden">
                      <Image
                        src={item.team.logo}
                        alt={`${item.team.team_name} 로고`}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.team.team_name}
                  </h3>
                  {hasCurrent && index === 0 && item.is_current === true && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      현재
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">{item.season.season_name}</span>
                  <span className="mx-2">•</span>
                  <span className="capitalize">
                    {item.role === 'head' ? '감독' : '코치'}
                  </span>
                </div>

                <div className="text-sm text-gray-500">
                  {new Date(item.start_date).toLocaleDateString('ko-KR')}
                  {item.end_date && (
                    <>
                      <span className="mx-2">~</span>
                      {new Date(item.end_date).toLocaleDateString('ko-KR')}
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CoachTimeline;
