'use client';

import React, { useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';
import { shortenSeasonName } from '@/lib/utils';

import { fetchCoachStats } from '../api-prisma';

interface CoachSeasonStatsProps {
  coachId: number;
  stats?: import('@/lib/types/database').CoachSeasonStats[];
}

const CoachSeasonStats: React.FC<CoachSeasonStatsProps> = ({
  coachId,
  stats,
}) => {
  const { data: fetched } = useGoalSuspenseQuery(fetchCoachStats, [coachId]);
  const rawEffective = stats ?? fetched?.season_stats;
  const effective = useMemo(() => {
    if (!rawEffective) return rawEffective;
    return [...rawEffective].sort((a, b) => a.season_id - b.season_id);
  }, [rawEffective]);

  if (!effective || effective.length === 0) {
    return (
      <Card>
        <CardHeader className="px-0 sm:px-0 md:px-0">
          <CardTitle>시즌별 통계</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-0 md:p-0">
          <p className="text-gray-500 text-center py-8">
            아직 경기 데이터가 없습니다.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-0 sm:px-0 md:px-0">
        <CardTitle>시즌별 통계</CardTitle>
      </CardHeader>
      <CardContent className="p-0 sm:p-0 md:p-0">
        <div className="overflow-x-hidden">
          <Table className="w-full table-fixed text-xs md:text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%] truncate">시즌</TableHead>
                <TableHead className="w-[12%] truncate">경기</TableHead>
                <TableHead className="w-[12%] truncate">승</TableHead>
                <TableHead className="hidden sm:table-cell w-[12%] truncate">
                  무
                </TableHead>
                <TableHead className="w-[12%] truncate">패</TableHead>
                <TableHead className="w-[12%] truncate">승률</TableHead>
                <TableHead className="w-[12%] truncate">순위</TableHead>
                <TableHead className="hidden sm:table-cell w-[12%] truncate">
                  득점
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[12%] truncate">
                  실점
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[12%] truncate">
                  득실차
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[28%] truncate">
                  팀
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {effective.map((season) => (
                <TableRow key={season.season_id}>
                  <TableCell className="truncate">
                    {shortenSeasonName(season.season_name)}
                  </TableCell>
                  <TableCell className="truncate">
                    {season.matches_played}
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold truncate">
                    {season.wins}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-yellow-600 font-semibold truncate">
                    {season.draws}
                  </TableCell>
                  <TableCell className="text-red-600 font-semibold truncate">
                    {season.losses}
                  </TableCell>
                  <TableCell className="font-semibold truncate">
                    {season.win_rate}%
                  </TableCell>
                  <TableCell className="truncate">
                    {season.position ?? '-'}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell truncate">
                    {season.goals_for}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell truncate">
                    {season.goals_against}
                  </TableCell>
                  <TableCell
                    className={`hidden sm:table-cell ${season.goal_difference >= 0 ? 'text-green-600' : 'text-red-600'} truncate`}
                  >
                    {season.goal_difference >= 0 ? '+' : ''}
                    {season.goal_difference}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-xs md:text-sm truncate max-w-[160px]">
                      {season.teams.join(', ')}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CoachSeasonStats;
