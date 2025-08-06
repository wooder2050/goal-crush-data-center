'use client';

import { FC, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getStandingsWithTeamPrisma } from '@/features/stats/api-prisma';
import { useGoalQuery } from '@/hooks/useGoalQuery';

interface GroupStandingsTableProps {
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
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'A' | 'B' | 'all'>('all');

  const {
    data: standings = [],
    isLoading,
    error,
  } = useGoalQuery(() => getStandingsWithTeamPrisma(seasonId), []);

  // 조별로 팀 필터링 (임시로 팀명으로 구분)
  const filteredStandings = standings.filter((standing: StandingRow) => {
    if (selectedGroup === 'all') return true;

    // A조 팀들 (임시 구분)
    const groupATeams = ['FC 탑걸', 'FC 액셔니스타'];
    // B조 팀들 (임시 구분) - 나중에 실제 팀 추가 시 수정
    const groupBTeams = ['FC 구척장신', 'FC 발라드림'];

    if (selectedGroup === 'A') {
      return standing.team && groupATeams.includes(standing.team.team_name);
    } else if (selectedGroup === 'B') {
      return standing.team && groupBTeams.includes(standing.team.team_name);
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">순위표</h3>
          <div className="flex gap-2">
            <Button
              variant={selectedGroup === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedGroup('all')}
            >
              전체
            </Button>
            <Button
              variant={selectedGroup === 'A' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedGroup('A')}
            >
              A조
            </Button>
            <Button
              variant={selectedGroup === 'B' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedGroup('B')}
            >
              B조
            </Button>
          </div>
        </div>
        <div className="text-center text-gray-500 py-8">
          순위표를 불러오는 중...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">순위표</h3>
        </div>
        <div className="text-center text-red-500 py-8">
          순위표를 불러오지 못했습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">순위표</h3>
        <div className="flex gap-2">
          <Button
            variant={selectedGroup === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedGroup('all')}
          >
            전체
          </Button>
          <Button
            variant={selectedGroup === 'A' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedGroup('A')}
          >
            A조
          </Button>
          <Button
            variant={selectedGroup === 'B' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedGroup('B')}
          >
            B조
          </Button>
        </div>
      </div>

      {/* 선택된 조 정보 표시 */}
      <div className="mb-4">
        <Badge variant="emphasis" className="mb-2">
          {selectedGroup === 'all' ? '전체 조' : `${selectedGroup}조`} 순위 (
          {filteredStandings.length}팀)
        </Badge>
      </div>

      {filteredStandings.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">
            {selectedGroup === 'all'
              ? '순위 데이터가 없습니다.'
              : `${selectedGroup}조 순위 데이터가 없습니다.`}
          </div>
        </div>
      ) : (
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
            {filteredStandings
              .sort(
                (a: StandingRow, b: StandingRow) =>
                  (a.position || 0) - (b.position || 0)
              )
              .map((standing: StandingRow) => (
                <TableRow key={standing.standing_id}>
                  <TableCell className="font-bold">
                    {getRankEmoji(standing.position || 0)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {standing.team?.team_name || 'Unknown Team'}
                  </TableCell>
                  <TableCell>{standing.matches_played || 0}</TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    {standing.wins || 0}
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
      )}
    </div>
  );
};

export default GroupStandingsTable;
