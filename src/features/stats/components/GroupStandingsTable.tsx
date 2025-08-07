'use client';

import Image from 'next/image';
import { FC } from 'react';

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
import { useGoalQuery } from '@/hooks/useGoalQuery';

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

const GroupStandingsTable: FC<GroupStandingsTableProps> = ({
  seasonId,
  className,
  tournamentStage = 'all',
  groupStage = 'all',
}) => {
  const {
    data: standings = [],
    isLoading,
    error,
  } = useGoalQuery(getGroupLeagueStandingsPrisma, [
    seasonId,
    tournamentStage,
    groupStage,
  ]);

  // API에서 이미 토너먼트 스테이지와 조별 필터링을 처리하므로 추가 필터링 불필요
  const filteredStandings = standings;

  if (isLoading) {
    return (
      <div className={className}>
        <div className="text-center text-gray-500 py-8">
          순위표를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="text-center text-red-500 py-8">
          순위표를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

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
        // 전체를 선택했을 때 조별로 분리해서 표시
        <div>
          {groupAStandings.length > 0 &&
            renderStandingsTable(groupAStandings, 'A조')}
          {groupBStandings.length > 0 &&
            renderStandingsTable(groupBStandings, 'B조')}
        </div>
      ) : (
        // 특정 조를 선택했을 때는 하나의 테이블로 표시
        renderStandingsTable(filteredStandings)
      )}
    </div>
  );
};

export default GroupStandingsTable;
