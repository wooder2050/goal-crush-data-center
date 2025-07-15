'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getMatchesBySeason } from '../api';

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
  // 시즌별 매치 데이터를 React Query로 직접 호출
  const {
    data: matches = [],
    isLoading,
    error,
  } = useGoalQuery(getMatchesBySeason, [seasonId]);

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
            <div className="text-red-500">
              시즌 정보를 불러올 수 없습니다:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 통계 계산
  const totalMatches = matches.length;
  const completedMatches = matches.filter(
    (match) => match.home_score !== null && match.away_score !== null
  ).length;
  const completionRate =
    totalMatches > 0 ? (completedMatches / totalMatches) * 100 : 0;

  // 참여 팀 수 계산 (중복 제거)
  const participatingTeams = new Set<number>();
  matches.forEach((match) => {
    if (typeof match.home_team_id === 'number')
      participatingTeams.add(match.home_team_id);
    if (typeof match.away_team_id === 'number')
      participatingTeams.add(match.away_team_id);
  });

  // 승부차기 경기 수 계산
  const penaltyMatches = matches.filter(
    (match) =>
      typeof match.penalty_home_score === 'number' &&
      typeof match.penalty_away_score === 'number'
  ).length;

  const summaryItems: SummaryItem[] = [
    { label: '총 경기 수', value: totalMatches, color: 'text-blue-600' },
    {
      label: '참여 팀 수',
      value: participatingTeams.size,
      color: 'text-green-600',
    },
    { label: '완료된 경기', value: completedMatches, color: 'text-purple-600' },
    { label: '승부차기 경기', value: penaltyMatches, color: 'text-orange-600' },
    {
      label: '진행률',
      value: `${completionRate.toFixed(1)}%`,
      color: 'text-red-600',
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
