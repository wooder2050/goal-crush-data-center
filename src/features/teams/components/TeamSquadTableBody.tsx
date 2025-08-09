'use client';

import { useQueries } from '@tanstack/react-query';
import Link from 'next/link';

import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { getPlayerSummaryPrisma } from '@/features/players';
import PlayerPositionBadge from '@/features/teams/components/PlayerPositionBadge';
import SeasonListBadges from '@/features/teams/components/SeasonListBadges';
import type { Player } from '@/lib/types';

interface TeamSquadTableBodyProps {
  players: Player[];
  teamId: number;
}

type SeasonSummary = {
  season_id: number | null;
  season_name: string | null;
  year: number | null;
};

export default function TeamSquadTableBody({
  players,
  teamId,
}: TeamSquadTableBodyProps) {
  const playersArray = Array.isArray(players) ? players : [];

  const summaryResults = useQueries({
    queries: playersArray.map((p) => ({
      queryKey: ['getPlayerSummaryPrisma', p.player_id, teamId],
      queryFn: () => getPlayerSummaryPrisma(p.player_id, teamId),
      staleTime: 5 * 60 * 1000,
      retry: 1,
      enabled: Boolean(p.player_id),
    })),
  });

  // Build rows with computed stats and sort
  const rows = playersArray.map((p, idx) => {
    const q = summaryResults[idx];
    const data = q?.data as
      | {
          primary_position?: string;
          seasons?: SeasonSummary[];
          totals?: { appearances?: number; goals?: number; assists?: number };
          totals_for_team?: {
            appearances?: number;
            goals?: number;
            assists?: number;
          };
        }
      | undefined;

    const primaryPosition = data?.primary_position ?? '-';
    const appearances =
      data?.totals_for_team?.appearances ?? data?.totals?.appearances ?? 0;
    const goals = data?.totals_for_team?.goals ?? data?.totals?.goals ?? 0;
    const assists =
      data?.totals_for_team?.assists ?? data?.totals?.assists ?? 0;
    const seasonLabels = (data?.seasons ?? [])
      .map(
        (s: SeasonSummary) =>
          s.season_name || (s.year ? `시즌 ${s.year}` : null)
      )
      .filter((x: unknown): x is string => Boolean(x));

    return {
      player: p,
      q,
      primaryPosition,
      appearances,
      goals,
      assists,
      seasonLabels,
    };
  });

  rows.sort((a, b) => {
    if (b.appearances !== a.appearances) return b.appearances - a.appearances;
    if (b.goals !== a.goals) return b.goals - a.goals;
    return b.assists - a.assists;
  });

  return (
    <TableBody>
      {playersArray.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} className="text-center text-gray-500 py-6">
            등록된 선수가 없습니다.
          </TableCell>
        </TableRow>
      ) : (
        rows.map(
          ({
            player: p,
            q,
            primaryPosition,
            appearances,
            goals,
            assists,
            seasonLabels,
          }) => (
            <TableRow key={p.player_id}>
              <TableCell className="w-20">{p.jersey_number ?? '-'}</TableCell>
              <TableCell>
                <Link
                  href={`/players/${p.player_id}`}
                  className="hover:underline"
                >
                  {p.name}
                </Link>
              </TableCell>
              <TableCell className="text-right">
                {q?.isLoading ? (
                  '…'
                ) : (
                  <PlayerPositionBadge position={primaryPosition} />
                )}
              </TableCell>
              <TableCell className="text-left">
                {q?.isLoading ? (
                  '…'
                ) : (
                  <SeasonListBadges
                    labels={seasonLabels}
                    max={3}
                    align="start"
                  />
                )}
              </TableCell>
              <TableCell className="text-right">
                {q?.isLoading ? '…' : appearances}
              </TableCell>
              <TableCell className="text-right">
                {q?.isLoading ? '…' : goals}
              </TableCell>
              <TableCell className="text-right">
                {q?.isLoading ? '…' : assists}
              </TableCell>
            </TableRow>
          )
        )
      )}
    </TableBody>
  );
}
