'use client';

import Image from 'next/image';
import { FC } from 'react';

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
    return '🥇 1';
  } else if (position === 2) {
    return '🥈 2';
  } else if (position === 3) {
    return '🥉 3';
  } else {
    return position;
  }
}

const StandingsTable: FC<StandingsTableProps> = ({ seasonId, className }) => {
  const {
    data: standings = [],
    isLoading,
    error,
  } = useGoalQuery(() => getStandingsWithTeamPrisma(seasonId), []);

  if (isLoading) {
    return (
      <div className={className}>
        <h3 className="text-lg font-bold mb-2">순위표</h3>
        <div className="text-center text-gray-500 py-8">
          순위표를 불러오는 중...
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className={className}>
        <h3 className="text-lg font-bold mb-2">순위표</h3>
        <div className="text-center text-red-500 py-8">
          순위표를 불러오지 못했습니다.
        </div>
      </div>
    );
  }
  return (
    <div className={className}>
      <h3 className="text-lg font-bold mb-2">순위표</h3>
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
          {standings.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-gray-500 py-8">
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
  );
};

export default StandingsTable;
