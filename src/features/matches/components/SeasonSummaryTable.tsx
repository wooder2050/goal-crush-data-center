'use client';

import React from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

import { getSeasonSummariesPrisma } from '../api-prisma';
import SeasonSummaryTableSkeleton from './SeasonSummaryTableSkeleton';

const columns = [
  { key: 'season_id', label: '시즌 ID' },
  { key: 'season_name', label: '시즌명' },
  { key: 'total_matches', label: '총 경기 수' },
  { key: 'participating_teams', label: '참여 팀 수' },
  { key: 'completed_matches', label: '완료된 경기' },
  { key: 'penalty_matches', label: '승부차기 경기' },
  { key: 'completion_rate', label: '진행률(%)' },
];

const SeasonSummaryTable: React.FC = () => {
  return (
    <GoalWrapper fallback={<SeasonSummaryTableSkeleton />}>
      <SeasonSummaryTableInner />
    </GoalWrapper>
  );
};

function SeasonSummaryTableInner() {
  const { data } = useGoalSuspenseQuery(getSeasonSummariesPrisma, []);

  return (
    <Card>
      <CardHeader className="px-0 py-3 sm:px-6 sm:py-6">
        <CardTitle className="text-sm leading-tight sm:text-base">
          시즌별 통계 요약
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 sm:px-6">
        {/* Mobile cards */}
        <div className="sm:hidden space-y-3">
          {data && data.length > 0 ? (
            data.map((row) => (
              <div key={row.season_id} className="rounded-md border px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-sm font-semibold truncate">
                    {row.season_name}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    ID {row.season_id}
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
                  <div className="text-gray-600">총 경기</div>
                  <div className="text-right font-medium">
                    {row.total_matches}
                  </div>
                  <div className="text-gray-600">참여 팀</div>
                  <div className="text-right font-medium">
                    {row.participating_teams}
                  </div>
                  <div className="text-gray-600">완료 경기</div>
                  <div className="text-right font-medium">
                    {row.completed_matches}
                  </div>
                  <div className="text-gray-600">승부차기</div>
                  <div className="text-right font-medium">
                    {row.penalty_matches}
                  </div>
                  <div className="text-gray-600">진행률</div>
                  <div className="text-right font-medium">
                    {Number(row.completion_rate).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-gray-500 text-[12px]">
              데이터가 없습니다.
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full border text-center">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="border px-1.5 py-1 bg-gray-100 text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.season_id}>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className="border px-1.5 py-1 text-[10px] sm:text-xs md:text-sm whitespace-nowrap"
                      >
                        {col.key === 'completion_rate'
                          ? `${Number(row[col.key as keyof typeof row]).toFixed(1)}%`
                          : row[col.key as keyof typeof row]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-gray-500 py-8">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default SeasonSummaryTable;
