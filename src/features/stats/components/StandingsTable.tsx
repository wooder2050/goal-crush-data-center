'use client';

import Image from 'next/image';
import { FC } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getStandingsWithTeamPrisma } from '@/features/stats/api-prisma';
import StandingsTableSkeleton from '@/features/stats/components/StandingsTableSkeleton';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

interface StandingsTableProps {
  seasonId: number;
  className?: string;
}

// API 응답 타입 정의
type StandingRow = {
  standing_id: number;
  season_id: number | null;
  team_id: number | null;
  position: number;
  matches_played: number | null;
  wins: number | null;
  draws: number | null;
  losses: number | null;
  goals_for: number | null;
  goals_against: number | null;
  goal_difference: number | null;
  points: number | null;
  form: string | null;
  created_at: string | null;
  updated_at: string | null;
  team: {
    team_id: number;
    team_name: string;
    logo?: string;
  } | null;
};

function getRankEmoji(position: number) {
  if (position === 1) {
    return '🥇 1위';
  } else if (position === 2) {
    return '🥈 2위';
  } else if (position === 3) {
    return '🥉 3위';
  } else {
    return `${position}위`;
  }
}

const StandingsTable: FC<StandingsTableProps> = ({ seasonId, className }) => {
  const { data: standings = [] } = useGoalSuspenseQuery(
    getStandingsWithTeamPrisma,
    [seasonId]
  );
  const hasNoData = !standings || standings.length === 0;

  if (hasNoData) {
    return (
      <div className={className}>
        <h3 className="text-lg font-bold mb-2">순위표</h3>
        <div className="py-6 text-center text-gray-500 text-[12px] sm:text-sm">
          순위표 데이터가 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-bold mb-2">순위표</h3>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {hasNoData ? (
          <div className="py-6 text-center text-gray-500 text-[12px]">
            순위표 데이터가 없습니다.
          </div>
        ) : (
          standings.map((row: StandingRow, idx: number) => (
            <div
              key={row.team?.team_id ?? idx}
              className="rounded-md border px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-base font-bold">
                  {getRankEmoji(row.position)}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 relative flex-shrink-0 rounded-full overflow-hidden">
                    {row.team?.logo ? (
                      <Image
                        src={row.team.logo}
                        alt={`${row.team?.team_name ?? ''} 로고`}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs text-gray-500 font-medium">
                          {row.team?.team_name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="truncate text-base font-semibold">
                    {row.team?.team_name ?? '-'}
                  </span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { label: '경기', value: row.matches_played ?? '-' },
                  { label: '승', value: row.wins ?? '-' },
                  { label: '패', value: row.losses ?? '-' },
                  { label: '득점', value: row.goals_for ?? '-' },
                  { label: '실점', value: row.goals_against ?? '-' },
                  { label: '득실차', value: row.goal_difference ?? '-' },
                  { label: '승점', value: row.points ?? '-' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="rounded bg-gray-50 border border-gray-200 px-2 py-1 text-center"
                  >
                    <div className="text-[11px] text-gray-600">
                      {stat.label}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table (unchanged) */}
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>순위</TableHead>
              <TableHead>팀명</TableHead>
              <TableHead>경기</TableHead>
              <TableHead>승</TableHead>
              <TableHead>패</TableHead>
              <TableHead>득점</TableHead>
              <TableHead>실점</TableHead>
              <TableHead>득실차</TableHead>
              <TableHead>승점</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hasNoData ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-gray-500 py-8"
                >
                  순위표 데이터가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              standings.map((row: StandingRow, idx: number) => (
                <TableRow key={row.team?.team_id ?? idx}>
                  <TableCell>{getRankEmoji(row.position)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 relative flex-shrink-0 rounded-full overflow-hidden">
                        {row.team?.logo ? (
                          <Image
                            src={row.team.logo}
                            alt={`${row.team.team_name} 로고`}
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-500 font-medium">
                              {row.team?.team_name?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-medium">
                        {row.team?.team_name ?? '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{row.matches_played ?? '-'}</TableCell>
                  <TableCell>{row.wins ?? '-'}</TableCell>
                  <TableCell>{row.losses ?? '-'}</TableCell>
                  <TableCell>{row.goals_for ?? '-'}</TableCell>
                  <TableCell>{row.goals_against ?? '-'}</TableCell>
                  <TableCell>{row.goal_difference ?? '-'}</TableCell>
                  <TableCell>{row.points ?? '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const StandingsTableWithSuspense: FC<StandingsTableProps> = (props) => {
  return (
    <GoalWrapper
      fallback={<StandingsTableSkeleton className={props.className} />}
    >
      <StandingsTable {...props} />
    </GoalWrapper>
  );
};

export default StandingsTableWithSuspense;
