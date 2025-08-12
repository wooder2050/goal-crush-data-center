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
  const {
    data: summaryArr = [],
    isLoading,
    error,
  } = useGoalQuery(getSeasonSummaryBySeasonIdPrisma, [seasonId]);
  const summary = summaryArr[0];

  // Mobile: remove the common phrase; Desktop: show full
  const baseTitle = `${seasonName} 시즌 요약`;
  const mobileSeason = seasonName
    .replace(/\s*골\s*때리는\s*그녀들\s*/g, '')
    .trim();
  const mobileTitle = `${mobileSeason || seasonName} 시즌 요약`;

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{seasonName ?? '시즌'} 시즌 요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto h-7 w-16 rounded bg-gray-200 animate-pulse md:w-20" />
                <div className="mx-auto mt-2 h-3 w-20 rounded bg-gray-200 animate-pulse md:w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !summary) {
    return (
      <Card className={className}>
        <CardHeader className="px-0 sm:px-6 py-3 sm:py-6">
          <CardTitle className="sm:hidden text-sm leading-tight whitespace-nowrap">
            {mobileTitle}
          </CardTitle>
          <CardTitle className="hidden sm:block">{baseTitle}</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
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
      label: '승부차기',
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
      <CardHeader className="px-0 sm:px-6 py-3 sm:py-6">
        <CardTitle className="sm:hidden text-sm leading-tight whitespace-nowrap">
          {mobileTitle}
        </CardTitle>
        <CardTitle className="hidden sm:block">{baseTitle}</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="grid grid-cols-5 gap-4">
          {summaryItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className={`text-base sm:text-2xl font-bold ${item.color}`}>
                {item.value}
              </div>
              <div className="text-[10px] sm:text-sm text-gray-600">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SeasonSummary;
