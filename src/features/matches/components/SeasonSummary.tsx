'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getSeasonSummaryBySeasonIdPrisma } from '../api-prisma';

interface SeasonSummaryProps {
  seasonId: number;
  seasonName: string;
  className?: string;
}

interface SummaryItem {
  label: string;
  value: string | number;
  color: string;
}

const SeasonSummary: React.FC<SeasonSummaryProps> = ({
  seasonId,
  seasonName,
  className,
}) => {
  // 시즌별 요약 데이터를 React Query로 호출
  const {
    data: summaryArr = [],
    isLoading,
    error,
  } = useGoalQuery(getSeasonSummaryBySeasonIdPrisma, [seasonId]);
  const summary = summaryArr[0];

  // 로딩 상태
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{seasonName} 시즌 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-gray-500">시즌 정보를 불러오는 중...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{seasonName} 시즌 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-[#ff4800]">
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{seasonName} 시즌 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-gray-500">시즌 요약 데이터가 없습니다.</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const summaryItems: SummaryItem[] = [
    {
      label: '총 경기 수',
      value: summary.total_matches,
      color: 'text-blue-600',
    },
    {
      label: '참여 팀 수',
      value: summary.participating_teams,
      color: 'text-green-600',
    },
    {
      label: '완료된 경기',
      value: summary.completed_matches,
      color: 'text-purple-600',
    },
    {
      label: '승부차기 경기',
      value: summary.penalty_matches,
      color: 'text-orange-600',
    },
    {
      label: '진행률',
      value: `${Number(summary.completion_rate).toFixed(1)}%`,
      color: 'text-[#ff4800]',
    },
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{seasonName} 시즌 요약</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {summaryItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonSummary;
