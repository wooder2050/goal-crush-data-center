'use client';

import Image from 'next/image';
import { FC } from 'react';

import { GoalWrapper } from '@/common/GoalWrapper';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getGroupLeagueStandingsPrisma } from '@/features/stats/api-prisma';
import GroupStandingsTableSkeleton from '@/features/stats/components/GroupStandingsTableSkeleton';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

interface GroupStandingsTableProps {
  seasonId: number;
  className?: string;
  tournamentStage?: 'group_stage' | 'championship' | 'relegation' | 'all';
  groupStage?: 'A' | 'B' | 'all';
}

// API 응답 타입 정의
type StandingRow = {
  standing_id?: number;
  group_standing_id?: number;
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
  group_stage?: string;
  group_name?: string;
  tournament_stage?: string;
  team: {
    team_id: number;
    team_name: string;
    logo?: string;
  } | null;
};

function getRankEmoji(position: number) {
  if (position === 1) {
    return '🥇 1';
  } else if (position === 2) {
    return '🥈 2';
  } else if (position === 3) {
    return '🥉 3';
  } else {
    return position;
  }
}

function GroupStandingsTableInner({
  seasonId,
  className,
  tournamentStage = 'all',
  groupStage = 'all',
}: GroupStandingsTableProps) {
  const { data: standings = [] } = useGoalSuspenseQuery(
    getGroupLeagueStandingsPrisma,
    [seasonId, tournamentStage, groupStage]
  );

  // API에서 이미 토너먼트 스테이지와 조별 필터링을 처리하므로 추가 필터링 불필요
  const filteredStandings = standings;

  // 전체를 선택했을 때 조별로 데이터를 분리
  const groupAStandings = filteredStandings.filter(
    (standing: StandingRow) => standing.group_stage === 'A'
  );
  const groupBStandings = filteredStandings.filter(
    (standing: StandingRow) => standing.group_stage === 'B'
  );

  const renderStandingsTable = (
    standings: StandingRow[],
    groupName?: string
  ) => (
    <div className="mb-6">
      {groupName && (
        <div className="mb-3">
          <Badge variant="outline" className="text-sm">
            {groupName}
          </Badge>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>순위</TableHead>
            <TableHead>팀명</TableHead>
            <TableHead>경기</TableHead>
            <TableHead>승</TableHead>
            <TableHead>무</TableHead>
            <TableHead>패</TableHead>
            <TableHead>득점</TableHead>
            <TableHead>실점</TableHead>
            <TableHead>득실차</TableHead>
            <TableHead>승점</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {standings
            .sort(
              (a: StandingRow, b: StandingRow) =>
                (a.position || 0) - (b.position || 0)
            )
            .map((standing: StandingRow) => (
              <TableRow
                key={standing.group_standing_id || standing.standing_id}
              >
                <TableCell className="font-bold">
                  {getRankEmoji(standing.position || 0)}
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 relative flex-shrink-0 rounded-full overflow-hidden">
                      {standing.team?.logo ? (
                        <Image
                          src={standing.team.logo}
                          alt={`${standing.team.team_name} 로고`}
                          fill
                          className="object-cover"
                          sizes="24px"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs text-gray-500 font-medium">
                            {standing.team?.team_name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <span>{standing.team?.team_name || 'Unknown Team'}</span>
                  </div>
                </TableCell>
                <TableCell>{standing.matches_played || 0}</TableCell>
                <TableCell className="text-green-600 font-semibold">
                  {standing.wins || 0}
                </TableCell>
                <TableCell className="text-yellow-600 font-semibold">
                  {standing.draws || 0}
                </TableCell>
                <TableCell className="text-red-600 font-semibold">
                  {standing.losses || 0}
                </TableCell>
                <TableCell>{standing.goals_for || 0}</TableCell>
                <TableCell>{standing.goals_against || 0}</TableCell>
                <TableCell
                  className={
                    (standing.goal_difference || 0) > 0
                      ? 'text-green-600'
                      : (standing.goal_difference || 0) < 0
                        ? 'text-red-600'
                        : 'text-gray-600'
                  }
                >
                  {(standing.goal_difference || 0) > 0
                    ? `+${standing.goal_difference}`
                    : standing.goal_difference}
                </TableCell>
                <TableCell className="font-bold text-blue-600">
                  {standing.points || 0}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div className={className}>
      {/* 선택된 토너먼트 스테이지와 조 정보 표시 */}
      <div className="mb-4">
        <Badge variant="emphasis" className="mb-2">
          {tournamentStage === 'all'
            ? '전체 토너먼트'
            : tournamentStage === 'group_stage'
              ? groupStage === 'all'
                ? '조별리그 전체'
                : `조별리그 ${groupStage}조`
              : tournamentStage === 'championship'
                ? '우승 토너먼트'
                : '멸망 토너먼트'}{' '}
          순위 ({filteredStandings.length}팀)
        </Badge>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {filteredStandings.length === 0 ? (
          <div className="py-6 text-center text-gray-500 text-[12px]">
            {tournamentStage === 'all'
              ? '순위 데이터가 없습니다.'
              : tournamentStage === 'group_stage'
                ? groupStage === 'all'
                  ? '조별리그 순위 데이터가 없습니다.'
                  : `조별리그 ${groupStage}조 순위 데이터가 없습니다.`
                : tournamentStage === 'championship'
                  ? '우승 토너먼트 순위 데이터가 없습니다.'
                  : '멸망 토너먼트 순위 데이터가 없습니다.'}
          </div>
        ) : tournamentStage === 'group_stage' && groupStage === 'all' ? (
          <>
            {groupAStandings.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold text-gray-600">
                  A조
                </div>
                {groupAStandings
                  .slice()
                  .sort(
                    (a: StandingRow, b: StandingRow) =>
                      (a.position || 0) - (b.position || 0)
                  )
                  .map((row: StandingRow, idx: number) => (
                    <div
                      key={row.group_standing_id ?? row.standing_id ?? idx}
                      className="rounded-md border px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold">
                          {getRankEmoji(row.position || 0)}위
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
                          <span className="truncate text-sm font-semibold">
                            {row.team?.team_name ?? '-'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {[
                          { label: '경기', value: row.matches_played ?? '-' },
                          { label: '승', value: row.wins ?? '-' },
                          { label: '무', value: row.draws ?? '-' },
                          { label: '패', value: row.losses ?? '-' },
                          {
                            label: '득실차',
                            value: row.goal_difference ?? '-',
                          },
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
                  ))}
              </div>
            )}
            {groupBStandings.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-semibold text-gray-600">
                  B조
                </div>
                {groupBStandings
                  .slice()
                  .sort(
                    (a: StandingRow, b: StandingRow) =>
                      (a.position || 0) - (b.position || 0)
                  )
                  .map((row: StandingRow, idx: number) => (
                    <div
                      key={row.group_standing_id ?? row.standing_id ?? idx}
                      className="rounded-md border px-3 py-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-xs font-bold">
                          {getRankEmoji(row.position || 0)}위
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
                          <span className="truncate text-sm font-semibold">
                            {row.team?.team_name ?? '-'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {[
                          { label: '경기', value: row.matches_played ?? '-' },
                          { label: '승', value: row.wins ?? '-' },
                          { label: '무', value: row.draws ?? '-' },
                          { label: '패', value: row.losses ?? '-' },
                          {
                            label: '득실차',
                            value: row.goal_difference ?? '-',
                          },
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
                  ))}
              </div>
            )}
          </>
        ) : (
          filteredStandings
            .slice()
            .sort(
              (a: StandingRow, b: StandingRow) =>
                (a.position || 0) - (b.position || 0)
            )
            .map((row: StandingRow, idx: number) => (
              <div
                key={row.group_standing_id ?? row.standing_id ?? idx}
                className="rounded-md border px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-xs font-bold">
                    {getRankEmoji(row.position || 0)}위
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
                    <span className="truncate text-sm font-semibold">
                      {row.team?.team_name ?? '-'}
                    </span>
                  </div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { label: '경기', value: row.matches_played ?? '-' },
                    { label: '승', value: row.wins ?? '-' },
                    { label: '무', value: row.draws ?? '-' },
                    { label: '패', value: row.losses ?? '-' },
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

      {/* Desktop table */}
      <div className="hidden sm:block">
        {filteredStandings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">
              {tournamentStage === 'all'
                ? '순위 데이터가 없습니다.'
                : tournamentStage === 'group_stage'
                  ? groupStage === 'all'
                    ? '조별리그 순위 데이터가 없습니다.'
                    : `조별리그 ${groupStage}조 순위 데이터가 없습니다.`
                  : tournamentStage === 'championship'
                    ? '우승 토너먼트 순위 데이터가 없습니다.'
                    : '멸망 토너먼트 순위 데이터가 없습니다.'}
            </div>
          </div>
        ) : tournamentStage === 'group_stage' && groupStage === 'all' ? (
          <div>
            {groupAStandings.length > 0 &&
              renderStandingsTable(groupAStandings, 'A조')}
            {groupBStandings.length > 0 &&
              renderStandingsTable(groupBStandings, 'B조')}
          </div>
        ) : (
          renderStandingsTable(filteredStandings)
        )}
      </div>
    </div>
  );
}

const GroupStandingsTable: FC<GroupStandingsTableProps> = (props) => {
  return (
    <GoalWrapper
      fallback={<GroupStandingsTableSkeleton className={props.className} />}
    >
      <GroupStandingsTableInner {...props} />
    </GoalWrapper>
  );
};

export default GroupStandingsTable;
