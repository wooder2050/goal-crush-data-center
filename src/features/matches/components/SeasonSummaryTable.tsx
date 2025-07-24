'use client';

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoalQuery } from '@/hooks/useGoalQuery';

import { getSeasonSummariesPrisma } from '../api-prisma';

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
  const { data, isLoading, error } = useGoalQuery(getSeasonSummariesPrisma, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>시즌별 통계 요약</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">불러오는 중...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            데이터를 불러올 수 없습니다.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-center">
              <thead>
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="border px-2 py-1 bg-gray-100 text-xs md:text-sm"
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
                          className="border px-2 py-1 text-xs md:text-sm"
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
        )}
      </CardContent>
    </Card>
  );
};

export default SeasonSummaryTable;
