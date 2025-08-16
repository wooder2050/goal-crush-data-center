'use client';

import Image from 'next/image';
import React, { useMemo } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
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
import CoachSeasonStatsSkeleton from './CoachSeasonStatsSkeleton';

interface CoachSeasonStatsProps {
  coachId: number;
  stats?: import('@/lib/types/database').CoachSeasonStats[];
}

const CoachSeasonStats: React.FC<CoachSeasonStatsProps> = ({
  coachId,
  stats,
}) => {
  return (
    <GoalWrapper fallback={<CoachSeasonStatsSkeleton />}>
      <CoachSeasonStatsInner coachId={coachId} stats={stats} />
    </GoalWrapper>
  );
};

function CoachSeasonStatsInner({ coachId, stats }: CoachSeasonStatsProps) {
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
                <TableHead className="w-[24%] truncate">시즌</TableHead>
                <TableHead className="w-[16%] sm:w-[28%] truncate">
                  팀
                </TableHead>
                <TableHead className="w-[10%] truncate">순위</TableHead>
                <TableHead className="w-[10%] truncate">경기</TableHead>
                <TableHead className="w-[10%] truncate">승</TableHead>
                <TableHead className="w-[10%] truncate">패</TableHead>
                <TableHead className="w-[10%] truncate">승률</TableHead>
                <TableHead className="hidden sm:table-cell w-[10%] truncate">
                  득점
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[10%] truncate">
                  실점
                </TableHead>
                <TableHead className="hidden sm:table-cell w-[10%] truncate">
                  득실차
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {effective.map((season) => (
                <TableRow key={season.season_id}>
                  {/* 시즌 */}
                  <TableCell className="truncate">
                    {shortenSeasonName(season.season_name)}
                  </TableCell>
                  {/* 팀 */}
                  <TableCell className="truncate w-[16%] sm:w-auto">
                    <div className="flex flex-wrap items-center gap-1 max-w-[140px] sm:max-w-[240px]">
                      {(season.teams_detailed ?? []).length > 0 ? (
                        (season.teams_detailed ?? []).map((t) => (
                          <span
                            key={t.team_id}
                            className="inline-flex items-center gap-1 text-[11px] md:text-xs text-gray-700 truncate"
                          >
                            {t.logo ? (
                              <span className="relative inline-block w-3.5 h-3.5">
                                <Image
                                  src={t.logo}
                                  alt={t.team_name}
                                  fill
                                  sizes="14px"
                                  className="rounded-full object-cover"
                                />
                              </span>
                            ) : (
                              <span className="w-3.5 h-3.5 rounded-full bg-gray-200 inline-block" />
                            )}
                            <span className="hidden sm:inline truncate max-w-[120px]">
                              {t.team_name}
                            </span>
                          </span>
                        ))
                      ) : (
                        <div className="hidden sm:block text-xs md:text-sm truncate max-w-[200px]">
                          {season.teams.join(', ')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  {/* 순위 */}
                  <TableCell className="truncate">
                    {season.position ?? '-'}
                  </TableCell>
                  {/* 경기 */}
                  <TableCell className="truncate">
                    {season.matches_played}
                  </TableCell>
                  {/* 승 */}
                  <TableCell className="text-green-600 font-semibold truncate">
                    {season.wins}
                  </TableCell>
                  {/* 패 */}
                  <TableCell className="text-red-600 font-semibold truncate">
                    {season.losses}
                  </TableCell>
                  {/* 승률 */}
                  <TableCell className="font-semibold truncate">
                    {season.win_rate}%
                  </TableCell>
                  {/* 득점 */}
                  <TableCell className="hidden sm:table-cell truncate">
                    {season.goals_for}
                  </TableCell>
                  {/* 실점 */}
                  <TableCell className="hidden sm:table-cell truncate">
                    {season.goals_against}
                  </TableCell>
                  {/* 득실차 */}
                  <TableCell
                    className={`hidden sm:table-cell ${season.goal_difference >= 0 ? 'text-green-600' : 'text-red-600'} truncate`}
                  >
                    {season.goal_difference >= 0 ? '+' : ''}
                    {season.goal_difference}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default CoachSeasonStats;
