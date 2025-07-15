'use client';

import { FC } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StandingsTableProps {
  standings: Array<{
    position: number;
    team: { team_id: number; team_name: string };
    matches_played: number;
    wins: number;
    draws: number;
    losses: number;
    goals_for: number;
    goals_against: number;
    goal_difference: number;
    points: number;
  }>;
  className?: string;
  standingsLoading?: boolean;
  standingsError?: boolean;
}

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

function isValidStandingRow(row: unknown): row is {
  position: number;
  team?: { team_id?: number; team_name?: string };
  matches_played?: number;
  wins?: number;
  losses?: number;
  goals_for?: number;
  goals_against?: number;
  goal_difference?: number;
  points?: number;
} {
  return !!row && typeof row === 'object' && 'position' in row && 'team' in row;
}

const StandingsTable: FC<StandingsTableProps> = ({
  standings,
  className,
  standingsLoading,
  standingsError,
}) => {
  if (standingsLoading) {
    return (
      <div className={className}>
        <h3 className="text-lg font-bold mb-2">순위표</h3>
        <div className="text-center text-gray-500 py-8">
          순위표를 불러오는 중...
        </div>
      </div>
    );
  }
  if (standingsError) {
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
            standings.map((row, idx) =>
              isValidStandingRow(row) ? (
                <TableRow key={row.team?.team_id ?? idx}>
                  <TableCell>{getRankEmoji(row.position)}</TableCell>
                  <TableCell>{row.team?.team_name ?? '-'}</TableCell>
                  <TableCell>{row.matches_played ?? '-'}</TableCell>
                  <TableCell>{row.wins ?? '-'}</TableCell>
                  <TableCell>{row.losses ?? '-'}</TableCell>
                  <TableCell>{row.goals_for ?? '-'}</TableCell>
                  <TableCell>{row.goals_against ?? '-'}</TableCell>
                  <TableCell>{row.goal_difference ?? '-'}</TableCell>
                  <TableCell>{row.points ?? '-'}</TableCell>
                </TableRow>
              ) : (
                <TableRow key={idx}>
                  <TableCell
                    colSpan={9}
                    className="text-center text-gray-500 py-8"
                  >
                    잘못된 데이터가 포함되어 있습니다.
                  </TableCell>
                </TableRow>
              )
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StandingsTable;
