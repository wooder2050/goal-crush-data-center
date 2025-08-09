'use client';

import Link from 'next/link';

import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getTeamSeasonStandingsPrisma,
  TeamSeasonStandingRow,
} from '@/features/teams/api-prisma';
import LeagueBadge from '@/features/teams/components/LeagueBadge';
import PositionBadge from '@/features/teams/components/PositionBadge';
import SeasonOutcomeBadge from '@/features/teams/components/SeasonOutcomeBadge';
import { useGoalSuspenseQuery } from '@/hooks/useGoalQuery';

export default function TeamSeasonStandings({ teamId }: { teamId: number }) {
  const { data } = useGoalSuspenseQuery(getTeamSeasonStandingsPrisma, [teamId]);

  const participatedRows = Array.isArray(data)
    ? data.filter((row) => row.participated)
    : [];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">시즌별 순위</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>연도</TableHead>
              <TableHead>시즌</TableHead>
              <TableHead className="text-right">순위</TableHead>
              <TableHead className="text-right">경기수</TableHead>
              <TableHead className="text-right">승점</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participatedRows.map((row: TeamSeasonStandingRow) => (
              <TableRow key={`${row.year}-${row.season_id}`}>
                <TableCell className="whitespace-nowrap">{row.year}</TableCell>
                <TableCell>
                  {row.season_id && row.season_name ? (
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/seasons/${encodeURIComponent(row.season_name)}`}
                        className="hover:underline"
                      >
                        {row.season_name}
                      </Link>
                      <LeagueBadge league={row.league} />
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {row.position ? (
                    <div className="flex items-center justify-end gap-1">
                      <SeasonOutcomeBadge
                        league={row.league}
                        position={row.position}
                        seasonName={row.season_name}
                      />
                      <PositionBadge position={row.position} />
                    </div>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {row.matches_played}
                </TableCell>
                <TableCell className="text-right">{row.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
